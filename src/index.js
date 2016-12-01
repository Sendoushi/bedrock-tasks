/* eslint-disable strict */'use strict';/* eslint-enable strict */

//-------------------------------------
// Vars / Imports

var path = require('path');
var Joi = require('joi');
var logger = require('./utils/logger.js');

// Import modules
var modules = {
    file: require('./modules/file.js'),
    script: require('./modules/script.js'),
    style: require('./modules/style.js'),
    sprite: require('./modules/sprite.js'),
    styleguide: require('./modules/styleguide.js')
};
var tasks = {
    clean: { struct: modules.file.STRUCT, fn: modules.file.clean },
    copy: { struct: modules.file.STRUCT, fn: modules.file.copy },
    script: { struct: modules.script.STRUCT, fn: modules.script.build },
    style: { struct: modules.style.STRUCT, fn: modules.style.build },
    sprite: { struct: modules.sprite.STRUCT, fn: modules.sprite.build },
    styleguide: { struct: modules.styleguide.STRUCT, fn: modules.styleguide.build }
};

var STRUCT = Joi.object().keys({
    projectId: Joi.string().default('projectname'),
    projectName: Joi.string().default('Project Name'),
    tasks: Joi.array().items(Joi.object().keys({
        type: Joi.string().required(),
        env: Joi.string().default('*'),
        data: Joi.array()
    })).default([])
}).required();

//-------------------------------------
// Functions

/**
 * Check if url is valid
 *
 * @param {string} url
 * @returns
 */
function checkUrl(url) {
    var pattern = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;

    return pattern.test(url);
}

/**
 * Gets path
 * @param  {string} src
 * @return {string}
 */
function getPath(src) {
    var newSrc = src;

    if (src && typeof src === 'string') {
        if (checkUrl(src)) {
            return src;
        }

        newSrc = (src[0] !== '/') ? path.join(process.env.PWD, src) : src;
    } else if (src && typeof src === 'object' && src.hasOwnProperty('length')) {
        newSrc = src.map(function (val) { return getPath(val); });
    }

    return newSrc;
}

/**
 * Verify if config is right
 * @param  {object} config
 * @return {boolean}
 */
function verify(config) {
    var result = Joi.validate(config, STRUCT);
    var value = result.value;
    var schema;
    var task;
    var i;
    var c;

    if (result.error) {
        return {
            error: { type: 'root', err: result.error }
        };
    }

    // Lets check data now
    for (i = 0; i < value.tasks.length; i += 1) {
        task = value.tasks[i];
        schema = tasks[task.type].struct;

        for (c = 0; c < task.data.length; c += 1) {
            result = Joi.validate(task.data[c], schema);

            if (result.error) {
                return {
                    error: { type: task.type, msg: result.error }
                };
            }

            task.data[c] = result.value;
        }
    }

    return { value: value };
}

/**
 * Gets tasks
 * @param  {object} config
 * @param  {string} type
 * @param  {string} env
 * @return {array}
 */
function getTasks(config, type, env) {
    var tTasks = config.tasks;
    var internTasks = [];
    var c;
    var i;

    // Lets filter!
    tTasks = tTasks.filter(function (task) {
        var isType = task.type === type;
        var isEnv = task.env === '*' || env === task.env;

        return isType && isEnv;
    }).map(function (task) {
        return task.data;
    });

    // Go per task...
    for (i = 0; i < tTasks.length; i += 1) {
        for (c = 0; c < tTasks[i].length; c += 1) {
            tTasks[i][c].projectId = config.projectId;
            tTasks[i][c].projectName = config.projectName;
            tTasks[i][c].src = getPath(tTasks[i][c].src);
            tTasks[i][c].dest = getPath(tTasks[i][c].dest);

            internTasks.push(tTasks[i][c]);
        }
    }

    return internTasks;
}

/**
 * Set tasks
 * @param {function} fn
 * @param {array} tasks
 * @param {Function} cb
 */
function setTasks(fn, tTasks, cb) {
    var cbs = [];

    // Maybe there isn't anything
    cbs.length === tTasks.length && cb();

    // Lets go per task
    tTasks.forEach(function (task) {
        fn(task, function () {
            cbs.push(1);
            cbs.length === tTasks.length && cb();
        });
    });
}

/**
 * Run task
 *
 * @param {string} task
 * @param {object} config
 * @param {function} cb
 */
function run(task, config, env, cb) {
    try {
        setTasks(tasks[task].fn, getTasks(config, task, env), cb);
    } catch (err) {
        cb(err);
    }
}

/**
 * Initialize
 *
 * @param {object} config
 * @returns {object}
 */
function init(config) {
    config = verify(config);

    // Verify config
    if (config.error) {
        logger.err('Validation', 'Error happened in: ' + config.error.type);
        throw new Error(config.error.msg);
    } else {
        config = config.value;
    }

    return config;
}

// ------------------------------------
// Export

module.exports = {
    init: init,
    run: run,
    setTasks: setTasks,
    getTasks: getTasks,
    getPath: getPath
};
