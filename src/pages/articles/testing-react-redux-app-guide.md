---
layout: '@/templates/BasePost.astro'
title: Testing a React & Redux app — a comprehensive guide (part 1)
description: These series of posts will, hopefully, give you a good overview and examples on how you can do unit and integration tests for a react & redux app, using Jest and Enzyme.
pubDate: 2019-06-26T00:00:00Z
imgSrc: '/assets/images/article-test-react.jpeg?nf_resize=fit&w=1080&h=720'
imgAlt: 'Article image'
---

These series of posts will, hopefully, give you a good overview and examples on how you can do unit and integration tests for a react & redux app, using [Jest](https://jestjs.io/) and [Enzyme](https://airbnb.io/enzyme/).

The series will be split into 4 parts:

_Part 1_ — Introduction to tests (theory) & first real world practical example: a filterable table with setup instructions & without redux

_Part 2_ — Second real world practical example: a _product form_ without redux

_Part 3_ — Third real world practical example: a _wizard_ with redux

_Part 4_ — Fourth real world practical example: a _timeline_ with redux

## TL;DR

If you already know the theory behind the kinds of tests that exist and the difference between them, then skip straight to the _“Show me the good stuff”_ section for some practical examples of using _Jest_ and _Enzyme_ to perform unit and integration tests in React & Redux.

---

First of all, I hope we all agree that to develop software nowadays, testing is a fundamental part of the process. Now, I’m not saying it’s the most important part, or that it should be the first thing you do (e.g. TDD or Test Driven Development), because each software is different and has different needs, but it should definitely be well implemented and thought of in your software development process.

So, without further ado, what is this about unit testing and integration testing? Are there more types of testing? Which types of testing should I do for my application? How do I test my app? These are all valid questions, and questions that are asked several times by many software developers. I’ll try to do a brief introduction for this and clarify some concepts.

So to test our app, we can do several types of tests, like we can see in the well known testing pyramid:

![img](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*MCV9_S_Yyr56S9b9UrzXKw.png)

> Its essential point is that you should have many more low-level UnitTests than high level BroadStackTests running through a GUI. — Martin Fowler
 
This pyramid illustrates the use of 3 different kinds of well known types of tests, namely, unit testing, integration (service layer) testing and end-to-end (UI layer) testing.

Regarding unit testing we can define it as such:

> UNIT TESTING is a level of software testing where individual units/components of a software are tested. The purpose is to validate that each unit of the software performs as designed.

Basically it’s the lowest level tests we’ll have in our testing suite and will test if very small parts of our code are working as expected. It’s expected that unit tests will be your most powerful “testing force”, covering the most part of your code and being invaluable for regression testing (testing everything again after performing a change to the software). For example, if we have a function “sum” that sums two numbers, some possible unit tests for that would be something like:

```js
import { sumTwoNumbers } from 'sum2';

test('sumTwoNumbers correctly sums 2 numbers', () => {
  const result = sumTwoNumbers(2, 5);
  expect(result).toBe(7);
});

test('sumTwoNumbers correctly handles invalid arguments', () => {
  let result, exception;
  try {
    result = sumTwoNumbers('ABD', 2);
  } catch(exception) {
    exception = exception;
  }
  expect(result).toBe(null);
  expect(exception).toBeDefined();
});
```

---

Now, let us pass to integration testing i.e. the service layer of the pyramid.

> INTEGRATION TESTING is a level of software testing where individual units are combined and tested as a group. The purpose of this level of testing is to expose faults in the interaction between integrated units.

At this point you might be wondering “Well, ok, it tests an integration between two small components for example. But how does that apply to react?”, and I answer: Each component defined in React is an individual piece of the system and by testing communication and interaction between two different components we are technically performing integration testing.

As the second layer, it’s expected for there to be a good number of integration tests, but not as many as unit tests, at least, in theory.

Let’s analyse the following app case and then create an integration test for it:

```js
import React, { Component } from 'react';
import Select from 'react-select';

export const dummyDataForProducts = [
    { value: 'bananas', label: 'Bananas' },
    { value: 'strawberries', label: 'Strawberries' },
    { value: 'milk', label: 'Milk' },
    { value: 'chocolate', label: 'Chocolate' },
];

export const dummyDataForPencils = [
    { value: 'blue', label: 'Blue' },
    { value: 'black', label: 'Black' },
    { value: 'yellow', label: 'Yellow' },
    { value: 'red', label: 'Red' },
    { value: 'orange', label: 'Orange' },
    { value: 'gray', label: 'Gray' },
];

const fetchDummyData = (dataUrl) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(
            dataUrl === 'products' ? dummyDataForProducts : dummyDataForPencils
        ), 1000);
    });
};

class FormSelect extends Component {
    state = {
        options: [],
    };

    onMenuOpen = async () => {
        const { dataUrl } = this.props;

        const options = await fetchDummyData(dataUrl);
        this.setState({ options });
    };

    render() {
        const { options } = this.state;
        const { onChange, className } = this.props;

        return (
            <Select
                options={options}
                onChange={onChange}
                className={className}
                onMenuOpen={this.onMenuOpen}
            />
        );
    }
}

class Form extends Component {
    state = {
        product: null,
        pencil: null
    };

    onSelectChange = (prop, { value }) => this.setState({ [prop]: value });

    onFormSubmit = () => {
        console.log('Submit these items to server', this.state);
    };

    render() {
        return (
            <div>
                <FormSelect
                    className="products-select"
                    onChange={value => this.onSelectChange('product', value)}
                    dataUrl="products"
                />
                <FormSelect
                    className="pencils-select"
                    onChange={value => this.onSelectChange('pencil', value)}
                    dataUrl="pencils"
                />
                <button onClick={this.onFormSubmit}>
                    Submit
                </button>
            </div>
        );
    }
}
```

Given something like these two components, how could we perform integration testing on them?

```js
import React from 'react';
import { mount } from 'enzyme';

test('correctly loads products and selects a product', () => {
    // mount component in deep mode to render itself and children
    const wrapper = mount(<App />);
    // the wrapper should be mounted
    expect(wrapper.isEmptyRender()).toBe(false);

    // simulate an open of the products select
    simulateKeyDown(wrapper.find('.Select-control').at(0), 40);

    /*
    * because enzyme cannot detect setState's that are made inside the mounted
    * component, we need to populate the select like the component itself does
    * see here: https://github.com/airbnb/enzyme/issues/1543#issuecomment-494981226
    */
    const productSelect = wrapper.find('FormSelect').at(0);
    setProductSelectOptions(productSelect);

    // expect that the options menu is open and that it has the same number of options as products
    expect(wrapper.find('.Select-menu-outer').length).toBe(1);
    expect(wrapper.find('div.Select-option').length).toBe(dummyDataForProducts.length);

    // check to see if the options in the menu are the same as the products
    const optionNodes = wrapper.find('div.Select-option p');
    validateProductOptionNodes(optionNodes);

    // select a product from the select and validate the final state of the form
    productSelect.prop('onChange')(dummyDataForProducts[1]);
    validateFormFinalState(wrapper, { product: 'strawberries', pencil: null });
});

const simulateKeyDown = (node, keyCode) => {
    node.simulate('keydown', { keyCode });
};

const setProductSelectOptions = (node) => {
    node.setState({
        options: dummyDataForProducts,
    }, () => node.update());
};

const validateProductOptionNodes = (nodes) => {
    nodes.forEach((pNode) => {
        expect(dummyDataForProducts.includes(pNode.text())).toBe(true);
    });
};

const validateFormFinalState = (wrapper, desiredState) => {
    expect(wrapper.find('Form').instance().state).toEqual(desiredState);
};
```

So, this is a possible integration test on the previous study case we presented. It’s a super simple example, so nothing too fancy until now.

---

Now for the top layer of the pyramid, the end-to-end tests.

> END-TO-END TESTING is a Software testing methodology to test an application flow from start to end. The purpose of end-to-end testing is to simulate the real user scenario and validate the system under test and its components for integration and data integrity.

These tests are in smaller number, take much longer to execute and have a different purpose than the previous tests until now. These kind of tests simulate how the end user interacts with the system (hence end-to-end).

It usually involves simulating clicks, key presses, waiting for elements to appear on screen and validating if everything is according to the coded flow of the application. By testing the flow of the app vs the code itself, end-to-end tests validate the results of the system as a whole.

As end-to-end tests are out of the scope of this article, I won’t give any study cases or test examples, but if you really want to hear more about them please drop me a message in the comments below and I can write another article on it 😉.

Let’s keep in mind that these types of tests are not the only types of tests that exist! There are more test classifications, but I’m only going to cover these, for simplicity and pragmatism, since these are VERY important.

The testing side of a project is a world, there is so much material, so many frameworks and tools that it’s impossible to cover everything in a single article (or even in a series of articles).

Now that the boring part is out of the way, let’s dive in to some practical examples.

---

## Show me the good stuff

Each project has its own different needs, which in turn have their own test quirks and particularities.

We’ll not be working on a full-fledged project as a case study, instead we will be working on different specific real world needs that may arise during your own projects.

### Test setup with jest and enzyme

Let’s cover the setup part of this with two different cases. One that uses the [create-react-app](https://facebook.github.io/create-react-app/) cli tool and other that does not use it and was created in a different way.

#### With create-react-app

First, let’s install the cli tool in our system:

```shell
npm i -g create-react-app
```

Then we can create a new test project with:

```shell
npx create-react-app test_project (requires npm@5.2.0)

cd test_project
```

At the time of writing, create-react-app ships with React@16.x.

So, in a create-react-app project we already have jest installed, which is great! Now we just need to install enzyme in the project (use yarn or npm as you wish). There’s a twist here for enzyme to work out of the box with our project, we also need to install the correct enzyme adapter and configure it:

```shell
npm i --save-dev enzyme enzyme-adapter-react-16
```

The enzyme-adapter-react-16 part may vary depending on if you’re using React@15.x or other. You just need to change the last part to enzyme-adapter-react-15.x for example.

So, in the projects created now by create-react-app we can configure our test setup in a file that jest will search for automatically. It will search for a _setupTests.js_ in the _src_ directory of the project.

Basic setup for enzyme to work in our tests (_setupTests.js_ file):

```js
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
```

So now we can do some tests at will with both jest and enzyme! :)

#### Without create-react-app

Let’s install what we need to create our tests in a React project not created with the previous tool.

```shell
yarn add --dev jest babel-jest enzyme enzyme-adapter-react-16
```

In our project’s _package.json_ we can configure jest options like the following:

```json
{
  "jest": {
    "testPathIgnorePatterns": [
      "vendor/*",
      "node_modules/*"
    ],
    "setupFilesAfterEnv": [
      "./__tests_setup__/test_setup.js"
    ],
    "moduleNameMapper": {
      "^.+\\.(css|less|scss)$": "babel-jest"
    }
  }
}
```

On line 3, this option is to ignore test cases found in the directories defined (vendor/* and node_modules/* in this case).

On line 7 this is the setup file for our tests or entry point, and can be named whatever you want. It’s where our test setup is defined (adapter for enzyme and other global variables needed for testing).

On line 10 we can see the reason why we installed babel-jest. It’s for the case when we use components that imported css, less or sass files, and this way we make jest accept these kind of files.

This makes a basic setup for our tests, in order for jest to have what it needs to work. There are many more options, and we will cover some cases where most probably we will need to further customise it.

So now we can do some tests if we used the create-react-app cli tool to create our project or not!

#### A quick note

> Jest ships with a kind of tests that are called [snapshots](https://jestjs.io/docs/en/snapshot-testing), but be careful with this. Snapshot tests are basically tests that record the final result (or state) of a test and, if in the future while running the same test, the final result is different from what was recorded previously, then something happened, but not necessarily a bad thing. This is particularly useful for regression testing when adding new features to the platform or changing existing features, but it doesn’t actually test the components and integration. It just compares the states.

So the question is if you should use them right? In my opinion you should definitely use them IF the project already has some solid features done, which you don’t think will change regularly. Snapshot testing is very useful in more mature projects, but if you are starting a project from scratch and you want to do meaningful tests, then you should avoid them at the start. This is due to the fact that when you are starting a project from scratch things will change A LOT and if you are always rewriting the snapshot test results, you are basically doing nothing to assure code quality. So keep this is mind when thinking of using snapshot tests.

---

### Study case 1 — Filterable table

Let’s create a use case where we have a table of todos, and these todos can be filtered. The todos have two fields that are relevant to us: the title and the status (completed or not). We will be able to filter the results of our list by the status attribute. Besides this, we will also be able to choose the number of results per page we want in our table and also navigate between table pages by selecting the page we want.

Since this example is a bit bigger than previous ones, I ask you that you clone this repo or view it on GitHub: https://github.com/comoser/test-article-filterable-table, so you can actually run it locally and see exactly what it does.

If you don’t want to run it locally or you just need to quickly check the project, you can visit it live in here: https://test-article-filterable-table.herokuapp.com.

If you check out the source code, you can find all the tests done for the app under the __tests__ directory.

#### Unit Tests

In the example app given we can verify some unit tests for the more atomic components, and we can analyse the unit tests done for the number_of_results_picker.js component.

The NumberOfResultsPerPage component is responsible for determining how many results we have in our table per page. It has three possible values: 10, 50 and 100. It is a select like component. Here are the unit tests for this component:

```js
import React from 'react';
import { mount } from 'enzyme';

import { NumberOfResultsPicker, OPTIONS } from '../number_of_results_picker';
import { DEFAULT_NUMBER_OF_RESULTS } from '../../common/api';
import { callPropFunctionOnComponent } from '../../setupTests';

describe('NumberOfResultsPicker component validation', () => {
    let component = null;

    beforeEach(() => {
        component = mount(
            <NumberOfResultsPicker
                resultsPerPage={DEFAULT_NUMBER_OF_RESULTS}
                onResultsPerPageChange={() => {}}
            />
        );
    });

    test('it renders correctly', () => {
        expect(component.isEmptyRender()).toBe(false);
        expect(component.find('div.nor__single-value').text()).toBe(String(DEFAULT_NUMBER_OF_RESULTS));
    });

    test('it renders the 3 available options of number of results per page when pressed', () => {
        component.find('div.nor__dropdown-indicator').simulate('mouseDown', { button: 0 });
        expect(component.find('div.nor__option').length).toBe(3);
        const pNodes = component.find('div.nor__option');
        pNodes.forEach((pNode) => {
            expect(
                OPTIONS
                    .map(({ value }) => value)
                    .includes(Number(pNode.text()))
            ).toBe(true);
        });
    });

    test('it changes the number of results per page correctly', () => {
        component.setProps({
            onResultsPerPageChange: (resultsPerPage) => {
                component.setProps({ resultsPerPage });
            }
        });
        expect(component.find('div.nor__single-value').text()).toBe(String(DEFAULT_NUMBER_OF_RESULTS));
        callPropFunctionOnComponent(component, 'onResultsPerPageChange', [50]);
        expect(component.find('div.nor__single-value').text()).toBe('50');
    });
});
```

```js
const callPropFunctionOnComponent = (component, propName, paramsArray) => {
    if (component.prop(propName)) {
        component.prop(propName)(...paramsArray);
    }
};
```

So, first of all on line 8 we are describing the suite of tests and naming it, in order for our tests to be logically placed inside a “container”. To create one of these containers you just need to call the describe function and use it as it is in the example. These containers allow us to not only logically group tests, but also to have access to optional methods, like beforeEach, afterEach, beforeAll, afterAll that will only affect the tests in the container’s scope.

On line 11 we are describing the beforeEach function which will run before each test will run, so it’s a good place to put some variables you wish to reset at every test run in the suite. In this function we are calling our component NumberOfResultsPicker and passing our desired props.

> One thing to notice in jest is that it’s not a browser testing environment. It’s a headless node testing environment, so enzyme is not capable of receiving some “events” that happen in react. For instance, you may have a checkbox component, that when you click it, it will change a property in the component’s internal state. But even if you manage to trigger the correct event with the simulate function of enzyme, enzyme has no way of knowing that the internal state of the react component has changed, rendering the rest of the possible test useless. So what I suggest in this case is to simulate the change that the event callback would do, but explicitly. You can see this case in line 45 of the above gist. There are several discussions of this in enzyme’s GitHub, but one of the comments is this one: https://github.com/airbnb/enzyme/issues/1543#issuecomment-494981226.

On line 20 we specify the first real test, with the test function. It also takes a name parameter, which allows us to identify the specific test when running the whole suite. On our first two tests, we do fairly simple stuff, just making sure the correct html elements are there, that the classes are ok, and that the options of the select are the correct ones when the select is open.

On line 38 we can find our third test of this suite, and this one has a bit more interest than the previous ones. We define our callback that is received by prop, which is called onResultsPerPageChange and we are simulating what it would do if called like it is defined in the actual react component. This allows us to test the component correctly without changing logic. After changing the number of results per page, we are checking if the correct value is then set in the select component.

In the React context I consider these kinds of tests to be unitary like we previously saw in the theory part, since we are testing the functionality and correctness of our most granular and atomic components on the app.

#### Integration Tests

In our app we have a top level component called FilterableList which calls our Filters component and our List component. In turn, our List component calls both the Pagination and the NumberOfResultsPicker components. So to present an example of integration tests, what better example than the FilterableList component which integrates 4 different components?

```js
import React from 'react';
import { mount } from 'enzyme';

import { DEFAULT_NUMBER_OF_RESULTS } from '../../common/api';
import { FilterableList } from '../index';
import { setInternalStateOnComponent } from '../../setupTests';

const PAGES = {
    1: [
        {
            id: 1,
            title: 'Title 1',
            completed: true,
        },
        {
            id: 2,
            title: 'Title 2',
            completed: false,
        },
        {
            id: 3,
            title: 'Title 3',
            completed: true,
        },
        {
            id: 4,
            title: 'Title 4',
            completed: true,
        },
        {
            id: 5,
            title: 'Title 5',
            completed: false,
        },
        {
            id: 6,
            title: 'Title 6',
            completed: false,
        },
        {
            id: 7,
            title: 'Title 7',
            completed: false,
        },
        {
            id: 8,
            title: 'Title 8',
            completed: true,
        },
        {
            id: 9,
            title: 'Title 9',
            completed: true,
        },
        {
            id: 10,
            title: 'Title 10',
            completed: true,
        },
    ],
    2: [
        {
            id: 11,
            title: 'Title 11',
            completed: true,
        },
        {
            id: 12,
            title: 'Title 12',
            completed: false,
        },
        {
            id: 13,
            title: 'Title 13',
            completed: true,
        },
        {
            id: 14,
            title: 'Title 14',
            completed: true,
        },
        {
            id: 15,
            title: 'Title 15',
            completed: false,
        },
        {
            id: 16,
            title: 'Title 16',
            completed: false,
        },
        {
            id: 17,
            title: 'Title 17',
            completed: false,
        },
        {
            id: 18,
            title: 'Title 18',
            completed: true,
        },
        {
            id: 19,
            title: 'Title 19',
            completed: true,
        },
        {
            id: 20,
            title: 'Title 20',
            completed: true,
        },
    ],
    3: [
        {
            id: 21,
            title: 'Title 21',
            completed: true,
        },
        {
            id: 22,
            title: 'Title 22',
            completed: false,
        },
        {
            id: 23,
            title: 'Title 23',
            completed: true,
        },
        {
            id: 24,
            title: 'Title 24',
            completed: true,
        },
        {
            id: 25,
            title: 'Title 25',
            completed: false,
        },
        {
            id: 26,
            title: 'Title 26',
            completed: false,
        },
        {
            id: 27,
            title: 'Title 27',
            completed: false,
        },
        {
            id: 28,
            title: 'Title 28',
            completed: true,
        },
        {
            id: 29,
            title: 'Title 29',
            completed: true,
        },
        {
            id: 30,
            title: 'Title 30',
            completed: true,
        },
    ],
};

describe('FilterableList component validation', () => {
    let component = null;

    beforeEach(() => {
        component = mount(<FilterableList />);
        setInternalStateOnComponent(component, {
            todos: PAGES[1],
            totalResults: 30,
        });
    });

    test('it renders correctly', () => {
        expect(component.isEmptyRender()).toBe(false);
        expect(component.find('input#complete').length).toBe(1);
        expect(component.find('input#incomplete').length).toBe(1);
        expect(component.find('.list .list-item h3').length).toBe(10);
        expect(component.find('a.page-btn').length).toBe(3);
        expect(component.find('div.nor__single-value').text()).toBe(String(DEFAULT_NUMBER_OF_RESULTS));
    });

    test('it changes the results according to the selected filters', () => {
        let listItemNodesStatus = component.find('.list .list-item p');
        let joinedStatus = '';
        listItemNodesStatus.forEach((pNode) => {
            joinedStatus += `${pNode.text()}, `;
        });
        expect(joinedStatus.includes('COMPLETED') && joinedStatus.includes('NOT COMPLETED')).toBe(true);
        setInternalStateOnComponent(
            component,
            {
                completeFilter: true,
                incompleteCheckboxValue: false,
                todos: PAGES[1].filter(todo => todo.completed === true),
            }
        );
        listItemNodesStatus = component.find('.list .list-item p');
        joinedStatus = '';
        listItemNodesStatus.forEach((pNode) => {
            joinedStatus += `${pNode.text()}, `;
        });
        expect(joinedStatus.includes('NOT COMPLETED')).toBe(false);
        expect(joinedStatus.includes('COMPLETED')).toBe(true);
    });

    test('it changes results per page correctly', () => {
        expect(component.find('a.page-btn').length).toBe(3);
        expect(component.find('div.nor__single-value').text()).toBe(String(DEFAULT_NUMBER_OF_RESULTS));
        expect(component.find('.list .list-item h3').length).toBe(10);
        setInternalStateOnComponent(
            component,
            {
                todos: [...PAGES[1], ...PAGES[2], ...PAGES[3]],
                resultsPerPage: 50,
            }
        );
        expect(component.find('a.page-btn').length).toBe(1);
        expect(component.find('div.nor__single-value').text()).toBe('50');
        expect(component.find('.list .list-item h3').length).toBe(30);
    });

    test('it changes page number correctly', () => {
        expect(component.find('a.page-btn').at(0).html().includes('active')).toBe(true);
        expect(component.find('.list .list-item h3').at(0).text()).toBe('Title 1');
        setInternalStateOnComponent(
            component,
            {
                todos: PAGES[2],
                currentPage: 2,
            }
        );
        expect(component.find('a.page-btn').at(0).html().includes('active')).toBe(false);
        expect(component.find('a.page-btn').at(1).html().includes('active')).toBe(true);
        expect(component.find('.list .list-item h3').at(0).text()).toBe('Title 11');
        setInternalStateOnComponent(
            component,
            {
                todos: PAGES[3],
                currentPage: 3,
            }
        );
        expect(component.find('a.page-btn').at(0).html().includes('active')).toBe(false);
        expect(component.find('a.page-btn').at(1).html().includes('active')).toBe(false);
        expect(component.find('a.page-btn').at(2).html().includes('active')).toBe(true);
        expect(component.find('.list .list-item h3').at(1).text()).toBe('Title 22');
    });
});
```

On line 8 we are declaring the dummy content of 3 different pages, so we can simulate the pages being changed. In total there are 30 results, and the default results per page are 10.

On our second test starting on line 187 we are testing if by changing the filters on the table, if the results reflect that change.

We start by confirming that the list items in the table by default have both the completed and not completed status present (since the filters are on by default). Then we simulate the change of the filter to only see the todos that are completed. In this simulation we need to perform the change that our API would return (the filtered result), and we do this by doing PAGES[1].filter(todo => todo.completed === true) . After this change we confirm that the list items indeed only have the completed status present in them, and thus verify that the integration between the list and the filters is working correctly.

We follow the same kind of logic for the remaining tests of the component, which will verify all the integrations between the involving components.

## Conclusion

This is the first part of a 4 part series of articles regarding testing in a React & Redux app, so stay tuned for the next parts 😉.

Hopefully this first part will help you understand both the theory and the practical part of doing tests in an app, and it can really help you even in an enterprise grade application.

There are several more tests that could be done for this example app, the point here is not to do exhaustive testing, but to do some of the most usual and common cases in real world examples so that you can have a base for testing in your own app.

I would love your feedback 🙂
If you find this article interesting, please share it because you know — Sharing is caring!
