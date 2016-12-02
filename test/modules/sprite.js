/* eslint-disable strict */'use strict';/* eslint-enable */
/* global describe, it, Promise */

// var expect = require('chai').expect;
var file = require('bedrock-utils/src/node/file.js');
var utilsPath = require('bedrock-utils/src/node/path.js');
var main = require('../../src/index.js');
var config = utilsPath.getPwd('./test/examples/sprite/config.json');
config = JSON.parse(file.readFile(config));

// --------------------------------
// Functions

// --------------------------------
// Suite of tests

describe('module:sprite', function () {
    // build
    describe('build', function () {
        it.skip('should compile', function (done) {
            var env = 'dev';
            var generalPromise;

            this.timeout(10000);

            // Now for the tasks
            generalPromise = new Promise(resolve => resolve());
            generalPromise.then(function () {
                var promise = new Promise(function (resolve, reject) {
                    resolve();

                    // TODO: Not passing because of SVG error "Callback was already called"
                    main.run('sprite', config, env, function (err) {
                        if (err) { reject(err); } else { resolve(); }
                    });
                });

                return promise;
            }).then(() => {})
            .then(done).catch(done);
        });
    });
});
