/* eslint-disable strict */'use strict';/* eslint-enable */
/* global describe it */

var expect = require('chai').expect;
var file = require('bedrock-utils/src/node/file.js');
var utilsPath = require('bedrock-utils/src/node/path.js');
var main = require('../../src/index.js');
var config = utilsPath.getPwd('./test/examples/config.json');
config = JSON.parse(file.readFile(config));

// --------------------------------
// Functions

// --------------------------------
// Suite of tests

describe('main', function () {
    // init
    describe('init', function () {
        it('should get a valid config', function () {
            var result;

            try {
                result = main.init(config, true);
            } catch (err) {
                throw err;
            }

            expect(result).to.be.an('object');
            expect(result).to.have.all.keys(['projectId', 'projectName', 'tasks']);
            expect(result.tasks).to.be.an('array');
            expect(result.tasks).to.have.length.above(1);
            expect(result.tasks[0]).to.be.an('object');
            expect(result.tasks[0]).to.contain.keys(['type', 'data']);
            expect(result.tasks[0].type).to.be.a('string');
            expect(result.tasks[0].data).to.be.an('array');
        });

        it('should error with wrong config', function (done) {
            try {
                main.init({ foo: 'bar' }, true);
                done('It should error!');
            } catch (err) {
                done();
            }
        });
    });

    // getTasks
    describe('getTasks', function () {
        it('should get tasks', function () {
            var initConfig = main.init(config, true);
            var result = main.getTasks(initConfig, 'copy');

            expect(result).to.be.an('array');
            expect(result).to.have.length(1);
            expect(result[0]).to.be.an('object');
            expect(result[0]).to.contain.keys(['projectId', 'projectName', 'src', 'dest']);
        });

        it('should get tasks for the right env', function () {
            var initConfig = main.init(config, true);
            var result = main.getTasks(initConfig, 'style', 'prod');

            expect(result).to.be.an('array');
            expect(result).to.have.length(1);
            expect(result[0]).to.be.an('object');
            expect(result[0]).to.contain.keys(['projectId', 'projectName', 'src', 'dest']);
        });

        it('should error without a valid config', function (done) {
            try {
                main.getTasks(null, 'style');
                done('It should error!');
            } catch (err) {
                done();
            }
        });

        it('should error without a valid type', function (done) {
            try {
                main.getTasks({
                    projectId: 'foo',
                    projectName: 'Foo',
                    tasks: []
                }, 'foo');
                done('It should error!');
            } catch (err) {
                done();
            }
        });
    });

    // setTasks
    describe('setTasks', function () {
        it('should set task', function (done) {
            main.setTasks(
                (task, cb) => { cb(); }, [{ foo: 'bar' }],
            done);
        });

        it('should callback if there are no tasks', function (done) {
            main.setTasks(() => {}, [], done);
        });

        it('should error without a valid task function', function (done) {
            try {
                main.setTasks();
                done('It should error!');
            } catch (err) {
                done();
            }
        });
    });

    // run
    describe('run', function () {
        it('should run task', function (done) {
            main.run('copy', config, done);
        });

        it('should run task under env', function (done) {
            main.run('clean', config, 'prod', done);
        });

        it('should error without a task', function (done) {
            main.run(null, {}, function (err) {
                done(!err && 'It should error!');
            });
        });

        it('should error without a valid task', function (done) {
            main.run('foo', {}, function (err) {
                done(!err && 'It should error!');
            });
        });

        it('should error without a config', function (done) {
            main.run('script', null, function (err) {
                done(!err && 'It should error!');
            });
        });
    });
});
