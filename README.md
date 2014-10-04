# backbone.base-router

A better starting point for creating your own routing abstractions in Backbone.

### What problems does this library solve?

Backbone's Router has two frustrating properties: it is too simple and too difficult to
change. This library solves the second problem to make it easier for *you* to solve the
first problem.

Instead of requiring that you associate a callback with a route, this library
lets you associate whatever you'd like with a route. It can be a callback if you want,
but it can also be an object, or a string.

Whenever a Route is matched, a single method on the Router is called. This method is passed a single
argument, `routeData`, that contains as much about the matched route as possible. Included this object are parsed
query parameters, named fragment params, and the object you associated with the route, among other things. This
single point-of-entry, combined with all of this data, makes it remarkably easy to add new abstractions to the Router.

### What problems *doesn't* this library solve?

This library is not an effort to rewrite Backbone.history. As such, some of History's quirks are carried
over, too. For instance, the order that you specify your callbacks in *still* matters, as this is how `Backbone.History` matches routes.

- [Getting Started](#getting-started)
  - [Backwards Compatibility](#backwards-compatibility)
  - [History](#history)
  - [A Single Point of Entry](#a-single-point-of-entry)
- [API](#api)
  - [history](#history)
  - [onNavigate](#onnavigate-routedata-)
- [Removed Features](#removed-features)
- [Accessing the options passed to `route`](#accessing-the-options-passed-to-route)
- [Example Usage](#example-usage)

### Getting Started

#### Backwards Compatibility

This library is backwards compatible with any existing Backbone application. It can even run concurrently
alongside an existing Router.

#### History

Backbone's Router is intimately tied to Backbone.History (more specifically, an instance
of that Class called Backbone.history). With a regular Router you can't specify what instance
of history that you're using, but you can with this one. To use a different instance of History, specify the
`history` property on the Router.

#### A Single Point of Entry

The API for the Base Router is simple: there's a single callback that gets called when a Route is navigated
to. This callback is a plethora of information you might need, such as parsed query
parameters and whatever object was associated with the callback. This is the location
where you build your abstractions from.

## API

### `history`

The instance of `history` to use in conjunction with this Router.

### `onNavigate( routeData )`

The single point of entry is the `onNavigate` method. This method is called each time the user navigates
via Backbone.history.

```js
// Create a new Base Router
var router = new BaseRouter();

// Each time the user navigates to a matched route, a console message
// logs all of the data passed to the callback.
router.onNavigate = function(routeData) {
  console.log('The user has navigated!', routeData);
};
```

In addition to being called everytime that the user navigates to a matched route, which in itself is useful, the
callback is passed a plethora of useful data related to the navigation action. This information is contained
in the `routeData` argument.

#### `routeData`

##### `linked`

The object that was associated with this route. In a traditional Backbone router, this is always a callback that
is executed. In the BaseRouter, this can be anything, and no assumptions are made about what you should do with it.

##### `route`

The regular expression that matched the URI fragment.

##### `originalRoute`

If the route was registered as a string, and not a regular expression, then this will
be that original string. Otherwise, it is undefined.

##### `params`

An object which has keys that are the named parameters from the Route, and corresponding values
from the URL.

##### `query`

An object representation of the query string in the URI fragment.

##### `router`

The router instance that this route was registered on.

##### `uriFragment`

The URI fragment that was matched.

### Removed features

Backbone.BaseRouter does more for you by doing less. The following features were removed from the router.

- A callback, if specified, is not executed
- Related to the above; the `trigger` option to the `navigate` method no longer exists
- No routing-related events are fired

The point of removing these features is that it gives you complete control over the Routing
mechanism. It's simple to add them back in. Or you can change them to be exactly how you
want. Or just leave them out. It's entirely up to you.

### Accessing the options passed to `route`

As you might already know, you can pass options when you call the `route` method.

```js
myRouter.navigate('some/path', {myOption: true});
```

Backbone Routers do not get these options back. They're sent off to History, which does not
return them. Because this library is *just* a Router, it doesn't let you access those options. However, if you want
these options you can use [Backbone.BaseHistory](https://github.com/jmeas/backbone.base-history) in conjunction
with this library. If you use that library you will receive those options in your `routeData` as a property
called `navOptions`.

```js
var BaseHistory = require('BaseHistory');
myRoute.history = new baseHistory();
```

## Example Usage

See the [`examples/`](https://github.com/jmeas/backbone.base-router/tree/updates/examples) directory. There are READMEs for each example.
