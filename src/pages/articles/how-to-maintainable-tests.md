---
layout: '@/templates/BasePost.astro'
title: How to... Maintainable tests
description: An approach to acceptance testing your project with NodeJS. This article will cover what you should test and what you should not test. Testing is an art, and it's not easy to get it right.
pubDate: 2022-09-09T00:00:00Z
imgSrc: '/assets/images/article-maintainable-tests.jpeg?nf_resize=fit&w=1080&h=720'
imgAlt: 'Article image'
---

I recently worked on a NodeJs project where the team had a well-defined development process and today I’m going to share a small part of that process and how it connects with testing your application in a very maintainable way.

This whole thing will be exemplified with NodeJs, but it can honestly be applied in any language, so don’t feel limited by the title.

## Team Workflow

To provide context, the team worked with an agile methodology (doesn’t really matter which one), and there were a couple of ceremonies that helped define a well-oiled development flow, namely the _power-of-x_ and the _grooming_.

At some point in time, a new feature would come up and there would be a senior engineer that together with the product manager would slice, at a very high level, the stories that would need to be done. At a regular interval, the power-of-x session would take place and in that session, the product manager would join with the senior engineer and a designer, in order to fully define the task and what criteria would be enough for the team to declare the story done. To these criteria that would be assigned to a story, we called _acceptance criteria_.

Then, also at a regular interval, we had a grooming session where the whole team would discuss these stories and clarify any and every doubt involving them.

Then, and only then, would these stories be added to our backlog of stories to be done. There are a lot more ceremonies that the team did, but for the purpose of the article, these are the most relevant ones.

## Testing approach

The team followed a [test-driven-development](https://www.agilealliance.org/glossary/tdd/#q=~(infinite~false~filters~(postType~(~'page~'post~'aa_book~'aa_event_session~'aa_experience_report~'aa_glossary~'aa_research_paper~'aa_video)~tags~(~'tdd))~searchTerm~'~sort~false~sortDirection~'asc~page~1)) (TDD) approach and in order to cover our stories/features with tests, the acceptance tests we did were the most relevant ones. We also did more unitary tests that covered some components in an isolated manner, but those were not as meaningful.

The main purpose of our acceptance tests is to cover the core business and domain logic. We don’t test peripheral components at this layer (like the database connection or the s3 storage connection). Ultimately, what this means is that we mock everything around our business/domain layer.

Arguably, these kinds of tests are the most valuable in your application as they are the ones that validate your actual business. Many things may change that are more peripheral, like the database, the framework, and the storage service, but the business logic should stay solid and valid throughout these infrastructural changes.

In order to know which tests we should create, we simply looked to the acceptance criteria in the story and started coding one or more tests for that same criteria. This helps a lot in guiding what tests to write when tests are the first thing you do.

By writing clear and easily understandable acceptance test cases, you might be making life easier for new engineers onboarding the team, as they can actually read those tests and understand what a feature should do under all the tested circumstances. This is especially useful in codebases that are quite large and have grown over time to have more legacy components.

## Testing tooling

Because these were the most meaningful tests that we wrote, we needed them to be perfectly clear, readable, and maintainable.

To achieve this, we decided to borrow a bit of the [Gherkin](https://cucumber.io/docs/gherkin/) language from [Cucumber](https://cucumber.io/), which helps us write tests in plain English. Cucumber was originally for Java, but we can easily adapt the mindset to any other language. Nowadays it supports Java, Javascript, Ruby, Kotlin, and Scala. We basically borrowed the syntax and adapted it to our NodeJs use case but without the overhead of using the cucumber JS library.

Example:

```jsx
test("Customer should be able to update their profile basic information", async () => {
  givenTheCustomerExists();
  givenTheCustomerWantsToChangeTheirProfileInformationWithValidData();
  
  await whenTheCustomerSubmitsAProfileInformationUpdateRequest();
  
  thenTheCustomerProfileIsUpdated();
  thenTheAPIReturns(HTTP_STATUS_CODES.OK);
});

const givenTheCustomerExists = () => {
  // prepare a mock from the database that returns an existing customer
};

const givenTheCustomerWantsToChangeTheirProfileInformationWithValidData = () => {
  // prepare the request body for the actual API request with valid data
};

const whenTheCustomerSubmitsAProfileInformationUpdateRequest = async () => {
  // actually call you API handler code to execute you domain and business logic
};

const thenTheCustomerProfileIsUpdated = () => {
  // assess that the request to update the database (most likely through a service or repository) is called with the correct data
};

const thenTheAPIReturns = (statusCode) => {
  // assess that the API returns the HTTP status code that it should
  // you could also check the response body in case it makes sense for the request
};
```

This seems a bit long, but ignore for a bit the helper methods and focus on the actual test case, it’s short, it’s highly readable, and it’s easily understandable. These are all the qualities that you want to have for maintainable tests.

To further expand on the test, I’ll explain the purpose of the different syntaxes that are used.

- _given_: The purpose of the givens is to set the stage for what’s going to happen. If you’re on an API, you probably want to mock a response from the DB, or maybe mock a response from a repository. If you’re on a frontend application, maybe you want to mock a response that comes back from an API or prepare a mock file for a file upload.
- _when_: An actual action that’s going to happen. This will be the trigger for whatever you want to test. If you’re on an API, you want to call your API handler with the prepared data that comes from the givens. If you’re on a frontend application, maybe you want to trigger a file upload.
- _then_: Assertions for what has happened. After the trigger happens we need to check if what’s supposed to happen actually happened. If you’re on an API, you probably want to check that the database was updated successfully or that a repository has been called with certain information. If you’re on a frontend application, maybe you want to check that a new page has been shown to the user or maybe that some API endpoint has been called with certain information.

If you stick to the correct usage of the borrowed Gherkin syntax, you should be able to fit all your test cases and cover your whole domain and business logic.

## Conclusions

This wasn’t something that I had done before in my JS projects, but it was a practice that I found to give the team a lot of quality and reassurance that our stories were well implemented. Of course, this doesn’t depend only on the testing part, but also on the agile process itself. In the end, it’s something that I will probably try to implement and iterate on future projects.

This approach comes with a bit of a downside, in terms of “clutter” in your auxiliary methods. Your test scenario may grow a bit big quite easily. I don’t really see a way around this besides extracting all common behavior to reusable functions. That way, the auxiliary methods will stay very small in terms of lines of code.

If you do try it out, give me some feedback, and tell me if you saw an improvement in the development process as a whole, or if it’s something that you entirely would skip!

I hope you enjoyed it! 👐 Please leave your comments down below to stir up the discussion!

If you find this article interesting, please share it, because you know — Sharing is caring!

