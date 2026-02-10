---
title: "Unit Testing Overview"
date: 2018-12-13
tags: []
description: "Discover the essentials of Unit Testing with Telefónica Tech. Learn best practices, tools, and techniques to enhance your software quality."
source: "https://telefonicatech.uk/blog/unit-testing-overview/"
source_site: "Telefonica Tech UK (formerly Adatis)"
original_author: "Ust Oldfield"
status: draft
migrated: true
migration_date: "2026-02-10"
# images_to_download: 5 (see bottom of file)
---

> **Migrated from [Telefonica Tech UK (formerly Adatis)](https://telefonicatech.uk/blog/unit-testing-overview/)**
> Original publication date: 2018-12-13

In a [previous post](https://telefonicatech.uk/blog/testing-whats-the-point/), I touched on the point of testing and briefly talked about unit testing. In this post, I will be going into more detail about what unit testing is and why it’s important to do it.

In the previous post, I said that Unit Tests are:

> low level tests, meaning that they are close to the source of the product. They should be written with the aim of testing individual methods and functions for a given code base, using a unit test framework to support the authoring and execution of a test. As a developer, you would typically author the unit tests in a development tool like Visual Studio; you’d run them locally to ensure that the tests pass; and then they would be executed on a regular basis as a task in a Build Pipeline within Azure DevOps. Unit Tests are cheap to automate and should be quick to run.

To expand on this, unit tests are written by a developer to apply to a unit of code. But what do we mean by “unit of code”? A unit of code is the smallest testable part of a solution – verifying that the individual part or component of a solution works as intended, independently from other parts. A unit could be a C# method; a PowerShell function; a T-SQL Stored Proc, and many others. Like most forms of testing, unit tests follow a pattern of:

- Initialise system under test
- Call method under test
- Assert expected outcome against result of method

A best practice would be to write the unit test before the writing any code, but if you’ve not got to that level of maturity with your test approach – writing tests after code is still good practice.

## How do you write a good unit test?

Keep it simple

- A unit test shouldn’t replicate the code it is intended to test.
- You’ll be writing lots of them, so make them quick and easy to write.

Readable

- By keeping it simple, the test should also be readable. Making it easy to know what method is being tested and the expected behaviour of the method.
- By making it readable, you can easily address any failures that may surface.

Reliable and Repeatable

- Unit tests should only fail if there are bugs in the system, not because there are bugs in the tests. Keeping it simple and readable will avoid that issue.
- Unit tests need to be run many times, sometimes multiple times throughout the course of a day, so they need to be executed quickly in a repeatable manner. Keeping it simple helps achieve this aim.

## How do you write a unit test?

We’ve got an understanding of what a unit test is, but how do we write one? For this example, we’ll be writing our code and tests using C#.

Our application is a very simple calculator, which adds two numbers together.

Simply, to add a new Unit Test, we can right-click on the method and select Create Unit Tests. Because we’ve not built any unit tests before, we can use it to create a new unit test project using a [framework of choice](https://docs.microsoft.com/en-gb/visualstudio/test/install-third-party-unit-test-frameworks?view=vs-2017). If we already had a unit test project, we could add the new test to the existing project.

Using this method, it creates a skeleton of a unit test from which we can amend for our needs.

As you can see, this doesn’t contain what we need, so we amend the test so that it reflects our requirements, as in the below.

To run a Unit Test, you can either right-click on the test method and click on **Run Test(s)** or open up the **Test Explorer** window, navigate to the desired test and click on **Run Selected Tests**.

## Unit Tests in Azure DevOps

We’ve written our unit tests and have run them locally, but how do we make it repeatable? We utilise the power of Azure DevOps to have repeatable tests run against a changing code base as part of the Build or Continuous Integration process.

The process is:

1. Install NuGet on the Build Agent
2. Restore any packages from NuGet that your application requires
3. Build solution
4. Run tests
5. Publish tests
6. Copy successfully built and tested artifacts to a staging directory
7. Publish those artifacts

Using Azure DevOps, or another CI tool, we can rely upon our tests in a repeatable manner.


<!-- IMAGE MANIFEST (DOWNLOADED)
Images downloaded to local paths:
  - images\unit-testing-overview\ustoldfield_Calculator_thumb.jpg
    alt: Calculator
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_Calculator_thumb.jpg
  - images\unit-testing-overview\ustoldfield_createUnitTest_thumb.jpg
    alt: createUnitTest
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_createUnitTest_thumb.jpg
  - images\unit-testing-overview\ustoldfield_unitTestNew_thumb.jpg
    alt: unitTestNew
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_unitTestNew_thumb.jpg
  - images\unit-testing-overview\ustoldfield_unitTestAmended_thumb.jpg
    alt: unitTestAmended
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_unitTestAmended_thumb.jpg
  - images\unit-testing-overview\ustoldfield_image_thumb_54.png
    alt: image
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_image_thumb_54.png

To use in markdown:
  ![Calculator](images\unit-testing-overview\ustoldfield_Calculator_thumb.jpg)
  ![createUnitTest](images\unit-testing-overview\ustoldfield_createUnitTest_thumb.jpg)
  ![unitTestNew](images\unit-testing-overview\ustoldfield_unitTestNew_thumb.jpg)
  ![unitTestAmended](images\unit-testing-overview\ustoldfield_unitTestAmended_thumb.jpg)
  ![image](images\unit-testing-overview\ustoldfield_image_thumb_54.png)
-->