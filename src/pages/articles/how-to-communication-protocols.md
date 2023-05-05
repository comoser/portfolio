---
layout: '@/templates/BasePost.astro'
title: How to... Communication protocols
description: I want to write about a technique to leverage better communication between a client and an API system that are both owned by an organization.
pubDate: 2022-09-15T00:00:00Z
imgSrc: '/assets/images/article-comms-protocol.jpeg?nf_resize=fit&w=1080&h=720'
imgAlt: 'Article image'
---

I recently wrote another How to article where I explore an approach for acceptance testing your applications. Still on the same wave, and picking up from the experience of my most recently worked project, I want to write about a technique to leverage better communication between a client and an API system that are both owned by an organization.

## Disclaimer

This article will use [Data Transfer Objects](https://en.wikipedia.org/wiki/Data_transfer_object) (DTOs), and there’s a lot of discussion on the internet regarding its usage as a correct pattern or an anti-pattern. As is usual in software engineering, this depends on the context of your problem, and the purpose of this article is not to elaborate in favor or against it, rather, I’ll explain the high-level context of the project for you to understand why we did use DTOs.

## Context

The project in question belongs to a big organization, that has a product split into several different teams. These teams are vertical (owning their full slice of product) and it is built in such a way that the frontend is split into different micro frontends and the backend is split into multiple APIs that leverage a [Domain Driven Design](https://en.wikipedia.org/wiki/Domain-driven_design) (DDD) architecture. Because of the multitude of teams involved and the complexity of the business itself, an [Event Driven](https://en.wikipedia.org/wiki/Event-driven_architecture) architecture is also in place. The majority of the code is in Typescript with some exceptions for some performance and compatibility use cases.

Given the distributed nature of the product and the teams themselves, there’s one thing that becomes critical, which is to provide clear communication guidelines and support between the different micro frontends and the APIs. The way we did this was through protocols, that were no more than Typescript types available through npm packages. To these communication protocols, we called contracts.

## A high-level diagram of the solution

![img](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*x96cEQxwUDpu59y_Ow-zaw.png)

In the solution diagram, we can see that we have two different vertical teams: checkout and consumables. Each team has its own processes and owns the tech stack, like the frontends, the backends, and the contracts between UI < - > API.

It’s also important to note that I’m being over simplistic in this approach, as the team actually owns a lot more stuff, like CI/CD for their system components, monitoring stacks, infrastructure automation tools like Terraform, etc etc. But for the purposes of this article, the above-mentioned components in the diagram are the important ones to keep track of.

### How it works (backend / API)

Let’s take team checkout for instance and explore what a new feature development would look like.

We have a new feature in the making and we start coding new endpoints in the API to handle the new feature logic. Because we use DDD in the API architecture, the domain objects will be inherently only accessed and used in the domain layer. The reasoning for this is simple: domain objects hold logic on business processes and business validations on top of all the data the object usually holds. Because of this, we need a strategy to pass data from and to our core application, and DTOs serve that exact purpose.

We create the DTOs in accordance with the needs of the clients (web frontends in this case) and these DTOs are most likely not “equal” to the domain objects. They can hold data from an aggregate or from different domain objects. They basically hold only the necessary data needed to fit a client's need.

When we do create the DTOs, we do so in a separate contract npm package, which is versioned and deployed to a private npm repository. These DTOs are no more than Typescript type definitions. The deployment process of the contract happens in a pipeline in our CI/CD flow.

### How it works (frontend)

The frontends then, besides all the other possible npm packages they use, import the contract package at a specific version. This will allow the usage of the correct types when communicating with the APIs.

Besides the fact that we know for sure we are sending the correct data format to the APIs, there’s another great advantage of using these contract type definitions on the frontend: development API mocking.

Most of the time, feature development is not done first on the API and then on the UI. What usually happens is that the feature is developed simultaneously, which means that we may have a situation where we want to call an API endpoint that is not yet ready.

To tackle this, we can leverage tools like [msw](https://mswjs.io/), that allow us to intercept AJAX requests and mock responses to certain endpoints. If we join the usage of msw with the usage of the contract DTOs as the return types of certain endpoints, we got ourselves a fully independent, reliable, and pluggable development environment for our frontends!

## Potential issues

Until now, we saw how contract adoption can help teams create a more trustworthy and useful communication protocol between the frontends and the APIs, but there are some potential downsides to the solution.

If changes are made to the contract DTOs and they are used by the API but are not published as a new contract version, this can have potential breaking behavior. It’s important to have strategies to avoid falling into this issue.

One of the strategies may be to have a `pre-push` git hook that validates if anything has changed in your contract folder and prevent you from pushing those changes unless you have bumped the version in the contract `package.json`.

It’s also important to note what [semver](https://semver.org/) is and how it helps us manage the npm package that we publish. By using it correctly, we can communicate to the frontends whenever a breaking change happens (since that changes the major part of the version). When breaking changes are indeed published, we need to update our frontend mandatorily. If we don’t, we may fall into breaking behavior again.

Let’s take a step back and remember that our teams are vertical, owning the full tech stack as we can see in the image below.

![img](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*IttyxImLjEorLdh9yXIzWA.png)

It’s entirely feasible that we implement a communication mechanism inside the team like:

- Run contract deploy pipeline
- Detect major version bump in the contract version
- Send a message to the team slack channel informing that an update NEEDS to be made in the frontends that consume that package
- Update frontends with the correct contract version
- You’re safe 👍

There may even be other solutions to these problems, but at least you now have two strategies to deal with them.

## Final thoughts

The protocol communication system is incredible in big products that have vertical teams working on different aspects of it. It’s not a silver bullet for every system, this may be too much in simpler systems or even on products where teams are not vertical. It’s always critical to analyze the context of the product and the teams, to see if this communication protocol is beneficial.

You can get more serious about contract testing too, by leveraging existing tools like [Pact](https://docs.pact.io/), which will let you achieve, with more established processes, the same outcomes we had.

Either way, I hope this will help you build your next system more safely and easily. Please leave your comments down below to stir up the discussion!

If you find this article interesting, please share it, because you know — Sharing is caring!
