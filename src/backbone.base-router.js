//
// Backbone.BaseRouter
//

'use strict';

// Copied over from Backbone, because it doesn't expose them.
var optionalParam = /\((.*?)\)/g;
var namedParam    = /(\(\?)?:\w+/g;
var splatParam    = /\*\w+/g;
var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

Backbone.BaseRouter = Backbone.Router.extend({

  // The instance of history that this Router 
  history: Backbone.history,

  // The single point of entry. This is called whenever a
  // route is matched. The options argument contains a large
  // quantity of useful information.
  onNavigate: function(options) {},

  route: function(origRoute, linked) {
    var route = _.isRegExp(origRoute) ? origRoute : this._routeToRegExp(origRoute);

    // Begin setting up our onNavOptions,
    // based on what we already know.
    var onNavOptions = {
      route: route,
      router: this,
      linked: linked
    };

    if (!_.isRegExp(origRoute)) {
      onNavOptions.originalRoute = origRoute;
    }

    // We register our callback with the , we gather all of our information 
    var router = this;
    this.history.route(route, function(fragment, navOptions) {
      var routeParams = router._extractParameters(route, fragment);
      var queryString = routeParams.pop();

      // If the user is using history, then we'll get the options passed to route
      if (navOptions) { onNavOptions.navOptions = navOptions; }
      onNavOptions.query = router._getQueryParameters(queryString);
      onNavOptions.params = router._getNamedParams(route, routeParams);
      onNavOptions.uriFragment = fragment;

      router.onNavigate(onNavOptions);
    });

    return this;
  },

  _routeToRegExp: function(route) {
    this.routeParams = this.routeParams || {};

    var namedParams = [];
    var newRoute = route.replace(escapeRegExp, '\\$&')
      .replace(optionalParam, '(?:$1)?')
      .replace(namedParam, function(match, optional) {
        namedParams.push(match.substr(1));
        return optional ? match : '([^/?]+)';
      })
      .replace(splatParam, '([^?]*?)');
    var regexStr = '^' + newRoute + '(?:\\?([\\s\\S]*))?$';
    this.routeParams[regexStr] = namedParams;
    return new RegExp(regexStr);
  },

  // Decodes the Url query string parameters & and returns them
  // as an object. Supports empty parameters, but not array-like
  // parameters (which aren't in the URI specification)
  _getQueryParameters: function(queryString) {
    if (!queryString) { return {}; }
    var match,
      pl     = /\+/g,  // Regex for replacing addition symbol with a space
      search = /([^&=]+)=?([^&]*)/g,
      decode = function (s) { return decodeURIComponent(s.replace(pl, ' ')); },
      query  = queryString;

    var urlParams = {};
    while (match = search.exec(query)) {
       urlParams[decode(match[1])] = decode(match[2]);
    }
    return urlParams;
  },

  // Returns the named parameters of the route
  _getNamedParams: function(route, routeParams) {
    if (routeParams.length === 0) { return {}; }
    var routeString = route.toString();
    routeString = routeString.substr(1, routeString.length - 2);
    var routeArr = this.routeParams[routeString];
    var paramObj = {};
    _.each(routeArr, function(arrVal, i) {
      paramObj[arrVal] = routeParams[i];
    });
    return paramObj;
  }
});
