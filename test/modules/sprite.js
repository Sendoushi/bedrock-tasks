/* eslint-disable strict */'use strict';/* eslint-enable */
/* global describe it */

// var expect = require('chai').expect;
var file = require('bedrock-utils/src/node/file.js');
var utilsPath = require('bedrock-utils/src/node/path.js');
var config = utilsPath.getPwd('./test/examples/sprite/config.json');
config = JSON.parse(file.readFile(config));

// --------------------------------
// Functions

// --------------------------------
// Suite of tests

describe('module:sprite', function () {
    // build
    describe('build', function () {
        it.skip('should compile', function () {
            // TODO: ...
        });
    });
});
