# backbone.base-router

A better starting point for creating your own routing abstractions in Backbone.

### What problems does this library solve?

Backbone's Router has two frustrating properties: it is too simple and too difficult to
change. This library solves the second problem to make it easier for *you* to solve the
first problem.

Instead of requiring that you associate a callback with a route, this library
lets you associate whatever you'd like with a route. It can be an object, a string, or
even just a callback.

Whenever a Route is matched, a single method on the Router is called. This method is passed
you as much information about the Route – including the associated object – as possible. This single
point-of-entry makes it remarkably easy to add new abstractions to your Router.

### What problems doesn't this library solve?

This library is **not** an effort to rewrite Backbone.history. As such, some of the same quirks are carried
over, too. For instance, the order that you specify your callbacks in *still* matters, as this behavior stems
from `Backbone.history`.

### Getting Started

#### Backwards Compatibility

This library is backwards compatible with any existing Backbone Application. It can even run concurrently
alongside an existing Router.

#### History

Backbone's Router is intimately tied to Backbone.History (more specifically, an instance
of that Class called Backbone.history). There is no way to specify what version of history a regular Router
uses, but you can with this one. Simply specify the `history` property on the Router.

#### A Single Point of Entry

The API for the Base Router is simple: there's a single callback that gets called when a Route is navigated
to. This callback is a plethora of information you might need, such as parsed query
parameters and whatever object was associated with the callback. This is the location
where you build your abstractions from.

## API

### `history`

The instance of `history` to use in conjunction with this Router.

### `onNavigate`

The single point of entry is the `onNavigate` method. This method is called each time the user navigates
via Backbone.history.

```js
// Create a new Base Router
var baseRouter = new BaseRouter();

// Each time the user navigates a console message will be logged,
// displaying all of the options passed to the callback.
baseRouter.onNavigate = function(options) {
  console.log('The user has navigated!', options);
};
```

In addition to being called everytime that the user navigates, which in itself is useful, the
callback is passed a plethora of useful data related to the navigation action.

### `options`

#### `linked`

The object that was associated with this route. In a traditional Backbone router, this is always a callback that
is executed. In the BaseRouter, this can be anything, and no assumptions are made about what you should do with it.

#### `route`

The regular expression that matched the URI fragment.

#### `originalRoute`

If the route was registered as a string, and not a regular expression, then this will
be that original string. Otherwise, it is undefined.

#### `params`

An object which has keys that are the named parameters from the Route, and corresponding values
from the URL.

#### `query`

An object representation of the query string in the URI fragment.

#### `router`

The router instance that this route was registered on.

#### `uriFragment`

The URI fragment that was matched.

### Removed features

Backbone.BaseRouter does more for you by doing less. The following features were removed from the router.

- A callback, if specified, will no longer ever be executed
- Related to the above; the `trigger` option no longer exists
- No `route` events are not fired

The point of removing these features is that it gives you complete control over the Routing
mechanism. It's simple to add them back in. Or you can change them to be exactly how you
want. Or just leave them out. It's entirely up to you.

### Accessing the options passed to `route`

When you call the `route` method, you can pass options.

```js
myRouter.route('some/path', {myOption: true});
```

This Router – and all Backbone.Routers – do not get these options back. They're sent off to History and
not returned. Because this library is *just* a Router, it doesn't let you access those options. However, by
using this library in conjunction with Backbone.BaseHistory you will receive an extra parameter in your
`onNavigate` callback, `navOptions`. These are those options.
