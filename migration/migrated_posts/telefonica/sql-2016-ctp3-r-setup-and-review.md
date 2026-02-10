---
title: "SQL 2016 CTP3 R Setup and Review"
date: 2015-11-10
tags: []
description: "The release of SQL Server 2016 CTP3 is pretty big as it's the first CTP which incorporates in-database support for R"
source: "https://telefonicatech.uk/blog/sql-2016-ctp3-r-setup-and-review/"
source_site: "Telefonica Tech UK (formerly Adatis)"
original_author: "Ust Oldfield"
status: draft
migrated: true
migration_date: "2026-02-10"
# images_to_download: 1 (see bottom of file)
---

> **Migrated from [Telefonica Tech UK (formerly Adatis)](https://telefonicatech.uk/blog/sql-2016-ctp3-r-setup-and-review/)**
> Original publication date: 2015-11-10

The release of SQL Server 2016 CTP3 is pretty big as it’s the first CTP which incorporates in-database support for R. This means that you can call R scripts and functions within a SQL query without any workarounds as previously [demonstrated](https://telefonicatech.uk/blog/connecting-sql-server-to-r/).

To get yourself up and running on CTP3 you’ll need to follow these steps:

### 1)      Download, install and configure CTP3 <https://www.microsoft.com/en-us/evalcenter/evaluate-sql-server-2016>

a.       Make sure that Advanced Analytics Extension is installed

b.       verify that the service for Advanced Analytics Extensions starts automatically using the MSSQLLaunchpad account.

c.        On the Database Engine Configuration page, for Authentication mode, select Mixed Mode (SQL Server authentication and Windows authentication).

                                                               i.      For CTP3, a SQL login is required when using the RevoScaleR functions from a remote workstation to run R scripts in the context of the server.

### 2)      Download, install and configure Revolution R Open <https://www.microsoft.com/en-us/download/details.aspx?id=49525>

### 3)      Download, install and configure Revolution R Enterprise <https://www.microsoft.com/en-us/download/details.aspx?id=49505>

### 4)      Enable external scripts

exec sp\_configure ‘external scripts enabled’,1;

RECONFIGURE;

### 5)      Run the post-installation script(s)

a.       Open an instance of command prompt with administrator privileges and run the following script

b.       C:Program FilesRRORRO-3.2.2-for-RRE-7.5.0R-3.2.2libraryRevoScaleRrxLibsx64RegisterRExt.exe /install

                                                               i.      More info can be found here: <https://msdn.microsoft.com/en-us/library/mt590536.aspx>

Now you should be up and running and ready to fire up a new instance of SQL Server Management Studio to begin working with R. For the rest of the demo I will be using the latest version of Adventure Works for SQL 2016 CTP3, which can be found here: <https://www.microsoft.com/en-us/download/confirmation.aspx?id=49502> Please restore the backed up databases to continue.

To start off we’re just going to do something really simple, which is return the mean of the UnitPrice from Sales.SalesOrderDetail in a result set, just to demonstrate functionality and ease in which you can write and execute R scripts within SQL.

The script I’m going to use is:

USE AdventureWorks2016CTP3;

EXECUTE sp\_execute\_external\_script

@language = N’R’

,@script = N’OutputDataSet <-data.frame(mean(InputDataSet[,1]))’

,@input\_data\_1 = N’SELECT UnitPrice FROM [Sales].[SalesOrderDetail]’

WITH RESULT SETS ((col int not null));

What it does is call a stored procedure with three input parameters: @language; @script; and @input\_data\_1

The only valid input for @language is ‘R’.

@script is the external language script specified as a literal or variable input. Datatype of @script is NVARCHAR(MAX).

@input\_data\_1 specifies the input data for the external script in the form of a T-SQL query. Datatype of @input\_data\_1 is NVARCHAR(MAX).

              With the specification of \_1 it would appear that in future one might be able to pass in more than one lot of data.

The syntax for sp\_execute\_external\_script can be much more complex than demonstrated and more information can be found here: <https://msdn.microsoft.com/en-us/library/mt604368.aspx>

So, we’ve run our script. SQL has initiated the R script, which is taking a mean of the first column and converting it to a data frame. A data frame is similar to a table and, at the moment, the output data has to be in a data frame structure in order for it to be passed back into SQL. The end result is that the mean of the UnitPrice has been returned.

Query and result should look something like this:

R is a really powerful tool as it is and by incorporating in-database support for R within SQL Server 2016 allows for a convenient, usable and even more powerful toolkit to process and analyse data. The possibilities of application to your data are vast but can range from simple data exploration, as demonstrated above, to predictive modelling.

Be on the lookout for more demonstrations of R functionality within SQL Server 2016.


<!-- IMAGE MANIFEST (DOWNLOADED)
Images downloaded to local paths:
  - images\sql-2016-ctp3-r-setup-and-review\ustoldfield_clip_image001_thumb_07C7BA48.png
    alt: clip_image001
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_clip_image001_thumb_07C7BA48.png

To use in markdown:
  ![clip_image001](images\sql-2016-ctp3-r-setup-and-review\ustoldfield_clip_image001_thumb_07C7BA48.png)
-->