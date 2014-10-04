var router = new Backbone.BaseRouter({
  onNavigate: function(options) {
    console.log('options', options);
  },

  routes: {
    ':name(/)': {name:'james'},
    '*notFound': true
  }
});

Backbone.baseHistory.start({
  pushState: true
});
