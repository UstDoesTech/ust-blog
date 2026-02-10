---
title: "Regression Testing Overview"
date: 2019-02-11
tags: []
description: "In this blog we go into more detail about what regression testing is, regression testing techniques and why it's important to do it."
source: "https://telefonicatech.uk/blog/regression-testing-overview/"
source_site: "Telefonica Tech UK (formerly Adatis)"
original_author: "Ust Oldfield"
status: draft
migrated: true
migration_date: "2026-02-10"
---

> **Migrated from [Telefonica Tech UK (formerly Adatis)](https://telefonicatech.uk/blog/regression-testing-overview/)**
> Original publication date: 2019-02-11

In a [previous post](https://telefonicatech.uk/blog/testing-whats-the-point/), I touched on the point of testing and briefly touched on regression testing. In this post, I will be going into more detail about what regression testing is and why it’s important to do it.

In the previous post, I said that Regression Tests are intended to:

> verify that newly developed code into a deployed product does not regress expected results. We’ll still need to go through the process of unit testing and integration testing; but do we want to go through the rigmarole of manual testing to check if a change has changed more than what it was meant to? That’s something that we would like to avoid, so we have regression testing to alleviate that need. Like integration tests, they do need multiple parts of the product available so would need to be executed as part of a Release Pipeline in Azure DevOps. Regression testing is expensive to automate and maintain; and slow to run – but that doesn’t mean that they should be avoided. They add a layer of confidence to a newly changed code base which is about to be deployed. However, because we are testing targeted elements, perhaps the entire solution at once, we don’t want to run all regressions tests all the time because they would take a very long time to complete.

## Regression Techniques

There are a variety of methods and techniques that can be used in the design and execution of regression tests. These are:

- Retest All
- Test Selection
- Test Case Prioritisation

Retest All executes all the documented test cases to check the integrity of the solution. This is the most expensive technique as it runs all the test cases, however, it does ensure that there are no errors in the modified code that could be released into Production.

Test Selection executes a defined selection of documented test cases to check the integrity of a section of the solution. Less expensive than the Retest All technique, but does introduce an element of risk as the test coverage does not cover the entire solution.

Test Case Prioritisation executes tests in priority order, executing higher priority tests over lower priority tests.

## Regression Testing

Regression tests are executed for the various functional slices that exist in a solution. Like most forms of testing, regression tests follow a pattern of:

- Initialise system under test
- Call functionality under test
- Assert expected outcome against result of method

Generally, regression tests will be executed after deployment as they often require the infrastructure to exist. Generally, regression tests are dependent on data, which must be created at the time of setting up the tests. Most of the time, you can automate regression tests using a unit test framework such as [Pester](https://github.com/pester/Pester/wiki/Pester) or [NUnit](https://nunit.org/).

## Some best practices

To get you going I’m going to set out some best practices that you should aim to follow:

- Adopt a hybrid technique of mixing and matching regression techniques to use what’s best for you at the time
- Create the data needed for the tests before execution, as part of the test setup
- Multiple asserts per test. You might have dependencies on external resources that you’d like to keep open or you want a fast running set of tests. Multiple asserts help with all of these
- Choose unit tests over regression tests when feasible
- Choose integration tests over when feasible

##