---
layout: '@/templates/BasePost.astro'
title: Context is everything
description: Choices every engineer is faced with and how to deal with them. Maybe it will help you the next time you have difficult choices to make
pubDate: 2022-10-26T00:00:00Z
imgSrc: '/assets/images/article-context.jpeg?nf_resize=fit&w=1080&h=720'
imgAlt: 'Article image'
---

Disclaimer: This article is going to be very generic, but even without the code examples that you might expect to see, the scenarios that will be presented will make you think and hopefully ring within you, the next time you are asked to make a choice in your engineering team’s project.

I’d like to start with a statement that may make sense to you or not:

> - Context is everything.

And this is especially true in software engineering. Almost every choice given to you in the software engineering world has the same outcome: It depends. To some, this may sound that it’s an excuse for not giving an answer, but the truth is that there’s a lot of depth to many questions asked to engineers in general and to senior engineers in specific.

Let’s see a bunch of scenarios that will let us understand the depth of some choices and how a software engineer is more than a technical person.

## Scenarios

> Should we use < insert any framework > or < insert any other framework >?

![img](https://miro.medium.com/v2/resize:fit:1400/0*SC8Au7SZEReKl1XM)

My immediate thinking here is: Do we have anyone on the team that used/uses one or the other for a long time? Someone that would be able to unblock framework-related issues for the other team engineers. If we do, then that may be an indicator that we should go with that technology instead of the other. Strong emphasis here on indicator, since there are more factors involved here.

Another immediate thought is: Do we have other parts of the system that are already deployed using one of the two frameworks? If we do, then that may also be an indicator to use the already tested and deployed solution. The main advantage here would be that the team could tap into the other teams' knowledge and experience, eventually even reusable components.

Other possible thoughts are:

- Does one framework fit better than the other to solve the problems we need to solve? Then that’s a clear indicator it should be chosen over the other. It’s easy for engineers to fall into the problem of “I want to test shiny new framework #1”. But the first and most important task an engineer has is to choose the right tool for the job, so we need to keep that in mind at all times.
- Do we have a short deadline to deliver the MVP or the solution as a whole? If we do, then for sure that’s an indicator the team should choose the framework that the team members have the most experience with. If not, then maybe we have the room to learn and work on something new (if it is the will of the engineering team and if it fits to solve the problem).

All these factors will ultimately contribute to making the right choice according to the teams' context.

--- 

> Your code is not optimized in this service. (a comment in a PR somewhere in the world)

![img](https://miro.medium.com/v2/resize:fit:1400/0*Yx6GnyBwdLXVJW-v)

Performance is a tricky subject. Of course, we don’t want a slow application or slow database access, or slow service execution of the business logic.

But you know what’s even worse than having a slow application? Having a dead application.

One question that I usually ask whoever is asking me about performance is: Did any application user notice / report an issue in terms of performance? Most of the time the answer is no. Most of the time the application is not even live for end users, and I have engineers worrying about performance right off the bat. Keep the focus on what’s important, to deliver a functional feature-ready solution for your end users. If after that you have reports of performance issues, that’s great news! It means people are using your solution! It’s the first step to a successful product. That’s the time to tackle most of the performance issues that may arise.

This is my goto point of view about performance, but this is not always true as you can imagine. There are solutions that are time-critical or even storage critical. In those cases, performance can’t be an afterthought obviously and should be tackled early on and continuously in each PR made to the project.

--- 

> Let’s build our solution with microservices / microfrontends.

![img](https://miro.medium.com/v2/resize:fit:1400/0*MbyBvjr4K2601ptL)

This topic is very common nowadays and it is a surprisingly easy choice for dev teams to make in favor of it. These architectures are surely helpful and have many benefits, but they need to be implemented in the right context and at the right time.

At what stage of development is the project?

If it’s just now starting, do we have the people capacity to handle such an architectural choice? People capacity should be understood as both the number of engineers the team has as well as the knowledge each of them has.

Make no mistake, microservices are great, but they bring a lot of overhead and additional work for the development team (discoverability, monitoring, alerting, distributed log tracing, async communication channels, CI/CD, distributed (or not) storage, etc, etc). Understanding if the team has the capacity to handle such a decision early on is critical to deciding in favor or against the adoption of such an architecture.

If the project is already ongoing and is deployed, has end users, and is getting the results the stakeholders wanted (financial or other), then there are a couple of scenarios that are interesting to analyse.

At this stage of the company’s life, there are probably a lot more engineers joining the team. The company may be growing its technical people count and at the same time specialising the engineers, managers, designers, etc in several different verticals inside the product. If a company is making the choice to use verticals to represent the different parts of their technical product, then these verticals are good candidates to split into microservices/microfrontends, since at this stage the capacity would be guaranteed to handle the different services and the overhead of managing the microservices environment.

The core of the issue that I want to bring out in this topic is that it’s sometimes smarter to start with a well-structured monolith than to start with architectures that the team is not equipped to handle, just because it’s the “right” way to do something. There’s no single right way to do anything most of the time. There may be a good way, given the context, the limitations, and the capacity of the team involved. That’s the important context that engineers have to be aware of at all times while making choices.

---

> Let’s use domain driven design (DDD). (Somewhere, some engineering manager or head of engineering telling to their team)

![img](https://miro.medium.com/v2/resize:fit:1400/0*Mb-X1jd673LhlJq6)

I’ve used DDD as an example, but this goes to any well-known and established software application architecture, like clean, onion, hexagon, etc. I’m usually all up for using one or more of the architectures presented before, mostly because they help follow several software development best practices.

By following them we assure that both the current team and new engineers entering it have a well-defined set of rules to follow when they start developing code. The problem is, this usually doesn’t work as well as intended.

To have a team fully implementing any of these architectures by the book (especially DDD) takes an enormous amount of experience. It takes previous experience in applying these architectures to real-world products and it takes iterations of applying them. Even then, there are some variables that come into play that disrupt well-established architectures:

- Time pressure to deliver
- New engineers to the team that don’t have enough knowledge
- Team growing too quick without strong processes in place
- Engineers leaving the team
- Not continuing to enforce core architecture rules (e.g. in DDD: continuing to distill the domain model continuously, speaking and practicing the ubiquitous language in a project, continuous and intricate contact with business experts. In Clean: dependency inversion)

The only way to be more sure that the project evolves following the best practices and the architecture guidelines defined is to have enough processes in place that any engineer won’t be able to deviate from them. Or at the very least they’d have to make effort to not follow them.

So, in summary, what I mean to say is that I’m in favor of adopting the architectures we think will bring value to the project, depending on the context.

Do we have an ambitious project, that has a complex business model and an experienced team working on it? Then maybe the team can follow the chosen architectures by the book (or at least what applies to the project). If you don’t have these variables set, then maybe the team can adopt some of the values and guidelines these architectures define, instead of going full-on mode following them. This will allow the team to continuously refactor code and adopt what makes sense to the project as the needs arise.

Then again, not every project is ambitious or has a complex business model, and in those cases, the right choice is probably not to follow such complex architectures, and instead keep things simple.

---

> Let’s create this common component (an engineer in a frontend team)

![img](https://miro.medium.com/v2/resize:fit:1400/0*KHXPLkUQs9VfMJcK)

It’s a given that in any frontend project there are components that are reusable. These components are often put in some `common` directory and used throughout the application or even throughout different applications.

They are essential to any frontend codebase. But when should we extract these common components?

This is a tricky decision. Sometimes components that appear to be a logical choice to abstract and reuse, are really not. It’s not easy to get things right when extracting a component based on supposed knowledge. What I mean by this is that there are always scenarios that we didn’t foresee, and that will lead to changes in the common components that we extract.

To help avoid this issue and to keep reusable components truthful for longer periods of time we should try to extract and abstract when the need for it arises. Even if the candidate for abstraction appears obvious, wait until you need to reuse it. When that need arises, you’ll have more context and more information on how the common component should behave and be interfaced with.

Abstractions that are done too early in the development process of any project are probably the wrong abstractions. It’s our job to not do unnecessary work and this category of problems is common in an engineering project.

## Final thoughts

There are myriad scenarios that engineers are faced with that have different solutions depending on the context of the team, the project, the client, or the organisation.

The scenarios discussed and presented in this article are just some common examples and my purpose with them is to reiterate my initial statement:

> Context is everything.

My hope is that the next time you’re faced with such kinds of questions your answer won’t be immediate, instead, it will be an It depends.

_It depends_ is a great answer, as long as an engineer has the knowledge to explain why and how different solutions might fit the problem, depending on the context. It depends leads to healthy and learnable discussions.

If you find this article interesting, please share it, because you know — Sharing is caring!
