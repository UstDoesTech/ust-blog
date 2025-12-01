---
title: "Self-Serve Analytical Platform Fictional Case Study: Retail"
pubDate: 2021-08-30T12:04:25+06:00
description: "Using a fictionalised case study to understand how a self-serve analytical platform could work in practice"
tags: ["data-mesh"]
categories: ["data-mesh"]
slug: "data-mesh/self-serve-platform-case-study-retail"
---

In our previous examples, we have explored how XclusiV can organise itself into domains; and we have explored how each domain can create data products and how other domains can consume those products. In this post we will explore how a shared self-service data platform can facilitate the creation and support of data products, as well as enable data consumers to get the data they need and have access to.

## What is a Self-Serve Data Platform?

A Self-Serve Data Platform is effectively a collection of Platform-as-a-Service (DPaaS) components with Infrastructure as Code principles, with some additional abstraction to lower the barriers of entry needed to build data products.

Like with any architecture, there's a large amount of infrastructure that's needed to be available so that a data product can be built, deployed, executed, monitored and accessed. Infrastructure management is a specialised skill-set that could be too prohibitive to have in every domain, particularly if there are hundreds of domains in an organisation. Therefore, the platform becomes a shared asset to enable domain autonomy.

There are some capabilities that the data platform should provide to domains, such as:

- Scalable, Distributed Storage
- Scalable, Distributed Query Engine
- Data Pipeline Implementation and Orchestration
- Identity and Control Management
- Data Product Code Deployment
- Data Product Discovery, Catalogue Registration, Lineage, etc.
- Data Product Monitoring / Alerting / Logs

In essence, we are aiming for a Data-Platform-as-a-Service (DPaaS), some halfway-house between PaaS and SaaS. All this can be delivered with existing services, but the question remains: what happens if the existing services do not enable domain autonomy and we need a service that doesn't yet exist to do so?

Let us focus on two areas:

1. Self-Serve Data Platform with Existing Services
2. Ideal Self-Serve Data Platform

## DPaaS with Existing Services

### Scalable, Distributed Storage

This is an easy one to tick-off. This is a data lake, whether it's a single service with folders demarking the boundaries between domains for physical storage of data; or a federated collection of physical services. What will dictate the approach to use a single service or multiple services will be internal data security policies and administration policies.

For XclusiV, the Information Security Team would prefer data to all be on one physical storage service so that it is easier to monitor and track access. They are currently cloud agnostic, so are deciding between Azure Data Lake Gen 2, AWS S3 and Google Cloud Storage - as the main cloud providers. As they already have Azure Active Directory, the choice of authentication protocol might sway them towards Azure.

[Insert Image About Federated v Centralised Storage]

### Scalable, Distributed Query Engine
 
The query engine is meant to do two things:

1. Process Data in a scalable, distributed manner
2. Serve and Query Data in a scalable, distributed manner

#### Spark Engine

While similar, it is possible to use different tools for each process. The first process, the physical processing and transformation of data, lends itself towards Spark. Yes, there are other data processing engines out there but, at the moment, Spark is the most performant engine that exists in the current technological landscape. It also allows for a closer integration between software and data engineering practices that other technologies do not.

[Insert Image About Data In / Data Out processes in Spark]

A common pattern in using Spark is to create generic reusable, repeatable applications that accept an input dataframe; performs some predefined transformations, and outputs a transformed dataframe that can be used downstream. This significantly reduces the amount of code that engineers have to maintain, thereby making a more reliable platform as there are fewer moving parts. This pattern would potentially allow many teams to ingest, transform and serve data quickly using configuration-as-code - metadata describing what data to be ingested; the transformations that need to be applied to the data; and how that data then looks like to be served up to the end consumer.

The IT Team in XclusiV do not want to have to manage Spark itself, so have been looking at [Databricks](https://databricks.com/) as a Spark provider. Handily, Databricks exists on all three cloud providers. 

There is, however, a concern in some areas of the business that configuration-as-code, even writing SQL, might be beyond some teams - so the team have also been looking at some drag and drop, canvas based tools that would still supply the Spark engine but a more user-friendly interface. Unfortunately, there's not many products on the market that offer both drag and drop, and Spark. On Azure, the best alternative to Databricks is [Synapse Analytics](https://azure.microsoft.com/en-gb/services/synapse-analytics/); on AWS, the best alternative is possibly [Glue](https://aws.amazon.com/glue/); and on GCP this service doesn't really exist.

#### Kafka Engine

An alternative to Spark is Kafka, utilising an efficient and effective publish & subscribe architecture to form a reliable messaging and analytics backbone to a data platform, and sharing data easily between domains.

Because Kafka is an abstraction of a distributed commit log, it integrates nicely with a microservices architecture and allows for the scalability of a durable system. Kafka also provides a variety of SQL, called KSQL, which would reduce the barriers to entry for querying data and creating data products. 

[IMAGE ABOUT KAFKA INTEGRATION]

Would it be used for everything throughout a self-service data platform? That's for the IT and Business teams to agree upon, but even if it's not used for everything, it provides a nice compliment to the Spark Engine.

If the IT Team don't want to manage a full blown Kafka instance, then a managed offering would probably be [Confluent](https://www.confluent.io/) as it exists on all three major cloud providers.

### Data Pipeline Implementation and Orchestration

How does data get from A to B? How does the system know which data to process and when? Data Mesh isn't an architecture that facilitates the removal of ETL / ELT pipelines, it decentralises the pipelines to domains and decouples the pipelines from each other.

Generally, the various data processing engines, like Spark or Kafka, will be responsible for moving and transforming data but when we add configuration-as-code into the mix, it can make orchestration more complex because the processing engines need to be told: 

- What needs to be processed
- Where the source data exists
- Where the target data needs to go
- Any other configuration / transformation steps need to be applied

Therefore, we need an orchestration tool. The most obvious open source offering is [Apache Airflow](https://airflow.apache.org/). Airflow, however, can only be deployed using containers - so the team would have to learn how to use Docker, Kubernetes or similar. 

The interface itself is Python based, so the team would also have to provide an abstraction for it, so that it can be used by Business Teams as part of their processing without knowing that they're using it. Or the team need to look at some proprietary alternatives. 

On Azure, this is [Azure Data Factory](https://docs.microsoft.com/en-gb/azure/data-factory/); AWS has [Data Pipeline](https://aws.amazon.com/datapipeline/) and GCP has [Cloud Data Fusion](https://cloud.google.com/data-fusion All of these provide a nice drag and drop interface, which can remove a lot of technical barriers to orchestrating pipelines. There's also built in connectors, which can make using configuration-as-case a lot simpler, as you can have a single location which stores the configuration (often a database) and have the orchestrator do what the configuration does it.

[Image About Configuration-As-Code being used by Orchestrator]

### Identity and Control Management
Identity and Control Management is a hot topic these days, and not just confined to InfoSec circles. Almost everyone in any business is concerned with the right people having the right access, along with the right policies and processes to support that.

From a technological perspective, for XclusiV, this is [Azure Active Directory](https://docs.microsoft.com/en-gb/azure/active-directory/fundamentals/active-directory-whatis) which is their Enterprise wide identity management tool. When it comes to designing and implementing the new platform, they'll have to have access and identity at the forefront to: a) make the platform secure, and b) make it easy for users to access data they should have access to.

### Data Product Code Deployment
