---
title:  "CI / CD With Synapse Serverless"
date:   2022-02-22T08:40:38+00:00
description: Exploring the limitations of deploying to Synapse Serverless and how to deploy database objects
menu:
  sidebar:
    name: CI CD with Synapse Serverless
    identifier: synapse-serverless-cicd
    parent: sql
    weight: 2
---

## Context

A project that I'm working on uses [Azure Synapse Serverless](https://docs.microsoft.com/en-us/azure/synapse-analytics/sql/overview-architecture) as a serving layer option for its data platform. The main processing and transformation of data is achieved using Databricks, with the resulting data being made available as a [Delta file](https://delta.io/).

Our processes ensure that the Delta files are registered automatically within Databricks as Delta Tables, but there is no native way to register Delta objects in Synapse. Therefore, we've gone down a route of creating a series of [Stored Procedures in Synapse](https://www.youtube.com/watch?v=B2jr6YRemxM&ab_channel=AdvancingAnalytics) - which can be called from Databricks - which register the Delta files as views within Synapse. There are performance considerations to be understood with this approach - namely the use of loosely typed data. For example, a string in Delta is converted to `VARCHAR(8000)` in Synapse. This approach isn't for everyone, so use with caution.

We have also assumed that everyone using a particular Synapse instance will need and want to be able to query the same datasets. Therefore, we've given controlled the access to the underlying data lake using the Managed Identity. This makes the deployments simpler, as there are fewer Azure AD objects that need the appropriate RBAC and ACL permissions - just the appropriate and relevant Managed Identity.

## Limitations

There limitations for using automated deployments to Synapse Serverless are incredibly annoying, particularly if you are used to deploying other databases.

1. DACPACs - the go-to method for deploying SQL Databases - don't work.
2. SQL Scripts do work, but not as one continuous script.
3. Contributors to the Subscription aren't automatically granted access to the resource, like with other resources.

## Solution

Before we go into any solution, let's take a moment to specify some pre-requisites as, without them this solution will not work.

### Pre-requisites

- Service Principal used to deploy the ARM Template must have the `User Access Administrator` role assigned to it.
- You have to hand, or a way of finding out, the Azure AD Object IDs for the accounts you want to be a Synapse Workspace Admin.

### Let's Build This

Pre-requisites out of the way, let's build this thing.

ARM Templates are the primary vehicle for the creation and configuration of the Synapse workspace. If you're using something like Bicep or Terraform, the approach will be similar - although the syntax might be simpler.

I won't bore you with the specifics, there's the code for that. Other than the creation of the Workspace, we're adding the Managed Identity to the Data Lake as a `Storage Blob Data Contributor`. ACL definition can then be done at a container / folder level. We're also assigning the Workspace Name, SQL User and Password down to Key Vault for use later on, as well as outputting the Workspace Name to DevOps pipeline.

#### ARM Template

{{< gist UstDoesTech 2198f319f0d5a84b60a418fe7437c012.js"></script>

#### ARM Parameters

{{< gist UstDoesTech 797f98b22f453e771c523fcda899095a.js"></script>

Now that we have the name of the Workspace in the DevOps pipeline, we can use it in a PowerShell script to assign our accounts as Synapse Admins. If we don't do this step, no one will be able to use the Workspace as the only accounts that automatically have access are the Managed Identity and the Service Principal that deployed the workspace.

Workspace set up and permissions granted, time to deploy the database! And I hope you like command line...

As mentioned earlier, DACPACs don't work and a SQL Script that contains all the objects, doesn't work either. It's like Synapse doesn't recognise the `;` command terminator. So we have to break the script into component scripts that do run together.

#### Create Database

{{< gist UstDoesTech 0b4ca89c8905eba1a0d81fabfcfecbd6>}}

#### Create External Resources

{{< gist UstDoesTech 6fce12200a5ce1bca64fd7bc4fe1d013>}}

#### Create Schema

{{< gist UstDoesTech 683d2803d70df960ad937ff4b4eb6f17>}}

#### Create Stored Procs

{{< gist UstDoesTech 0d3164c974d898be6773b8210b4145ec>}}

{{< gist UstDoesTech eebdac85a5f7e979bb2ce04b253b6487>}}

And all this is orchestrated by an Azure DevOps Pipeline, written in yaml.

#### DevOps Pipeline Yaml

{{< gist UstDoesTech 41460487938756331e0f0109c4145098>}}

## Conclusion

Deploying a Database, and objects, to Synapse Serverless is frustrating, but it's also possible. There are potentially alternatives, like the [Synapse Workspace Deployment](https://marketplace.visualstudio.com/items?itemName=AzureSynapseWorkspace.synapsecicd-deploy) task in Azure DevOps, but I don't have the appropriate permissions in this DevOps instance for me to install the module and try it out. Considering the poor reviews, I would assume that it might not do what I needed to do.
