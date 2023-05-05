---
layout: '@/templates/BasePost.astro'
title: Micro-Frontends at scale (part 1)
description: This article will focus on analysing and designing an architecture suitable for an enterprise application at scale while keeping the advantages that a Single Page Application (SPA) provides to our end users.
pubDate: 2021-01-28T00:00:00Z
imgSrc: '/assets/images/article-mfe-1.jpeg?nf_resize=fit&w=1080&h=720'
imgAlt: 'Article image'
---

This will be the first article on a series dedicated to the micro-frontends topic. This one will focus on analysing and designing an architecture suitable for an enterprise application at scale while keeping the advantages that a Single Page Application (SPA) provides to our end users. By the end you’ll have a working platform with a scalable micro-frontends approach.

## Why Micro-Frontends?

First of all, you might be wondering why do you even need this, right? Well, there are several answers to this question, and I’m definitely not an advocate of using this pattern/architecture “just because”. I’ll provide a concrete example where this makes sense:

You’re in a big enterprise project, it’s a big monolithic application encompassing several different “products” inside one single project/product. The company most likely chose this initial model to start fast and get to market soon. Now, they are established and new engineers come to the team.

The team grows a lot, and dedicated teams for each sub-product starts to feel a good and realistic possibility. Maybe each sub-product can have its own product manager, to extract the most out of each product and to enable the teams to focus on smaller parts of the platform.

Up until now, the teams have been working horizontally, meaning that they are working focused on the technology itself (front-end, back-end) instead of focused on Product.

The company decides that vertical teams will be more productive on the long term and also more scalable as new engineers get into the company. These vertical teams will hold all the knowledge inside a specific product and will be composed by the 3 related horizontal layers (front-end, back-end, infrastructure), which will also allow to grow each product individually.

With this approach, the company can also get more independent teams and deployments, by not being dependent on a single gigantic release to get a new version out to the clients.

Given these changes, how will the front-end reflect them?

## Solutions

After a lot of investigation, I concluded that micro-frontends would be the solution to the scenario presented above. But micro-frontends has many faces, many technologies possible, many opinion articles (just like this one) and it’s not easy to know where and what to bet on.

I’ll be presenting an architecture that is suitable for scale but that still leverages the SPA feel and performance that we love to rely on to deliver a great experience to our customers.

The imaginary business that we are going to use for these articles is a store of clothing items (dresses, shirts, pants, etc). This business is a case of the scenario presented above, working in an horizontal structure on a monolithic application. Now, to increase team independence, they want to create 3 vertical teams for the different sub-products of their platform: Items, Checkout and the Blog.

## Architecture

To achieve the objective of the clothing company presented in the previous section, we need to design an architecture that enables all the teams to be independent while connecting all these individual products into a coherent platform.

The following technologies will allow us to achieve what we need:

- React
- Webpack 5 with Module Federation
- Yarn Workspaces with lerna

The following architectural diagram represents an overview of the final solution. This is what we’ll achieve at the end of this series of articles on micro-frontends (MFEs).

