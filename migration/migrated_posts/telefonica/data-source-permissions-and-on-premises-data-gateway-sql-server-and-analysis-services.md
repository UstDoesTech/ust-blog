---
title: "Data Source Permissions and On-Premises Data Gateway: SQL Server and Analysis Services"
date: 2018-01-31
tags: []
description: "Discover how to manage data source permissions and on-premises data gateway for SQL Server and Analysis Services with Telefónica Tech."
source: "https://telefonicatech.uk/blog/data-source-permissions-and-on-premises-data-gateway-sql-server-and-analysis-services/"
source_site: "Telefonica Tech UK (formerly Adatis)"
original_author: "Ust Oldfield"
status: draft
migrated: true
migration_date: "2026-02-10"
---

> **Migrated from [Telefonica Tech UK (formerly Adatis)](https://telefonicatech.uk/blog/data-source-permissions-and-on-premises-data-gateway-sql-server-and-analysis-services/)**
> Original publication date: 2018-01-31

In Microsoft’s documentation surrounding the On-Premises Data Gateway, the advice on permissions for the account used to authenticate the Data Source in the Power BI Service can be concerning for most, especially DBAs.

In the [Analysis Services](https://docs.microsoft.com/en-us/power-bi/service-gateway-enterprise-manage-ssas) section of the documentation, the advice is:

> The Windows account you enter must have Server Administrator permissions for the instance you are connecting to. If this account’s password is set to expire, users could get a connection error if the password isn’t updated for the data source.

Server Administrator permissions…? What happened to the principle of least-privilege?

In a practical sense, the On-Premises Data Gateway has to deal with two very different implementations of Analysis Services: Multidimensional and Tabular. Each are setup and configured differently from the other, and the nature of their security models are also different. As a one size fits all approach, it works. As we will soon see, the permissions do not have to be set as Server Admin

The [SQL](https://docs.microsoft.com/en-us/power-bi/service-gateway-enterprise-manage-sql) section of the documentation, on the other hand, doesn’t actually specify what permissions are required for the Data Source to be established in the Power BI Service.

## Permissions

Exactly what permissions are required for these common data sources, I hear you ask. As data sources are established at a database level, so too are the permissions set.

|  |  |
| --- | --- |
| Data Source | Minimum Permissions Level |
| SQL Server Database | **db\_datareader** |
| SSAS Tabular Database | **Process database** and **Read** |
| SSAS Multidimensional Database | **Full control (Administrator)** |

Principle of least-permissions is now restored.

Though there still are the curious incidents of Analysis Services data sources requiring permissions in addition to read. I am unsure, I have my suspicions, and have tried to find out. If you know, please leave a comment below!