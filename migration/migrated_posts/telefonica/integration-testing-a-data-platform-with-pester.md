---
title: "Integration Testing a Data Platform with Pester"
date: 2019-02-01
tags: []
description: "A blog to outline practical example of developing and performing integration tests with the Pester framework for PowerShell."
source: "https://telefonicatech.uk/blog/integration-testing-a-data-platform-with-pester/"
source_site: "Telefonica Tech UK (formerly Adatis)"
original_author: "Ust Oldfield"
status: draft
migrated: true
migration_date: "2026-02-10"
# images_to_download: 1 (see bottom of file)
---

> **Migrated from [Telefonica Tech UK (formerly Adatis)](https://telefonicatech.uk/blog/integration-testing-a-data-platform-with-pester/)**
> Original publication date: 2019-02-01

In a previous post, I gave an [overview to integration tests](https://telefonicatech.uk/blog/integration-testing-overview/) and documenting integration points. In this post, I will give a practical example of developing and performing integration tests with the Pester framework for PowerShell. With a data platform, especially one hosted in Azure, it’s important to test that the Azure resources in your environment have been deployed and configured correctly. After we’ve done this, we can test the integration points on the platform, confident that all the components have been deployed.

The code for performing integration tests is written in PowerShell using the [Pester Framework](https://github.com/pester/Pester/wiki/Pester). The tests are run through Azure DevOps pipelines and are designed to test documented integration points. The PowerShell scripts, which contain the mechanism for executing tests, rely upon receiving the actual test definitions from a metadata database.

## Database Structure

The metadata database should contain a schema called Test, which is a container for all the database objects for running tests using Pester. These objects are:

- Test.TestCategory – contains what category of test is to be run e.g. Integration Tests
- Test.TestType – contains the type of tests that need to be run and are associated with a particular type of functionality. In the Pester Framework, Test Type maps to the Describe function.
- Test.Test – contains the individual tests to be run, with reference to the test type and environment. In the Pester Framework, Test maps to the Context function.
- Test.Assert contains the individual asserts to be executed against the output from the test run, with reference to the Test and type of assert. In the Pester Framework, Test maps to the It function.

How you design the tables, is up to you, but I suggest that the schema looks similar to the above.

## Test Environment Setup

Before we begin testing all the integration points, we need to be confident that the environment, for which the platform is deployed to, has been created and configured correctly. If it hasn’t, there’s no point in progressing with the actual integration tests as they would fail. For this, we have an initial script to perform these checks.

The script executes a stored procedure called **Test.ObtainTests**, which returns the list of tests to be run. Within a Pester **Describe** block, the tests are executed. The tests use the **Get-AzureRmResource** cmdlet and asserts that the name of the deployed resource matches that of the expected resource, as defined in the TestObject.

If any of the tests fail in this phase, no further testing should take place.

## Integration Tests

We’re confident that the environment has been created and configured correctly, so now we’re ready to run the integration tests according to the documented integration points. For this example, we’ll be putting in some data into the RAW layer of the data lake, running it through the various layers until it ends up in the CURATED layer and can be read by Azure SQL DW. Because the majority of the processing is orchestrated using Azure Data Factory V2 (ADF), and the majority of the integration points are within ADF, we only really need to ensure that the pipeline(s) run successfully and some valid data appears in the CURATED layer for SQL DW to consume via PolyBase.

Because we’re also deploying some data, we’ve got elements of setup and teardown in the script. Setup and teardown in the metadata database, so that ADF knows what to process. Setup and teardown in the data lake, so that there is data to process

## Tying it all together

We’ve got our scripts, but how does it get invoked? This is where the InvokePester script comes in. For anyone not familiar with Pester, this is effectively the orchestrator for your testing scripts. 

If you deploy the tests to Azure DevOps as part of a release pipeline, you’ll see a similar output to the image below:

This should give you enough to start using Pester for testing your own Azure data platform implementations.


<!-- IMAGE MANIFEST (DOWNLOADED)
Images downloaded to local paths:
  - images\integration-testing-a-data-platform-with-pester\ustoldfield_image_thumb_60.png
    alt: image
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_image_thumb_60.png

To use in markdown:
  ![image](images\integration-testing-a-data-platform-with-pester\ustoldfield_image_thumb_60.png)
-->