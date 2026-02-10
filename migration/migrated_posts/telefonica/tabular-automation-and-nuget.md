---
title: "Tabular Automation and NuGet"
date: 2018-03-05
tags: []
description: "Discover how Telefónica Tech leverages Tabular Automation and NuGet to streamline data processes. Learn more on our blog!"
source: "https://telefonicatech.uk/blog/tabular-automation-and-nuget/"
source_site: "Telefonica Tech UK (formerly Adatis)"
original_author: "Ust Oldfield"
status: draft
migrated: true
migration_date: "2026-02-10"
# images_to_download: 2 (see bottom of file)
---

> **Migrated from [Telefonica Tech UK (formerly Adatis)](https://telefonicatech.uk/blog/tabular-automation-and-nuget/)**
> Original publication date: 2018-03-05

In a recent blog post, I wrote about processing an [Azure Analysis Services tabular model using Azure Functions](https://telefonicatech.uk/blog/process-an-azure-analysis-services-tabular-model-from-an-azure-function/). In it, there’s a lengthy process of downloading some DLLs and uploading them to the Azure Function. Handily, the Analysis Services team at Microsoft have released the [Analysis Services NuGet package](https://blogs.msdn.microsoft.com/analysisservices/2018/02/10/automation-of-analysis-services-with-nuget-packages/), which means that the necessary DLLs can be automatically installed to an Azure Function without much hassle. This blog is going to go through the steps of adding the NuGet package to your Azure Function.

Add a new file to your function called project.json

Input the following code in the newly created file

> {
> “frameworks”: {
> “net46”:{
> “dependencies”: {
> “Microsoft.AnalysisServices.retail.amd64”: “15.0.2”
> }
> }
> }
> }

Then save the Azure Function to proceed with the NuGet restore and compile your function. You should see the following logs in your log window.

That is the entire process. Much easier than documented previously!


<!-- IMAGE MANIFEST (DOWNLOADED)
Images downloaded to local paths:
  - images\tabular-automation-and-nuget\ustoldfield_image_thumb_48.png
    alt: image
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_image_thumb_48.png
  - images\tabular-automation-and-nuget\ustoldfield_image_thumb_49.png
    alt: image
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_image_thumb_49.png

To use in markdown:
  ![image](images\tabular-automation-and-nuget\ustoldfield_image_thumb_48.png)
  ![image](images\tabular-automation-and-nuget\ustoldfield_image_thumb_49.png)
-->