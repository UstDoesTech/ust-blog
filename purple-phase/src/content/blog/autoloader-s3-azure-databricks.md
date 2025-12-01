---
title: "Using Auto Loader on Azure Databricks with AWS S3"
pubDate: 2021-10-18T20:29:25+06:00
description: "All the necessary steps to make Auto Loader on Azure Databricks work with data in an AWS S3 Bucket"
tags: ["databricks"]
categories: ["databricks"]
slug: "databricks/autoloader-s3-azure-databricks"
---

# Problem

Recently on a client project, we wanted to use the [Auto Loader](https://docs.microsoft.com/en-us/azure/databricks/spark/latest/structured-streaming/auto-loader) functionality in Databricks to easily consume from [AWS S3](https://docs.microsoft.com/en-us/azure/databricks/spark/latest/structured-streaming/auto-loader-s3) into our Azure hosted data platform. The reason why we opted for Auto Loader over any other solution is because it natively exists within Databricks and allows us to quickly ingest data from [Azure Storage Accounts](https://docs.microsoft.com/en-us/azure/databricks/spark/latest/structured-streaming/auto-loader-gen2) and AWS S3 Buckets, while using the benefits of Structured Streaming to checkpoint which files it last loaded. It also means we're less dependent upon additional systems to provide that "what did we last load" context.

We followed the steps on the Microsoft Docs to [load files in from AWS S3 using Auto Loader](https://docs.microsoft.com/en-us/azure/databricks/spark/latest/structured-streaming/auto-loader-s3) but we were getting an error message that couldn't be easily resolved in the Azure instance of Databricks:

```typescript
shaded.databricks.org.apache.hadoop.fs.s3a.AWSClientIOException: 
Instantiate shaded.databricks.org.apache.hadoop.fs.s3a.auth.AssumedRoleCredentialProvider on : 
com.amazonaws.AmazonClientException: No AWS Credentials provided by InstanceProfileCredentialsProvider : 
com.amazonaws.SdkClientException: 
The requested metadata is not found at http://169.254.169.254/latest/meta-data/iam/security-credentials/: 
No AWS Credentials provided by InstanceProfileCredentialsProvider : 
com.amazonaws.SdkClientException: The requested metadata is not found at
http://169.254.169.254/latest/meta-data/iam/security-credentials/
```

Azure doesn't have notions of an InstanceProfile but AWS does, so marrying the two cloud platforms was going to be a challenge.

# Solution

We realised, through trial and error, that the role which had been provisioned for us in AWS would allow us to query data in S3 through Databricks using [temporary credentials](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html). The challenge for us would be to allow Databricks, and potentially other services, to use those temporary credentials in a secure and repeatable manner.

## Temporary Credential Generation

Temporary Credentials have a lifespan, which can be minutes through to a couple of days, so we want to be able to refresh them regularly and reliably - either on a schedule or when necessary. But for other services to use the same credentials, we'll want to store the temporary credentials in [Azure Key Vault](https://docs.microsoft.com/en-us/azure/key-vault/general/overview) - so that they are secured.

For this, we looked towards [Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/functions-overview) because, if Auto Loader wouldn't work with them then we could use [Azure Data Factory](https://docs.microsoft.com/en-us/azure/data-factory/introduction) as a fallback option to load data into Azure.

Following the steps laid out in the Microsoft documentation, we created our [Function in Python](https://docs.microsoft.com/en-us/azure/azure-functions/create-first-function-vs-code-python).

### Python Libraries

For our function to work, we needed the [boto3 library for AWS](https://aws.amazon.com/sdk-for-python/) and a whole host of Azure libraries to connect to Key Vault securely.

```python
import boto3

from azure.keyvault.secrets import SecretClient
from azure.identity import DefaultAzureCredential
from botocore.config import Config
```

### Functional Steps

#### Connecting to Key Vault

Our first step is to connect to Key Vault to retrieve the AWS Access Key ID and Secret Access Key of the role for which we are generating the temporary credentials for. Connecting Azure Functions to Key Vault, for secret retrieval is not transparent - luckily, there's a great blog post by [Daniel Krzyczkowski](https://twitter.com/DKrzyczkowski) which sets out the steps for [configuring your Function App](https://daniel-krzyczkowski.github.io/Integrate-Key-Vault-Secrets-With-Azure-Functions/).

We added the following Application Settings to the Function App, so that we could retrieve and update specific secrets in Key Vault:

- AZURE_CLIENT_ID
- AZURE_CLIENT_SECRET
- AZURE_TENANT_ID

A circular reference to Key Vault might sound counter-intuitive, but it's the only way I could see that would allow the app to update secrets.

Bringing back secrets from Key Vault required the following code:

```python
def retrieveSecret(client, secretName):
    secret = client.get_secret(f"{secretName}")
    return(secret.value)

keyVaultName = os.environ["KeyVaultName"]

keyVaultCredential = DefaultAzureCredential()
keyVaultClient = SecretClient(vault_url= f"https://{keyVaultName}.vault.azure.net/", credential=keyVaultCredential)

accessKeyId = retrieveSecret(keyVaultClient, "AWSAccessKey")
secretAccessKey = retrieveSecret(keyVaultClient, "AWSSecretKey")
```

#### Getting Temporary Credentials

Now that we've got the main credentials for the AWS Role, we can create temporary credentials for the role using the [assume role](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/sts.html#STS.Client.assume_role) functionality.

```python
os.environ['AWS_ACCESS_KEY_ID'] = accessKeyId 
os.environ['AWS_SECRET_ACCESS_KEY'] = secretAccessKey 
    
botoConfig = Config(
    region_name = 'eu-west-2',
    signature_version = 'v4',
    retries = {
        'max_attempts': 10,
        'mode': 'standard'
    }
)

client = boto3.client('sts', config = botoConfig)
response = client.assume_role(
    RoleArn='arn:aws:iam::1234567890:role/role_name',
    RoleSessionName='AzureFunctionRefresh',
    DurationSeconds=3600
)   
```

This returned our temporary credentials as a nice JSON object:

```json
{
    'Credentials': {
        'AccessKeyId': 'string',
        'SecretAccessKey': 'string',
        'SessionToken': 'string',
        'Expiration': datetime(2015, 1, 1)
    },
    'AssumedRoleUser': {
        'AssumedRoleId': 'string',
        'Arn': 'string'
    },
    'PackedPolicySize': 123,
    'SourceIdentity': 'string'
}
```

We then parsed the credentials into variables, so that we could pass them through into Key Vault to update some already defined secrets.

```python
def updateSecret(client, secretName, secretValue):
    updated_secret = client.set_secret(secretName, secretValue)
    
credResponse = response['Credentials']

tempAccessKeyId = credResponse['AccessKeyId']
tempSecretAccessKey = credResponse['SecretAccessKey']
tempSessionToken = credResponse['SessionToken']

updateSecret(keyVaultClient, "TempAccessKeyId", tempAccessKeyId)
updateSecret(keyVaultClient, "TempSecretAccessKey", tempSecretAccessKey)
updateSecret(keyVaultClient, "TempSessionToken", tempSessionToken)
```

#### Getting Databricks to work

Now that Key Vault had our all important temporary credentials, it was a matter of getting Databricks to work with them.

Our first cell in Databricks was to initialise our temporary credentials and to set some environment variables, which would allow us to connect to S3.

```python
spark.conf.set("fs.s3a.credentialsType", "AssumeRole")
spark.conf.set("fs.s3a.stsAssumeRole.arn", "arn:aws:iam::123456789:role/role_name")
spark.conf.set("fs.s3a.acl.default", "BucketOwnerFullControl")

AccessKey = dbutils.secrets.get("ScopeName", key = "TempAccessKeyId")
SecretKey = dbutils.secrets.get("ScopeName", key = "TempSecretAccessKey")
SessionToken = dbutils.secrets.get("ScopeName", key = "TempSessionToken")

sc._jsc.hadoopConfiguration().set("fs.s3a.aws.credentials.provider", "org.apache.hadoop.fs.s3a.TemporaryAWSCredentialsProvider")
sc._jsc.hadoopConfiguration().set("fs.s3a.access.key", AccessKeyId)
sc._jsc.hadoopConfiguration().set("fs.s3a.secret.key", SecretKey)
sc._jsc.hadoopConfiguration().set("fs.s3a.session.token", SessionToken)
```

Note how we're using the same Assume Role ARN as we used in the process to get the temporary credentials.

We can now, very easily use Auto Loader in the way it was intended. However, unlike other sources for Auto Loader, mounting an S3 Bucket with temporary credentials doesn't work - so we have to specify the bucket and top-level directory we want to work with in the load.

```python
df = (spark.readStream.format("cloudFiles")
      .option("cloudFiles.format", "json")
      .schema(definedSchema)
      .load("s3a://bucket/directory/")
     )
```

And writing out is just as easy.

```python
(df.writeStream.format("delta") 
  .option("checkpointLocation", "/mnt/lake/directory/_checkpoint") 
  .trigger(once=True)
  .start("/mnt/lake/directory/")
)
```

# Conclusion

Configuring Databricks Auto Loader to load data in from AWS S3 is not a straightforward as it sounds - particularly if you are hindered by AWS Roles that only work with temporary credentials.

This is one way of getting it to work. If there wasn't a need for other services to also connect to S3, I should think that the method to generate the temporary credentials could be rationalised significantly and to exist solely within Databricks.

Thanks for reading!

UPDATE: It is much simpler to configure this directly in Databricks if you do not need to use the temporary credentials for other services in Azure.

<script src="https://gist.github.com/UstDoesTech/172525c34c4bea5650e1338e77c5bf3a.js"></script>
