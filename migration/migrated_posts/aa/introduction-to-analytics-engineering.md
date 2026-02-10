---
title: "Introduction to Analytics Engineering"
date: 2026-02-10
tags: []
description: "Analytics Engineering is a relatively new term in the world of data, having been pioneered by dbt Labs, since being founded in 2016. In the last couple of years, it has gained traction becoming an est"
source: "https://www.advancinganalytics.co.uk/blog/2022/11/30/introduction-to-analytics-engineering"
source_site: "Advancing Analytics"
original_author: "Ust Oldfield"
status: draft
migrated: true
migration_date: "2026-02-10"
---

> **Migrated from [Advancing Analytics](https://www.advancinganalytics.co.uk/blog/2022/11/30/introduction-to-analytics-engineering)**
> Original publication date: unknown

Analytics Engineering is a relatively new term in the world of data, having been pioneered by dbt Labs, since being founded in 2016. In the last couple of years, it has gained traction becoming an established discipline.

## What is Analytics Engineering?

Analytics Engineering, along with Data Engineering and Report Engineering, is a specialised subset of skills that would previously be the preserve of a Business Intelligence (BI) Developer. The BI Developer was once a generalist data developer, whose overall responsibilities have been split out and shared among specialist developers as the prevalence of data across organisation has increased and the tools and technologies used to ingest, transform, and serve data have become more specialised and loosely integrated.

In the same way that Data Engineering borrowed and took inspiration from Software Engineering for applying repeatable and scalable patterns and techniques to the pipelines that ingest and cleanse data, as well as the rigorous testing of those pipelines, Analytics Engineering has borrowed and taken inspiration from Software Engineering too.

Where Data Engineering is largely responsible for creating and maintaining pipelines that ingest and cleanse data into a central data lake, Analytics Engineering is responsible for transforming the data into analysis-ready structures – effectively the Warehouse element of a Lakehouse. Analytics Engineering combines engineering best practices with domain knowledge and data modelling skills to create those analysis-ready structures.

GitLab puts it succinctly in their [role description for an Analytics Engineer](https://about.gitlab.com/job-families/finance/analytics-engineer/):

> *Analytics Engineers sit at the intersection of business teams, Data Analytics and Data Engineering and are responsible for bringing robust, efficient, and integrated data models and products to life. Analytics Engineers speak the language of business teams and technical teams, able to translate data insights and analysis needs into models powered by the Enterprise Data Platform. The successful Analytics Engineer is able to blend business acumen with technical expertise and transition between business strategy and data development.*

An Analytics Engineer provides clean, transformed, analysis-ready data. They apply software engineering best practices to the curation of data, such as version control, testing, CI/CD, modularisation and reusability of code. They maintain data documentation and definitions. They enable users with the provisioning of analysis-ready data, and they further enable them by providing training on how to use analytical tools, such as SQL, Tableau, Power BI etc.

From a conceptual perspective, using Advancing Analytics’ reference architecture, Analytics Engineers are responsible for the curated layer, as well as the semantic layer (which is sometimes referred to as the metric layer or metric store). While they need to be aware of data visualisation best practices and techniques, they are not expected to create reports themselves. Report creation is the domain of data analysts and report engineers.