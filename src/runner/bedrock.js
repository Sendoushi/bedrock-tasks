#!/usr/bin/env node

/* eslint-disable strict */'use strict';/* eslint-enable strict */

var fs = require('fs');
var argv = require('yargs').argv;
var logger = require('bedrock-utils/src/logger.js');
var suite = require('../index.js');
var env = argv.env;
var config;

//-------------------------------------
// Functions

/**
 * Callback for the suite task
 *
 * @param {string} task
 * @param {*} err
 */
function cb(task, err) {
    if (err) {
        throw err;
    }

    logger.log('Bedrock task: [' + task + ']', 'Task concluded');
}

//-------------------------------------
// Runtime

config = suite.getPath(argv.config);
config = require.resolve(config);
config = fs.readFileSync(config, 'utf8');
config = suite.init(JSON.parse(config));

// Now for the tasks
suite.run('clean', config, env, cb.bind(null, 'clean'));
suite.run('styleguide', config, env, cb.bind(null, 'styleguide'));
suite.run('sprite', config, env, cb.bind(null, 'sprite'));
suite.run('copy', config, env, cb.bind(null, 'copy'));
suite.run('style', config, env, cb.bind(null, 'style'));
suite.run('script', config, env, cb.bind(null, 'script'));
