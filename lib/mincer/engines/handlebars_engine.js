'use strict';


// 3rd-party
var _ = require('underscore');


// internal
var Template  = require('../template');
var prop      = require('../common').prop;


////////////////////////////////////////////////////////////////////////////////


// Class constructor
var HandlebarsEngine = module.exports = function HandlebarsEngine() {
  Template.apply(this, arguments);
};


require('util').inherits(HandlebarsEngine, Template);


// Check whenever coffee-script module is loaded
HandlebarsEngine.prototype.isInitialized = function () {
  return true;
};


// Autoload coffee-script library
HandlebarsEngine.prototype.initializeEngine = function () {
};


// Internal (private) options storage
var options = {};


HandlebarsEngine.setOptions = function (value) {
  options = _.clone(value);
};


// Render data
HandlebarsEngine.prototype.evaluate = function (context, locals, callback) {
  /*jshint unused:false*/
  var compiler, source;

  try {
    source = 'Ember.TEMPLATES[' + context.pathname + '] = ' +
      'Ember.Handlebars.compile(' + this.data + ')';

    callback(null, source);
  } catch (err) {
    callback(err);
  }
};

prop(HandlebarsEngine, 'defaultMimeType', 'application/javascript');
