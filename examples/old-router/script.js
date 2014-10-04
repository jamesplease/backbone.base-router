var Router = Backbone.BaseRouter.extend({
  onNavigate: function(routeData) {
    this.trigger('before:route', routeData);
    routeData.linked(routeData);
    this.trigger('route', routeData);
  },

  routes: {
    'examples/old-router(/)': function(routeData) {
      console.log('This route matched, and I got some cool data:', routeData);
    }
  }
});

var router = new Router();

Backbone.history.start({
  pushState: true
});
