#!/usr/bin/env node

/* eslint-disable strict */'use strict';/* eslint-enable strict */

var argv = require('yargs').argv;
var logger = require('bedrock-utils/src/logger.js');
var file = require('bedrock-utils/src/node/file.js');
var utilsPath = require('bedrock-utils/src/node/path.js');
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

config = utilsPath.getPwd(argv.config);
config = file.readFile(config);
config = suite.init(JSON.parse(config));

// Now for the tasks
suite.run('clean', config, env, cb.bind(null, 'clean'));
suite.run('styleguide', config, env, cb.bind(null, 'styleguide'));
suite.run('sprite', config, env, cb.bind(null, 'sprite'));
suite.run('copy', config, env, cb.bind(null, 'copy'));
suite.run('style', config, env, cb.bind(null, 'style'));
suite.run('script', config, env, cb.bind(null, 'script'));
