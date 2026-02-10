---
title: "One-way Domain Trust and Power BI"
date: 2017-12-07
tags: []
description: "Discover how to enhance your data analysis with One-way Domain Trust and Power BI in this insightful guide by Telefónica Tech."
source: "https://telefonicatech.uk/blog/one-way-domain-trust-and-power-bi/"
source_site: "Telefonica Tech UK (formerly Adatis)"
original_author: "Ust Oldfield"
status: draft
migrated: true
migration_date: "2026-02-10"
# images_to_download: 3 (see bottom of file)
---

> **Migrated from [Telefonica Tech UK (formerly Adatis)](https://telefonicatech.uk/blog/one-way-domain-trust-and-power-bi/)**
> Original publication date: 2017-12-07

I ran into a problem setting up on-premises data gateways on a client recently, whereby they had two domains but with a one-way trust. The result was that when authenticating within the Power BI Service to retrieve data from on-premises data sources in the untrusted domain it would throw an error.

At this point it is worth spending some time explaining the architecture.

# The Architecture

The architecture might be familiar to many who use Power BI and the on-premises data gateway, with a little caveat. Domain 1 is the main domain. Domain 2 is the secondary domain and trusts Domain 1. Domain 1, on the other hand, doesn’t trust Domain 2.

A user in Domain 1 can access data sources in both Domain 1 and Domain 2. They can create their Power BI reports with a live connection or direct query and publish them to the Power BI Service. In order to use the reports in the service, on-premises data gateways need to be established to provide a messaging service between on-premises and the cloud. In this example, each domain has a domain controller, a tabular server and an on-premises data gateway for each tabular server.

# The Problem

When a user logged-on to the Power BI Service tries to access data from Domain 2, their credentials are passed down to the on-premises data gateway, checked against the domain controller in Domain 2 and returns an error to the Power BI Service.

What I think happens is that the user (User.One@Domain1.com) will have their credentials passed down through the on-premises data gateway to the domain controller in Domain 2. Either the domain controller will not be able to find the user, it is the untrusted domain, and will not be able to pass the short name (DOMAIN1USERONE) to the tabular server, or it tries to check with the domain controller in Domain 1 and encounters the dreaded Kerberos and cannot perform a double hop to return the short name. Either way, the result is the same in that the short name cannot be passed to the tabular server.

# The Solution

As you can imagine, there are a few solutions to the problem.

- If it is a Kerberos related issue, then Kerberos will have to be configured separately
- Make Domain 2 a trusted domain
- User mapping in Power BI Service

This latter approach is the one I opted for because it was guaranteed to work and would not change the current domain and network configuration.

In the gateways settings in the Power BI Service, I went to the Users tab under my data source and clicked on Map user names. In there I mapped users in Domain 1 to users in Domain 2.

If you have a large number of users, individual mapping might not be preferable or feasible, which is why you can replace the Domain names in part of the user string, as in example 3. This, however, does rely upon users in Domain 1 having an equivalent account in Domain 2. This is not always the case, for which the wildcard to service account would work, as shown in example 4.


<!-- IMAGE MANIFEST (DOWNLOADED)
Images downloaded to local paths:
  - images\one-way-domain-trust-and-power-bi\ustoldfield_image_thumb_22.png
    alt: image
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_image_thumb_22.png
  - images\one-way-domain-trust-and-power-bi\ustoldfield_image_thumb_23.png
    alt: image
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_image_thumb_23.png
  - images\one-way-domain-trust-and-power-bi\ustoldfield_image_thumb_24.png
    alt: image
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_image_thumb_24.png

To use in markdown:
  ![image](images\one-way-domain-trust-and-power-bi\ustoldfield_image_thumb_22.png)
  ![image](images\one-way-domain-trust-and-power-bi\ustoldfield_image_thumb_23.png)
  ![image](images\one-way-domain-trust-and-power-bi\ustoldfield_image_thumb_24.png)
-->