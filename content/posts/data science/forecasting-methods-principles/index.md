---
title:  "Forecasting: Methods and Principles"
date:   2015-11-16T08:55:38+00:00
#description: Introduction to the Databricks Data Generator
menu:
  sidebar:
    name: Forecasting Methods and Principles
    identifier: forecasting-methods-principles
    parent: data science
    weight: 1
---
What comes to your mind when you hear the words forecasting, forecasts etc?

Invariably, you’ll think of weather forecasts. But forecasts are much more than that.

Forecasting is the process of making predictions of the future based on past and present data and analysis of trends. It’s a process that has existed for millennia, though often with dubious methodologies… Instead of looking in to a crystal ball to predict the future we are going to employ the power of statistics!

## Why use forecasting?
Nearly every function within a company needs an estimate of what the future will look like as a foundation to create and update plans. For example:

- Marketers need forecasts to estimate the expected demand that will be generated from their activities.

- Salespeople use forecasts to understand what volumes are expected in each period and to evaluate the sales pipeline activity to make sure that it supports those expectations.

- Managers in the supply chain use forecasts to make timely purchasing requests, develop production plans, evaluate capacity needs, and develop logistical plans.

- Finance professionals use forecasts to prepare and understand financial plans. They also use them to report on earnings expectations.

## What can be forecast?
The predictability of an event or a quantity depends the following conditions:

1. How well we understand the factors that contribute to it;
    - For example, in energy consumption the change in temperature will have an impact on the amount of energy we use to heat our homes.
2. How much data is available;
    - Generally, the more data you have to hand the more accurate your forecasts will be.
3. Whether the forecasts can affect the thing we are trying to forecast.
    - This is the principle of self-fulfilling forecasts. For example, if you publicly forecast a share price buyers will adjust their behaviour in order to achieve the forecasted price.  

Often in forecasting, a key step is knowing when something can be forecast accurately, and when forecasts will be no better than tossing a coin. Good forecasts capture the genuine patterns and relationships which exist in the historical data, but do not replicate past events that will not occur again.

## Forecasting methods
1. Average Approach
    - The prediction of all future values are the mean of the past values.

{{< img src="images/forecast_average.jpg" alt="Output of Average Forecast method" width="600" align="center">}}

2. Naive Approach
    - The prediction of all future values is that of the last observed value
    - Approach is cost effective and provides a benchmark for more sophisticated models

{{< img src="images/forecast_naive.jpg" alt="Output of Naive Forecast Method" width="600" align="center">}}

3. Drift Method
    - A variation of the Naive method, whereby the increase or decrease (drift) is the average change seen across the historical data

{{< img src="images/forecast_drift.jpg" alt="Output of Drift Forecast Method" width="600" align="center">}}

4. Seasonal Naive
    - Accounts for seasonal changes in the data and sets each prediction to the last observed value in the same season

{{< img src="images/forecast_seasonal_naive.jpg" alt="Output of Seasonal Naive Forecast Method" width="600" align="center">}}

5. Autoregressive Integrated Moving Average (ARIMA)
    - Used to apply a better understanding of the data or to predict future points

{{< img src="images/forecast_ARIMA.jpg" alt="Output of ARIMA Forecast Method" width="600" align="center">}}

6. Exponential Smoothing
    - Applies smoothing to the data in order to remove noise
    - Three types
    1. Simple Exponential
        - Models level
        {{< img src="images/forecast_simple_exponential.jpg" alt="Output of Simple Exponential Forecast Method" width="600" align="center">}}
    2. Double Exponential
        - Models level and trend
         {{< img src="images/forecast_double_exponential.jpg" alt="Output of Double Exponential Forecast Method" width="600" align="center">}}
    3. Triple Exponential
        - Models trend and seasonal components
         {{< img src="images/forecast_triple_exponential.jpg" alt="Output of Triple Exponential Forecast Method" width="600" align="center">}}

7. Probalistic
- Assign a probability value to each of a variety of different outcomes, and the complete set of probabilities represents a probability forecast.
- Most common example is in weather forecasting, but can be used in energy consumption, sports betting and population. 

8. Qualitative Approaches
- Typically asking people, usually experts, what they think is going to happen
- Can be interpreted as a crowd sourced forecast

## Forecast Planning
Forecasting is a common statistical task which helps to inform decisions about scheduling of staff, production, etc., and provides a guide for strategic planning. Forecasting is often used in conjunction with planning and setting goals.

Forecasting is about the process of making predictions of the future based on past and present data and analysis of trends.

Goals are what you would like to happen. You should plan how you are going to achieve them and forecast to see if they are realistic.

Planning is a response to forecasts and goals. It involves determining an appropriate response to make forecasts match goals.

The application of these three activities sets the length of time you want to forecast.

### Short-term forecasts:
The sort of activity this is needed for is scheduling of staff, production, transportation etc. Demand forecasts are often required

### Medium-term forecasts:
Needed to plan future resource requirements, such as hiring of staff and ordering materials and parts.

### Long-term forecasts:
Used in strategic planning.

## Conclusion

Forecasting is a really powerful tool to add to your toolkit in order to better understand the future and to better accommodate what that forecast might bring so that you can grow your business in the best way possible.  

This post was originally published at [Adatis](https://adatis.co.uk/forecasting-principles-and-methods/) on the 16th of November 2015.
