---
layout: '@/templates/BasePost.astro'
title: Micro-Frontends at Scale (part 2)
description: Following the first article on the series, which describes the architectural choices in detail, this one will focus on implementing that architecture based on Micro-Frontends (MFEs) using Module Federation.
pubDate: 2021-03-02T00:00:00Z
imgSrc: '/assets/images/article-mfe-2.jpeg?nf_resize=fit&w=1080&h=720'
imgAlt: 'Article image'
---

Following the [first article](https://medium.com/xgeeks/micro-frontends-at-scale-part-1-a8ab67bfb773) on the series, which describes the architectural choices in detail, this one will focus on implementing that architecture based on Micro-Frontends (MFEs) using Module Federation. By the end of the article, we’ll have created and discussed an open sourced solution that keeps the UX feeling of a Single Page Application to the customer while letting independent teams work on different products.

## An overview 👀

The business we’re going to simulate is a clothes marketplace. It has what you can usually find in an ecommerce store: a list of items, item details, checkout and a blog (the blog is not that common, but it fits the theme).

This is what our clothes shop looks like:

![img](https://miro.medium.com/v2/resize:fit:2000/format:webp/1*8BqSyQ12HI3Td6MfKLPzoA.png)

We are going to follow along with [this GitHub repository](https://github.com/comoser/clothes-store-micro-frontends) and also a few gists, so we have small snippets of code representing the implementation steps.

The project does not have a CI/CD configured and it’s not deployed anywhere. We are going to cover deployment and changes needed for that in another article on the series.

For now, we can run the solution locally, both in `development` and `production` environments.

The project also doesn’t have a proper state management solution. This will be covered in a future article.

### Architecture

The architectural choices and discussion for this solution are present in the [first article of the series](https://medium.com/xgeeks/micro-frontends-at-scale-part-1-a8ab67bfb773), so be sure to check it out. In summary, here is the diagram we’re going to implement throughout this article:

![img](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*wmffR3b3dTCqH8IF38vv9w.jpeg)

If this diagram brings up any doubts or questions, please read the [first article on the series](https://medium.com/xgeeks/micro-frontends-at-scale-part-1-a8ab67bfb773), which dives in great detail on the architecture of the solution.

## Implementation 💡

### Initial Setup

In the root folder, we have our main `package.json` file, which will be responsible for running our orchestration commands and hold the configuration for `yarn workspaces`.

```json
{
  "name": "clothes-store-micro-frontends",
  "version": "1.0.0",
  "private": true,
  "repository": "git@github.com:comoser/clothes-store-micro-frontends.git",
  "author": "David Alecrim <david.alecrim1@gmail.com>",
  "license": "MIT",
  "workspaces": {
    "packages": [
      "products/*"
    ]
  },
  "scripts": {
    "start": "concurrently \"wsrun --parallel start\"",
    "start:live": "concurrently \"wsrun --parallel start:live\"",
    "build:all": "concurrently \"wsrun --parallel build\"",
    "serve:all": "concurrently \"wsrun --parallel serve -s\"",
    "build:serve:all": "yarn run build:all && yarn run serve:all"
  },
  "devDependencies": {
    "concurrently": "^5.3.0",
    "lerna": "^3.22.1",
    "rimraf": "^3.0.2",
    "wsrun": "^5.2.4"
  }
}
```

Basically, we’re telling yarn that our workspaces will be all the folders inside the folder `products`, which in this case are:

- app_shell
- items
- checkout
- shared
- blog

> Note: yarn workspaces will require you to have a private: true property on the root level package.json, in order to manage the different MFEs dependencies correctly.

_Pro Tip_: yarn workspaces will try to hoist the dependencies of the MFEs to the root dependencies if possible. This works for most npm packages, but there may be a case where this doesn’t hold true. In those cases, you can specifically tell yarn to not hoist them, e.g.:

```json
"workspaces": {
  "packages": [
    "products/*"
  ],
  "nohoist": [
    "**/full-icu"
  ]
},
```

This way, the `full-icu` npm package will remain in each MFE `node_modules` folder.

We also leverage the `concurrently` and `wsrun` packages so that we can run in parallel our MFEs. The `start:live` script will be the goto command when developing, and to test the solution in production, the `build:serve:all` will be our choice.

Then, in every MFE root folder, we will have a `package.json` with commands that will respond to the commands in the root level `package.json`.

```json
{
  "name": "app_shell",
  "version": "1.0.0",
  "license": "MIT",
  "scripts": {
    "build": "webpack --mode production",
    "build:dev": "webpack --mode development",
    "serve": "cd dist && PORT=3000 npx serve",
    "start": "webpack-dev-server --mode development",
    "start:live": "webpack-dev-server --mode development --liveReload"
  },
  (...)
}
```

Note that the ports defined are different for each MFE, starting in 3000 and ending in `3004`. You can find these ports for development purposes in the respective `webpack.config.js` files and for production in the respective `serve` commands.

Now that the initial setup is covered, let’s check the different MFE configurations.

### App Shell MFE

The webpack configuration file for every MFE has a section with a plugin called [ModuleFederationPlugin](https://webpack.js.org/concepts/module-federation/). This is the configuration that will let us take advantage of this new webpack feature.

```js
// (...)
new ModuleFederationPlugin({
  name: 'app_shell',
  remotes: {
    items: 'items@http://localhost:3001/remoteEntry.js',
    checkout: 'checkout@http://localhost:3002/remoteEntry.js',
    blog: 'blog@http://localhost:3003/remoteEntry.js',
    shared: 'shared@http://localhost:3004/remoteEntry.js',
  },
  shared: {
    ...deps,
    react: {
      singleton: true,
      requiredVersion: deps.react,
    },
    'react-dom': {
      singleton: true,
      requiredVersion: deps['react-dom'],
    },
    'react-router-dom': {
      singleton: true,
      requiredVersion: deps['react-router-dom'],
    },
  },
}),
// (...)
```

Starting with `line 3`, the `name` property is the unique identifier of the federated module (in our context, the federated module is always a MFE). When another MFE needs to reference this one, it will need to specify this unique `name`.

```js
remotes: {
  items: 'items@http://localhost:3001/remoteEntry.js',
  checkout: 'checkout@http://localhost:3002/remoteEntry.js',
  blog: 'blog@http://localhost:3003/remoteEntry.js',
  shared: 'shared@http://localhost:3004/remoteEntry.js',
},
```

On the above snippet (regarding the webpack.config.js), the `remotes` property is defined. This property decides what MFEs the current MFE requires. All the dependencies that the current MFE needs, will be imported at run-time from the defined remotes. In this case, like in the architectural diagram presented in the architecture section, we can verify that the App Shell is importing code from items, checkout, shared and blog.

> Note: If we take the example at line 5, the key in the remotes object is reference in this MFE to the remote. The string value of that key is what will enable the connection with another MFE.
>
> In this case, the “items” before the “@” is the name property of that MFE. The URL after the “@” matches the location where that MFE is deployed.

```js
shared: {
  ...deps,
  react: {
    singleton: true,
    requiredVersion: deps.react,
  },
  'react-dom': {
    singleton: true,
    requiredVersion: deps['react-dom'],
  },
  'react-router-dom': {
    singleton: true,
    requiredVersion: deps['react-router-dom'],
  },
},
```

On the code above, the `shared` property is defined. This configuration is really important and is the cause for a lot of problems when not configured properly. Let’s explore more on this topic.

#### The shared module federation property

The configuration presented in the gist contains a few interesting options.

The `...deps` object spread pulls all of the `dependencies` in `package.json`, which will automatically share all libraries defined in it. This is done in order to better manage dependencies.

Webpack will be able to verify if the application already has a dependency, and if it has, it won’t load it again. These verifications happen when importing code at run-time. Pay attention to the version of the dependency, because if it doesn’t match, webpack will load both versions.

The `singleton` property definition is also important to notice. It is used every time a dependency has internal state. Since, e.g. React and React-dom have internal state, by defining them as singletons, we are telling webpack that we never want to load two versions of this dependency.

This shared object configuration is the same in every MFE of the solution. Depending on the projects this object may differ a lot, so always make an effort to fine tune the `shared` property.

### Items MFE

The module federation configuration changes a bit in this MFE. It features two new properties not present in the App Shell MFE.

```js
// (...)
new ModuleFederationPlugin({
  name: 'items',
  filename: 'remoteEntry.js',
  remotes: {
    shared: 'shared@http://localhost:3004/remoteEntry.js',
  },
  exposes: {
    './Routes': './src/components/routes',
  },
  shared: {
    ...deps,
    react: {
      singleton: true,
      requiredVersion: deps.react,
    },
    'react-dom': {
      singleton: true,
      requiredVersion: deps['react-dom'],
    },
    'react-router-dom': {
      singleton: true,
      requiredVersion: deps['react-router-dom'],
    },
  },
}),
// (...)
```

The `filename` defines the name of the file that serves as a manifest for other MFEs. It has information describing the location of code that is exposed and a few other configurations. When a MFE exposes code for other MFEs to consume, the `filename` property is mandatory.

The `exposes` key defines the components or general code that is exposed by the current MFE. Everything that can be parsed by webpack can also be exposed in Module Federation (primitives, functions, objects, react components, etc).

#### Remote imports

The main mechanism to import MFEs at run-time is to import the routes of that MFE. This allows for the App Shell to serve as a single entry point to the platform and importing what the user needs from other MFEs on the fly. There are also cases where a component from a remote is needed and is imported directly, instead of using routing. The checkout is an example of this. It exposes its routes while also exposing a `CheckoutCart`, allowing the `navbar` in the App Shell to have a small checkout component.

<div style="text-align: center">
    <img src="https://miro.medium.com/v2/resize:fit:676/format:webp/1*uU2Zw6i4dNtY9sjmKrUlBA.png" height="120" width="200" />
</div>

This single entry point pattern allows the application to feel as a regular SPA to our customers, since when the user navigates to a route belonging to a specific MFE (e.g. items), it asynchronously loads those routes at run-time. While they are being fetched, it displays a loading message. After being loaded, they are cached by webpack. From that point onward, the user interactions under those routes (e.g. /items), are handled by the remotely imported MFE.

In the code snippet below, we can see how we are safely importing react components at run-time.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import Navbar from './components/navbar';
import AsyncLoader from './components/async_loader';
import GlobalState from './components/global_state';

const ItemRoutes = React.lazy(() => import('items/Routes'));
const CheckoutRoutes = React.lazy(() => import('checkout/Routes'));
const BlogRoutes = React.lazy(() => import('blog/Routes'));

ReactDOM.render(
  <Router>
    <GlobalState>
      {(itemsInCart, setItemsInCart, setNotification) => (
        <>
          <Navbar itemsInCart={itemsInCart} />
          <Switch>
            <Route path="/blog">
              <AsyncLoader>
                <BlogRoutes />
              </AsyncLoader>
            </Route>
            <Route path="/checkout">
              <AsyncLoader>
                <CheckoutRoutes
                  itemsInCart={itemsInCart}
                  setItemsInCart={setItemsInCart}
                  setNotification={setNotification}
                />
              </AsyncLoader>
            </Route>
            <Route path="/items">
              <AsyncLoader>
                <ItemRoutes
                  itemsInCart={itemsInCart}
                  setItemsInCart={setItemsInCart}
                  setNotification={setNotification}
                />
              </AsyncLoader>
            </Route>
            <Redirect to="/items" from="/" />
          </Switch>
        </>
      )}
    </GlobalState>
  </Router>
  , document.getElementById('app'),
);
```

In this case we are analysing the `App.jsx` file for the App Shell MFE and there are two main things required to safely import the routes:

- Import the component with React.lazy
- Wrap the component call with React.Suspense

Both of these things are components from the [React Suspense API](https://reactjs.org/docs/concurrent-mode-suspense.html).

The import of the remote components is done as follows:

```javascript
const ItemRoutes = React.lazy(() => import('items/Routes'));
const CheckoutRoutes = React.lazy(() => import('checkout/Routes'));
const BlogRoutes = React.lazy(() => import('blog/Routes'));
```

And to call those components, we use `AsyncLoader`. This is a component that simply wraps the children in a `React.Suspense` and `ErrorBoundary` components. By using it, we guarantee that we have a fallback for when the components are still being imported and that any error triggered while loading the code will be caught by the error boundary, allowing the application to remain functional, despite any critical javascript error.

The `AsyncLoader` is as follows:

```jsx
import React from 'react';

const AsyncLoader = ({ children, noLoading }) => {
  return (
    <ErrorBoundary>
      <React.Suspense fallback={noLoading ? '' : <span>loading...</span>}>
        {children}
      </React.Suspense>
    </ErrorBoundary>
  )
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}

export default AsyncLoader;
```

This can of course be better suited for a production application. When failing we would want to display a good looking page, with some helpful information to our customers. We would probably want to log this error to Sentry or any other tool like it. This is the perfect place to do it.

Then we simply use the `AsyncLoader` to render our MFE specific routes:

```jsx
<Switch>
  <Route path="/blog">
    <AsyncLoader>
      <BlogRoutes />
    </AsyncLoader>
  </Route>
  <Route path="/checkout">
    <AsyncLoader>
      <CheckoutRoutes
        itemsInCart={itemsInCart}
        setItemsInCart={setItemsInCart}
        setNotification={setNotification}
      />
    </AsyncLoader>
  </Route>
  <Route path="/items">
    <AsyncLoader>
      <ItemRoutes
        itemsInCart={itemsInCart}
        setItemsInCart={setItemsInCart}
        setNotification={setNotification}
      />
    </AsyncLoader>
  </Route>
  <Redirect to="/items" from="/" />
</Switch>
```

Notice that the remote imports of the MFE routes are inside a base Route with the URL for each MFE (e.g. /items). By doing it this way, we make sure that the MFE related contents are only imported when the user actually needs them.

### Standalone mode

For development purposes, it’s essential to be able to run a MFE in standalone. It cuts the time to launch the application and overall improves the development experience when making small adjustments. Of course that at some point in development, you’ll have to run the whole orchestration with all the MFEs running, to test integration (these tests should be both manual and automated).

To achieve this we basically have two entry points to our MFE:

- `App.jsx` will be entry point in standalone (normal react application entry point)
- `routes.js` will be the entry point when the MFE is run in the whole orchestration

The `routes.js` component has quite literally the routes that the MFE has. In case of the Items MFE:

```jsx
import React from 'react';
import { Route, useRouteMatch } from 'react-router-dom';
import ItemList from '../item_list';
import ItemDetails from '../item_details';

const Routes = ({ itemsInCart, setItemsInCart, setNotification }) => {
  const { path } = useRouteMatch();

  return (
    <>
      <Route exact path={path}>
        <ItemList
          itemsInCart={itemsInCart}
          setItemsInCart={setItemsInCart}
          setNotification={setNotification}
        />
      </Route>
      <Route path={`${path}/details/:itemId`}>
        <ItemDetails
          itemsInCart={itemsInCart}
          setItemsInCart={setItemsInCart}
          setNotification={setNotification}
        />
      </Route>
    </>
  );
};

export default Routes;
```

For the `App.jsx` that serves as the standalone entry point there is an extra step:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import Routes from './components/routes';

ReactDOM.render(
  <Router>
    <Switch>
      <Route path="/items">
        <Routes
          itemsInCart={[]}
          setItemsInCart={() => {}}
          setNotification={() => {}}
        />
      </Route>
      <Redirect to="/items" from="/" />
    </Switch>
  </Router>
  , document.getElementById('app'),
);
```

Since in the App Shell MFE we have a base route for each MFE, when running in standalone mode, it’s easier to have this base route setup as well. This will allow us to reuse the `routes.js` component directly.

With this setup you can now run any MFE in the solution as standalone.

## The result 🌆

The final result can be checked in [this GitHub repository](https://github.com/comoser/clothes-store-micro-frontends) 👈.

In order to preview the clothes store and test it out, you have a couple of commands available under `package.json`:

- `start:live` which will start all the MFEs in development mode and with hot reload on
- `build:serve:all` which will build all the MFEs in production mode and `serve` with the serve npm package

If you want to open the respective browser tabs for each MFE automatically, then you can also add the `--open` argument in the `start:live` script.

## Common errors ⚠️

### Module “./Routes” does not exist in container

In this situation you most likely got the exposes syntax wrong:

```js
exposes: {
  'Routes': './src/components/routes', // wrong
  './Routes': './src/components/routes', // correct
},
```

### Uncaught type error: fn is not a function

This error can happen due to a couple of reasons:

- You forgot to mention the name of the entry `filename` in the remotes reference:

```js
remotes: {
  shared: 'shared@http://localhost:3004/remoteEntry.js', // this filename is defined in the imported MFE in the filename property
},
```

- I have also experienced this error when changing the webpack configuration for `chunks`. This configuration is usually everything you need by default, so if you changed it for some reason, double check to see if this is the cause.
- It can also be the case that the url defined for the remote MFE is wrong.

### Module not found: Error: Can’t resolve ‘shared/Button’ in ‘…/button’

Basically the key reference for the MFE in the config is different from the key being used in the import statement:

```jsx
// in webpack.config.js
remotes: {
  wrongName: 'shared@http://localhost:3004/remoteEntry.js'
}
// in react component
const Component = React.lazy(() => import('shared/Component'));
```

### Unexpected token ‘ < ’

This error can happen due to a number of reasons and it’s usually the hardest to debug:

- `output.publicPath` is not configured to the URL of the MFE or `auto`. Module federation needs these values well defined to correctly import code.
- `output.chunkFilename` is overridden and this may cause problems with module federation.
- Multiple versions of a library are loaded (e.g. React or react-router-dom) and this may cause erratic behaviour (refer to the shared object configuration).

## Conclusion

By now I hope you got a good grasp on webpacks’ module federation feature and that you found the clothes store project a good starting point for your next enterprise project or to simply improve an existing one.

This is only the beginning, with this code base it’s possible to expand more on topics like communication between MFEs, data storage and so much more. I’ll cover more on these topics in the future.

Module federation is still very recent, and there are suggestions and pseudo standards defined by its creators, but it’s still early to define really solid standards. The content here may become outdated soon, but I’ll try to keep the repo up to date with the latest changes from webpack.

I hope you enjoyed! 👐 Please leave your comments down below to stir up the discussion!

If you find this article interesting, please share it, because you know — Sharing is caring!
