/* eslint-disable strict */'use strict';/* eslint-enable strict */

var fs = require('fs');
var gulp = require('gulp');
var sass = require('node-sass');
var gulpSass = require('gulp-sass');
var gulpLess = require('gulp-less');
var postcss = require('postcss');
var autoprefixer = require('autoprefixer');
var gulpAutoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var Joi = require('joi');
var type = require('bedrock-utils/src/type.js');

var OPTIONS_STRUCT = Joi.object().keys({
    minify: Joi.boolean().default(true),
    autoprefixer: Joi.array().default(['last 2 versions']),
    sourceMap: Joi.boolean().default(false),
    include: Joi.array().items(Joi.string()).default([])
}).default({
    minify: true,
    autoprefixer: ['last 2 versions'],
    sourceMap: false,
    include: []
});

var STRUCT = Joi.object().keys({
    src: Joi.alternatives().try(
        Joi.array(Joi.string()),
        Joi.string()
    ).required(),
    dest: Joi.string().required(),
    // ignore: Joi.alternatives().try(
    //     Joi.array(Joi.string()),
    //     Joi.string()
    // ).default([]),
    // order: Joi.number().default(0),
    options: OPTIONS_STRUCT
});

//-------------------------------------
// Functions

/**
 * Is less
 *
 * @param {array} srcs
 * @returns boolean
 */
function isLess(srcs) {
    var src;
    var i;

    for (i = 0; i < srcs.length; i += 1) {
        src = srcs[i];

        if (src[0] === '!') {
            continue;
        }

        if (src.replace('.less', '') !== src) {
            return true;
        }
    }

    return false;
}

/**
 * Is sass
 *
 * @param {array} srcs
 * @returns boolean
 */
function isSass(srcs) {
    var src;
    var i;

    for (i = 0; i < srcs.length; i += 1) {
        src = srcs[i];

        if (src[0] === '!') {
            continue;
        }

        if (src.replace('.scss', '') !== src || src.replace('.sass', '') !== src) {
            return true;
        }
    }

    return false;
}

/**
 * Raw build
 * @param  {object} task
 * @param  {function} cb
 * @return {string}
 */
function rawBuild(task, cb) {
    // Index is setting up an array but we can only support one for now
    var src = !type.isArray(task.src) ? task.src : task.src[0];
    var css = sass.renderSync({
        file: src,
        outputStyle: task.options.minify ? 'compressed' : 'expanded',
        sourceMap: task.options.sourceMap,
        sourceMapEmbed: task.options.sourceMap,
        sourceMapContents: task.options.sourceMap
    }).css;

    // The prefixer...
    if (task.options.autoprefixer && task.options.autoprefixer.length) {
        css = postcss(autoprefixer({
            browsers: task.options.autoprefixer
        })).process(css).css;
    }

    task.dest && fs.writeFileSync(task.dest, css);
    cb();

    return css;
}

/**
 * Gulp build
 * @param  {object}
 * @param  {function} cb
 */
function gulpBuild(task, cb) {
    var src = type.isArray(task.src) ? task.src : [task.src];
    var gulpTask = gulp.src(src);
    var isItSass = isSass(src);
    var isItLess = isLess(src);

    if (isItSass) {
        gulpTask = gulpTask.pipe(gulpSass().on('error', gulpSass.logError));
    } else if (isItLess) {
        // Nothing to do here...
    } else {
        return;
    }

    if (task.options.sourceMap) {
        // TODO: Not working!
        gulpTask = gulpTask.pipe(sourcemaps.init());
    }

    if (isItSass) {
        gulpTask = gulpTask.pipe(gulpSass({
            outputStyle: task.options.minify ? 'compressed' : 'expanded'
        }).on('error', gulpSass.logError));
    } else if (isItLess) {
        gulpTask = gulpTask.pipe(gulpLess());
    }

    if (task.options.sourceMap) {
        gulpTask = gulpTask.pipe(sourcemaps.write());
    }

    if (task.options.autoprefixer.length) {
        gulpTask = gulpTask.pipe(gulpAutoprefixer({
            browsers: task.options.autoprefixer,
            cascade: false
        }));
    }

    return gulpTask.pipe(gulp.dest(task.dest))
    .on('end', function () { cb(); });
}

// --------------------------------
// Export

module.exports = {
    STRUCT: STRUCT,
    OPTIONS_STRUCT: OPTIONS_STRUCT,
    build: gulpBuild,
    raw: rawBuild
};
