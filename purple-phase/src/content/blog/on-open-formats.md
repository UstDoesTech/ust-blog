---
title: "On Open Formats"
pubDate: 2025-06-20T06:00:38Z
description: Musings on open formats
tags: ["philosophy"]
categories: ["philosophy"]
slug: "philosophy/on-open-formats"
---

I love open formats! And I don't just mean Delta.

Opening up storage formats is great, but equally important is opening up logic formats.

I work in data and with a lot of analytics tools. Analytics tools are notoriously proprietary. If you want to explore any logic that has been embedded in the tool, you need to fire up the tool and explore any logic through the application UI. Not very user friendly…

There are methods to extract the information contained within from some tools, like converting the binary file to a zip, and extracting the component parts. But that's still a faff.

Back in 2012, Microsoft released SQL Server Analysis Services Tabular - which changed the analytics landscape within the Microsoft ecosystem forever. In 2016, they introduced Tabular Model Scripting Language (TMSL) and Tabular Object Model (TOM) - which opened up the definition of a tabular model, which contains metrics, hierarchies, security rules, and many others for all the world to see in a JSON format.

This made it easier to port between instances, script out and modify on the fly, as well as fully understand how business logic had been applied to an analytics tool. Power BI initially reversed this openness, wrapping logic inside a black box that couldn't easily be inspected or versioned. Third-party tools like Tabular Editor began to pry it open, and last year, Microsoft finally embraced openness fully, not just for the semantic model, but the report layer too. Now, the entire logic stack is accessible, scriptable, and portable again.

This is a great example of how open formats can empower users, allowing them to take control of their analytics logic. It's not just about being able to move data around; it's about being able to understand, modify, and maintain the logic that drives your business decisions.

The likes of Databricks like to claim that by embracing open formats you remove vendor lock-in. And, while technically true, there are so many other ways for a technology vendor to create lock-in, such a feature lock-in. You get bought into the ecosystem and the openness of formats makes leaving tempting, there is effort (and innovation) required by the vendor to keep you on their stack.

Closed format companies, where everything is proprietary, really don't need to make any effort or innovation to keep you as a customer, they just have to make the cost of leaving higher than the pain of staying - even if what you're staying with isn't really working anymore.

My question to such companies is: why do you hate people? Why do you want to trap them in a system that they can't understand, can't modify, and can't control? Why do you want to make it so hard for them to take their data and logic elsewhere if they choose to?

That's why open formats, of both data and logic, matter so much. Not just for portability, but for transparency, maintainability, and control. When logic is open, it's not trapped behind buttons and checkboxes it's inspectable, scriptable, and testable. You can refactor it, version it, and treat it like the valuable IP it actually is.

So yes, I love open formats. But I love them most because they respect the intelligence of the people using them. Because openness isn't just a technical feature, it's a stance. One that says: you should own the logic that drives your business.
