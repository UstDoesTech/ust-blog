---
title:  "Currency Conversion in SQL using Triangulation Arbitrage"
date:   2015-05-12T08:55:38+00:00
description: Exploring how to convert currencies using the Triangulation Arbitrage method using SQL
menu:
  sidebar:
    name: Triangulation Arbitrage in SQL
    identifier: triangulation-arbitrage
    parent: sql
    weight: 1
---


Some systems use a single currency as a base, which is something that I noticed recently when working with IBM Cognos Controller, e.g. USD to convert local currencies into. But what if you want / need to rebase into another currency but still retain the original base?

This doesn't appear to be easy to achieve within Cognos Controller itself, but it is achievable within SQL and a wider ETL framework.

The basis for rebasing exchange rates uses the technique of triangulation arbitrage. The technique is most often used within the banking system and more information can be found here: http://en.wikipedia.org/wiki/Triangular_arbitrage 

In principle you deal with two known exchange rates and one unknown.

For example, if you have an exchange rate base of USD and know that the GBP/USD exchange rate is 1.54631 and the EUR/USD exchange rate is 1.11470 and wish to rebase from USD to EUR. You would begin by finding the inverse rates of GBP/USD (1/1.54631 = 0.6467), multiply by the EUR/USD rate (0.6467*1.11470 = 0.72087649) which produces the EUR/GBP and then find the inverse (1/0.72087649 = 1.3872) to produce the GBP/EUR rate. In order to find the USD/EUR exchange rate one simply finds the reverse of the EUR/USD rate (1/1.11470 = 0.8971).

That might sound simple, but most exchange rates are held in a table across a range of dates. This complicates the calculation somewhat. I've used CTEs because I find that it makes the script neater and easier to debug. Below is an example of the triangulation using the Sales.CurrencyRate table in the **AdventureWorks2012** database.

{{< gist uoldfield d8d6dbfeecee9df83c27c10d014c0c3d >}}

As always, if you have any feedback and can suggest a simpler way of performing the triangulation I would love to hear it.  

This post was originally published at [Adatis](https://adatis.co.uk/currency-conversion-triangulation-arbitrage/) on the 12th of May 2015.
