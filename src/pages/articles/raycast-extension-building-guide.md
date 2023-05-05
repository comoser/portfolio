---
layout: '@/templates/BasePost.astro'
title: Raycast extension building guide
description: This article will serve to document my journey in building my very first raycast extension, publish it to the raycast store and all the quirks that I found along the way.
pubDate: 2023-05-04T00:00:00Z
imgSrc: '/assets/images/article-raycast-sr.jpeg?nf_resize=fit&w=1080&h=720'
imgAlt: 'Article image'
---

This article will serve to document my journey in building my very first raycast extension, publish it to the raycast store and all the quirks that I found along the way.

First of all, let’s start with what [raycast](https://www.raycast.com/) is.

> Raycast is a blazingly fast, totally extendable launcher. It lets you complete tasks, calculate, share common links, and much more.

You can think of raycast as a spotlight on many steroids for macos users. It has been getting a lot of attention lately and many developers from my company have started using. Eventually the fever reached and I tried it out. I have been using it and learning about it a lot since then.

## Disclaimer

This is not a replacement to the raycast documentation at all. The documentation is very well done, but in order to create an extension from start to finish and have it published in the store, the information is really spread out, and sometimes not very clear. This is an attempt to have a guide from start to finish, covering everything you need to do that is not obvious from the documentation alone.

## Opportunity

I’m an avid [Slack](https://slack.com/) user, and one thing I love in Slack is the `/remind` command. I’m really forgetful, and I need to set many reminders throughout the day in order to keep up with everything I need to do. The reason I like Slack to do this, is because the reminders analyse plain english and then translate that into a reminder (e.g. remind me to buy lunch today at noon).

Since I started using raycast, I saw that such a command didn’t exist in the extension store and thus, started the journey to build [Simple Reminder](https://github.com/comoser/raycast-extensions/tree/simple-reminder/extensions/simple-reminder), the easy to use, dependency free, natural language reminder command for raycast!

## The process

The raycast documentation specifies everything needed to do, but there’s not exactly a guide to do it step by step. I’ll try to define step by step what needs to be done in order to get an extension from your computer to the raycast store.

### Getting the local setup running

First of all, we’ll need to fork the extensions repository in github.

You can find the [extensions repository here](https://github.com/raycast/extensions), and after we fork the repo, that’s where we’re going to do our local development. You’ll have the forked repository like so:

![img](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*gFv3im-aEimCG1BW6q_VfQ.png)

First create a feature branch for your new extension, so that you have a well established place to work.

![img](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*f7TkG5Sux4tZ-1Z4ZBjfrw.png)

The next step is to leverage the “Create Extension” command from raycast in order to create your extension boilerplate.

![img](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*C0OERlKn1ch9iQRt0XWxNw.png)

Now you need to detail how your extension will look. There’s a lot of different templates available, so you’ll need to browse the [documentation](https://developers.raycast.com/api-reference/user-interface) in order to find the best UI to deliver your functionality with. Another important detail is the location. To save time later, select the folder of your fork for the extension to be created there (it will be something like `raycast-extensions/extensions`).

![img](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*_KucxNfZu84evS67bYWgZQ.png)

You’ll be greeted with the following screen and then we’re ready to start our local development.

![img](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*HwimaiQu8_O22dT-GAx98Q.png)

Open up your terminal on the newly created folder `raycast-extensions/extensions/your-new-extension`, run the commands specified above, and you’ll be greeted with your own extension!

![img](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Fc0Ffgu7DlnANTMGQAJbKg.png)

![img](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*_A-q8L9GXVlmIXpIzjXOQg.png)

Congrats! You’re ready to start the development of your amazing extension.

### Development process

In this chapter I want to highlight how the project looks like and some specificities that might not be obvious at first. I will not develop any kind of example extension. For that you can check the [Simple Reminder](https://github.com/comoser/raycast-extensions/tree/simple-reminder/extensions/simple-reminder) extension or any of the others in the [raycast store](https://github.com/raycast/extensions/tree/main/extensions).

![img](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Ha7aqq-CFrN1g3NxzgN5ew.png)

- _assets_ is the folder where you’ll have all the images that your extension directly uses (including the extension logo). The images placed in this folder are preferentially pngs with a size of 512x512.
- _media_ is the folder where you have all the content necessary (images or more) to provide in your readme / changelog files. These images will not be placed in the final release of your extension in the raycast store.
- _metadata_ is a folder that is not obvious that you need to have from the documentation provided by raycast. In this folder you’ll have the screenshots to show in the store for your extension. You can have up to 6, in png format and preferentially with the size of 2000x1250. We will get back to this later in the article.
- _src_ will hold all the code necessary for your extension. This is a regular Typescript project, so feel free to leverage the npm ecosystem to achieve something great.

### Command definition

Your extension may have more than one command. For instance, in the Simple Reminder case, I have a main `Add-reminder` command, but I have another one that runs in the background from time to time, in order to notify the user of the reminders they have set. To read more on the kinds of commands you can create, [check this page here](https://developers.raycast.com/information/manifest#command-properties).

To get the result explained above, you need to place the command definition on package.json and then match those commands with files that need to be in the root of the src folder.

![img](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*CitbVyM28YQq1vuWu2nh8w.png)

![img](https://miro.medium.com/v2/resize:fit:972/format:webp/1*zul49N8bEK87rLz73NUWoA.png)

An important detail here is that the main command of your extension needs to be called `index`. For the rest of the commands that compose your extension, you can name them as you want, as long as they match between the filesystem and the `package.json` definition.

A tip for code developing, raycast already provides a lot of APIs to contact with system things: LocalStorage (encrypted), hooks for fetching data async, hooks to cache content fetched through the network and more. Explore the existing APIs before doing those efforts from scratch.

### Prepare an extension for Store

When your extension is done and working as you envisioned, it’s time to prepare it for the review and publishing processes.

The raycast team has put together very good [documentation on how to prepare your extension for the store](https://developers.raycast.com/basics/prepare-an-extension-for-store), and you should follow everything specified there, but in my case, there was a bit of a misunderstanding regarding the screenshots.

It’s not really clear how screenshots work at first, especially since the default project that the “Create extension” command bootstraps doesn’t come with a `metadata` folder.

When doing the screenshots for your extension, it’s important to use the “Window Capture“ feature raycast has built-in. You can define a shortcut for it on the preferences panel.

![img](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*yJskRNqzgei7VkZO0tRX9w.png)

With the shortcut defined, just pull up raycast to the screen, enter your command and use the shortcut to enter “Window Capture” mode. This mode does 2 important things:

1. Visually show you how the screenshot will look like and remove the small green development icon next to the command name.

![img](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*wY6nGha_s_ejW1SC3L6ghw.png)

2. Take the screenshot in the required dimensions of 2000x1250px and png format.

Optionally, you can save the screenshots to the metadata folder directly. You can set up to 6 screenshots, and as any store, you should definitely leverage this to showcase how your extension adds value to the raycast users.

## Submit for review

To start the review process you have two alternatives:

1. To use the `npm run publish` command
2. To do a Pull Request (PR) manually and follow the PR template

Honestly I cannot say if the first option works. I tried using it, but I faced issues with it. It’s possible that there are some issues on their github regarding this, but it’s also possible that I did something wrong in the setup, which in turn makes this command not work.

Either way, I like to have full control over my PRs, and open sources ones especially so. To start the review process, simply open a Pull Request from your forked repo/branch to the origin one (the raycast owned one).

![img](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*BShGulPbdWXEBwK9EEkk5g.png)

In the PR, follow the template suggestions and try to add as much information as possible. This will make lives easier for the raycast team and it will speed the process for your extension review.

If you want to, I’d encourage you to join the [raycast community slack](https://join.slack.com/t/raycastcommunity/shared_invite/zt-1u7yczhyp-bWxHcwgsvKh9aeSIWlLmgQ), so that you can reach out directly to the raycast team and discuss issues faster with them.

When the PR is accepted and merged, you’ll have your extension in the raycast store!

This is what it will look like:

![img](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*F4jke5Y0jnZqoWTz5jAI1g.png)

## Final thoughts

The adoption rate of raycast is picking up quite well, and this is a great time and opportunity to contribute to something that will be surely widely adopted in the community.

Regarding the process of creating an extension, it wasn’t a breeze, but it wasn’t hell either. There are points in the documentation that seem to be quite separate and sometimes it’s hard to find what you want. But there are many other parts that are really good.

I hope this guide will help you build your new extension and if anything in this guide is wrong or if you have suggestions, please feel free to drop them in the comments, or [reach out to me directly](https://davidalecrim.dev)!

If you find this article interesting, please share it, because you know — Sharing is caring!
