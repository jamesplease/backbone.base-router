var Model = Backbone.Model.extend({

  // We're going to override fetch to simply return a promise after a moment
  fetch: function() {
    return new Promise(function(resolve) {
      window.setTimeout(function() {
        resolve(true);
      }, 1000);
    });
  }
});

var Router = Backbone.BaseRouter.extend({
  onNavigate: function(routeData) {
    var RouteObj = routeData.linked;
    RouteObj.fetch().then(RouteObj.show);
  },

  routes: {
    'examples/fetch-router(/)': {

      fetch: function() {
        console.log('Fetching data...');
        this.model = new Model();
        return this.model.fetch();
      },

      show: function() {
        console.log('Data fetched. Showing the view.');
      }
    }
  }
});

var router = new Router();

Backbone.history.start({
  pushState: true
});
