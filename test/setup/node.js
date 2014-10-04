// Create our JSDom document
global.jsdom = require('jsdom').jsdom;
global.document = jsdom('<html><head><script></script></head><body></body></html>');
global.window = global.document.parentWindow;
global.navigator = window.navigator = {
  userAgent: 'NodeJS JSDom',
  appVersion: ''
};

var sinon = require('sinon');
var chai = require('chai');
var sinonChai = require('sinon-chai');

global.$ = require('jquery');
global._ = require('underscore');
global.Backbone = require('backbone');
global.Backbone.$ = global.$;

chai.use(sinonChai);

global.expect = chai.expect;
global.sinon = sinon;

require('../../src/backbone.base-router');
