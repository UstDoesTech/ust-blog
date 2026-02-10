---
title: "SQL Server Data Tools Deployment Method"
date: 2018-02-26
tags: []
description: "Discover the SQL Server Data Tools Deployment Method by Telefónica Tech. Learn best practices and streamline your deployment process today!"
source: "https://telefonicatech.uk/blog/sql-server-data-tools-deployment-method/"
source_site: "Telefonica Tech UK (formerly Adatis)"
original_author: "Ust Oldfield"
status: draft
migrated: true
migration_date: "2026-02-10"
# images_to_download: 2 (see bottom of file)
---

> **Migrated from [Telefonica Tech UK (formerly Adatis)](https://telefonicatech.uk/blog/sql-server-data-tools-deployment-method/)**
> Original publication date: 2018-02-26

The Deploy command in SQL Server Data Tools (SSDT) provides a simple and intuitive method to deploy a tabular model project from the SSDT authoring environment. However, this method **should not be used to deploy to production servers**. Using this method can overwrite certain properties in an existing model.

Deploying a tabular model using SSDT is a simple process; however, certain steps must be taken to ensure your model is deployed to the correct Analysis Services instance and with the correct configuration options.

Deployment in SSDT requires the properties page of the Tabular model to be configured properly. The properties and options are as follows:

|  |  |  |
| --- | --- | --- |
| Property | Default Setting | Description |
| Processing Option | Default | This property specifies the type of processing required when changes to objects are deployed. This property has the following options: **Default** – Metadata will be deployed and unprocessed objects will be processed including any necessary recalculation of relationships, hierarchies and calculated columns.  **Do Not Process** – Only the metadata will be deployed. After deploying, it may be necessary to run a process operation on the deployed database to update and recalculate data.  **Full** – This setting specifies that both the metadata is deployed and a process full operation is performed. This assures that the deployed database has the most recent updates to both metadata and data. |
| Transactional Deployment | False | This property specifies whether or not the deployment is transactional. By default, the deployment of all or changed objects is not transactional with the processing of those deployed objects. Deployment can succeed and persist even though processing fails. You can change this to incorporate deployment and processing in a single transaction. |
| Server |  | This property, set when the project is created, specifies the Analysis Services instance by name to which the model will be deployed. By default, the model will be deployed to the default instance of Analysis Services on the local computer. However, you can change this setting to specify a named instance on the local computer or any instance on any remote computer on which you have permission to create Analysis Service objects. |
| Edition |  | This property specifies the edition of the Analysis Services server to which the model will be deployed. The server edition defines various features that can be incorporated into the project. By default, the edition will be of the local Analysis Services server. If you specify a different Analysis Services server, for example a production Analysis Service server, be sure to specify the edition of the Analysis Services server. |
| Database |  | This property specifies the name of the Analysis Services database in which model objects will be instantiated upon deployment. This name will also be specified in a reporting client data connection or an .bism data connection file. You can change this name at any time when you are authoring the model. |
| Model Name | Model | This property specifies the model name as shown in client tools, such as Excel and Power BI, and AMO. |

This is where you can set what type of processing the Tabular model does once it has been deployed. For a development environment, it is best practice to set to **Do Not Process** due to the frequency of deployments. For deployments to more stable environments, such as UAT or Pre-Production, the Processing Option can be changed away from Do Not Process.

The Deployment Server, Version of SQL Server and Database Name can all be configured from this properties page.

Then, by right-clicking on the project, you can deploy your database to your server.


<!-- IMAGE MANIFEST (DOWNLOADED)
Images downloaded to local paths:
  - images\sql-server-data-tools-deployment-method\ustoldfield_image_thumb_46.png
    alt: image
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_image_thumb_46.png
  - images\sql-server-data-tools-deployment-method\ustoldfield_image_thumb_47.png
    alt: image
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_image_thumb_47.png

To use in markdown:
  ![image](images\sql-server-data-tools-deployment-method\ustoldfield_image_thumb_46.png)
  ![image](images\sql-server-data-tools-deployment-method\ustoldfield_image_thumb_47.png)
-->