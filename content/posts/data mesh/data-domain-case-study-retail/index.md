---
title: "Data Domain Fictional Case Study: Retail"
date: 2021-08-05T12:04:25+06:00
description: Using a fictionalised case study to understand how data domains could work in practice
menu:
  sidebar:
    name: Data Domain Fictional Case Study in Retail
    identifier: data-domain-case-study-retail
    parent: data-mesh
    weight: 3
---

In previous posts we've understood what is [Data Mesh](../what-is-data-mesh/) and gone into [greater detail](../data-mesh-deep-dive/) with regards to the principles. In this next series of posts I want to use a fictional case study to explore how the underlying principles could work in practice. This post will introduce the fictitious company; the challenges it faces; and how the principle of decentralised data ownership and architecture, with domain alignment, would work.

## Fictitious Company: XclusiV

XclusiV is a luxury retailer operating in multiple countries. It has two divisions, which operate almost as separate businesses, which we will call Division X and Division V. The Point-of-Sale (POS) and Enterprise Resource Planning (ERP) systems within each market that it operates is the same for each division, but the POS and ERP systems can vary between markets. 

Each division has their own stores but, occasionally, there are flagship XclusiV stores that house products and staff from both divisions. 

The retail operations are supported by separate manufacturing and buying processes, separate marketing teams; as well as centralised distribution, IT, Finance, and HR capabilities. 

## XclusiV Analytical Challenges

The analytical challenges that XclusiV faces can be summarised as follows:

- Centralised Data Warehouse that treats both divisions and all markets the same
- A central Data Engineering team that has limited capacity to support the development of new features requested by business teams
- Shadow IT has sprung up to try to overcome the capacity limitations of the Data Engineering Team but has created more confusion
- The business teams do not feel like they own the data
- Very few business teams want to own the data

We've got two themes for our challenges: poor analytical performance (which will impact business performance) and lack of data ownership.

Quality of data is quite good, so there isn't the usual data governance concerns, other than ownership. 

## How could Data Mesh help? 

Due to the lack of ownership of data, a data mesh might not be able to resolve the challenges at XclusiV. However, embarking on a journey which, ultimately, empowers users will go a long way to establishing data ownership within domains. 

The organisational structure doesn't make this a simple use case for data mesh. In other examples, there's a clear separation between domains: user domain; playlist domain; artist domain etc., but in this example, the separation between domains isn't so clean. I think one of the reasons why there's a clear domain separation in other examples is due to a microservices architecture. XclusiV haven't got around to implementing a microservices architecture and are still using line-of-business applications.  

{{< img src="images/xclusiv-architecture.png" alt="Image with POS and ERP flowing into a Data Warehouse with Cube" width="600" align="center">}}

We could separate domains into Sale, Product, Customer, Location, Stock etc., and that would work quite nicely if there was system alignment across markets (and that is a technological hurdle which shouldn't be insurmountable). 

{{< img src="images/data-flow-domains-xclusiv.png" alt="Image with the data flow between the different domains listed" width="900" align="center">}}