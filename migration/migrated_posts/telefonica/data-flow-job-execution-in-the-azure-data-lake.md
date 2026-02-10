---
title: "Data Flow: Job Execution in the Azure Data Lake"
date: 2017-05-11
tags: []
description: "Explore how Telefónica Tech optimizes job execution in the Azure Data Lake, ensuring efficient data flow and robust performance."
source: "https://telefonicatech.uk/blog/data-flow-job-execution-in-the-azure-data-lake/"
source_site: "Telefonica Tech UK (formerly Adatis)"
original_author: "Ust Oldfield"
status: draft
migrated: true
migration_date: "2026-02-10"
# images_to_download: 2 (see bottom of file)
---

> **Migrated from [Telefonica Tech UK (formerly Adatis)](https://telefonicatech.uk/blog/data-flow-job-execution-in-the-azure-data-lake/)**
> Original publication date: 2017-05-11

In this blog we will deep dive into the job execution of the Azure Data Lake Analytics (ADLA). If you’ve used ADLA you will have come across the following image:

This is the graphical representation of the job execution. But what is is doing at each stage?

# Preparing

The job execution begins with the authoring of the U-SQL script. The U-SQL script itself is the logical plan of how you intend to transform input data into output data. The script gets compiled, which will translate your U-SQL script primarily into C#, as well as a few other items such as XML- which will contain metadata information and the job graph. Once compiled it will create an initial plan – which will then be optimised thus producing an optimised plan. If it fails at this stage it will mostly be down to your U-SQL script failing to compile successfully. Fortunately, the error codes at this stage are fairly helpful and will indicate the line in question.

# Queued

Once compiled and optimised the job progresses to the queued stage. There are a few things which can cause the a job to queue and these are:

- Running Jobs
  - The default setting per subscription is 3. So if you or someone else in your subscription is already running a series of jobs, your job will be queued until at least one of them completes
- Higher priority jobs
  - As the queue is ordered by job priority, with loser numbers having a higher priority, other jobs can jump to the top of the queue thus forcing your job to queue for longer
- Lack of resources
  - Even if there are no running jobs and there are no jobs ahead of yours in the queue, your job will continue to queue if there are not enough Azure Data Lake Analytic Units (ADLAUs) to start the job.

# Running

Once the job has finished queuing it will run. The Job Manager allocates vertexes, which are collections of data to be processed, to the ADLAUs and uses YARN to orchestrate it. The vertexes will then execute. At this stage, if there is a vertex failure you can download the vertex locally and debug in visual studio.

When the vertexes have successfully completed you will be able to consume the end product – either locally, if you have run the job locally, or in the Azure Data Lake Store.

Conclusion

The above process can be visualised in this graph. Knowing how ADLA executes your job is the first of many steps to being able to write performant U-SQL and debug effectively. Be on the look out for more blogs on the technical deep dive into ADLA!


<!-- IMAGE MANIFEST (DOWNLOADED)
Images downloaded to local paths:
  - images\data-flow-job-execution-in-the-azure-data-lake\ustoldfield_Picture1_thumb.png
    alt: Picture1
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_Picture1_thumb.png
  - images\data-flow-job-execution-in-the-azure-data-lake\ustoldfield_Job_Execution_thumb.jpg
    alt: Job Execution
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_Job_Execution_thumb.jpg

To use in markdown:
  ![Picture1](images\data-flow-job-execution-in-the-azure-data-lake\ustoldfield_Picture1_thumb.png)
  ![Job Execution](images\data-flow-job-execution-in-the-azure-data-lake\ustoldfield_Job_Execution_thumb.jpg)
-->