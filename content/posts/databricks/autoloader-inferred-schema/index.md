---
title: "Using and Abusing Auto Loader's Inferred Schema"
date: 2021-10-28T17:29:25+06:00
description: Auto Loader's Inferred Schema - what is it and how can we amend it
#hero: databricks.svg
menu:
  sidebar:
    name: Using and Abusing Auto Loader's Inferred Schema
    identifier: auto-loader-inferred-schema
    parent: databricks
    weight: 3
---

## Problem

Databricks' Auto Loader has the ability to infer a schema from a sample of files. This means that you don't have to provide a schema, which is really handy when you're dealing with an unknown schema or a wide and complex schema, which you don't always want to define up-front.

But what happens if the schema that has been inferred isn't the schema you were expecting or it contains fields which you definitely don't want to ingest - like PCI or PII data fields?

## Solution

Schema inference in Auto Loader works by sampling the data. It will do this by either reading 50GB or 1,000 files it discovers - whichever threshold is crossed first.

By default, a schema will be inferred at every run but that's not efficient, so we need to supply it with a schema location to store the inferred schema. This means that at every run, Databricks is going to retrieve that defined schema and use it.

However, unless you set `cloudFiles.inferColumnTypes` to `true` in the config, it'll try to infer the data types on every run, even though they have been defined in the schema. This can cause errors if it decides that a `long` is an `int` as it will produce a schema mismatch.

There's a lot more to [Schema inference on the Databricks website](https://docs.databricks.com/spark/latest/structured-streaming/auto-loader-schema.html), including all the different options and how it relates to schema evolution.

In terms of taking that inferred schema and amending it to what you were expecting or using it to filter out sensitive data fields, there are two approaches to this:

- Schema Hints
- Amending the Inferred Schema File

### Schema Hints

[Schema hints](https://docs.databricks.com/spark/latest/structured-streaming/auto-loader-schema.html#schema-hints) are really useful if the schema Databricks infers for you has data types which you think or know are incorrect. When you provide a schema hint, this overrides the inferred schema for the fields you've provided hints for.

{{< img src="images/original-schema.png" alt="inferred schema of the dataframe" width="400" align="center">}}

In this example, our inferred schema has detected our Date field as a String; Quantity as an Integer; and Amount as an Integer. But what if Date is a date and Amount is actually a float?

This is where the schema hint comes in handy. We don't need to modify the entire schema, just need to give Databricks the necessary information to make the right choice.

```python
.option("cloudFiles.schemaHints", "Date DATE, Amount FLOAT")
```

Which will produce a schema of:

{{< img src="images/amended-schema.png" alt="amended inferred schema of the dataframe using hints" width="400" align="center">}}

This is great for small amendments to a schema, particularly if it's a large one. If you need to make significant changes then you might want to define the schema upfront or take a look at the other option...

### Amending the Inferred Schema File

On the first run of using schema inference, Databricks will output the schema to a `_schema` location of your choosing. This can then be referenced in the schema location option.

```python
.option("cloudFiles.schemaLocation", "/mnt/lake/schemaLocation")
```

**CAUTION**: The file that is output is not meant to be edited so proceed with care.

The file is often called 0, though could be called any form of integer if the schema has evolved, and contains two lines:

1. The version of the schema, represented by `vN`
2. The schema in a json block

If you have a large and / or complex schema, editing this json block could be a challenge. But if your large / and or complex schema contains sensitive fields, it may be necessary to edit this block.

{{< img src="images/sensitive-fields.png" alt="inferred schema with sensitive fields" width="900" align="center">}}

In this example, we have sensitive fields (highlighted) that we do not want to have in our data platform because:

1. Do not need them in our platform for analysis purposes
2. Will cause a world of pain if they get compromised

Therefore it's safer to remove them from the platform before they get ingested. Removing them is a manual exercise of deleting each contained field definition block.

```json
{\"name\":\"fieldName\",\"type\":\"dataType\",\"nullable\":boolean,\"metadata\":{}}
```

{{< img src="images/sensitive-fields-removed.png" alt="inferred schema with sensitive fields removed" width="900" align="center">}}

Depending on the number of fields, this could significantly reduce the number of fields in your schema. Depending on what's left over, it may be easier and safer to define the schema up front.

We've removed the fields from the schema, but the schema evolution functionality of Auto Loader can easily add those fields back in. Therefore, we need to explicitly tell Auto Loader to not perform schema evolution.

```python
.options("cloudFiles.schemaEvolutionMode": "none")
```

This means that any new columns, including the ones we have intentionally excluded, will not make their way any further into the data flow.

## Conclusion

We've seen two approaches to using (and abusing) the inferred schema functionality of Auto Loader. Schema inference significantly reduces the barriers to ingesting data but there are occasions when schema inference might need a little help. Hopefully, this post will have given you an idea of when and why you want to interfere with an automated process.
