/* eslint-disable strict */'use strict';/* eslint-enable */
/* global describe it */

// var expect = require('chai').expect;
var file = require('bedrock-utils/src/node/file.js');
var utilsPath = require('bedrock-utils/src/node/path.js');
var config = utilsPath.getPwd('./test/examples/clean_copy/config.json');
config = JSON.parse(file.readFile(config));

// --------------------------------
// Functions

// --------------------------------
// Suite of tests

describe('module:file', function () {
    // copy
    describe('copy', function () {
        it.skip('should copy file/folder', function () {
            // TODO: ...
        });
    });

    // clean
    describe('clean', function () {
        it.skip('should clean file/folder', function () {
            // TODO: ...
        });
    });
});
