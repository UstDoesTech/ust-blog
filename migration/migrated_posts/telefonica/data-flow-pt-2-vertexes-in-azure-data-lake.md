---
title: "Data Flow Pt 2: Vertexes In Azure Data Lake"
date: 2017-07-06
tags: []
description: "Explore the intricacies of vertexes in Azure Data Lake with Telefónica Tech. Learn how data flows efficiently in this detailed guide."
source: "https://telefonicatech.uk/blog/data-flow-pt-2-vertexes-in-azure-data-lake/"
source_site: "Telefonica Tech UK (formerly Adatis)"
original_author: "Ust Oldfield"
status: draft
migrated: true
migration_date: "2026-02-10"
# images_to_download: 3 (see bottom of file)
---

> **Migrated from [Telefonica Tech UK (formerly Adatis)](https://telefonicatech.uk/blog/data-flow-pt-2-vertexes-in-azure-data-lake/)**
> Original publication date: 2017-07-06

Following on from my previous post on [Job Execution in the Azure Data Lake](https://telefonicatech.uk/blog/data-flow-job-execution-in-the-azure-data-lake/), this post will explore the concept of Extents and how they are utilised by Vertexes in the actual Job processing in Azure.

The U-SQL script that has been authored, compiled and deployed is the logical plan of how the author intends to transform input data into output data. This creates a total amount of work – essentially the amount of data it has to process – which is decomposed into a set of vertexes. Each vertex will process a subset of data, or extents (see [Azure Data Lake Storage](https://telefonicatech.uk/blog/azure-data-lake-store-storage-and-best-practices/) for more information) and represent a fraction of the total.

Vertexes are displayed, or grouped, in a super vertex, also known as a stage. Vertexes in each stage are doing the same operation on a different part of the same data. The number of vertexes in a stage indicates the maximum theoretical parallelisation of that stage. The containers requested for the job will be allocated to complete each vertex. Say there is a 10GB file. This file will be split into 40 Extents and allocated to at least 10 Vertexes. If one wants to process all of the file in parallel then requesting 10 containers will allow for concurrent parallelism.

All this is visualised as the job graph.

If you have multiple transformations going on in your USQL script this will create multiple stages, and the output of one vertex becomes the input of another vertex in a dependent stage. As a result, dependent stages can begin processing even if preceding stages haven’t completed processing.

If dependency does exist, it will create a critical path – which is the dependency chain of vertexes which keep the job running to the very end because the vertex on the bottom depends on the output of the vertex on the top. This can be seen in the Vertex Execution View in the Visual Studio Azure Data Lake Tools view. It’s useful for optimising job, by re-positioning or re-writing elements of your script, by checking which vertex takes the longest.

 

It may not be possible to use all the reserved parallelism during a stage if there are fewer vertexes than Azure Data Lake Analytics Units (ADLAUs) available.

For example, if I have 10 ADLAUs – it’s great for an early stage as all ADLAUs will be allocated a vertex. But with later stages, more and more ADLAUs will be idle. So by the last stage only 2 of the 14 are utilised. Unfortunately it is not currently possible to dynamically de-allocate ADLAUs during a job.

 

In conclusion, understanding how vertexes interact with extents and can influence parallelism, you should be able to provision adequate resources for your jobs as well as know where to start the investigation for any long running queries you might have with the Vertex Execution View. In the next post of the series I will be looking into resource costs and optimising spend and time taken to process data.


<!-- IMAGE MANIFEST (DOWNLOADED)
Images downloaded to local paths:
  - images\data-flow-pt-2-vertexes-in-azure-data-lake\ustoldfield_image_thumb_13.png
    alt: image
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_image_thumb_13.png
  - images\data-flow-pt-2-vertexes-in-azure-data-lake\ustoldfield_image_thumb_14.png
    alt: image
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_image_thumb_14.png
  - images\data-flow-pt-2-vertexes-in-azure-data-lake\ustoldfield_image_thumb_15.png
    alt: image
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_image_thumb_15.png

To use in markdown:
  ![image](images\data-flow-pt-2-vertexes-in-azure-data-lake\ustoldfield_image_thumb_13.png)
  ![image](images\data-flow-pt-2-vertexes-in-azure-data-lake\ustoldfield_image_thumb_14.png)
  ![image](images\data-flow-pt-2-vertexes-in-azure-data-lake\ustoldfield_image_thumb_15.png)
-->