---
title: "Azure Data Lake Store–Storage and Best Practices"
date: 2017-04-10
tags: []
description: "Discover best practices for Azure Data Lake Store with Telefónica Tech. Learn about efficient storage solutions and optimize your data management strategy."
source: "https://telefonicatech.uk/blog/azure-data-lake-store-storage-and-best-practices/"
source_site: "Telefonica Tech UK (formerly Adatis)"
original_author: "Ust Oldfield"
status: draft
migrated: true
migration_date: "2026-02-10"
# images_to_download: 5 (see bottom of file)
---

> **Migrated from [Telefonica Tech UK (formerly Adatis)](https://telefonicatech.uk/blog/azure-data-lake-store-storage-and-best-practices/)**
> Original publication date: 2017-04-10

The Azure Data Lake Store is an integral component for creating a data lake in Azure as it is where data is physically stored in many implementations of a data lake. Under the hood, the Azure Data Lake Store is the Web implementation of the Hadoop Distributed File System (HDFS). Meaning that files are split up and distributed across an array of cheap storage.

What this blog will go into is the physical storage of files in the Azure Data Lake Store and then best practices.

## Azure Data Lake Store File Storage

As mentioned, the Azure Data Lake Store is the Web implementation of HDFS. Each file you place into the store is split into 250MB chunks called extents. This enables parallel read and write. For availability and reliability, extents are replicated into three copies. As files are split into extents, bigger files have more opportunities for parallelism than smaller files. If you have a file smaller than 250MB it is going to be allocated to one extent and one vertex (which is the work load presented to the Azure Data Lake Analytics), whereas a larger file will be split up across many extents and can be accessed by many vertexes.

The format of the file has a huge implication for the storage and parallelisation. Splittable formats – files which are row oriented, such as CSV – are parallelizable as data does not span extents. Non-splittable formats, however, – files what are not row oriented and data is often delivered in blocks, such as XML or JSON – cannot be parallelised as data spans extents and can only be processed by a single vertex.

In addition to the storage of unstructured data, Azure Data Lake Store also stores structured data in the form of row-oriented, distributed clustered index storage, which can also be partitioned. The data itself is held within the “Catalog” folder of the data lake store, but the metadata is contained in the data lake analytics. For many, working with the structured data in the data lake is very similar to working with SQL databases.

#

# Azure Data Lake Store Best Practices

The framework allows you to manage and maintain your data lake. So, when setting up your Azure Data Lake Store you will want to initially create the following folders in your Root.

Raw is where data is landed in directly from source and the underlying structure will be organised ultimately by Source.

Source is categorised by Source Type, which reflects the ultimate source of data and the level of trust one should associate with the data.

Within the Source Type, data is further organised by Source System.

Within the Source System, the folders are organised by Entity and, if possible, further partitioned using the standard Azure Data Factory Partitioning Pattern of Year > Month > Day etc., as this will allow you to achieve partition elimination using file sets.

The folder structure of Enriched and Curated is organised by Destination Data Model. Within each Destination Data Model folder is structured by Destination Entity. Enriched or Curated can either be in the folder structure and / or within the Database.


<!-- IMAGE MANIFEST (DOWNLOADED)
Images downloaded to local paths:
  - images\azure-data-lake-storestorage-and-best-practices\ustoldfield_image_thumb.png
    alt: image
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_image_thumb.png
  - images\azure-data-lake-storestorage-and-best-practices\ustoldfield_image_thumb_1.png
    alt: image
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_image_thumb_1.png
  - images\azure-data-lake-storestorage-and-best-practices\ustoldfield_image_thumb_2.png
    alt: image
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_image_thumb_2.png
  - images\azure-data-lake-storestorage-and-best-practices\ustoldfield_image_thumb_3.png
    alt: image
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_image_thumb_3.png
  - images\azure-data-lake-storestorage-and-best-practices\ustoldfield_image_thumb_4.png
    alt: image
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_image_thumb_4.png

To use in markdown:
  ![image](images\azure-data-lake-storestorage-and-best-practices\ustoldfield_image_thumb.png)
  ![image](images\azure-data-lake-storestorage-and-best-practices\ustoldfield_image_thumb_1.png)
  ![image](images\azure-data-lake-storestorage-and-best-practices\ustoldfield_image_thumb_2.png)
  ![image](images\azure-data-lake-storestorage-and-best-practices\ustoldfield_image_thumb_3.png)
  ![image](images\azure-data-lake-storestorage-and-best-practices\ustoldfield_image_thumb_4.png)
-->