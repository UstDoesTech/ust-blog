---
title: "Deploying a Hybrid Cloud Updated"
date: 2016-02-18
tags: []
description: "Operations Management Suite (OMS) is an Azure based tool that helps manage your entire IT infrastructure, whether on premise or in the cloud"
source: "https://telefonicatech.uk/blog/deploying-a-hybrid-cloud/"
source_site: "Telefonica Tech UK (formerly Adatis)"
original_author: "Ust Oldfield"
status: draft
migrated: true
migration_date: "2026-02-10"
# images_to_download: 11 (see bottom of file)
---

> **Migrated from [Telefonica Tech UK (formerly Adatis)](https://telefonicatech.uk/blog/deploying-a-hybrid-cloud/)**
> Original publication date: 2016-02-18

Operations Management Suite (OMS) is an Azure based tool that helps manage your entire IT infrastructure, whether on premise or in the cloud. OMS allows you to monitor the machines you have in your infrastructure and provides a bridge for a hybrid cloud solution, by moving multi-tier workloads into Azure, or run tests on a copy of production workloads in Azure, as well as storing critical data in Azure.

Configuring and deploying OMS is very quick and relatively straightforward. This post will deal with creating a hybrid cloud solution using OMS and configuring the solution so you can make best use of resources.

Within the Azure management portal you will have to create a new Operational Insights workspace as detailed below:

Once the Operational Insights has been created, you can navigate to it in the Azure Portal and click “Manage” which will bring up the OMS itself. The start page should look like this:

And you want to click on the “Get Started” button to begin creating your hybrid cloud solution. You then want to add various solutions to the suite. For this demonstration we’re going to accept the default and have all the solutions.

The next step is to connect a data source, which can be an on premise machine, a virtual machine or an Azure data storage. For this demonstration we are only interested in connecting to an on premise machine and a VM.

For a VM you’ll have to go back to the Azure portal, assuming you have a VM on Azure, and go back to the operational insights workspace and click on the Azure virtual machines link under the Enable for servers heading.

On the next page all you need to do is select the VM and enable operational insight.

That’s it for adding a VM to your OMS solution. Setting it up for an on premise machine, or a VM on a different platform, is a bit more involved.

On the Connected Sources tab of the settings in your OMS solution you’ll need to download the relevant Agent and install it on the machine(s) you want included in the solution.

Installation is very straight forward, but the one thing to note is the input of credentials so that the on premise machine can talk to the OMS.

The Workspace ID corresponds nicely with the WORKSPACE ID in OMS and the Workspace Key in the agent is the PRIMARY KEY in OMS.

Finish the installation and you have the basis of a hybrid cloud solution. As demonstrated below we have 2 servers in OMS.

The final step in the basic set up is to add Logs, so that you can take advantage of the monitoring capabilities of OMS. Below is an example of the log information it collects.

For Backup purposes you simply attach a Backup vault, which can be quickly created in the Azure Portal under Recovery Services.

Site Recovery is achieved in the same way, but creating a Site Recovery Vault instead of a Backup Vault.

Automation requires the creation of a Runbook, which can also be achieved through the Azure portal.

At the end of it all, your OMS should overview page should look something like this:


<!-- IMAGE MANIFEST (DOWNLOADED)
Images downloaded to local paths:
  - images\deploying-a-hybrid-cloud-updated\Deploying-a-Hybrid-Cloud-800x365.jpeg
    original: https://telefonicatech.uk/wp-content/uploads/adatis/Deploying-a-Hybrid-Cloud-800x365.jpeg
  - images\deploying-a-hybrid-cloud-updated\Deploying-a-Hybrid-Cloud-image_01-310x400.jpeg
    original: https://telefonicatech.uk/wp-content/uploads/adatis/Deploying-a-Hybrid-Cloud-image_01-310x400.jpeg
  - images\deploying-a-hybrid-cloud-updated\Deploying-a-Hybrid-Cloud-image_02-695x400.jpeg
    original: https://telefonicatech.uk/wp-content/uploads/adatis/Deploying-a-Hybrid-Cloud-image_02-695x400.jpeg
  - images\deploying-a-hybrid-cloud-updated\Deploying-a-Hybrid-Cloud-image_03-707x400.jpeg
    original: https://telefonicatech.uk/wp-content/uploads/adatis/Deploying-a-Hybrid-Cloud-image_03-707x400.jpeg
  - images\deploying-a-hybrid-cloud-updated\Deploying-a-Hybrid-Cloud-image_04-785x400.jpeg
    original: https://telefonicatech.uk/wp-content/uploads/adatis/Deploying-a-Hybrid-Cloud-image_04-785x400.jpeg
  - images\deploying-a-hybrid-cloud-updated\Deploying-a-Hybrid-Cloud-image_05-692x400.jpeg
    original: https://telefonicatech.uk/wp-content/uploads/adatis/Deploying-a-Hybrid-Cloud-image_05-692x400.jpeg
  - images\deploying-a-hybrid-cloud-updated\Deploying-a-Hybrid-Cloud-image_06-800x383.jpeg
    original: https://telefonicatech.uk/wp-content/uploads/adatis/Deploying-a-Hybrid-Cloud-image_06-800x383.jpeg
  - images\deploying-a-hybrid-cloud-updated\Deploying-a-Hybrid-Cloud-image_07-521x400.jpeg
    original: https://telefonicatech.uk/wp-content/uploads/adatis/Deploying-a-Hybrid-Cloud-image_07-521x400.jpeg
  - images\deploying-a-hybrid-cloud-updated\Deploying-a-Hybrid-Cloud-image_08-800x400.jpeg
    original: https://telefonicatech.uk/wp-content/uploads/adatis/Deploying-a-Hybrid-Cloud-image_08-800x400.jpeg
  - images\deploying-a-hybrid-cloud-updated\Deploying-a-Hybrid-Cloud-image_09-800x353.jpeg
    original: https://telefonicatech.uk/wp-content/uploads/adatis/Deploying-a-Hybrid-Cloud-image_09-800x353.jpeg
  - images\deploying-a-hybrid-cloud-updated\Deploying-a-Hybrid-Cloud-image_10-744x400.jpeg
    original: https://telefonicatech.uk/wp-content/uploads/adatis/Deploying-a-Hybrid-Cloud-image_10-744x400.jpeg

To use in markdown:
  ![image](images\deploying-a-hybrid-cloud-updated\Deploying-a-Hybrid-Cloud-800x365.jpeg)
  ![image](images\deploying-a-hybrid-cloud-updated\Deploying-a-Hybrid-Cloud-image_01-310x400.jpeg)
  ![image](images\deploying-a-hybrid-cloud-updated\Deploying-a-Hybrid-Cloud-image_02-695x400.jpeg)
  ![image](images\deploying-a-hybrid-cloud-updated\Deploying-a-Hybrid-Cloud-image_03-707x400.jpeg)
  ![image](images\deploying-a-hybrid-cloud-updated\Deploying-a-Hybrid-Cloud-image_04-785x400.jpeg)
  ![image](images\deploying-a-hybrid-cloud-updated\Deploying-a-Hybrid-Cloud-image_05-692x400.jpeg)
  ![image](images\deploying-a-hybrid-cloud-updated\Deploying-a-Hybrid-Cloud-image_06-800x383.jpeg)
  ![image](images\deploying-a-hybrid-cloud-updated\Deploying-a-Hybrid-Cloud-image_07-521x400.jpeg)
  ![image](images\deploying-a-hybrid-cloud-updated\Deploying-a-Hybrid-Cloud-image_08-800x400.jpeg)
  ![image](images\deploying-a-hybrid-cloud-updated\Deploying-a-Hybrid-Cloud-image_09-800x353.jpeg)
  ![image](images\deploying-a-hybrid-cloud-updated\Deploying-a-Hybrid-Cloud-image_10-744x400.jpeg)
-->