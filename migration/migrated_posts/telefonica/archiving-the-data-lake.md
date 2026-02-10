---
title: "Archiving the Data Lake"
date: 2017-12-13
tags: []
description: "Discover how Telefónica Tech efficiently manages and archives vast data lakes, ensuring optimal performance and compliance. Learn more at Telefónica Tech."
source: "https://telefonicatech.uk/blog/archiving-the-data-lake/"
source_site: "Telefonica Tech UK (formerly Adatis)"
original_author: "Ust Oldfield"
status: draft
migrated: true
migration_date: "2026-02-10"
# images_to_download: 1 (see bottom of file)
---

> **Migrated from [Telefonica Tech UK (formerly Adatis)](https://telefonicatech.uk/blog/archiving-the-data-lake/)**
> Original publication date: 2017-12-13

In a blog introducing the [Data Lake Framework](https://telefonicatech.uk/blog/shaping-the-lake-data-lake-framework/), keen readers will be aware that in the diagram there’s a box titled “ARCHIVE” but it has not been brought up since. The reason why the Archive layer in the data lake has not been discussed is because we’ve been waiting for the Archive Tier in Blob Storage.

To remind readers of the framework and where the archive layer sits in it, here it is again with the archive layer highlighted.

# The Archive Blob

The [Archive access tier](https://docs.microsoft.com/en-gb/azure/storage/blobs/storage-blob-storage-tiers) in blob storage was made generally available today (13th December 2017) and with it comes the final piece in the puzzle to archiving data from the data lake.

Where Hot and Cool access tiers can be applied at a storage account level, the Archive access tier can only be applied to a blob storage container. To understand why the Archive access tier can only be applied to a container, you need to understand the features of the Archive access tier. It is intended for data that has no or low SLAs for availability within an organisation and the data is stored offline (Hot and Cool access tiers are online). Therefore, it can take up to 15 hours for data to be made online and available. Brining Archive data online is a process called rehydration (fitting for the data lake). If you have lots of blob containers in a storage account, you can archive them and rehydrate them as required, rather than having to rehydrate the entire storage account.

# Archive Pattern

An intended use for the Archive access tier is to store raw data that must be preserved, even after it has been fully processed, and does not need to be accessed within 180 days.

Data gets loaded into the RAW area of the data lake, is fully processed through to CURATED, and a copy of the raw data is archived off to a blob container with a Cool access tier applied to it. When the archive cycle comes about, a new Cool access tiered blob container is created and the now old container has its access tier changed to Archive.

For example, our Archive cycle is monthly and we have a Cool access tiered blob container in our storage account called “December 2017”. When data has finished being processed in the Azure Data Lake, the Raw data is archived to this blob container. January comes around, we create a new blob container called “January 2018” with Cool access tier settings and change the access tier of “December 2017” from Cool to Archive.

This data has now been formally achieved and is only available for disaster recovery, auditing or compliance purposes.


<!-- IMAGE MANIFEST (DOWNLOADED)
Images downloaded to local paths:
  - images\archiving-the-data-lake\ustoldfield_image_thumb_25_1.png
    alt: image
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_image_thumb_25.png

To use in markdown:
  ![image](images\archiving-the-data-lake\ustoldfield_image_thumb_25_1.png)
-->