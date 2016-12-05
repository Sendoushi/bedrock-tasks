/* eslint-disable strict */'use strict';/* eslint-enable strict */

//-------------------------------------
// Vars / Imports

var suite = require('../index.js');
var argv = require('yargs').argv;
var gulp = require('gulp');
var file = require('bedrock-utils/src/node/file.js');
var utilsPath = require('bedrock-utils/src/node/path.js');
var env = argv.env;
var config;

//-------------------------------------
// Functions

//-------------------------------------
// Runtime

config = utilsPath.getPwd(argv.config);
config = file.readFile(config);
config = suite.init(JSON.parse(config));

// Initialize
gulp.task('clean', [], function (cb) {
    suite.run('clean', config, env, cb);
});

gulp.task('styleguide', ['clean'], function (cb) {
    suite.run('styleguide', config, env, cb);
});

gulp.task('sprite', ['clean'], function (cb) {
    suite.run('sprite', config, env, cb);
});

gulp.task('copy', ['clean'], function (cb) {
    suite.run('copy', config, env, cb);
});

gulp.task('style', ['styleguide', 'sprite'], function (cb) {
    suite.run('style', config, env, cb);
});

gulp.task('script', ['sprite'], function (cb) {
    suite.run('script', config, env, cb);
});

// Prepare build for dev
gulp.task('build', ['clean', 'style', 'script', 'copy']);
