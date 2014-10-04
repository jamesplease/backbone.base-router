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

  // The instance of history that this Router uses
  history: Backbone.history,

  // The single point of entry. This is called whenever a
  // route is matched. The routeData argument contains lots of
  // useful information.
  onNavigate: function(routeData) {},

  route: function(origRoute, linked) {
    var route = _.isRegExp(origRoute) ? origRoute : this._routeToRegExp(origRoute);

    // Begin setting up our routeData,
    // based on what we already know.
    var routeData = {
      route: route,
      router: this,
      linked: linked
    };

    // Only attach the originalRoute to routeData if it isn't a RegExp.
    if (!_.isRegExp(origRoute)) { routeData.originalRoute = origRoute; }

    // Register a callback with history
    var router = this;
    this.history.route(route, function(fragment, navOptions) {
      var routeParams = router._extractParameters(route, fragment);
      var queryString = routeParams.pop();

      // If the user is using baseHistory, then we'll get the navOptions back from BB.History
      if (navOptions) { routeData.navOptions = navOptions; }
      routeData.query = router._getQueryParameters(queryString);
      routeData.params = router._getNamedParams(route, routeParams);
      routeData.uriFragment = fragment;

      router.onNavigate(routeData);
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
