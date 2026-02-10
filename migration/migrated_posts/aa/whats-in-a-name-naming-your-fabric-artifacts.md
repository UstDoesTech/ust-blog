---
title: "What's in a name? Naming your Fabric artifacts"
date: 2026-02-10
tags: ["fabric"]
description: "Should you care about what you call your artifacts when you create them in a Fabric Workspace? At Advancing Analytics, we say yes! Here we describe a naming convention we’ve adopted to make sure Fabri"
source: "https://www.advancinganalytics.co.uk/blog/2023/8/16/whats-in-a-name-naming-your-fabric-artifacts"
source_site: "Advancing Analytics"
original_author: "Ust Oldfield"
status: draft
migrated: true
migration_date: "2026-02-10"
---

> **Migrated from [Advancing Analytics](https://www.advancinganalytics.co.uk/blog/2023/8/16/whats-in-a-name-naming-your-fabric-artifacts)**
> Original publication date: unknown

## Who Cares?

Does it really matter what you call your artifacts when you create them in a Fabric Workspace?

The Power BI Developer side of me didn’t really tend to give this much thought – Datasets would tend to be named after the business process they covered (e.g. Sales, Logistics etc…) and associated reports would describe the report’s intent (e.g. Weekly Sales Report, Delivery Adherence etc…).

## Engineering Practices

But if I put my Data Engineer hat on, I’ve always been a fan of a robust naming convention.

In Azure infrastructure land there have been many words dedicated to this topic, with [Microsoft even providing a formal guide.](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming)

And taking that a step further, most data teams I’ve worked in have also been keen to adopt similar patterns for Data Factory and Synapse Analytics components too. Our own [Terry McCann](https://www.linkedin.com/in/tpmccann/) wrote his [own suggestions](https://adatis.co.uk/azure-data-factory-suggested-naming-conventions-and-best-practices/) way back in 2017, and Data Platform MVP [Erwin De Kreuk](https://www.linkedin.com/in/erwindekreuk/) also has a [good guide](https://erwindekreuk.com/2020/07/azure-data-factory-naming-conventions/).

## Clash of the Titans

With Fabric being a unified platform, the worlds of Power BI Developer and Data Engineer collide. So is a solid naming convention a good idea?

At Advancing Analytics, we say yes.

In fact, given the breadth of the platform and the variety of artifacts available for use in Fabric, it becomes even more important to have a strategy to be able to organise these items and make them quick and easy to identify.

## Organising Artifacts

I’d previously toyed with the idea of separating out different types of artifact by having them in separate workspaces, but as it stands in the Fabric Public Preview, many of the artifacts need to be in the same workspace in order for them to interact with each other, which makes this a non-starter (and perhaps is a blessing in disguise as otherwise there’s a real danger of workspace sprawl with a hard to manage overhead).

Artifact types in a workspace do come tagged with a type and have a unique icon for each artifact type too, but the monochrome icon implementation, plus the need to scan the information across three columns in the display, doesn’t make this all that intuitive.