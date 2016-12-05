/* eslint-disable strict */'use strict';/* eslint-enable strict */

var Joi = require('joi');
var logger = require('bedrock-utils/src/logger.js');
var utilsPath = require('bedrock-utils/src/node/path.js');
var type = require('bedrock-utils/src/type.js');

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
function getTasks(config, tType, env) {
    var tTasks = config.tasks || [];
    var internTasks = [];
    var ignore;
    var src;
    var c;
    var i;

    if (!tType || !tasks[tType]) {
        throw new Error('Set a valid type');
    }

    // Lets filter!
    tTasks = tTasks.filter(function (task) {
        var isType = task.type === tType;
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
            tTasks[i][c].dest = utilsPath.getPwd(tTasks[i][c].dest);

            // Take care of source and ignore
            src = utilsPath.getPwd(tTasks[i][c].src);
            src = !type.isArray(src) ? [src] : src;
            ignore = tTasks[i][c].ignore || [];
            ignore = !type.isArray(ignore) ? [ignore] : ignore;
            ignore = utilsPath.getPwd(ignore).map(val => '!' + val);
            tTasks[i][c].src = src.concat(ignore);

            internTasks.push(tTasks[i][c]);
        }
    }

    return internTasks;
}

/**
 * Set tasks
 * @param {function} fn
 * @param {array} tasks
 * @param {function} cb
 */
function setTasks(fn, tTasks, cb) {
    var cbs = [];
    var hasErrored = false;

    if (!fn) {
        throw new Error('A function is required');
    }

    tTasks = tTasks || [];

    // Maybe there isn't anything
    cbs.length === tTasks.length && cb();

    // Lets go per task
    tTasks.forEach(function (task) {
        if (hasErrored) {
            return;
        }

        fn(task, function (err) {
            if (hasErrored) {
                return;
            }

            if (err) {
                hasErrored = true;

                if (cb) {
                    cb(err);
                } else {
                    throw err;
                }
            }

            cbs.push(1);
            cb && cbs.length === tTasks.length && cb();
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
    var tTasks;

    if (typeof env === 'function') {
        cb = env;
        env = null;
    }

    if (!task || !tasks[task] || !tasks[task].fn) {
        return cb(new Error('Task is required'));
    }

    if (!config) {
        return cb(new Error('Config is required'));
    }

    try {
        tTasks = getTasks(config, task, env);
        setTasks(tasks[task].fn, tTasks, cb);
    } catch (err) {
        if (cb) {
            cb(err);
        } else {
            throw err;
        }
    }
}

/**
 * Initialize
 *
 * @param {object} config
 * @param {boolean} dontLog
 * @returns {object}
 */
function init(config, dontLog) {
    var msg;

    config = verify(config);

    // Verify config
    if (config.error) {
        msg = 'Error happened in: ' + config.error.type;
        if (config.error.ValidationError) {
            msg += ' ' + config.error.ValidationError;
        }

        !dontLog && logger.err('Validation', 'Error happened in: ' + msg);
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
    getTasks: getTasks
};