![img](https://miro.medium.com/v2/resize:fit:1122/format:webp/1*AK0DPWoWg2vPassA14bHOg.jpeg)

All the components presented in the architecture are MFEs, and as such, each is independently developed, tested and deployed, but all of them tie together to deliver a consistent experience to the customer.

### App Shell

This MFE will be the single entry point into the platform.

It will be responsible for rendering the first page to our user and also for invoking the respective micro-frontends as the user navigates through our platform.

Using client-side navigation, we will be able to asynchronously load the necessary micro-frontends at run-time, keeping the solution memory and performance efficient.

It’s pretty common to find this App Shell approach in micro-frontend projects, but some of the approaches are not exactly like this. They follow more of a micro-services approach where each MFE can be the entry point for the user, and then that MFE will import the “setup” code from the App Shell (e.g. Base Layout with the Header and Footer). Although this approach is perfectly valid, it will most definitely not feel like an SPA to the end user while switching between different entry points for the platform, since it will force a refresh each time the user navigates to a domain from a different MFE.

### Shared

Inevitably, there are components that will be shared between our different MFEs, and for that reason the Shared MFE will be their home.

Regarding this MFE, in my opinion, there is not a team specifically responsible for this, instead, there should be a “caretaker” of the MFE that would review any pull request created regarding shared components. This person would be responsible for keeping order in Shared and also for keeping a critical thinking on the following question: “Will this change affect other MFEs?”.

### Items / Checkout / Blog

These MFEs are the actual products with dedicated teams working on them. They’re all independent in development and deployment. None of them is directly dependent on the other. Naturally, since the platform works as a whole, we need to cover the possibility of some MFE being broken and handle that gracefully. However, this approach will not let any MFE break the whole platform, as long as we handle the remote imports properly.

### Repository Structure

We’re going to use a monorepo for this solution.

The option to use a monorepo is arguable, and for all the cons it may have, the pros I’m after by using it are:

- Easily shareable configurations (linters, tasks, setup jobs, code styles)
- Better / easier overview of the whole system
- Easier to make a gradual migration from an existing monolith

## Architecture (in detail)

Let’s see in more detail how these components interact with each other and how exactly we enable the features mentioned in the previous section.

![img](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*wmffR3b3dTCqH8IF38vv9w.jpeg)

The key to making this whole architecture work is Module Federation.

> Webpack 5 Module Federation aims to solve the sharing of modules in a distributed system, by shipping those critical shared pieces as macro or as micro as you would like. It does this by pulling them out of the the build pipeline and out of your apps.

The excerpt is from the official [Module Federation](https://module-federation.github.io/) page, a new feature shipped officially on Webpack 5.
If you want to [learn more](https://module-federation.github.io/) you can read the information on the website and also checkout their [videos section](https://module-federation.github.io/videos). There is also a whole [GitHub project](https://github.com/module-federation/module-federation-examples) with examples using this new technology.

Very briefly, Module Federation provides us the chance to remotely import javascript code (components, functions, variables) at run-time, while efficiently managing dependencies between different remotes.

Basically, any application can be classified as a host (in case it’s the entry point) or a remote (in case it’s imported by a host). An application can be both a host and a remote at the same time, in which case it’s called bi-directional.

Next, let’s analyse some common micro-frontends pitfalls and see how we can get around them using the presented architecture.

## Common pitfalls

### Dependency Duplication

Using a micro-frontend approach may lead to importing dependencies multiple times. When the components are remotely imported from another MFE, they need certain dependencies to work. Chances are that the MFE importing that piece of code already has some (or all) of those dependencies. Without highly customised caching for dependencies, the imported components will most likely bring along their own dependencies, causing the host to have multiple instances of the same libraries (e.g. having different versions of React in scope may lead to unexpected problems).

With the presented architecture we’ll take advantage of Module Federation to manage these dependencies. When a remote module is imported at run-time, Webpack will actually check if it already has the dependencies required in the host. If they are there, then the only thing imported from the remote is the actual code.

### Dependency Mismatches

In micro-frontends, sometimes different versions of the same library are loaded in the same scope. To avoid this, we’ll be using a combination of lerna to manage our monorepo and yarn workspaces to manage the dependencies of our different MFEs.

By using yarn workspaces we’ll make sure that the versions of critical libraries are locked for all the micro-frontends, preventing this whole class of problems. This approach reduces independence, but it allows a more robust overall solution.

### UI / UX

In a micro-frontends solution, it often happens that the UI and UX diverge between different MFEs. It’s a natural process when different independent teams are each developing their products. At the same time, we need to keep in mind that the different products form the platform as a whole and that platform should provide a consistent experience to the user. This should happen both in the UI components and in the flows / user experience provided.

In the solution presented, by using a Shared MFE, we are keeping these same visual components and reusable behaviours in the same package. This will guarantee that the UI experience is unique and consistent. At the same time, we’re giving this Shared MFE the independence it needs to release frequently. This will help fix small problems in the common components without needing to redeploy any other product MFE (like Items and Blog).

### Local Development

Local development can be taxing in a micro-frontends solution, sometimes needing to run the whole solution in order to test what you are developing in a small part of that platform.

The way we’re going to solve this is by providing the chance for all the different MFEs to be run in stand-alone mode. This will be done by providing 2 separate entry points to our MFE, one for the integration with the whole MFE solution and another for the stand-alone entry point.

## Conclusion

The architecture presented in this article was achieved after a lot of investigation on the topic and you can check a lot of material in the References section below.

In the next articles we’ll be deep diving on how to implement this architecture by following along a github repository with the example project for our imaginary business use case.

We’ll also talk about common challenges that occur when using Module Federation and what can we do to solve them.

Here is the second article on this series, feel free to check it out and leave some comments: [Micro-Frontends at Scale (Part 2)](https://levelup.gitconnected.com/micro-frontends-at-scale-part-2-d10994f09f18).

Stay tuned 😉

If you find this article interesting, please share it, because you know — Sharing is caring!
