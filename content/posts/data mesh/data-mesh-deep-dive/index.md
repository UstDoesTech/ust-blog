---
title: "Data Mesh Deep Dive"
date: 2021-08-04T19:29:25+06:00
description: Digging deeper into the underlying principles of Data Mesh
menu:
  sidebar:
    name: Data Mesh Deep Dive
    identifier: data-mesh-deep-dive
    parent: data-mesh
    weight: 10
---

In a [previous post](../what-is-data-mesh/), we laid down the foundational principles of a Data Mesh, and touched on some of the problems we have with the current analytical architectures. In this post, I will go deeper into the underlying principles of Data Mesh, particularly why we need an architecture paradigm like Data Mesh.  

Let's start with why we need a paradigm like Data Mesh. 

## Why do we need Data Mesh?

In my previous post, I made the bold claim that analytical architectures hadn't fundamentally progressed since the inception of the Data Warehouse in the 1990s. That's three decades of the same thinking: ingest data into a central data repository, clean and transform data, serve data for consumption. 

![Image describing the process flow of data from ingestion, to transformation, and serving](/images/ingest-clean-serve.png)

This approach doesn't scale very well, even though the underpining technology has made vast improvements to alleviate, or even mask, the impact of poor scalability. Even approaches that use metadata and configuration to automatically perform the bulk of the data process still end up falling foul of the same issue: scalability. 

However, I'm not referring to platform scalability, as most cloud platforms scale incredibly well both in terms of storage and compute scaling. The scalability issues I'm referring to are several points: a constantly changing data landscape (just think of all the different tools there are to work with data); a huge increase in data sources and volumes; a huge increase in demand for quality and usable data in organisations; huge increase in data use cases, coupled with diverse requirements for transformating and processing those use cases, and the need for organisations to respond quickly to change. 

In a traditional analytical architecture (whether it's a Data Warehouse, Data Lake, Data Hub or Lakehouse) the closer processes get to serving data from a central data repository, more dataset dependencies are introduced and the throughput becomes less. 

![Image describing the reduced throughput as data goes through the data flow process](/images/ingest-clean-serve-throughput.png)

This means that, while it is relatively easy to ingest data, it becomes harder to transform and serve data to the consumers who demand it, in a manner and time in which they desire. The business gets frustrated with IT, or the central data function, friction ensues and we end up with classic governance issues of shadow IT and dark data. All because the architecture we build no longer meets the needs of today, let alone the future. 

The Data Mesh aims to overcome these challenges by embracing the following principles to perform at scale, while delivering quality, usable data to consumers:

1. Decentralised data ownership and architecture
2. Data Products enabled by Domain Driven Design
3. Self-serve data platform infrastructure
4. Federated Governance

The big differentiators here are the decentralised operational model, supported by data as a product and the self-serve platform. For many data professionals, this is a huge change in the way of working because our architectural paradigm is shifting away from a centralised model to one which is decentralised and democratised. As a 

## Decentralised Data Ownership and Architecture


## Data Products 

A Data Product is a fundamental part of the data mesh and the smallest component of it. It contains the ***code*** used to ingest, transform and serve that data; the ***data*** that is to be consumed and its metadata, describing its schema, quality metrics, access control policies, etc; the ***infrastructure*** upon which the code is deployed, and the data to be stored, processed and accessed. 

![The Data Product as composed by Code, Data and Infrastructure](/images/data-product.png)

A data product is bounded by the context of a domain and a domain can have many data products, just like it might have many operational systems. Very simply put, the following diagram is of a data product in the context of a domain.

![Data Product in the Context of a Domain - linking to Operational System](/images/data-product-domain-context.png)

But that's not all there is to a data product. It is much more than a composition of code, data and infrastructure. It has the following core principles associated with it:
- Discoverable
- Self-describing
- Addressable
- Secure
- Trustworthy
- Interoperable

The reason why a data product has those core principles is because it makes it easier to use. What's the point of building something if it's not going to be used? Also, a data product can be used by other domains - so we need to treat any other domain just like any other customer. In fact, there's no fundamental difference between a domain customer and any other data customer. 

*What does this mean in practice?* PLACEHOLDER

## Self-Serve Data Platform

A Self-Serve Data Platform is effectively Platform-as-a-Service with Infrastructure as Code principles, with some additional abstraction to lower the barriers of entry needed to build data products. 

Like with any architecture, there's a large amount of infrastructure that's needed to be deployed so that a data product can be built, deployed, executed, monitored and accessed. Infrastructure management is specialised skill-set that could be too prohibitive to have in every domain, particularly if there are hundreds of domains in an organisation. Therefore, the platform becomes a shared asset to enable domain autonomy. 

There are some capabilities that the data platform should provide to domains:
- Scalable polyglot big data storage
- Encryption of data in transit and at rest
- Data Product Versioning
- Data Product Schema
- Data Product De-identification
- Unified data access control and logging
- Data pipeline implementation and orchestration
- Data product discovery, catalogue registration and publishing
- Data governance and standardisation
- Data product lineage
- Data product monitorin / alerting / logs
- Data product quality metrics
- In-memory data caching
- Federated identity management
- Compute and data locality

A typical workload on a shared self-service data platform infrastructure could look like the following digram: incoming data (batch or streaming) gets ingested and processed and stored into the data structure that defines the data product, whether that is columnar or object. At the other end of the workload, an incoming request for data hits a web service, which then orchestrates a series of processes against the data product storage area, to then return that data to the customer.

![Logical workload process of a data product on self-service infrastructure as described above](/images/data-product-self-serve-infra.png)

This is highly abstracted to allow any technology to play the role of an ingestion service, processing engine, storage provider, web service, etc. While the platform needs to domain agnostic, it should also aim to be vendor agnostic and embrace Open Standards, Open Protocols and Open-Source Integrations. 

## Federated Governance