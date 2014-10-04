function setupTestHelpers() {
  beforeEach(function() {
    this.Location = function(href) {
      this.replace(href);
    };

    _.extend(this.Location.prototype, {
      parser: document.createElement('a'),
      replace: function(href) {
        this.parser.href = href;
        _.extend(this, _.pick(this.parser,
          'href',
          'hash',
          'host',
          'search',
          'fragment',
          'pathname',
          'protocol'
        ));
        // In IE, anchor.pathname does not contain a leading slash though
        // window.location.pathname does.
        if (!/^\//.test(this.pathname)) this.pathname = '/' + this.pathname;
      },
      toString: function() {
        return this.href;
      }
    });

    this.sinon = sinon.sandbox.create();
    global.stub = _.bind(this.sinon.stub, this.sinon);
    global.spy  = _.bind(this.sinon.spy, this.sinon);
  });

  afterEach(function() {
    global.Backbone.history.stop();
    this.sinon.restore();
    delete global.stub;
    delete global.spy;
  });
}

var node = typeof exports !== 'undefined';
var $ = node ? require('jquery') : $;

if (node) {
  setupTestHelpers();
}

// when running in a browser
else {
  this.global = window;
  mocha.setup('bdd');

  window.expect = chai.expect;
  window.sinon = sinon;

  onload = function() {
    mocha.checkLeaks();
    mocha.globals(['stub', 'spy']);
    mocha.run();
    setupTestHelpers();
  };
}
