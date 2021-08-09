---
title: "Databricks Labs: Data Generator"
date: 2021-08-09T19:29:25+06:00
description: Introduction to the Databricks Data Generator
#hero: databricks.svg
menu:
  sidebar:
    name: Databricks Labs Data Generator
    identifier: data-generator-intro
    parent: databricks
    weight: 1
---

Databricks recently released the [public preview](https://github.com/databrickslabs/dbldatagen/releases/tag/v0.2.0-rc0-master) of a Data Generator for use within Databricks to generate synthetic data. 

This is particularly exciting as the Information Security manager at a client recently requested synthetic data to be generated for use in all non-production environments as a feature of a platform I've been designing for them. The Product Owner decided at the time that it was too costly to implement any time soon, but this release from Databricks makes the requirement for synthetic data much easier and quicker to realise and deliver. 

## Databricks Labs

[Databricks Labs](https://databricks.com/learn/labs) is a relatively new offering from Databricks which showcases what their teams have been creating in the field to help their customers. As a Consultant, this makes my life a lot easier as I don't have to re-invent the wheel and I can use it to demonstrate value in partnering with Databricks. There's plenty of use cases that I'll be using, and extending, with my client but the one I want to focus on in this post is the Data Generator. 

## Data Generator  

The Data Generator aims to do just that: generate synthetic data for use in non-production environments while trying to represent realistic data. It uses the Spark engine to generate the data so is able to generate a huge amount of data in a short amount of time. It is a Python framework, so you have to be comfortable with Python and PySpark to generate data. But once data has been generated, you can then use any of the other languages supported by Databricks to consume it.

In order to generate data, you define a spec (which can imply a schema or use an existing schema) and seed each column using a series of approaches:

- Based on ID fields of base data frame
- Based on other columns in the spec
- Based on the value on one or more base fields
- Based on a hash of the base values
- Generated at random

You can also iteratively generate data for a column by applying transformations on the base value of the column, such as:

- Mapping the base value to one of a set of discrete values, including weighting
- Applying arithmetic transformation
- Applying string formatting

The generator is currently installed to a cluster as a [wheel](https://github.com/databrickslabs/dbldatagen/releases) and enabled in your notebook using:

``` python
import dbldatagen as dg
```
From here we can create the specification for our synthetic data.

``` python
spec = (dg.DataGenerator(
        spark # initialize a spark session
        ,name="[name of dataset]"
        ,rows=[number of rows to be generated]
        ,partitions=[number of partitions to be generated]
        ,randomSeedMethod=None | "[fixed | hash_fieldname]"
        ,startingId=[starting value for seed]
        ,randomSeed=[seed for random number generator]
        ,verbose=True # generates verbose output
        ,debug=True # output debug level info 
        )
    .withColumn([column spec]) # inferring a schema
    .withSchema([Schema Definition]) # supplying a schema
)

```

We can then build upon the spec, by applying transformations in an iterative way, reflecting the quality of the data (e.g. missing data) that you might expect in a production system, as well as the patterns of the data too. 

``` python
spec = (spec
            .withColumn("email", percentNulls=0.1, template=r'\w.\w@\w.com|\w@\w.co.u\k') # insert a random word from the ipsum lorem word set 
            .withColumn("ip_addr",template=r'\n.\n.\n.\n') # insert a random number between 0 and 255
            .withColumn("serial_number", minValue=1000000, maxValue=10000000, prefix="dr", random=True) # insert a random number using a range of values
            .withColumn("phone",template=r'+447dddddddddd') # insert a random digit between 0 and 9
        )

```
Finally, we use the `build` command to generate the data into a dataframe which can then be written and used by other processes or users.

``` python
testData = spec.build()

testData.write.format("delta").mode("overwrite").save("output path")
```

But the most incredible thing isn't the ease in which synthetic data is generated. The most incredible thing is being able to [generate synthetic data that relates to other synthetic data](https://databrickslabs.github.io/dbldatagen/public_docs/multi_table_data.html) - consistent primary and foreign keys that you will most likely encounter in a production operational system. 

## Conclusion

My previous experiences of generating synthetic data is a costly exercise, which largely isn't worth the hassle. However, the Databricks Data Generator is easy to work with and makes generating synthetic data, through the multiple table approach, worthwhile. 

However, you still need access to production data in order to profile it and capture the quality of the data so that you're making synthetic data reflective of the challenges that you'll face once it comes to deploying your analytical solution to production and it starts ingesting and transforming production data in the wild. 

I cannot wait to start using this in every single project! Not only will it alleviate many concerns InfoSec might have with non-production environments, it will help improve knowledge of the data - due to the need to profile and model the data for generating a synthetic version of it. 