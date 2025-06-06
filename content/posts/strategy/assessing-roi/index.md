---
title:  "Forecasting and Assessing Data ROI"
date:   2025-06-06T01:00:38+00:00
description: Understanding the value of data in business decisions and how to measure it
menu:
  sidebar:
    name: Forecasting and Assessing Data ROI
    identifier: assessing-roi
    parent: strategy
    weight: 7
---

This post is inspired by a LinkedIn post by [Pierre-Yves Calloc'h](https://www.linkedin.com/feed/update/urn:li:activity:7335885538001907712?updateEntityUrn=urn%3Ali%3Afs_updateV2%3A%28urn%3Ali%3Aactivity%3A7335885538001907712%2CFEED_DETAIL%2CEMPTY%2CDEFAULT%2Cfalse%29), which goes into detail about how to calculate ROI for AI initiatives. The post got me thinking about how we can assess the ROI of data in general, and how we can forecast the value of data before we invest in it.

## Understanding Data ROI

Data ROI (Return on Investment) is a measure of the value that data brings to an organisation relative to the costs associated with acquiring, storing, and processing that data. It is a critical metric for businesses that rely on data-driven decision-making, as it helps them understand whether their investments in data are yielding positive returns. But it's also a metric that is often neglected or poorly understood.

Borrowing from the M. Calloc'h's post, we can define Data ROI as follows:

```
Data ROI = (Performance * Adoption) / Cost
```

Where:

- **Performance** is AI that delivers accurate results.
- **Adoption** is Solutions people actually use.
- **Cost** is the total cost of the solution.

The reason why I like this as a definition is that it highlights the importance of both performance and adoption in determining the value of data. It's not enough to have accurate data; it also needs to be used effectively by the people who need it.

It is also a lot simpler than the [traditional definition of ROI](https://www.investopedia.com/terms/r/returnoninvestment.asp), which is:

```
ROI = (Gain from Investment - Cost of Investment) / Cost of Investment
```

The likes of [Monte Carlo](https://www.montecarlodata.com/blog-data-roi-pyramid) have tried to align the traditional definition of ROI with data, by defining it as:

```
Data ROI = (Data Product Return - Data Downtime) / Data Investment
```

Both definitions can be difficult to apply to data, as it can be hard to quantify the "gain" from data investments - and they are quite abstract. The simplified definition focuses on performance and adoption, which are more tangible and measurable.

## Why Data ROI Matters

{{< figure src="images/data-roi.png" alt="CDO rolling in ROI" width="500" align="center">}}

Data ROI matters because it helps organisations make informed decisions about their data investments. By understanding the value that data brings to the organisation, businesses can prioritise their data initiatives, allocate resources effectively, and measure the success of their data strategies.

It also helps in justifying data investments to stakeholders, as it provides a clear framework for evaluating the potential returns on data initiatives. This is particularly important in an era where data is often seen as a cost centre rather than a value driver.

Data ROI is not just a metric for data teams; it is a strategic tool that can influence the direction of the entire organisation. By focusing on performance and adoption, organisations can ensure that their data initiatives are aligned with business goals and deliver tangible value.

## Forecasting Data ROI

If we take the simplified definition of Data ROI, we can forecast the value of data before we invest in it by estimating the potential performance and adoption of the data solution, and the costs associated with it. We can then use those forecasts to benchmark against the achieved ROI after the solution has been implemented.

To forecast Data ROI, we can follow these steps:

1. **Estimate Performance**: Here, we're applying performance more broadly than the original definition - by focusing on the value potential. What measurable outcomes should the product improve? How large is the impact? These could include specific metrics or KPIs that the solution is expected to impact, such as revenue gain (e.g. better targeting by > £500k a year), cost avoidance (e.g. reducing fraud by <£300K a year), efficiency gains (e.g. saving 2 FTEs or ~£150k a year).

2. **Estimate Adoption**: Assess the likelihood of adoption within the organisation, considering factors such as user training, change management, and integration with existing workflows.
Adoption can be expressed as a percentage of the total potential user base that is expected to use the solution effectively. For example, if 80% of the target users are expected to adopt the solution, this would be expressed as 0.8.

3. **Estimate Costs**: Calculate the expected total cost of ownership including development, implementation, and ongoing maintenance costs.

4. **Calculate Forecasted Data ROI**: Use the estimates from the previous steps to calculate the forecasted Data ROI using the simplified formula:

```
Forecasted Data ROI = (Estimated Performance * Estimated Adoption) / Estimated Costs
```

An example of this could be:

```
Estimated Performance = £500,000 (revenue gain)
Estimated Adoption = 0.8 (80% of target users)
Estimated Costs = £200,000 (total cost of the solution)
Forecasted Data ROI = (£500,000 * 0.8) / £200,000 = 2.0
```
This means that for every £1 invested in the data solution, the organisation expects to gain £2 in value.

Another example could be:

```
Estimated Performance = £300,000 (cost avoidance)
Estimated Adoption = 0.6 (60% of target users)
Estimated Costs = £150,000 (total cost of the solution)
Forecasted Data ROI = (£300,000 * 0.6) / £150,000 = 1.2
```

This means that for every £1 invested in the data solution, the organisation expects to gain £1.20 in value.

And an example of weak ROI could be:

```
Estimated Performance = £100,000 (efficiency gain)
Estimated Adoption = 0.5 (50% of target users)
Estimated Costs = £250,000 (total cost of the solution)
Forecasted Data ROI = (£100,000 * 0.5) / £250,000 = 0.2
```

This means that for every £1 invested in the data solution, the organisation expects to gain only £0.20 in value, which may not justify the investment.

## Measuring and Assessing Data ROI

Once the data solution has been implemented, it's essential to measure and assess the actual Data ROI to determine whether the forecasts were accurate and whether the investment was worthwhile. This involves:

1. **Collecting Data**: Gather data on the actual performance of the solution, user adoption rates, and the total costs incurred.
2. **Calculating Actual Data ROI**: Use the same formula to calculate the actual Data ROI:

```
Actual Data ROI = (Actual Performance * Actual Adoption) / Actual Costs
```

3. **Comparing Forecasted and Actual Data ROI**: Compare the forecasted Data ROI with the actual Data ROI to assess the accuracy of the forecasts and the effectiveness of the solution.
4. **Identifying Lessons Learned**: Analyse any discrepancies between the forecasted and actual Data ROI to identify areas for improvement in future data initiatives. This could include refining forecasting methods, improving user training, or addressing any unforeseen challenges that arose during implementation.

An example of this could be:

```
Actual Performance = £450,000 (revenue gain)
Actual Adoption = 0.75 (75% of target users)
Actual Costs = £220,000 (total cost of the solution)
Actual Data ROI = (£450,000 * 0.75) / £220,000 = 1.53

Estimated Performance = £500,000 (revenue gain)
Estimated Adoption = 0.8 (80% of target users)
Estimated Costs = £200,000 (total cost of the solution)
Forecasted Data ROI = (£500,000 * 0.8) / £200,000 = 2.0
```
Versus the forecasted Data ROI of 2.0, this indicates that while the solution delivered value, it did not meet the initial expectations. The organisation can then analyse why the actual adoption was lower than expected or why the performance did not reach the forecasted levels.

## Conclusion

Forecasting and assessing Data ROI is a crucial aspect of designing and delivering data products. By simplifying the definition of Data ROI and focusing on performance and adoption, we can more effectively forecast the value of data solutions before investing in them. The only investment that is always worth making is the time taken to forecast the value of data solutions, as it helps organisations make informed decisions about where to allocate resources and how to measure success.

This approach not only helps in making informed investment decisions but also provides a simplified framework for measuring the success of data initiatives after implementation. By continuously refining forecasting methods and learning from past experiences, organisations can enhance their data strategies and drive greater value from their investments.
