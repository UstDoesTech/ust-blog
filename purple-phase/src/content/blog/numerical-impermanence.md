---
title: "Numerical Impermanence"
pubDate: 2025-06-30T01:00:38+00:00
description: "Expanding on numerical impermanence"
tags: ["maths"]
categories: ["maths"]
slug: "maths/numerical-impermanence"
heroImage: "/images/maths/numerical-impermanence/images/fuzzy.png"
---

In a recent blog post I introduced the concept of [**numerical impermanence**](https://ustdoes.tech/posts/strategy/numerical-impermanence-intro/). In this post, I want to expand on that idea, and introduce the theorem in more detail.

Numerical impermanence is a philosophical-mathematical framework that challenges the notion of numbers as fixed, immutable entities. By defining numbers as temporal functions bound to evolving contexts, we demonstrate that numerical identity undergoes transformation as its contextual framework shifts. This perspective not only aligns with the principles of impermanence but also opens new avenues for understanding the dynamic nature of numbers in various domains, including mathematics, physics, and philosophy.

Much in the same way that we, as humans, are bound to the context in which we exist and are shaped by it, numbers are also bound to the context in which they exist and are shaped by it. This is a radical departure from the core tenets of mathematics, but it is one that I believe is necessary in order to fully realise the world around us.

## Introduction

Mathematics has traditionally been viewed as the domain of eternal, unchanging truths. Platonists argue that mathematical objects exist independently of human thought in an abstract realm, while formalists consider mathematics a game of symbol manipulation governed by consistent rules. Both perspectives, however, typically view the identity of numbers as fixed. "1" is eternally and universally "1" regardless of time, culture, or context.

I'm going to challenge this assumption by introducing the Numerical Impermanence Theorem. Drawing inspiration from Eastern philosophical traditions, particularly the Buddhist concept of impermanence and Heraclitus' notion that *"no man ever steps in the same river twice,"* this theorem proposes a framework in which numbers are **temporal entities** whose identities are **bound to evolving contexts**. As a result, under sufficient transformation of context, **every number loses its fixed identity**.

## Background

The question of what numbers "are" has occupied philosophers since antiquity. Plato's theory of Forms suggests that mathematical objects exist in an abstract realm independent of human perception. Aristotle, by contrast, viewed mathematical objects as abstractions from physical reality. In contemporary philosophy, mathematical Platonism (GÃ¶del, 1964; Maddy, 1990) contends that mathematical objects exist independently of human minds, while nominalism (Field, 1980; Hellman, 1989) argues that mathematical statements do not commit us to the existence of abstract entities.

Intuitionism (Brouwer, 1913; Dummett, 1977) holds that mathematics is a human construction, with mathematical objects coming into existence only when they are constructed by finite procedures. Similarly, social constructivism (Ernest, 1998) views mathematics as a social construct, shaped by cultural and historical contexts.

While mathematics has developed sophisticated tools for modeling time, the temporal nature of mathematical objects themselves remains underexplored. Conceptual change in mathematics has been studied by philosophers and historians of mathematics (Lakatos, 1976; Crowe, 1988), but few have proposed formal models for how mathematical objects themselves might evolve temporally.

Recent work in category theory and topos theory (Lawvere, 1964; Johnstone, 2002) provides tools for understanding mathematical objects in terms of their relationships rather than their intrinsic properties, offering a potential bridge to a more contextual view of mathematics.

The concept of impermanence (anicca in Pali) is central to Buddhist philosophy, holding that all phenomena are in a constant state of flux. The Heraclitean dictum that "everything flows" (panta rhei) similarly emphasizes the transient nature of reality. These philosophical traditions question the existence of fixed, unchanging essences - a perspective rarely applied to mathematical objects in Western thought.

## Definitions and Framework

Here, I will introduce the key concepts and definitions that underpin the Numerical Impermanence Theorem.

### Temporal Number (N(t))

A **Temporal Number** $N(t)$ is a function from time $t$ to a value in $\mathbb{R}$, where its meaning is tied to the context $C(t)$ in which it is used.

Formally:
$N(t) = f(t, C(t))$

where:

- $t$ represents time in some appropriate metric
- $C(t)$ is a continuous function representing shifting context: cultural, computational, physical, or abstract
- $f$ is a function mapping time and context to a numerical value

To put this in simpler terms, a temporal number is a number whose value or meaning changes over time because the context in which it is used changes.

The formula has three main components:

- **$N(t)$**: The temporal number itself. The "(t)" means it changes as time passes.
- **$C(t)$**: The context in which the temporal number is used. This also changes over time. Think of this as "what's normal at time t".
- **$f(t, C(t))$**: The function that maps time and context to a numerical value. This function can be thought of as the "engine" that drives the temporal number's behavior.

Time passes (t changes). As time passes, what's "normal" in the world changes (C(t) changes). The Temporal Number's value depends on both the specific time and the context at that time.

For example, if we're referring to "fast internet", the value of "fast" might change over time. In 1995, a 56k modem was considered fast. In 2025, a 1Gbps connection is considered fast. The context (C(t)) has changed, and so the value of "fast" (N(t)) has also changed.

### Contextual Framework (C(t))

A **Contextual Framework** $C(t)$ is a time-dependent structure that determines how numbers are interpreted, manipulated, and related to one another.

Components of a contextual framework may include:

- Base system (binary, decimal, etc.)
- Axioms and rules of inference
- Operational semantics
- Cultural and linguistic associations
- Technological implementations
- Philosophical interpretations

Simply put, a Contextual Framework is the lens through which we understand and use numbers at a given point in time.

As an example, consider the number "10" - what it actually means depends on the system around it, and how that changes over time. In the context of a binary system, 10 represents the number 2. In a decimal system, it represents 10. Are we using "10" to count things, measure something or rank things? What technology is being used to process this number? What cultural meaning might be attached to it? All of these factors shape the meaning of "10" at a given time.

The mathematical expression $C(t)$ just means that this framework depends on time (t).
  
A **Contextual Transformation** is a change in $C(t)$ over time such that $C(t_1) \neq C(t_2)$ for $t_1 \neq t_2$.

The Contextual Transformation is how we understand numbers change from one time to another. For example, the number "10" in 1995 might mean something different than "10" in 2025. The Contextual Transformation is the process of moving from one understanding of "10" to another.

The mathematical expression $C(t_1) \neq C(t_2)$ just means that if you pick any two different points in time (tâ‚ and tâ‚‚), the context for understanding numbers will be different.

### Numerical Identity

The **Numerical Identity** of a temporal number $N(t)$ at time $t$ is the complete set of properties and relations that define it within $C(t)$.

The Numerical Identity is everything that makes a number what it is at a given time. This includes its properties (like being even or odd), its relationships to other numbers (like being greater than or less than another number), what you can do with the number, and what it means in that context.

The mathematical expression simply means: a number's complete identity comes from how it fits into the entire system of meaning at a particular moment in time.

Two temporal numbers $N_1(t_1)$ and $N_2(t_2)$ have the **same identity** if and only if their complete sets of properties and relations are isomorphic across their respective contexts $C(t_1)$ and $C(t_2)$.

To put this in simpler terms, two numbers from different times have the same identity if they play exactly the same role in their own times, even though the times are different. This is a very strong condition, and it means that the two numbers are essentially the same in their own contexts.

To give an example, the "average home price" in 1995 and 2025 would be very different amounts, but they have the same identity if they represent the same level of expense relative to incomes, take similar effort to pay off, and hold the same social meaning in their respective contexts.

Isomorphic just means a perfect match between how these numbers fit in their respective contexts, even though the numerical values are different. This concept is crucial for understanding how numerical identity can persist across different temporal frameworks.

## The Numerical Impermanence Theorem

We've defined the key concepts and framework, now let's introduce the theorem itself.

The **Numerical Impermanence Theorem** states that:

In a dynamic number system where values are defined relative to a state function over time, every number loses its fixed identity under sufficient transformation of context.

Formally: For any initial value $N(t_0)$, there exists a transformation of $C(t)$ such that $\lim_{t \to \infty} N(t) \neq N(t_0)$ and may even become undefined.

### Theorem Breakdown

The Numerical Impermanence Theorem says that no number keeps its meaning forever as the world changes around it.

For any number at some starting time $N(t_0)$, if you wait long enough (as time goes to infinity) and let the context keep changing, that number's meaning will drift away from its original meaning. Eventually, it might even lose all meaning and become "undefined".

## Proving the Theorem

Time to prove that the theorem is true.

### Initial Conditions

Let $N(t_0) = 1$ in a standard mathematical context $C(t_0)$ defined by:

- Base-10 numeral system
- Classical first-order logic
- Standard set-theoretic foundations
- Conventional arithmetic operations

Within this context, "1" has a well-defined identity including properties such as:

- Being the successor of 0
- Being a natural number, integer, rational, real, and complex number
- Having measure 1
- Being odd, prime, and square-free

This is, for all intents and purposes, a fixed identity of the number "1". The number "1" we all know and love.

### Contextual Evolution

Now, consider the following contextual transformations:

**Fuzzy Context**
Let $C(t_1)$ be a context in which fuzzy logic replaces classical logic. In this context:

- $N(t_1)$ becomes a fuzzy set with membership function centered around 1
- The law of excluded middle no longer applies
- $N(t_1)$ is no longer definitively odd or even, but has degrees of membership in both categories

<div align="center"><img src="/images/maths/numerical-impermanence/images/fuzzy.png" alt="Fuzzy Context" width="500" /></div>

**Probabilistic Context**
Let $C(t_2)$ be a probabilistic context where numbers are represented as random variables. In this context:

- $N(t_2)$ is represented as a probability distribution
- Deterministic outcomes are replaced by expected values and confidence intervals
- $N(t_2)$ has probability $P$ of being odd and probability $1-P$ of being even

<div align="center"><img src="/images/maths/numerical-impermanence/images/probability.png" alt="Probabilistic Context" width="500" /></div>

**Quantum Context**
Let $C(t_3)$ be a quantum context where numbers are represented as quantum states. In this context:

- $N(t_3)$ is represented as a superposition of states
- Complementary properties cannot be simultaneously measured with precision
- $N(t_3)$ can be in a state of being both odd and even until measured

<div align="center"><img src="/images/maths/numerical-impermanence/images/quantum.png" alt="Quantum Context" width="500" /></div>
