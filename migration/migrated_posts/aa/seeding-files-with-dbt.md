---
title: "Seeding Files With dbt"
date: 2026-02-10
tags: []
description: "File seeding is a useful way of maintaining and deploying static, or very slowly changing, reference data for a data model to use repeatably and reliably across environments, whilst benefitting from s"
source: "https://www.advancinganalytics.co.uk/blog/2022/12/15/seeding-files-with-dbt"
source_site: "Advancing Analytics"
original_author: "Ust Oldfield"
status: draft
migrated: true
migration_date: "2026-02-10"
---

> **Migrated from [Advancing Analytics](https://www.advancinganalytics.co.uk/blog/2022/12/15/seeding-files-with-dbt)**
> Original publication date: unknown

File seeding is a useful way of maintaining and deploying static, or very slowly changing, reference data for a data model to use repeatably and reliably across environments, whilst benefitting from source control.

## **Seeding Files with dbt**

Seed files exist in the `seed` directory of dbt and can be added like any other csv to a directory.

You can then run the `dbt seed` command which will insert the data into a table in Databricks, or whatever target system you’ve got set up for dbt.

For this, I’m using our list of airports from our previous example, having exported it as a csv and deposited it in our `seeds` folder.