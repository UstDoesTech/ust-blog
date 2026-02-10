---
title: "Whitelisting Azure IP addresses for Key Vault"
date: 2019-01-08
tags: []
description: "Learn how to whitelist Azure IP addresses for Key Vault with Telefónica Tech. Secure your data and manage access efficiently."
source: "https://telefonicatech.uk/blog/whitelisting-azure-ip-addresses-for-key-vault/"
source_site: "Telefonica Tech UK (formerly Adatis)"
original_author: "Ust Oldfield"
status: draft
migrated: true
migration_date: "2026-02-10"
# images_to_download: 4 (see bottom of file)
---

> **Migrated from [Telefonica Tech UK (formerly Adatis)](https://telefonicatech.uk/blog/whitelisting-azure-ip-addresses-for-key-vault/)**
> Original publication date: 2019-01-08

A colleague came to me with an interesting request:

> We want to put Key Vault behind a firewall, but when we do that it means that Azure Data Factory can no longer access the secrets. Is there a way to whitelist the IP addresses for a given Azure Data Centre?

The short answer is: Yes.

By default, the following option is enabled on Azure Key Vault under the **Firewalls and virtual networks** blade.

For most users, having unrestricted access from external networks to a resource that holds secrets, certificates and other sensitive information is a big red flag.

If we choose to only allow access from **Selected Networks** we get the following options opening up for us:

Note that trusted Microsoft services is not an extensive list and does not include Azure Data Factory.

Therefore we need to whitelist a series of IP Addresses in the firewall rules. The list of IP Addresses are [published by Microsoft](https://www.microsoft.com/en-gb/download/details.aspx?id=41653) and are updated on a weekly basis. The IP addresses are published in an XML document, which isn’t always the best format when one needs to update firewalls in Azure.

## Shredding XML

To update the Firewall in Azure, we’re going to use PowerShell to shred the XML and extract the IP ranges for a given region. Then, we’re going to use the [updated Azure PowerShell module](https://docs.microsoft.com/en-us/powershell/azure/new-azureps-module-az?view=azps-1.0.0) to register the IP ranges against the Key Vault.

Using the last command, we can check that the IP ranges have been registered successfully. You should see something like:

There we have it, explicit IP whitelisting of Azure Data Centres so we can lock down Azure resources, only opening up access when we need to.

## Update

Key Vault is currently limited to 127 firewall rules. If you are adding a region with more than 127 IP ranges, you might have an issue…


<!-- IMAGE MANIFEST (DOWNLOADED)
Images downloaded to local paths:
  - images\whitelisting-azure-ip-addresses-for-key-vault\ustoldfield_image_thumb_56.png
    alt: image
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_image_thumb_56.png
  - images\whitelisting-azure-ip-addresses-for-key-vault\ustoldfield_image_thumb_57.png
    alt: image
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_image_thumb_57.png
  - images\whitelisting-azure-ip-addresses-for-key-vault\ustoldfield_image_thumb_58.png
    alt: image
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_image_thumb_58.png
  - images\whitelisting-azure-ip-addresses-for-key-vault\ustoldfield_image_thumb_59.png
    alt: image
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_image_thumb_59.png

To use in markdown:
  ![image](images\whitelisting-azure-ip-addresses-for-key-vault\ustoldfield_image_thumb_56.png)
  ![image](images\whitelisting-azure-ip-addresses-for-key-vault\ustoldfield_image_thumb_57.png)
  ![image](images\whitelisting-azure-ip-addresses-for-key-vault\ustoldfield_image_thumb_58.png)
  ![image](images\whitelisting-azure-ip-addresses-for-key-vault\ustoldfield_image_thumb_59.png)
-->