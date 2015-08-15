// Backbone.BaseRouter v1.1.0
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['backbone', 'underscore'], function(Backbone, _) {
      return factory(Backbone, _);
    });
  }
  else if (typeof exports !== 'undefined') {
    var Backbone = require('backbone');
    var _ = require('underscore');
    module.exports = factory(Backbone, _);
  }
  else {
    factory(root.Backbone, root._);
  }
}(this, function(Backbone, _) {
  'use strict';

  //
  // Backbone.BaseRouter
  //
  
  // This is copied over from Backbone, because it doesn't expose it
  var NAMED_PARAM = /(\(\?)?:\w+/g;
  // Find plus symbols
  var PLUS_SYMBOL = /\+/g;
  
  Backbone.BaseRouter = Backbone.Router.extend({
    constructor: function() {
      this.routeParams = {};
      Backbone.Router.prototype.constructor.apply(this, arguments);
    },
  
    // The single point of entry. This is called whenever a
    // route is matched. The routeData argument contains lots of
    // useful information.
    onNavigate: function(routeData) {},
  
    route: function(origRoute, linked) {
      var route, routeStr;
  
      if (_.isRegExp(origRoute)) {
        route = origRoute;
        routeStr = '' + origRoute;
      } else {
        route = this._routeToRegExp(origRoute);
        routeStr = origRoute;
      }
  
      this.routeParams[origRoute] = _.invoke(routeStr.match(NAMED_PARAM), 'slice', 1);
  
      // Begin setting up our routeData,
      // based on what we already know.
      var routeData = {
        route: route,
        router: this,
        linked: linked
      };
  
      // Only attach the originalRoute to routeData if it isn't a RegExp.
      if (!_.isRegExp(origRoute)) {
        routeData.originalRoute = origRoute;
      }
  
      // Register a callback with history
      var router = this;
      Backbone.history.route(route, function(fragment, navOptions) {
        var routeParams = router._extractParameters(route, fragment);
        var queryString = routeParams.pop();
  
        // If the user is using baseHistory, then we'll get the navOptions back from BB.History
        if (navOptions) { routeData.navOptions = navOptions; }
        routeData.query = router._getQueryParameters(queryString);
        routeData.params = router._getNamedParams(routeStr, routeParams);
        routeData.uriFragment = fragment;
  
        router.onNavigate(routeData);
      });
  
      return this;
    },
  
    // Decodes the Url query string parameters & and returns them
    // as an object. Supports empty parameters, but not array-like
    // parameters (which aren't in the URI specification)
    _getQueryParameters: function(queryString) {
      if (!queryString) { return {}; }
  
      return _.reduce(queryString.split('&'), function(memo, param) {
        var parts = param.replace(PLUS_SYMBOL, ' ').split('=');
        var key = parts[0];
        var val = parts[1];
  
        key = decodeURIComponent(key);
        val = val === undefined ? null : decodeURIComponent(val);
  
        // If we don't have the value, then we set it.
        if (!memo[key]) {
          memo[key] = val;
        }
  
        // Otherwise, if we have the value, and it's an array,
        // then we push to it.
        else if (_.isArray(memo[key])) {
          memo[key].push(val);
        }
  
        // Otherwise, we have a value that is not yet an array,
        // so we convert it to an array, adding the newest value.
        else {
          memo[key] = [memo[key], val];
        }
  
        return memo;
      }, {});
    },
  
    // Returns the named parameters of the route
    _getNamedParams: function(route, routeParams) {
      if (!routeParams.length) { return {}; }
  
      var routeKeys = this.routeParams[route];
      var routeValues = routeParams.slice(0, routeKeys.length);
  
      return _.object(_.zip(routeKeys, routeValues));
    }
  });
  

  return Backbone.BaseRouter;
}));
