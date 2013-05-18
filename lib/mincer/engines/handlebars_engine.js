'use strict';


// 3rd-party
var _ = require('underscore');
var path  = require('path');


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
  var oldLogicalPath, logicalPath;

  logicalPath = context.logicalPath;
  // JST members should not have extensions in the name
  oldLogicalPath = '';
  while (oldLogicalPath !== logicalPath) {
    oldLogicalPath = logicalPath;
    logicalPath    = logicalPath.replace(path.extname(logicalPath), '');
  }

  logicalPath = logicalPath.replace('templates/', '');
  source = this.data.toString().replace(/$(.)/mg, '$1  ').trimLeft().trimRight();
  source = source.replace(/\n/g, '');
  source = source.replace(/\"/g, "\\\"");

  try {
    source = 'Ember.TEMPLATES[' + JSON.stringify(logicalPath) + '] = ' +
      'Ember.Handlebars.compile("' + source + '")';

    callback(null, source);
  } catch (err) {
    callback(err);
  }
};

prop(HandlebarsEngine, 'defaultMimeType', 'application/javascript');
