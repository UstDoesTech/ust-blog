---
title:  "The Next Frontier of Automation: Why Agentic AI Must Learn from the Failures of RPA and BPA"
date:   2025-06-16T19:00:38+00:00
description: The lessons from RPA and BPA that Agentic AI must heed to avoid repeating history.
menu:
  sidebar:
    name: The Next Frontier of Automation
    identifier: agentic-ai-rpa-bpa
    parent: ai
    weight: 2
---

Automation has long carried a promise both bold and elegant: that machines might one day relieve us from the weight of repetitive labor, allowing human creativity to rise where once it was mired in routine. For decades, that vision has danced just ahead of us, sometimes feeling close, sometimes impossibly distant.

In recent years, two waves of enterprise automation: Robotic Process Automation (RPA) and Business Process Automation (BPA), promised to bring that vision within reach. They delivered real gains. They have also equally delivered real disappointments.

Now, as we enter what may be the most profound shift yet, it's time to reflect and remember: new technologies often fail not because they lack capability, but because we forget the lessons of the technologies that came before.

## The First Wave: RPA's Narrow Victory

RPA emerged with a simple, almost seductive proposition: why not let bots replicate human actions directly?

Instead of waiting for every legacy system to expose APIs or clean data, software robots could mimic our clicks, keystrokes, and copy-paste routines. With minimal coding, companies could automate invoice entry, data reconciliation, and reporting — exactly the sort of repetitive tasks humans found draining.

