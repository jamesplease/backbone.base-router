### [1.2.0](https://github.com/jmeas/backbone.base-router/releases/tag/1.2.0)

- **New feature:** The `routeData` Object now returns the original query string under `queryString`
- **New feature:** Splat values are now included in `routeData.params`

### [1.1.0](https://github.com/jmeas/backbone.base-router/releases/tag/1.1.0)

- Updated dependencies to include the latest Backbone and Underscore versions.

### [1.0.0](https://github.com/jmeas/backbone.base-router/releases/tag/v1.0.0)

- **Enhancement**: Adds support for multiple query parameters of the same name. They
  are returned as an array.

### [0.5.0](https://github.com/jmeas/backbone.base-router/releases/tag/v0.5.0)

- Updated Backbone dependency
- Tests against multiple versions of Backbone/Underscore

### [0.4.1](https://github.com/jmeas/backbone.base-router/releases/tag/v0.4.1)

- **Bug fix**: Uses the constructor on the Router's prototype

### [0.4.0](https://github.com/jmeas/backbone.base-router/releases/tag/v0.4.0)

- **Refactor**: No longer override `_routeToRegExp`
- **Refactor**: Simplified method to parse query parameters
- **Bug fix**: `routeParams` was removed from the prototype
