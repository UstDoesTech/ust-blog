---
title: "Getting Started with dbt"
date: 2026-02-10
tags: []
description: "What is dbt?  dbt is an abbreviation for data build tools. It is primarily a SQL based transformation workflow, supported by yaml, to allow teams to collaborate on analytics code whilst implementing s"
source: "https://www.advancinganalytics.co.uk/blog/2022/12/5/getting-started-with-dbt"
source_site: "Advancing Analytics"
original_author: "Ust Oldfield"
status: draft
migrated: true
migration_date: "2026-02-10"
---

> **Migrated from [Advancing Analytics](https://www.advancinganalytics.co.uk/blog/2022/12/5/getting-started-with-dbt)**
> Original publication date: unknown

## What is dbt?

dbt is an abbreviation for data build tools. It is primarily a SQL based transformation workflow, supported by yaml, to allow teams to collaborate on analytics code whilst implementing software engineering best practices like modularity, portability, CI/CD, testing, and documentation.

dbt is available using a CLI in the form of dbt core, or as a paid-for SaaS product in the form of dbt cloud.

dbt Core features a CLI for you to be able to create analytical models and tests, whereas dbt Cloud adds auto-generated documentation at run-time and scheduled workflows.

dbt materializes the results of queries as physical tables or views, thereby avoiding the maintenance of tables, such as managing the schema, transactions and other activities which occupy data teams. You can decompose data models into reusable, modular components to be used across different models, as well as leveraging metadata for optimisation.

SQL elements in dbt can utilise Jinga, which helps to reduce repetitive tasks by using macros and packages. The Directed Acyclic Graph (DAG) feature of dbt allows you to determine the order of execution of the objects, but also to propagate changes to the model to dependents. As the files that dbt uses are largely SQL and yaml files, this allows them to be easily source controlled. The power of dbt comes from the build engine itself, that creates the DAG, runs data quality tests on the data, hosts embedded documentation of the models and fields, as well as easily define snapshots and easily maintain seed values and files for repeatable testing.

It can connect to and use data from multiple systems such as: Postgres, Snowflake, Databricks and many others. For the purpose of this blog post, we’ll use Databricks as our source and use dbt core as our dbt instance.

We’re assuming you’ve already got a Databricks workspace available, you are familiar with Git, and tools like VSCode.

## **Installing dbt locally**

For local development, dbt core is installed and configured using Python pip commands

```
pip install dbt-core
```

will install dbt core without any connection configuration, whereas something like

```
pip install dbt-databricks
```

will install dbt core as well as the connection configuration for Databricks, [other options are available](https://docs.getdbt.com/docs/get-started/pip-install).

## **Initialise dbt**

Create / Re-use an existing repo and clone locally using VS Code.

Within your project repo, open a new terminal window and use the following command to initialize the repo with base dbt structure for a given project:

```
dbt init {project_name}
```

There’ll be a series of prompts in the terminal, asking for the Databricks connection details. You’ll need to provide the host, the http path, the token and the schema that objects will be deployed to.

You’ll then be greeted with a folder structure that looks like: