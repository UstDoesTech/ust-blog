---
title: "Integration Testing Overview"
date: 2019-01-07
tags: []
description: "Discover the essentials of Integration Testing with Telefónica Tech. Learn best practices and methodologies in our comprehensive overview."
source: "https://telefonicatech.uk/blog/integration-testing-overview/"
source_site: "Telefonica Tech UK (formerly Adatis)"
original_author: "Ust Oldfield"
status: draft
migrated: true
migration_date: "2026-02-10"
# images_to_download: 4 (see bottom of file)
---

> **Migrated from [Telefonica Tech UK (formerly Adatis)](https://telefonicatech.uk/blog/integration-testing-overview/)**
> Original publication date: 2019-01-07

In a [previous post](https://telefonicatech.uk/blog/testing-whats-the-point/), I touched on the point of testing and briefly talked about integration testing. In this post, I will be going into more detail about what integration testing is and why it’s important to do it.

In the previous post, I said that Integration Tests are:

> intended to verify that the units of code and the services used in a product work together. As a result, they are more expensive to automate and maintain than unit tests; and can take considerably longer to run. Whilst unit tests can be run without dependencies of other parts of the product being available, integration tests often require multiple parts of the product – including infrastructure – to be up and running so that the integrations between units and services can be tested. Because integration tests might require infrastructure to be available, and certainly multiple parts of the product available, integration tests are best run as part of a Release Pipeline in Azure DevOps.

To expand on this, integration tests are written for each integration point for a solution. But what do we mean by “integration point”? An integration point is typically where two or more units of code interact with each other, or two or more services interact with each other – verifying that the individual parts or components of a solution works as intended together with other parts. How do we define an integration point?

## Integration Points

We define an [application integration](https://telefonicatech.uk/solutions/data-ai/data-migration-application-integration/) point by whiteboarding each component of our solution with the aim to document how they interact with each other. We can highlight the integration point by drawing a circle around it.

Consider the following architecture:

It’s a fairly typical modern data warehouse solution. We’re ingesting data from a variety of sources and storing it in a data lake. We’re then transforming and processing that data into our warehouse schema before presenting it in a data warehouse; processing it in an analysis services model so that it can be reported on. That’s the architecture, but the components used might be very different and interact differently with the architecture.

For the ingestion, our integration points are going to be between the following components:

For the transformation piece, our integration points are going to look like:

Finally, for processing our data into the semantic model, the integration points look like:

As you can see, the integration points do not align perfectly with the architecture – bear in mind that every solution is different, so your integration points will definitely look different even if the broad architecture is the same.

## Integration Testing

We’ve documented our integration points and now we need to write some integration tests. Integration tests are executed for the various integration points that exist in a solution. Like most forms of testing, integration tests follow a pattern of:

- Initialise system under test
- Call functionality under test
- Assert expected outcome against result of method

Generally, integration tests will be executed after deployment as they often require the infrastructure to exist. Most of the time, integration tests should not be dependent on data. However, if data does need to exist, this must be created at the time of setting up the tests. Most of the time, you can automate integration tests using a unit test framework such as [Pester](https://github.com/pester/Pester/wiki/Pester) or [NUnit](https://nunit.org/).

## Some Best Practices

To get you going, I’m going to set out some best practices that you should aim to follow:

- Only create integration tests you need
- Don’t depend on data being available. If you have tests that depend on data – create that data before execution, as part of the test setup
- Multiple asserts per test. You might have dependencies on external resources that you’d like to keep open or you want a fast running set of tests. Multiple asserts help with all of these.
- Choose unit tests over integration tests when feasible. Don’t duplicate effort.

## Further reading

My colleague Ben has written an excellent blog on [SQL Integration Testing using NUnit](https://telefonicatech.uk/blog/sql-server-database-integration-testing-using-nunit/).

I’ll add another post soon about how to do Integration Testing using Pester.


<!-- IMAGE MANIFEST (DOWNLOADED)
Images downloaded to local paths:
  - images\integration-testing-overview\ustoldfield_image_thumb_55.png
    alt: image
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_image_thumb_55.png
  - images\integration-testing-overview\ustoldfield_sourceToRawIntegration_thumb.png
    alt: sourceToRawIntegration
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_sourceToRawIntegration_thumb.png
  - images\integration-testing-overview\ustoldfield_rawToCuratedIntegration_thumb.png
    alt: rawToCuratedIntegration
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_rawToCuratedIntegration_thumb.png
  - images\integration-testing-overview\ustoldfield_curatedToSemanticIntegration_thumb.png
    alt: curatedToSemanticIntegration
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_curatedToSemanticIntegration_thumb.png

To use in markdown:
  ![image](images\integration-testing-overview\ustoldfield_image_thumb_55.png)
  ![sourceToRawIntegration](images\integration-testing-overview\ustoldfield_sourceToRawIntegration_thumb.png)
  ![rawToCuratedIntegration](images\integration-testing-overview\ustoldfield_rawToCuratedIntegration_thumb.png)
  ![curatedToSemanticIntegration](images\integration-testing-overview\ustoldfield_curatedToSemanticIntegration_thumb.png)
-->