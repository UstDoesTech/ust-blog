---
title: "Scheduling Databricks Cluster Uptime"
date: 2022-07-28T12:29:25+06:00
description: Scheduling Interactive and SQL Warehouse Clusters in Databricks
#hero: databricks.svg
menu:
  sidebar:
    name: Scheduling Databricks Cluster Uptime
    identifier: cluster-scheduling
    parent: databricks
    weight: 4
---

## Problem

Interactive and SQL Warehouse (formerly known as SQL Endpoint) clusters take time to become active. This can range from around 5 mins through to almost 10 mins. For some workloads and users, this waiting time can be frustrating if not unacceptable.

For this use case, we had streaming clusters that needed to be available for when streams started at 07:00 and to be turned off when streams stopped being sent at 21:00. Similarly, there was also need from business users for their SQL Warehouse clusters to be available for when business started trading so that their BI reports didn't timeout waiting for the clusters to start.

## Solution

A simple solution to both problems, doesn't yet exist. It could be possible to use [SQL Serverless](https://databricks.com/blog/2021/08/30/announcing-databricks-serverless-sql.html) for the Warehouse clusters. However, at the time of writing, Serverless compute is still in private preview. And the equivalent for Engineering workloads still doesn't really exist.

Therefore, we need to have a method for warming up the clusters before they get used. And this is where the API comes in handy.

The [Databricks API](https://docs.databricks.com/dev-tools/api/latest/index.html) is incredibly powerful and allows you to programmatically control your Databricks experience.

The process for the programmatically scheduling the warm-up of Engineering and Warehouse clusters are the same but the API endpoints are different, therefore the code is different (notebooks below).

{{< figure src="images/ClusterScheduleProcess.png" alt="Cluster Scheduling Process: Pass in Params, Generate Bearer Token, Start / Stop Cluster(s)" width="300" align="center">}}

### Engineering Cluster Notebook

{{< gist UstDoesTech 0df763d2a461881f3ec487c15dca3d35>}}

### SQL Warehouse Cluster Notebook

{{< gist UstDoesTech fce60de7c8f26a34ee9efab5f9a67dc1>}}

## Conclusion

With our new notebooks, using the API, we can now set them on a schedule using a job cluster to start or stop at specific times of day.

For Engineering clusters with a streaming workload, this allows the clusters to be available when the streams start, as well as allowing the VMs some downtime for maintenance once streams stop.

For SQL Warehouse clusters, this allows the clusters to be available for users to refresh their reports and query data before they've started work - so no more waiting for clusters to start.

There are so many more uses for the Databricks API and we've just touched on a few here. If you're using the API for a different use case, pop it in the comments below as I'm interested to know how other people use the API.
