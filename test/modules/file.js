/* eslint-disable strict */'use strict';/* eslint-enable */
/* global describe, it, Promise */

// var expect = require('chai').expect;
var file = require('bedrock-utils/src/node/file.js');
var utilsPath = require('bedrock-utils/src/node/path.js');
var main = require('../../src/index.js');
var config = utilsPath.getPwd('./test/examples/clean_copy/config.json');
config = JSON.parse(file.readFile(config));

// --------------------------------
// Functions

// --------------------------------
// Suite of tests

describe('module:file', function () {
    // copy
    describe('copy', function () {
        it('should copy file/folder', function (done) {
            var env = 'dev';
            var generalPromise;

            this.timeout(10000);

            // Now for the tasks
            generalPromise = new Promise(resolve => resolve());
            generalPromise.then(function () {
                var promise = new Promise(function (resolve, reject) {
                    main.run('copy', config, env, function (err) {
                        if (err) { reject(err); } else { resolve(); }
                    });
                });

                return promise;
            }).then(() => {})
            .then(done).catch(done);
        });
    });

    // clean
    describe('clean', function () {
        it('should clean file/folder', function (done) {
            var env = 'prod';
            var generalPromise;

            this.timeout(10000);

            // Now for the tasks
            generalPromise = new Promise(resolve => resolve());
            generalPromise.then(function () {
                var promise = new Promise(function (resolve, reject) {
                    main.run('clean', config, env, function (err) {
                        if (err) { reject(err); } else { resolve(); }
                    });
                });

                return promise;
            }).then(() => {})
            .then(done).catch(done);
        });
    });
});
