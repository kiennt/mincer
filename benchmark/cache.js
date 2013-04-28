"use strict";


// stdlib
var fs    = require("fs");
var path  = require("path");


// 3rd-party
var Benchmark = require("benchmark");


// internal
var Mincer      = require("../index");
var Environment = Mincer.Environment;


function compile(callback) {
  var root, env;

  root  = path.resolve(__dirname, "../test/fixtures");
  env   = new Environment(root);

  env.appendPath('app/assets/images');
  env.appendPath('app/assets/javascripts');
  env.appendPath('app/assets/stylesheets');
  env.appendPath('vendor/assets/stylesheets');
  env.appendPath('vendor/assets/javascripts');

  env.precompile([
    'app.css', 'app.js', 'hundreds-of-files/test.js',
    'templates/issue-16.js', 'templates/jade-lang.js',
    'header.jpg', 'README.md'
  ], callback);
}


var CACHE_DB  = "/tmp/mincer-cache.db";
var suite     = new Benchmark.Suite;


function runner(deferred) {
  compile(function (err) {
    if (err) { console.error(err); }
    deferred.resolve();
  });
}


suite.add("without cache", runner, {
  defer:    true,
  onCycle:  function () { Mincer.Template.cache = null; }
});


suite.add("with cache - load cache on each init", runner, {
  defer:    true,
  onCycle:  function () { Mincer.Template.cache = CACHE_DB; }
});


suite.add("with cache - load cache on only once", runner, {
  defer:    true,
  onStart:  function () { Mincer.Template.cache = CACHE_DB; }
});


suite.on('cycle', function(event) {
  console.log(String(event.target));
});


if (fs.existsSync(CACHE_DB)) {
  fs.unlinkSync(CACHE_DB);
}

Mincer.Template.cache = CACHE_DB;


compile(function (err) {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  process.nextTick(function () {
    suite.run({ async: true, queued: true });
  });
});
