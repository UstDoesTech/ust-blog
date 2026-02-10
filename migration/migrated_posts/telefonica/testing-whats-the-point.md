---
title: "Testing: What's the point?"
date: 2018-12-12
tags: []
description: "Discover the importance of testing in tech with Telefónica Tech. Learn why it's crucial for success and innovation. Read more on Telefónica Tech!"
source: "https://telefonicatech.uk/blog/testing-whats-the-point/"
source_site: "Telefonica Tech UK (formerly Adatis)"
original_author: "Ust Oldfield"
status: draft
migrated: true
migration_date: "2026-02-10"
# images_to_download: 1 (see bottom of file)
---

> **Migrated from [Telefonica Tech UK (formerly Adatis)](https://telefonicatech.uk/blog/testing-whats-the-point/)**
> Original publication date: 2018-12-12

I’m almost certain that every developer has asked themselves this question at least once throughout their careers. You’ve developed your solution, it works fine on your machine and now the deployment into production is being held up because someone mentions the need to do testing. What’s the point of testing? Ultimately, **to provide assurance about the quality of a product**.

With testing, there are two approaches:

- Manual
- Automated

Manual testing is what most developers complain about: it’s expensive to setup; laborious to execute; time consuming to repeat; and prone to human error. Manual testing typically takes the form of User Acceptance Tests – and sometimes can be the only tests that are conducted on a product. How confident are we that the product is of high quality if we only do manual testing? Not very.

Automated testing is what every developer should be doing: they’re executed by a machine; they’re repeatable; they’re more robust and reliable than manual testing. However, like manual testing, the quality of the test is dependent on how well the test scripts have been written and the test scripts can vary hugely in complexity. The tests could vary from very simple build verification tests through to complex regression tests.

# Types of Testing

At its most simplest, testing can be build verification and at its most complex, testing can be user acceptance testing. But to get a true feel of how complex they are and how often you should use them, we should refer to a testing tree.

As we can see, the wider the segment the more frequently we should employ it and, as we work our way up the pyramid, the more complex the type of testing becomes. For the remainder of this blog post, I’m going to briefly expand on the following types of tests:

- Build Verification
- Unit
- Integration
- Regression

# Build Verification Tests

A build verification test is using a tool like MS Build to answer the question: does my code compile? If it does compile, the test has passed. If it doesn’t compile, then the test has failed. This can be used in the local development environment, through Visual Studio or it can be conducted as a task in a Build Pipeline within Azure DevOps. These types of tests are extremely cheap to automate and maintain; and very quick to run.

# Unit Tests

Unit tests are low level tests, meaning that they are close to the source of the product. They should be written with the aim of testing individual methods and functions for a given code base, using a unit test framework to support the authoring and execution of a test. As a developer, you would typically author the unit tests in a development tool like Visual Studio; you’d run them locally to ensure that the tests pass; and then they would be executed on a regular basis as a task in a Build Pipeline within Azure DevOps. Unit Tests are cheap to automate and should be quick to run.

# Integration Tests

We know that individual units of code work, due to unit tests, but how can we be sure that those units work together? Integration tests are intended to verify that the units of code and the services used in a product work together. As a result, they are more expensive to automate and maintain than unit tests; and can take considerably longer to run. Whilst unit tests can be run without dependencies of other parts of the product being available, integration tests often require multiple parts of the product – including infrastructure – to be up and running so that the integrations between units and services can be tested. Because integration tests might require infrastructure to be available, and certainly multiple parts of the product available, integration tests are best run as part of a Release Pipeline in Azure DevOps.

# Regression Tests

We’ve verified that individual elements of the product work; and we’ve verified that the individual elements of the product work together; what happens if we change elements of the product? This is where regression testing comes in – to verify that newly developed code into a deployed product does not regress expected results. We’ll still need to go through the process of unit testing and integration testing; but do we want to go through the rigmarole of manual testing to check if a change has changed more than what it was meant to? That’s something that we would like to avoid, so we have regression testing to alleviate that need. Like integration tests, they do need multiple parts of the product available so would need to be executed as part of a Release Pipeline in Azure DevOps. Regression testing is expensive to automate and maintain; and slow to run – but that doesn’t mean that they should be avoided. The add a layer of confidence to a newly changed code base which is about to be deployed. However, because we are testing targeted elements, perhaps the entire solution at once, we don’t want to run all regressions tests all the time because they would take a very long time to complete.

# Summary

We know why we’re do testing; we are aware of some high-level approaches; and we’ve gone through some types of automated tests in brief detail. This post is first in a series on testing, future posts will include:

- [Unit Testing](https://telefonicatech.uk/blog/unit-testing-overview/)
- [Integration Testing](https://telefonicatech.uk/blog/integration-testing-overview/)
- [Regression Testing](https://telefonicatech.uk/blog/regression-testing-overview/)


<!-- IMAGE MANIFEST (DOWNLOADED)
Images downloaded to local paths:
  - images\testing-whats-the-point\ustoldfield_test_tree_thumb.jpg
    alt: test tree
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_test_tree_thumb.jpg

To use in markdown:
  ![test tree](images\testing-whats-the-point\ustoldfield_test_tree_thumb.jpg)
-->