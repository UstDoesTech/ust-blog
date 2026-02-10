---
title: "What is Data Mesh?"
date: 2026-02-10
tags: []
description: "To be able to properly describe what Data Mesh is, we need to contextualise in which analytical generation we currently are, mostly so that we can describe what it is not."
source: "https://www.advancinganalytics.co.uk/blog/2021/8/5/what-is-data-mesh"
source_site: "Advancing Analytics"
original_author: "Ust Oldfield"
status: draft
migrated: true
migration_date: "2026-02-10"
---

> **Migrated from [Advancing Analytics](https://www.advancinganalytics.co.uk/blog/2021/8/5/what-is-data-mesh)**
> Original publication date: unknown

To be able to properly describe what Data Mesh is, we need to contextualise in which analytical generation we currently are, mostly so that we can describe what it is not.

## Analytical Generations

The first generation of analytics is the humble Data Warehouse and has existed since the 1990s and, while being mature and well known, is not always implemented correctly and, even the purest of implementation, comes under the strain of creaking and complex ETLs as it has struggled to scale with the increased volume of data and demand from consumers. This has led to systems being maintained by a select few in an organisation who are able to understand the system, in its entirety or even partially. Where once it provided value, the benefits posed to many mature organisations is, perhaps, diminishing.

The second generation of analytics is the Data Lake. While relatively in its infancy, having being incepted in 2010, the Data Lake was meant to try to solve some of the problems that Data Warehousing faced - namely analytics at scale in a big data era. Analytics became much more than the traditional Business Intelligence (BI) problem of historical trends but now came to encompass data science, of which the Data Lake prides itself on enabling. However, like the Data Warehouse, the Data Lake is maintained and supported by a small number of people in an organisation with a very niche, and in-demand, skill-set.

The third, and current, generation of analytics is the Data Lakehouse paradigm. While building on the advantages of both the Data Warehouse and the Data Lake, the Data Lakehouse suffers from the deficiencies of the previous generations: centralised, monolithic and needs a highly specialised skillset to develop and support it.

There’s going to be a lot of people who will hate me for this, but there has been no fundamental progress since the introduction of the Data Warehouse. The patterns are still the same, and the challenges that were seen then are still seen now. This is because, fundamentally, the logical architecture is the same: ingest data into a central location; apply conformed cleansing, enrichment and transformation to source data so that it is, hopefully, trustworthy; and serve those conformed datasets to a wide audience of consumers with a diverse set of needs. And this architecture pattern doesn’t scale very well - the larger the volumes, the more complex the data, etc., - the longer it takes to serve data to consumers.

Even the configuration-based and metadata driven platforms will still struggle to serve consumers in a timely manner because there is still an end-to-end dependency between ingesting data, processing data, and serving it to consumers. That pipeline approach, like any pipe, introduces capacity constraints which limit the ability to scale and meet the demands of consumers and new data sources.

The crux of the problem is having a monolithic architecture which, due to its nature, produces monolithic support structures - a central super-specialised team of engineers - and monolithic architectures are what we want to overcome. Tearing down monolithic structures is the reason why we use cloud platforms; why we use multi-repos in our development; why we’re embracing (reluctantly or otherwise) self-serve analytics. But these only chip away at the edge because we’re not challenging the architectures we’re building.

## Crude Introduction

What is a Data Mesh? Data Mesh is new and was introduced in a few articles by Zhamak Dehghani, starting in May 2019. The first article, [How To Move Beyond a Monolithic Data Lake to a Distributed and Data Mesh](https://martinfowler.com/articles/data-monolith-to-mesh.html), and the second article, [Data Mesh Principles and Logical Architecture](https://martinfowler.com/articles/data-mesh-principles.html), form the foundational thought pieces on data meshes. Very simply, and crudely, a Data Mesh aims to overcome the deficiencies of previous generations of analytical architectures by decentralising the ownership and production of analytical data to the teams who own the data domain. It is a convergence of Distributed Domain Driven Architecture, Self-serve Platform Design, and Product Thinking with Data.

Essentially applying the learnings from operational systems, of applying domain driven design, so that ownership of data is domain oriented. For example, a CRM team will own the Customer domain and all the data within it. Instead of data from all domains flowing into a central data repository, the individual domains curate and serve their datasets in an easily consumable way. A much closer alignment between operational and analytical data.

## Product Thinking

So, we’ve taken away data ownership and data pipeline implementation away from a centralised team of high-specialised people and put it into the hands of the business domains. How are we going to deal with accessibility, usability and harmonisation of the newly distributed datasets? This is where product thinking comes in, and providing data as Application Programming Interfaces (APIs) to the rest of the organisation, so that higher order value and functionality can be built on top of it. Alongside these APIs, there needs to be provided discoverable and understandable documentation; sandboxes; and tracked quality and adoption KPIs. Assets become products. Other teams become customers.

## Sharing Between Domains

What about the need to share across domains? Instead of the pull and ingest method, favoured by traditional data platforms, domains enable a serve and pull method, allowing other domains to pull and access datasets they need access to. And that might duplicate data, but in the era of cheap storage why should that be a concern - as long as the data from the originating domain can be trusted, it shouldn’t be a concern. Particularly as the served data that is consumed shouldn’t need to go through any additional cleansing or transformation.

Each domain is responsible for the cleansing, de-duplication and enrichment of their data so that they can be consumed by other domains, without the replication of cleansing. Clean once and use as many times as you want in an organisation. This means that there now becomes a need for Service Level Agreements (SLAs) for the data a domain provides, including timeliness, error rates and many other Key Performance Indicators (KPIs).

## Central Governance

How do data products become discoverable? A common approach is to have a data catalogue of every data asset product (formerly known as asset) along with the relevant and appropriate metadata such as data owners, lineage, data profiling results, etc. A Data Catalogue makes discovering data easy and it is one of the few centralised capabilities that is not only permitted but encouraged.

Once discovered, the data product needs to have a unique address, following global standards and conventions (as laid out by a central governance team), that can easily be accessed by other data domains.

However, with any system involving data, there still exists the concern with master data management. How is an Customer identified? What is a Customer? What attributes define a Customer? And this can only really be solved by a central governance function because, while the Customer domain might own the customer data, customer will be consumed and used by other domains - so there is a need for common agreement across some crucial data domains and datasets, often with a large number of dependents.

Central governance coupled with central security, like Identity Access Management (IAM) and Role Based Access Control (RBAC), allows data to be secured and for data products to be accessed securely. Policies for accessing data products need to be defined centrally and implemented locally, in the domain.

## Self-Serve Platform

Shifting the responsibility of data ownership and producing data products from a central team to distributed domain oriented teams could appear to be a huge burden, especially if they are to be responsible for the platform that hosts their data products. Fortunately, a Data Mesh can use a centrally provisioned infrastructure platform - whereby the pipeline engines, data storage and any other commonly used infrastructure can be used by all teams to develop their data products without having to worry about infrastructure as well. This responsibility for the shared platform belongs to a data infrastructure team all so that the domain teams have the necessary technology to “capture, process, store and serve their data products”.

It does mean that the underlying infrastructure needs to be domain agnostic, much like traditional data platforms, but also to provide an abstraction layer that hides all the underlying complexity of the infrastructure so that it can be used in a self-serve manner. And a lot of this can be achieved through some of the existing practices, such as configurable and metadata driven ingestions, auto-registration of data products in the data catalogue, and other automation capabilities favoured by engineers.

## Paradigm Shift

The data mesh is intentionally designed as a distributed architecture, enabled by a self-serve data infrastructure platform and a central governance function applying standards for interoperability. It is an ecosystem of data products that mesh together.

In an ideal world, there will be no more centralised engineering teams. Long live the citizen data engineer. No more highly specialised skillsets. Long live the generalist. No more centralised data platforms. Long live distributed data products. No more ingestion. Long live serving. No more ETL. Long live data discovery. Long live central governance.

## Closing Thoughts

The data mesh is an interesting paradigm and, because it is so new, poses more questions than there are answers currently available, such as:

- How does data mesh work in organisations which still have Line of Business aligned operational systems, as opposed to domain oriented operational systems?
- How much assumption does this paradigm place on in-house built operational systems versus off-the-shelf operational systems?
- How much organisational change is required to reorient an organisation to be domain driven?
- What level of data governance maturity is required before embarking on the data mesh?

I like the potential it offers, such as decentralising data ownership and enabling more people to be involved in the curation of data. I LOVE the emphasis on data governance and how it plays a central role to enabling data mesh.

The shift in thinking means data engineering, and everything analytics, needs to start aligning much more closely with software engineering so that architectures like data mesh can be realised, as well as making more traditional architectures much more performant. While I can’t see widespread adoption of the data mesh any time soon, I would like to see some of the principles behind the data mesh adopted so that it becomes easier to adapt and change to new ways of thinking and new ways of working.