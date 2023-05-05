---
layout: '@/templates/BasePost.astro'
title: Lessons learned fighting the COVID pandemic
description: A story about participating in Helpful Engineering and how open sourced volunteering can teach you a lot in life.
pubDate: 2020-07-14T00:00:00Z
imgSrc: '/assets/images/article-covid.jpeg?nf_resize=fit&w=1080&h=720'
imgAlt: 'Article image'
---

Going back earlier this year, we started hearing more and more about this new virus that was starting to spread around the whole world. In just a few days we saw that we were dealing with a global pandemic and we saw many health systems just overflowed and working over their limits in many countries.

One of the main things missing in many hospitals was ventilator equipments, since the virus attacks the respiratory system, and in most critical cases, ventilators are vital for the patients.

Mainly due to this lack of equipment, the [Helpful Engineering](https://www.helpfulengineering.org/) community initiative started and its purpose was to bring together all types of volunteers (engineers, medics, medical equipment technicians, all sorts of different professionals) to help governments and associations fight this pandemic.

## Motivation

So, how did I start contributing to Helpful Engineering? Well, fortunately, I was still working full time as software engineer for xgeeks, but seeing the pandemic hitting hard and being unable to help anyone, I decided to investigate how I could help the Helpful Engineering effort with my software engineering skillset.

## Obstacles

First of all, let me give a big #kudos to the Helpful Engineering founders and initial contributors, they were able to create a really great and big (6000+ volunteers and 16000+ slack members) community out of the blue.

But with a big community and a recent birth there are a lot of challenges associated.

My first big question was:

> Where can I see what’s happening already?

After browsing a few channels (there were dozens at the time), I found a document where I found out the project proposals. Again, I was searching for software projects, since that’s my area of expertise. After browsing a few of them I found one that I identified myself with. At the time it was named “Neighbourhood Assistance” and it’s now known by “[Reach4Help](https://reach4help.org/)”.

<div style="text-align:center">
    <img src="https://miro.medium.com/v2/resize:fit:574/format:webp/1*zwlAXpsbNB2ON3lTNm3qAw.png" height="100" width="100"/>
</div>

> The project proposal described that we were meant to build a platform where people could register to either help or be helped with several kinds of requests.

Now that I had found a project that I wanted to help with, enters the second obstacle:

> How can I actually help?

The slack channel at the time was full of people sharing their ideas and their vision for the project. The members of the channel dedicated to the project were also from very different timezones which also meant that when you went to sleep, in the next morning you could have hundreds of messages to catch up with the discussion.

One thing that I tried to do was to keep active, up to date with recent messages and trying to identify people that were active more than one day.

> The first lesson that I learned is that people are quick to flee when they find a messy environment.

Of course no-one likes to enter a slack channel where there are no clear project leads, people are throwing their ideas left and right, no unique vision for the project and so on, BUT you need to remember a couple of things:

- Most people are volunteers, this is not their full time job and they are there only with the will to help others.
- The project proposal and channel at the time only had a couple of days of existence, there was no real time to organize well.

Another thing I learned is that there are lots of types of people that are willing to contribute to these projects. Some want to actively shape the product, others just want to know what tasks they need to do and do them.

The latter are also important and we were risking losing some of these people since we still didn’t have anything palpable, while other projects already had something they could actually do.

After a couple of days there were project leads defined, Pedro Filipe and Shayan Chowdhury, this started to help in the organization of the channel and project and also in the definition of tasks.

## Quick vs Planned

Given this scenario, the second challenge that I found was the balance between the common paradox in software development “quick vs planned”. People were discussing a lot of ideas, but we were running against the clock. So I devised a simple frontend with the help of a friend Luis Oliveira, using recent technologies in order to simulate a possible UI for the platform.

This was never supposed to be the final product or even the initial product. It served a bigger purpose:

> To help shift the mind of the people in the channel to a more MVP approach.

After this we started organising teams inside the project and leads for each team. I got the frontend lead role at the time and started organising the team. At the same time other teams started organising and we started having a real project: We had a board, meetings for product vision, an organised repo at github https://github.com/reach4help/reach4help and we started getting a small core that could move things forward.

## Product Problems

With the small core formed, the product vision was very debated.

I’m all for an MVP approach, we first define the minimum features that we need to provide to the platform in order to be a functioning one, and we release it. Then we go iterating over and over adding new features that complement and add value to the platform.

There were lots of discussions regarding what the MVP should be and this leads to the third lesson learned from all this:

> People from different countries with different work and social realities can have difficulties getting an alignment on what to do and how much to do for an MVP.

I was all for a simple MVP, but at the same time we were dealing with a lot of legal issues that we needed to take care of that went against this simple MVP approach. Lots of initial work added was due to legal protection for the platform now and in the future.

Finally, we decided on what kind of features we should ship in the MVP and went with it.

Another important lesson especially important when working with people you didn’t know before:

> It’s important to compromise, even if it means going back on something you really believe could be better for the product. This will help keep the morale higher for the team and you can always refactor later.

## Contributors

Another challenge in these projects is member retention. It’s hard to keep a consistent team working throughout the different phases of the project. Mainly because people have other responsibilities and they don’t always have the time they need in order to contribute.

So it’s doubly important to keep a clean, organised and well divided project board for people that have little time to contribute, to still be able to.

This will allow the project to leverage the power of the community, which is immense!

## Mental stability

Another lesson learned was regarding the amount of work I could tolerate. And that ultimately led to me having to leave the project after about a month of contributions.

It’s important for you to know yourself, and know how much time you can contribute to volunteer work while keeping you regular work/life balance/mental state in check.

Punch line is:

> Contribute the best you can to the causes you care about, but don’t forget to keep yourself healthy and mentally sane.

## Tips for leads

There’s a few things I can say to help leads that are helping out volunteer projects in early stages:

- Organise a team you can rely on. As a lead you’ll probably have little time to code, so others will need to take that mantle. In my case it was easy since [xgeeks](https://xgeeks.io) provided people to help full time in the project and I knew I could rely in them.
- Keep in sync with the leads from the other teams. One of the most important things to remember is that every team is creating the same product. So keep aligned on what your team is doing and what the other teams are doing, to see if it makes sense, or if your team should be putting their efforts in other tasks.
- Rely on kanban or other non sprint methodologies to develop the product (I’m not even factoring waterfall style methodologies). No one will be able to get the commitment required to have sprints, and kanban is best suited to projects where anyone can go, pick up a task, create a PR and go on with their lives.
- Keep a well organised project board and break down tasks as granularly as you can. This will help benefit from the general open-source community, since they will be able to scope much better what they need to do in order to close that task/ticket. Keep the priority tickets at the top and do this regularly! This way your team doesn’t need to worry about “what will I do next”, which in turn saves time.
- Keep an MVP mind, and try to reduce time to market as much as possible. Focus on what is really necessary and do only that. Additional features can come later when the product is already shipped (this is especially important when fighting against a fast spreading pandemic). This mentality will also help better focus development efforts where they count the most.

## Conclusion

The whole process of involving myself in a volunteer cause was very rewarding, I met and worked with really great people and I really was able to see the power that a community driven project has. For all the mess it may be in the start, with time, a community driven project has all the potential to be a real high quality project both in management and execution.

I hope I shared a few new perspectives for you while reading my story, and feel free to drop any comments! 🙂

If you find this article interesting, please share it, because you know — Sharing is caring!
