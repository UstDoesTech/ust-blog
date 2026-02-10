---
title: "LETS Process Data–Modern ETL for the Data Lake"
date: 2017-11-29
tags: []
description: "Where ETL stands for Extract, Transform, Load or ELT stands for Extract, Load, Transform – LETS stands for Load, Extract, Transform, Store."
source: "https://telefonicatech.uk/blog/lets-process-data-modern-etl-for-the-data-lake/"
source_site: "Telefonica Tech UK (formerly Adatis)"
original_author: "Ust Oldfield"
status: draft
migrated: true
migration_date: "2026-02-10"
# images_to_download: 1 (see bottom of file)
---

> **Migrated from [Telefonica Tech UK (formerly Adatis)](https://telefonicatech.uk/blog/lets-process-data-modern-etl-for-the-data-lake/)**
> Original publication date: 2017-11-29

At the PASS Summit this year, I attended a session by Michael Rys. In this session he introduced the concept of LETS as an approach to process data in the data lake. If you are familiar with data lake, then you will be familiar of having to apply a schema to the data held within. The LETS approach is purpose design for schematization.

Where ETL stands for Extract, Transform, Load or ELT stands for Extract, Load, Transform – LETS stands for Load, Extract, Transform, Store.

Data are **Loaded** into the data lake

Data are **Extracted** and schematized

Data are **Transformed** in rowsets

Data are **Stored** in a location, such as the Catalog in Azure Data Lake Analytics, Azure Data Warehouse, Azure Analysis Services, for analysis purposes.

I really like this approach as it makes sense for how data are handled in the data lake. It’s something that I will be advocating and using, and I hope you do too!


<!-- IMAGE MANIFEST (DOWNLOADED)
Images downloaded to local paths:
  - images\lets-process-datamodern-etl-for-the-data-lake\ustoldfield_image_thumb_21.png
    alt: image
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_image_thumb_21.png

To use in markdown:
  ![image](images\lets-process-datamodern-etl-for-the-data-lake\ustoldfield_image_thumb_21.png)
-->