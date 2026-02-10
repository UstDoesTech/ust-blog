---
title: "Whitelisting Azure IP addresses for SQL Server"
date: 2019-01-14
tags: []
description: "Learn how to whitelist Azure IP addresses for SQL Server with Telefónica Tech. Step-by-step guide to secure your database access."
source: "https://telefonicatech.uk/blog/whitelisting-azure-ip-addresses-for-sql-server/"
source_site: "Telefonica Tech UK (formerly Adatis)"
original_author: "Ust Oldfield"
status: draft
migrated: true
migration_date: "2026-02-10"
---

> **Migrated from [Telefonica Tech UK (formerly Adatis)](https://telefonicatech.uk/blog/whitelisting-azure-ip-addresses-for-sql-server/)**
> Original publication date: 2019-01-14

In a recent blog post, I wrote about [whitelisting Azure Data Centre IP addresses for Key Vault](https://telefonicatech.uk/blog/whitelisting-azure-ip-addresses-for-key-vault/). Key Vault’s firewall uses CIDR notation for IP ranges, which is exactly what is contained within the list of IP addresses supplied by Microsoft. However, there are some resources, like Azure SQL Server, which only accept IP ranges. Therefore, we need a way of converting CIDR to an IP range.

Handily, there’s a PowerShell script which exists to provide that conversion – called [ipcalc.ps1](https://gallery.technet.microsoft.com/scriptcenter/ipcalc-PowerShell-Script-01b7bd23). When you download it, make sure it’s in the same working folder as the script you’re going to use to create the new firewall rules.

From there, we can make slight amends to the script we had in the previous post and produce the following script:

If you need to assign the IP ranges to other resources you can substitute the New-AzSqlServerFirewallRule with the appropriate cmdlet and parameters