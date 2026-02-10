---
title: "Forecasting – Principles and Methods"
date: 2015-11-16
tags: []
description: "What comes to your mind when you hear the words forecasting, forecasts etc?Invariably, you'll think of weather forecasts. But forecasts are much more than that."
source: "https://telefonicatech.uk/blog/forecasting-principles-and-methods/"
source_site: "Telefonica Tech UK (formerly Adatis)"
original_author: "Ust Oldfield"
status: draft
migrated: true
migration_date: "2026-02-10"
# images_to_download: 9 (see bottom of file)
---

> **Migrated from [Telefonica Tech UK (formerly Adatis)](https://telefonicatech.uk/blog/forecasting-principles-and-methods/)**
> Original publication date: 2015-11-16

What comes to your mind when you hear the words forecasting, forecasts etc?

Invariably, you’ll think of weather forecasts. But forecasts are much more than that.

Forecasting is the process of making predictions of the future based on past and present data and analysis of trends. It’s a process that has existed for millennia, though often with dubious methodologies… Instead of looking in to a crystal ball to predict the future we are going to employ the power of statistics!

**Why use forecasting?**

Nearly every function within a company needs an estimate of what the future will look like as a foundation to create and update plans. For example:

• Marketers need forecasts to estimate the expected demand that will be generated from their activities.

• Salespeople use forecasts to understand what volumes are expected in each period and to evaluate the sales pipeline activity to make sure that it supports those expectations.

• Managers in the supply chain use forecasts to make timely purchasing requests, develop production plans, evaluate capacity needs, and develop logistical plans.

• Finance professionals use forecasts to prepare and understand financial plans. They also use them to report on earnings expectations.

**What can be forecast?**

The predictability of an event or a quantity depends the following conditions:

1. How well we understand the factors that contribute to it;
   - For example, in energy consumption the change in temperature will have an impact on the amount of energy we use to heat our homes.
2. How much data is available;
   - Generally, the more data you have to hand the more accurate your forecasts will be.
3. Whether the forecasts can affect the thing we are trying to forecast.
   - This is the principle of self-fulfilling forecasts. For example, if you publicly forecast a share price buyers will adjust their behaviour in order to achieve the forecasted price.

Often in forecasting, a key step is knowing when something can be forecast accurately, and when forecasts will be no better than tossing a coin. Good forecasts capture the genuine patterns and relationships which exist in the historical data, but do not replicate past events that will not occur again.

**Forecasting methods**

1.       Average approach

a.       The prediction of all future values are the mean of the past values

2.       Na?ve approach

a.       The prediction of all future values is that of the last observed value

b.       Approach is cost effective and provides a benchmark for more sophisticated models

3.       Drift method

a.       A variation on the Na?ve method whereby the increase or decrease (drift) is the average change seen across the historical data

4.       Seasonal Na?ve

a.       Accounts for seasonal change seen in the data and sets each prediction to the last observed value in the same season

5.       Autoregressive integrated moving average (ARIMA)

a.       Used to apply a better understanding of data or to predict future points

6.       Exponential smoothing

a.       Applies smoothing to the data in order to remove noise

b.       Three types

                                                               i.      Simple exponential

1.       Models level

                                                             ii.      Double exponential

1.       Models level and trend

                                                           iii.      Triple exponential

1.       Models trend and seasonal components

7.       Probabilistic

a.       Assign a probability value to each of a variety of different outcomes, and the complete set of probabilities represents a probability forecast.

b.       Most common example is in weather forecasting, but can be used in energy consumption, sports betting and population.

8.       Qualitative approaches

a.       Typically asking people, usually experts, what they think is going to happen.

                                                               i.      Can be interpreted as a crowd sourced forecast

Forecast Planning

Forecasting is a common statistical task which helps to inform decisions about scheduling of staff, production, etc., and provides a guide for strategic planning. Forecasting is often used in conjunction with planning and setting goals.

Forecasting is about the process of making predictions of the future based on past and present data and analysis of trends.

Goals are what you would like to happen. You should plan how you are going to achieve them and forecast to see if they are realistic.

Planning is a response to forecasts and goals. It involves determining an appropriate response to make forecasts match goals.

The application of these three activities sets the length of time you want to forecast.

Short-term forecasts:

              The sort of activity this is needed for is scheduling of staff, production, transportation etc. Demand forecasts are often required

Medium-term forecasts:

              Needed to plan future resource requirements, such as hiring of staff and ordering materials and parts.

Long-term forecasts:

              Used in strategic planning.

Forecasting is a really powerful tool to add to your toolkit in order to better understand the future and to better accommodate what that forecast might bring so that you can grow your business in the best way possible.  I will be publishing a follow-up blog in how to perform forecasting in R in the near future.


<!-- IMAGE MANIFEST (DOWNLOADED)
Images downloaded to local paths:
  - images\forecasting-principles-and-methods\ustoldfield_mean2_thumb_2406C822.jpg
    alt: mean2
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_mean2_thumb_2406C822.jpg
  - images\forecasting-principles-and-methods\ustoldfield_naive2_thumb_5F5A2DE0.jpg
    alt: naive2
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_naive2_thumb_5F5A2DE0.jpg
  - images\forecasting-principles-and-methods\ustoldfield_drift3_thumb_01459065.jpg
    alt: drift3
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_drift3_thumb_01459065.jpg
  - images\forecasting-principles-and-methods\ustoldfield_seasonal2_thumb_5594C668.jpg
    alt: seasonal2
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_seasonal2_thumb_5594C668.jpg
  - images\forecasting-principles-and-methods\ustoldfield_ARIMA2_thumb_310338E4.jpg
    alt: ARIMA2
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_ARIMA2_thumb_310338E4.jpg
  - images\forecasting-principles-and-methods\ustoldfield_simpleexp_thumb_39F2CB23.jpg
    alt: simple exp
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_simpleexp_thumb_39F2CB23.jpg
  - images\forecasting-principles-and-methods\ustoldfield_doubleexp_thumb_2333839A.jpg
    alt: double exp
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_doubleexp_thumb_2333839A.jpg
  - images\forecasting-principles-and-methods\ustoldfield_Tripleexp_thumb_309996A0.jpg
    alt: Triple exp
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_Tripleexp_thumb_309996A0.jpg
  - images\forecasting-principles-and-methods\ustoldfield_weather_thumb_196E1C22.jpg
    alt: weather
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_weather_thumb_196E1C22.jpg

To use in markdown:
  ![mean2](images\forecasting-principles-and-methods\ustoldfield_mean2_thumb_2406C822.jpg)
  ![naive2](images\forecasting-principles-and-methods\ustoldfield_naive2_thumb_5F5A2DE0.jpg)
  ![drift3](images\forecasting-principles-and-methods\ustoldfield_drift3_thumb_01459065.jpg)
  ![seasonal2](images\forecasting-principles-and-methods\ustoldfield_seasonal2_thumb_5594C668.jpg)
  ![ARIMA2](images\forecasting-principles-and-methods\ustoldfield_ARIMA2_thumb_310338E4.jpg)
  ![simple exp](images\forecasting-principles-and-methods\ustoldfield_simpleexp_thumb_39F2CB23.jpg)
  ![double exp](images\forecasting-principles-and-methods\ustoldfield_doubleexp_thumb_2333839A.jpg)
  ![Triple exp](images\forecasting-principles-and-methods\ustoldfield_Tripleexp_thumb_309996A0.jpg)
  ![weather](images\forecasting-principles-and-methods\ustoldfield_weather_thumb_196E1C22.jpg)
-->