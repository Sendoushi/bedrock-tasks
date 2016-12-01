/* eslint-disable strict */'use strict';/* eslint-enable */
/* global describe it */

// var expect = require('chai').expect;
var file = require('bedrock-utils/src/node/file.js');
var utilsPath = require('bedrock-utils/src/node/path.js');
var config = utilsPath.getPwd('./test/examples/script/config.json');
config = JSON.parse(file.readFile(config));

// --------------------------------
// Functions

// --------------------------------
// Suite of tests

describe('module:script', function () {
    // build
    describe('build', function () {
        it.skip('should compile', function () {
            // TODO: ...
        });
    });

    // raw
    describe('raw', function () {
        it.skip('should compile', function () {
            // TODO: ...
        });
    });
});