And for many, RPA worked. Analysts estimate that global RPA revenue jumped from less than $100 million in 2015 to over [$1 billion just five years later](https://www.technologydecisions.com.au/content/cloud-and-virtualisation/news/gartner-rpa-software-revenue-to-reach-1-89bn-by-2021-819644074). Early adopters reported measurable efficiency gains and rapid ROI.

But beneath this initial success, cracks began to show. RPA bots excelled only when conditions remained static. A small change (a new field added to a form, a pop-up dialog, a minor UI redesign) could break entire bot fleets. Enterprises that had hoped to reduce operational overhead found themselves employing entire teams of "bot shepherds," continually patching, updating, and maintaining fragile scripts.

RPA's strength was also its weakness: it automated surface-level behavior, not understanding. The bots didn't "know" what they were doing, they simply followed patterns. And when those patterns shifted, so too did their reliability.

## The Second Wave: BPA's Ambitious Overreach

BPA arrived next, attempting to go deeper. Instead of mimicking human actions at the interface layer, BPA sought to redesign and automate entire business processes. Purchase orders, customer onboarding, HR approvals could all be captured as formal workflows, orchestrating multiple systems, APIs, and even human touchpoints.

This was, in many ways, the more intellectually satisfying vision of automation: not piecemeal scripting, but holistic, integrated transformation.

Yet even here, limits emerged. Business processes rarely follow the neat, linear paths depicted in consulting diagrams - even though we try really hard to capture the essence of those processes. Exceptions are common. Policies change. Unstructured data abounds. Human judgment remains essential at many junctures.

What began as a quest for "lights-out" automation often turned into sprawling rule engines that struggled under their own complexity. Adding new scenarios sometimes broke old ones. Governance structures grew to manage the rules, and soon organisations were bogged down in the very bureaucracy they sought to eliminate.

In both RPA and BPA, a painful truth emerged: most automation was built for a world that doesn't exist, where processes are stable, data is clean, and complexity is predictable.

## Why Both Ultimately Fell Short

Looking back, we can distill their failures into several themes:

* **Rigidity**: Both approaches assumed a static world where rules could be defined once and followed forever. The real world of customers, regulators, markets, and people rarely behaves that way.

* **Maintenance Overhead**: The more that was automated, the more maintenance was required to keep automation working. Instead of freeing people, much of the effort shifted into managing the bots themselves.

* **Shallow Understanding**: These systems operated by replicating patterns, not by reasoning. When faced with novelty or ambiguity, they lacked the capacity to adapt.

* **The Illusion of Autonomy**: Both were often sold as "autonomous" solutions. In reality, humans remained heavily involved to handle exceptions, monitor processes, and intervene when things went wrong.

And so, while RPA and BPA achieved real value in narrow domains, they never truly delivered the fully adaptive automation they promised.

## The Third Wave: Agentic AI

Now, a new wave is rising: agentic AI frameworks.

At their core, agentic systems attempt to move beyond scripting toward genuine reasoning. Unlike RPA and BPA, which execute pre-defined flows, agentic frameworks pursue goals.

Rather than simply being told what to do, agents are told what outcome to achieve and are left to determine how best to achieve it, drawing upon a growing arsenal of tools, APIs, and knowledge sources.

Agentic systems typically exhibit:

* **Planning**: Breaking down high-level goals into actionable steps.
* **Dynamic tool use**: Selecting appropriate functions or APIs based on context.
* **Reflection**: Monitoring outcomes and adjusting when plans falter.
* **Collaboration**: Working with other agents or humans to complete tasks.

Some of the most ambitious early agentic systems already show promise in domains like research assistance, customer service, legal drafting, and scientific discovery. Frameworks such as LangChain, AutoGen, OpenAI's function-calling APIs, and others have created the foundation for agents that reason, adapt, and evolve.

## Why Agentic AI Feels So Different, Yet So Dangerous

At first glance, agentic AI may feel like the long-awaited solution to automation's old struggles. After all, isn't the capacity to adapt exactly what RPA and BPA lacked?

But we must not be naïve. Agentic AI doesn't automatically escape the pitfalls of its predecessors; it merely encounters them at a higher level of abstraction.

### The New Rigidity: Cognitive Blind Spots

While agents reason better than bots, they are still limited by their training data, prompt engineering, and knowledge boundaries. Without careful design, agents can still fail catastrophically when encountering edge cases they've never seen before. They may generate plausible-sounding but incorrect outputs, a phenomenon known as "hallucination." This is particularly dangerous in high-stakes domains where accuracy is critical.

### Maintenance: Now a Matter of Models

Where RPA needed script maintenance, agentic AI requires constant model tuning, data validation, and monitoring for hallucinations or misaligned behavior. Non-determinism makes debugging far more challenging. As agents evolve, so too must the systems that support them. This can lead to a never-ending cycle of updates and retraining, which may not be sustainable in the long run.

### The New Illusion of Autonomy

Just because an agent can attempt novel approaches doesn't mean it always succeeds. In fact, the confidence with which agents produce erroneous outputs can mask underlying failures, especially in domains like healthcare, finance, or law. The illusion of autonomy can lead to complacency, where humans assume the agent is always correct, when in reality it may be making poor decisions based on incomplete or biased data.

### Distributed Accountability

As agents begin chaining tasks across multiple systems, handoffs, and actors, accountability becomes blurry. When an agent makes a poor decision based on ambiguous data, who is responsible? Is it the developer who trained the model, the business that deployed it, or the agent itself? This distributed accountability can lead to ethical and legal challenges that RPA and BPA never fully confronted.

## The Lessons Agentic AI Must Learn

If there is one great danger for this third wave, it is the temptation to forget the very history that made it necessary.

The most impactful agentic AI systems will:

* Build deep domain understanding, not shallow pattern replication.
* Incorporate explicit uncertainty estimation, surfacing doubt instead of hiding it.
* Embrace human-in-the-loop oversight, particularly where ethical or high-risk decisions are involved.
* Invest in observability, monitoring, and real-time error correction as core system functions.
* Design for adaptability not just in logic, but in governance and accountability structures.

The story of RPA and BPA is not one of failure, but of partial success under the wrong assumptions. Agentic AI represents a profound shift but it requires a different kind of design humility.

## A More Purposeful Future

Perhaps the most important insight is this: automation is not about replacing people (although it can highlight roles that might be considered ["bullshit"](https://en.wikipedia.org/wiki/Bullshit_Jobs)), it's about changing the nature of partnership between humans and machines.

* RPA automated tasks.
* BPA automated processes.
* Agentic AI aims to automate problem-solving itself.

As Icarus learned, the higher we climb the more dangerous our mistakes become. Agentic systems may one day reason, negotiate, and coordinate at levels we can scarcely imagine. But they must do so with transparency, alignment, and wisdom built-in.

We have been here before. We should not be here blindly again. If we move too quickly, seduced by novelty, confident in early gains—we risk building fragile, overconfident systems that repeat the brittle trajectories of the past. If we listen to the lessons automation has already tried to teach us, we may yet build a generation of systems that are not simply faster or cheaper, but more human in their adaptability, their reasoning, and their care.

Do I think we will? I think some of us will. I think some of us will learn from the past and build better systems. I think some of us will continue to repeat the same mistakes, thinking that this time it will be different.

Will I be among those who learn? I hope so. I think so. But only time will tell.
