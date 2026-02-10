---
title: "Utilising R in SSRS"
date: 2016-01-12
tags: []
description: "This blog will guide you through the process of creating a simple report in SSRS using data from R."
source: "https://telefonicatech.uk/blog/utilising-r-in-ssrs/"
source_site: "Telefonica Tech UK (formerly Adatis)"
original_author: "Ust Oldfield"
status: draft
migrated: true
migration_date: "2026-02-10"
---

> **Migrated from [Telefonica Tech UK (formerly Adatis)](https://telefonicatech.uk/blog/utilising-r-in-ssrs/)**
> Original publication date: 2016-01-12

With the release of SQL Server 2016 CTP3 the inclusion of R has been a powerful and welcome addition. As R can now be directly queried from inside SQL Server Management Studio (SSMS) one can now use the data outputs from R in SQL Server Reporting Services (SSRS) thereby utilising the power of R in the convenience of SSRS.

This blog will guide you through the process of creating a simple report in SSRS using data from R.

As demonstrated in a previous blog, it is very easy to [begin using R within SQL Server](https://telefonicatech.uk/blog/sql-2016-ctp3-r-setup-and-review/) and this is no different.

First of you will need your SQL R Script, for which I’m producing a simple K Means cluster of employees in the Adventure Work Data Warehouse. Then you will want to wrap that query inside a stored procedure.

CREATE PROCEDURE dbo.spKMeansEmployee

AS

BEGIN

      EXECUTE sp\_execute\_external\_script

                   @language = N’R’,

                   @script = N’ClusterCount <- 4;

                                      df <- data.frame(InputDataSet);

                                      ClusterFeatures <- data.frame(df$BaseRate, df$VacationHours, df$SickLeaveHours, df$SalaryFlag);

                                      ClusterResult <- kmeans(ClusterFeatures, centers = ClusterCount, iter.max = 10)$cluster;

                                      OutputDataSet <- data.frame(df, ClusterResult);’,

                   @input\_data\_1 = N’SELECT

                                                   EmployeeKey,

                                                   BaseRate,

                                                   VacationHours,

                                                   SickLeaveHours,

                                                   CAST(SalariedFlag AS VARCHAR(1)) AS SalaryFlag

                                            FROM dbo.DimEmployee;’

      WITH RESULT SETS (( EmployeeKey INT NOT NULL,

                                      BaseRate MONEY NOT NULL,

                                      VacationHours INT NOT NULL,

                                      SickLeaveHours INT NOT NULL,

                                      SalaryFlag VARCHAR(1) NOT NULL,

                                      ClusterResult INT NOT NULL

                                ));

END

 

The next step is to create a new report in Visual Studio and add a new Data Source.

Then create a dataset.

And link that dataset to a new report.

Then build the report how you want, using that dataset. This is the quick output I’ve opted for as you can quickly analyse employees based on the cluster they are in.

As you can see, and hopefully reproduce, it’s a very quick and relatively easy process that allows you to make business decisions by utilising the combined powerful capabilities of R and SQL.