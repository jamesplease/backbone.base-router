var Model = Backbone.Model.extend({

  // Because I don't actually want to fetch any data for this example,
  // I'm overriding the method to return a Promise that resolves after 1s has passed.
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
