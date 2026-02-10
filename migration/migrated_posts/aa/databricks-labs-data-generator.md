---
title: "Databricks Labs: Data Generator"
date: 2026-02-10
tags: ["public-preview"]
description: "Databricks recently released the  public preview  of a Data Generator for use within Databricks to generate synthetic data."
source: "https://www.advancinganalytics.co.uk/blog/2021/8/9/databricks-labs-data-generator"
source_site: "Advancing Analytics"
original_author: "Ust Oldfield"
status: draft
migrated: true
migration_date: "2026-02-10"
---

> **Migrated from [Advancing Analytics](https://www.advancinganalytics.co.uk/blog/2021/8/9/databricks-labs-data-generator)**
> Original publication date: unknown

Databricks recently released the [public preview](https://github.com/databrickslabs/dbldatagen/releases/tag/v0.2.0-rc0-master) of a Data Generator for use within Databricks to generate synthetic data.

This is particularly exciting as the Information Security manager at a client recently requested synthetic data to be generated for use in all non-production environments as a feature of a platform I’ve been designing for them. The Product Owner decided at the time that it was too costly to implement any time soon, but this release from Databricks makes the requirement for synthetic data much easier and quicker to realise and deliver.

## Databricks Labs

[Databricks Labs](https://databricks.com/learn/labs) is a relatively new offering from Databricks which showcases what their teams have been creating in the field to help their customers. As a Consultant, this makes my life a lot easier as I don’t have to re-invent the wheel and I can use it to demonstrate value in partnering with Databricks. There’s plenty of use cases that I’ll be using, and extending, with my client but the one I want to focus on in this post is the Data Generator.

## Data Generator

The Data Generator aims to do just that: generate synthetic data for use in non-production environments while trying to represent realistic data. It uses the Spark engine to generate the data so is able to generate a huge amount of data in a short amount of time. It is a Python framework, so you have to be comfortable with Python and PySpark to generate data. But once data has been generated, you can then use any of the other languages supported by Databricks to consume it.

In order to generate data, you define a spec (which can imply a schema or use an existing schema) and seed each column using a series of approaches:

- Based on ID fields of base data frame
- Based on other columns in the spec
- Based on the value on one or more base fields
- Based on a hash of the base values
- Generated at random

You can also iteratively generate data for a column by applying transformations on the base value of the column, such as:

- Mapping the base value to one of a set of discrete values, including weighting
- Applying arithmetic transformation
- Applying string formatting

The generator is currently installed to a cluster as a [wheel](https://github.com/databrickslabs/dbldatagen/releases) and enabled in your notebook using: