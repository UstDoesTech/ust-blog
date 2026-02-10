---
title: "Automating The Deployment of Azure Data Factory Custom Activities"
date: 2017-09-06
tags: []
description: "Learn how to automate the deployment of Azure Data Factory custom activities with Telefónica Tech. Streamline your data workflows efficiently."
source: "https://telefonicatech.uk/blog/automating-the-deployment-of-azure-data-factory-custom-activities-2/"
source_site: "Telefonica Tech UK (formerly Adatis)"
original_author: "Ust Oldfield"
status: draft
migrated: true
migration_date: "2026-02-10"
---

> **Migrated from [Telefonica Tech UK (formerly Adatis)](https://telefonicatech.uk/blog/automating-the-deployment-of-azure-data-factory-custom-activities-2/)**
> Original publication date: 2017-09-06

Custom Activities in Azure Data Factory (ADF) are a great way to extend the capabilities of ADF by utilising C# functionality. Custom Activities are useful if you need to move data to/from a data store that ADF does not support, or to transform/process data in a way that isn’t supported by Data Factory, as it can be used within an ADF pipeline.

Deploying Custom Activities to ADF is a manual process, which requires many steps. Microsoft’s [documentation](https://docs.microsoft.com/en-us/azure/data-factory/data-factory-use-custom-activities) lists them as:

- Compile the project. Click **Build** from the menu and click **Build Solution**.
- Launch **Windows Explorer**, and navigate to **bindebug** or **binrelease** folder depending on the type of build.
- Create a zip file **MyDotNetActivity.zip** that contains all the binaries in the binDebug folder. Include the **MyDotNetActivity.pdb** file so that you get additional details such as line number in the source code that caused the issue if there was a failure.
- Create a blob container named **customactivitycontainer** if it does not already exist
- Upload MyDotNetActivity.zip as a blob to the customactivitycontainer in a general purpose Azure blob storage that is referred to by AzureStorageLinkedService.

The number of steps means that it can take some time to deploy Custom Activities and, because it is a manual process, can contain errors such as missing files or uploading to the wrong storage account.

To avoid that errors and delays caused by a manual deployment, we want to automate as much as possible. Thanks to PowerShell, it’s possible to automate the entire deployment steps.

The script to do this is as follows:

```
Login-AzureRmAccount
# Parameters 
$SourceCodePath = "C:PathToCustomActivitiesProject"
$ProjectFile ="CustomActivities.csproj"
$Configuration = "Debug"
#Azure parameters
$StorageAccountName = "storageaccountname"
$ResourceGroupName = "resourcegroupname"
$ContainerName = "blobcontainername"

# Local Variables
$MsBuild = "C:Program Files (x86)MSBuild14.0BinMSBuild.exe";            
$SlnFilePath = $SourceCodePath + $ProjectFile;            
                             
# Prepare the Args for the actual build            
$BuildArgs = @{            
     FilePath = $MsBuild            
     ArgumentList = $SlnFilePath, "/t:rebuild", ("/p:Configuration=" + $Configuration), "/v:minimal"            
     Wait = $true            
     }          
# Start the build            
Start-Process @BuildArgs 
# initiate a sleep to avoid zipping up a half built project
Sleep 5
# create zip file 
$zipfilename = ($ProjectFile -replace ".csproj", "") + ".zip"
$source = $SourceCodePath + "bin" + $Configuration
$destination = $SourceCodePath + $zipfilename
if(Test-path $destination) {Remove-item $destination}
Add-Type -assembly "system.io.compression.filesystem"
[io.compression.zipfile]::CreateFromDirectory($Source, $destination) 
 
#create storage account if not exists
$storageAccount = Get-AzureRmStorageAccount -ErrorAction Stop | where-object {$_.StorageAccountName -eq $StorageAccountName}       
if  ( !$storageAccount ) {
     $StorageLocation = (Get-AzureRmResourceGroup -ResourceGroupName $ResourceGroupName).Location
     $StorageType = "Standard_LRS"
     New-AzureRmStorageAccount -ResourceGroupName $ResourceGroupName  -Name $StorageAccountName -Location $StorageLocation -Type $StorageType
} 
 
#create container if not exists
$ContainerObject = Get-AzureStorageContainer -ErrorAction Stop | where-object {$_.Name -eq $ContainerName}
if (!$ContainerObject){
$storagekey = Get-AzureRmStorageAccountKey -ResourceGroupName $ResourceGroupName -Name $StorageAccountName
$context = New-AzureStorageContext -StorageAccountName $StorageAccountName -StorageAccountKey $storagekey.Key1 -Protocol Http
New-AzureStorageContainer -Name $ContainerName -Permission Blob -Context $context
}
 
# upload to blob
#set default context
Set-AzureRmCurrentStorageAccount -StorageAccountName $StorageAccountName -ResourceGroupName  $ResourceGroupName
Get-AzureRmStorageAccount -ResourceGroupName $ResourceGroupName -Name $StorageAccountName 
# Upload file
Set-AzureStorageBlobContent –Container $ContainerName -File $destination
```

By removing the manual steps in building, zipping and deploying ADF Custom Activities, you remove the risk of something going wrong and you add the reassurance that you have a consistent method of deployment which will hopefully speed up your overall development and deployments.