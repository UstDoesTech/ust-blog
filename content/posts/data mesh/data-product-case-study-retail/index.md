---
title: "Data Product Fictional Case Study: Retail"
date: 2021-08-30T12:04:25+06:00
description: Using a fictionalised case study to understand how data products could work in practice
draft: true
menu:
  sidebar:
    name: Data Product Fictional Case Study in Retail
    identifier: data-product-case-study-retail
    parent: data-mesh
    weight: 4
---

In a previous post, we explored what the [data domains](../data-domain-case-study-retail/) could look like for our fictional retailer - XclusiV. In this post, we will explore how the data products could work in this fictional case study, including how pure data consumers would handle the data - particularly those consumers who have a holistic view of an organisation (also a group of consumers for whom a traditional analytical model is perfect). 

We won't go through every domain identified in the previous post, instead we'll focus on the Customer Domain and the data consumers of Group Finance and Senior Management.

As a reminder, below is our hypothetical flow of data between the domains established in the previous post:

{{< img src="images/data-flow-domains-xclusiv.png" alt="Image with the data flow between the different domains listed" width="600" align="center">}}

## Customer Data Product

In our Customer Domain, we have the Customer information in the source applications and the Customer information in the CRM application, as highlighted in the below image.

{{< img src="images/data-flow-domain-ownership-crm-xclusiv.png" alt="Customer Relationship Domain Ownership" width="500" align="center">}}

But the reality of data flows for the customer domain are likely to be more complex than that, just because there are customers coming from different source applications and there's a business need to ensure that the data is mastered and we have a golden source of data for customers.

{{< img src="images/customer-mdm-inflow.png" alt="Image with the data flow between POS and MDM Tool" width="300" align="center">}}

At this point, our data product could be the Master Data Management (MDM) tool for Customer as it can be used by other solutions - not just those owned by the Customer Relationship Team. Like any good MDM tool and process, we want that data to flow back to originating source systems so that they have accurate and up-to-date data.

{{< img src="images/customer-mdm-reflow.png" alt="Image with the data flow between POS and MDM Tool and back to POS" width="300" align="center">}}

Other teams and systems can also subscribe to the data in the MDM tool but there's potential that the customer data and associated metrics can become distorted by teams and processes that don't have the same intimate knowledge of the data as the Customer Relationship Team. Ownership of customer information resides with the team, so they should provide some analytical capabilities - even for their own purposes.

{{< img src="images/customer-mdm-outflow.png" alt="Image with the data flow to an analytical endpoint" width="700" align="center">}}

In this scenario, we're consuming data from other domains such as Products, Employees and Location as we are cutting these domains with data created in the Customer domain.
