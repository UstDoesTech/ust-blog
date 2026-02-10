---
title: "Regression Testing a Data Platform with Pester"
date: 2019-02-21
tags: []
description: "A practical example of developing and performing regression tests with the Pester framework for PowerShell and how to test using Azure DevOps pipelines"
source: "https://telefonicatech.uk/blog/regression-testing-a-data-platform-with-pester/"
source_site: "Telefonica Tech UK (formerly Adatis)"
original_author: "Ust Oldfield"
status: draft
migrated: true
migration_date: "2026-02-10"
---

> **Migrated from [Telefonica Tech UK (formerly Adatis)](https://telefonicatech.uk/blog/regression-testing-a-data-platform-with-pester/)**
> Original publication date: 2019-02-21

In a previous post, I gave an [overview to regression tests](https://telefonicatech.uk/blog/regression-testing-overview/). In this post, I will give a practical example of developing and performing regression tests with the Pester framework for PowerShell. The code for performing regression tests is written in PowerShell using the [Pester Framework](https://github.com/pester/Pester/wiki/Pester). The tests are run through Azure DevOps pipelines and are designed to test regression scenarios. The PowerShell scripts, which contain the mechanism for executing tests, rely upon receiving the actual test definitions from a metadata database. The structure of the metadata database will be exactly the same as laid out in the [Integration Test post](https://telefonicatech.uk/blog/integration-testing-a-data-platform-with-pester/).

## Regression Tests

The regression tests will need to be designed so that existing functionality isn’t regressed by any changes made to the code. In an analytics system, the functionality is typically going to be aligned to the target schema that’s used for reporting and analysis. If we change the cleaning transformation logic in the source tables which make up our customer dimension, we’ll want to ensure that the customer dimension itself doesn’t change expected outcomes, for example row counts or a specific value.

For this example, we’ll be putting in some data into the data lake, run it through the various layers until it ends up in the CURATED layer. Because the majority of the processing is orchestrated using Azure Data Factory V2 (ADF), we only really need to ensure that the pipeline(s) run successfully and some valid data appears in all the layers of the lake, as well as logged into the metadata database.

Because we’re deploying some data, we’ve got elements of setup and teardown in the script. Setup and teardown in the metadata database, so that ADF knows what to process. Setup and teardown in the data lake, so that there is data to process.

This should give you enough to start using Pester for testing your own Azure data platform implementations.