// Backbone.BaseRouter v0.4.0
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
  
  // Copied over from Backbone, because it doesn't expose them.
  var namedParam = /(\(\?)?:\w+/g;
  
  Backbone.BaseRouter = Backbone.Router.extend({
    constructor: function() {
      this.routeParams = {};
      Backbone.Router.constructor.apply(this, arguments);
    },
  
    // The single point of entry. This is called whenever a
    // route is matched. The routeData argument contains lots of
    // useful information.
    onNavigate: function(routeData) {},
  
    route: function(origRoute, linked) {
      var route, routeStr;
  
      if (_.isRegExp(origRoute)) {
        route = origRoute;
        routeStr = origRoute.toString();
      } else {
        route = this._routeToRegExp(origRoute);
        routeStr = origRoute;
      }
  
      this.routeParams[origRoute] = this._extractRouteParams(routeStr);
  
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
  
    _extractRouteParams: function(route) {
      var namedParams = [];
  
      route.replace(namedParam, function(match, optional) {
        namedParams.push(match.substr(1));
      });
  
      return namedParams;
    },
  
    // Decodes the Url query string parameters & and returns them
    // as an object. Supports empty parameters, but not array-like
    // parameters (which aren't in the URI specification)
    _getQueryParameters: function(queryString) {
      if (!queryString) { return {}; }
  
      var match;
      var search = /([^&=]+)=?([^&]*)/g;
      var urlParams = {};
  
      while (match = search.exec(queryString)) {
         urlParams[this._decodeParams(match[1])] = this._decodeParams(match[2]);
      }
  
      return urlParams;
    },
  
    _decodeParams: function (queryString) {
      // Replace addition symbol with a space
      return decodeURIComponent(queryString.replace(/\+/g, ' '));
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
