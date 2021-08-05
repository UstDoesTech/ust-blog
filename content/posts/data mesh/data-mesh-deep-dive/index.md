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

{{< img src="images/ingest-clean-serve.png" alt="Image describing the process flow of data from ingestion, to transformation, and serving" width="900" align="center">}}

This approach doesn't scale very well, even though the underpining technology has made vast improvements to alleviate, or even mask, the impact of poor scalability. Even approaches that use metadata and configuration to automatically perform the bulk of the data process still end up falling foul of the same issue: scalability. 

However, I'm not referring to platform scalability, as most cloud platforms scale incredibly well both in terms of storage and compute scaling. The scalability issues I'm referring to are several points: a constantly changing data landscape (just think of all the different tools there are to work with data); a huge increase in data sources and volumes; a huge increase in demand for quality and usable data in organisations; huge increase in data use cases, coupled with diverse requirements for transformating and processing those use cases, and the need for organisations to respond quickly to change. 

In a traditional analytical architecture (whether it's a Data Warehouse, Data Lake, Data Hub or Lakehouse) the closer processes get to serving data from a central data repository, more dataset dependencies are introduced and the throughput becomes less. 

{{< img src="images/ingest-clean-serve-throughput.png" alt="Image describing the reduced throughput as data goes through the data flow process" width="700" align="center">}}

This means that, while it is relatively easy to ingest data, it becomes harder to transform and serve data to the consumers who demand it, in a manner and time in which they desire. The business gets frustrated with IT, or the central data function, friction ensues and we end up with classic governance issues of shadow IT and dark data. All because the architecture we build no longer meets the needs of today, let alone the future. 

The Data Mesh aims to overcome these challenges by embracing the following principles to perform at scale, while delivering quality, usable data to consumers:

1. Decentralised data ownership and architecture
2. Data Products enabled by Domain Driven Design
3. Self-serve data platform infrastructure
4. Federated Governance

The big differentiators here are the decentralised operational model, supported by data as a product and the self-serve platform. For many data professionals, this is a huge change in the way of working because our architectural paradigm is shifting away from a centralised model to one which is decentralised and democratised. 

## Decentralised Data Ownership and Architecture

A foundational principle of data mesh is the decentralisation of ownership of data to those closest to it. Those closest to it are those in the business, often using the operational systems and also using analytical data. Responsibility and ownership of the data is devolved from a central function to business units and domains. Therefore any change to how a business domain organises itself is limited to the domain itself rather than impacting the entire organisation. This is referred to as the bounded domain context. 

Teams responsible for the business operation, e.g. CRM team responsible for Customers, are also responsible for the ownership and serving of the analytical data relating to their domain. 

Because our organisations are often separated based on domains, our architecture needs to be arranged to support that. The interfaces of a domain needs to enable operational capabilities, e.g. registering a customer, but also provide an analytical endpoint, e.g. Newly registered Customers over last X months, to consumers. This means that domains must be able to provide these capabilities independently of other domains - essentially decoupling the analytical process at a domain level, much in the same way that microservices have decoupled operational capabilities at the domain level. 

{{< img src="images/domain-context.png" alt="Image visualising the domain context - with O for operational capabilities and A as analytical endpoints" width="700" align="center">}}

In the diagram above, we have the context of the domain - being the team and the systems they own - an operational capabiliity (represented by O), and an analytical endpoint (represented by A).

Whilst we've decoupled the analytical process at the domain level, we haven't removed dependencies as there will exist dependencies between domains of operational and analytical endpoints, particularly of business critical domains. 

There is, however, an assumption that operational systems have been built and maintained in-house for there to be this organisational alignment by domain, as well as a seamless sharing of data in domains. And, for some domains such as Customer and Product, it might also require significant investment in mastering data - so that there is a consistent view of these critical domains across systems. 

## Data Products 

A Data Product is a fundamental part of the data mesh and the smallest component of it. It contains the ***code*** used to ingest, transform and serve that data; the ***data*** that is to be consumed and its metadata, describing its schema, quality metrics, access control policies, etc; the ***infrastructure*** upon which the code is deployed, and the data to be stored, processed and accessed. 

{{< img src="images/data-product.png" alt="The Data Product as composed by Code, Data and Infrastructure" width="700" align="center">}}

A data product is bounded by the context of a domain and a domain can have many data products, just like it might have many operational systems. Very simply put, the following diagram is of a data product in the context of a domain.

{{< img src="images/data-product-domain-context.png" alt="Data Product in the Context of a Domain - linking to Operational System" width="700" align="center">}}

But that's not all there is to a data product. It is much more than a composition of code, data and infrastructure. It has the following core principles associated with it:
- Discoverable
- Self-describing
- Addressable
- Secure
- Trustworthy
- Interoperable

The reason why a data product has those core principles is because it makes it easier to use. What's the point of building something if it's not going to be used? Also, a data product can be used by other domains - so we need to treat any other domain just like any other customer. In fact, there's no fundamental difference between a domain customer and any other data customer. 



## Self-Serve Data Platform

A Self-Serve Data Platform is effectively Platform-as-a-Service with Infrastructure as Code principles, with some additional abstraction to lower the barriers of entry needed to build data products. 

Like with any architecture, there's a large amount of infrastructure that's needed to be deployed so that a data product can be built, deployed, executed, monitored and accessed. Infrastructure management is specialised skill-set that could be too prohibitive to have in every domain, particularly if there are hundreds of domains in an organisation. Therefore, the platform becomes a shared asset to enable domain autonomy. 

There are some capabilities that the data platform should provide to domains:
- Scalable, Distributed Storage
- Scalable, Distributed Query Engine
- Data Pipeline Implementation and Orchestration
- Identity and Control Management
- Data Product Code Deployment
- Data Product Discovery, Catalogue Registration, Lineage, etc.
- Data Product Monitoring / Alerting / Logs

A typical workload on a shared self-service data platform infrastructure could look like the following digram: incoming data (batch or streaming) gets ingested and processed and stored into the data structure that defines the data product, whether that is columnar or object. At the other end of the workload, an incoming request for data hits a web service, which then orchestrates a series of processes against the data product storage area, to then return that data to the customer.

{{< img src="images/data-product-self-serve-infra.png" alt="Logical workload process of a data product on self-service infrastructure as described above" width="900" align="center">}}

This is highly abstracted to allow any technology to play the role of an ingestion service, processing engine, storage provider, web service, etc. While the platform needs to domain agnostic, it should also aim to be vendor agnostic and embrace Open Standards, Open Protocols and Open-Source Integrations. This allows the domain teams to be truly autonomous in choosing the tools to best meet their needs and skills - although, a word of caution here, as the selection of tooling should also be done in consultation with the data platform team, as they will be supporting the underlying infrastructure - including how the tooling interacts with the rest of the infrastructure.  

## Federated Governance

A data mesh is, by nature, a distributed, decentralised architecture - with autonomy built into the architecture - largely applying the principles of software architecture to data architecture. However, because there are dependencies between domains and their data products, there is a needs for these autonomous and independent products to interoperate at scale. This, therefore, requires a robust governance model that embraces self-serve and autonomy. 

This is requires a Federated Governance model, that has contributions from data product owners and data platform product owners - creating and adhering to a common set of rules to be applied to all domains and their interfaces - to ensure interoperability. In a traditional governance model, this is similar to a Governance Council but the difference is that it is expanded to incorporate product owners.

In any federated system there will be challenges to maintain balance between what needs to be agreed globally and what the individual products have autonomy over. Ultimately, global concerns should be centered around interoperability and discovery of data products. Anything that will have an impact across domains will, most likely, become a focus of glocal concern and agreement, while elements that can be bounded by the domain context, such as the data model, would remain in the preserve of the domain. However, there might be standards set out by global that would need to be applied at the domain - to ensure interoperability and discovery. 

## Conclusion

The data mesh is supported by four principles:
1. Decentralised data ownership and architecture - so that the ecosystem can scale as the volume of data, number of use cases, and access models change over time. 
2. Data Products enabled by Domain Driven Design - so that consumers can easily discover, understand and consume high quality data.
3. Self-serve data platform infrastructure - so that domain teams can create data products without the complexity of needing to support or understand the underlying platform.
4. Federated Governance - so that consumers can get value from independent data products.

Ultimately, the data mesh brings analytical and operational data closer together, as well as enabling capabilities and architecture patterns from software engineering in data engineering - with principal focus on interoperability. 