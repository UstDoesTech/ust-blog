---
title: "Connecting Power BI to Hive"
date: 2017-06-04
tags: []
description: "Learn how to connect Power BI to Hive with this comprehensive guide from Telefónica Tech. Enhance your data analysis capabilities today!"
source: "https://telefonicatech.uk/blog/connecting-power-bi-to-hive/"
source_site: "Telefonica Tech UK (formerly Adatis)"
original_author: "Ust Oldfield"
status: draft
migrated: true
migration_date: "2026-02-10"
# images_to_download: 2 (see bottom of file)
---

> **Migrated from [Telefonica Tech UK (formerly Adatis)](https://telefonicatech.uk/blog/connecting-power-bi-to-hive/)**
> Original publication date: 2017-06-04

On a recent project I was tasked with importing data into [Power BI](https://telefonicatech.uk/solutions/business-applications/power-platform/power-bi/) from a Hive table. For those of you who are new to Azure or Big Data, Hive is a data warehousing infrastructure for Hadoop which sits in the HDInsight stack on Azure. The primary purpose of Hive is to provide data summarisation, query and analysis for big data sets. In this blog I’m going to take you through the steps and note any Gotchas so that you can connect to Hive using Power BI.

# Connecting to Hive

As Hive is part of the Azure HDInsight stack it would be tempting to select the HDInsight or Hadoop connector when you’re getting data. However, note HDFS in brackets beside the Azure HDInsight and Hadoop File options as this means that you’ll be connecting to the underlying data store, which can be Azure Data Lake Store or Azure Blob Storage – both of which use HDFS architectures.

##

##

But this doesn’t help when you want to access a Hive table. In order to access a Hive table you will first of all need to install the [Hive ODBC driver from Microsoft](https://www.microsoft.com/en-us/download/details.aspx?id=40886). Once you’ve downloaded and installed the driver you’ll be able to make your connection to Hive using the ODBC connector in PowerBI.

You will need to input a connection string to connect even though it says optional. The format of the connection string is as follows:

*Driver={Microsoft Hive ODBC Driver};Host=hdinsightclustername.azurehdinsight.net;Port=443;Schema=default; RowsFetchedPerBlock=10000; HiveServerType=2; AuthMech=6; DefaultStringColumnLength=200;*

One the next screen you’ll be asked to enter a username and password. The credentials used here are not what you use to access Azure but the credentials you created when you set up the HDInsight cluster and use to login to the cluster.

Click connect and you’ll be able to pull through the tables you need into Power BI. Or, if you want to be selective in what is returned, you can write a HiveQL query in the ODBC dialog. It’s also worth noting that at the moment it’s only possible to do an import of Hive Data in Power BI and not perform Direct Query, so if your data set is huge you’ll want to summarise the data or be really selective in what is returned first.


<!-- IMAGE MANIFEST (DOWNLOADED)
Images downloaded to local paths:
  - images\connecting-power-bi-to-hive\ustoldfield_image_thumb_11.png
    alt: image
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_image_thumb_11.png
  - images\connecting-power-bi-to-hive\ustoldfield_image_thumb_12.png
    alt: image
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_image_thumb_12.png

To use in markdown:
  ![image](images\connecting-power-bi-to-hive\ustoldfield_image_thumb_11.png)
  ![image](images\connecting-power-bi-to-hive\ustoldfield_image_thumb_12.png)
-->