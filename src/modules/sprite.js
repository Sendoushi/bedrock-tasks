/* eslint-disable strict */'use strict';/* eslint-enable strict */

var path = require('path');
var Joi = require('joi');
var gulp = require('gulp');
var gulpSpritesmith = require('gulp.spritesmith');
var gulpSvgSprite = require('gulp-svg-sprites');
var imagemin = require('gulp-imagemin');
var merge = require('merge-stream');
var buffer = require('vinyl-buffer');
var utilsPath = require('bedrock-utils/src/node/path.js');
var type = require('bedrock-utils/src/type.js');

var OPTIONS_STRUCT = Joi.object().keys({
    style: Joi.string(),
    styleTemplate: Joi.string(),
    // SVG related
    preview: Joi.boolean(),
    mode: Joi.string().default('defs'),
    baseSize: Joi.number(),
    selector: Joi.string().default('%f'),
    svgId: Joi.string().default('%f'),
    transformData: Joi.string()
}).default({
    mode: 'defs',
    selector: '%f',
    svgId: '%f'
});

var STRUCT = Joi.object().keys({
    src: Joi.alternatives().try(
        Joi.array(Joi.string()),
        Joi.string()
    ).required(),
    dest: Joi.string().required(),
    ignore: Joi.alternatives().try(
        Joi.array(Joi.string()),
        Joi.string()
    ).default([]),
    // order: Joi.number().default(0),
    options: OPTIONS_STRUCT
});

var SPRITE_TEMPLATE = path.resolve(path.join(__dirname, '_assets/sprite_template.css.handlebars'));

//-------------------------------------
// Functions

/**
 * Is svg
 *
 * @param {array} srcs
 * @returns boolean
 */
function isSvg(srcs) {
    var src;
    var i;

    for (i = 0; i < srcs.length; i += 1) {
        src = srcs[i];

        if (src[0] === '!') {
            continue;
        }

        if (src.replace('.svg', '') !== src) {
            return true;
        }
    }

    return false;
}

/**
 * Is image
 *
 * @param {array} srcs
 * @returns boolean
 */
function isImage(srcs) {
    var src;
    var i;

    for (i = 0; i < srcs.length; i += 1) {
        src = srcs[i];

        if (src[0] === '!') {
            continue;
        }

        if (src.replace('.png', '') !== src || src.replace('.jpg', '') !== src) {
            return true;
        }
    }

    return false;
}

/**
 * Initialize tasks
 * @param  {object} task
 * @param  {function} cb
 */
function gulpBuild(task, cb) {
    var src = type.isArray(task.src) ? task.src : [task.src];
    var gulpTask = gulp.src(src);
    var svg = isSvg(src);
    var image = isImage(src);
    var cssName = task.options.style ? path.basename(task.options.style) : 'sprite';
    var cssTemplate = task.options.styleTemplate && utilsPath.getPwd(task.options.styleTemplate) || SPRITE_TEMPLATE;
    var dest = task.dest;
    var baseName = path.basename(dest);
    var called = false;
    var imgStream;
    var cssStream;
    var options;

    if (image) {
        gulpTask = gulpTask.pipe(gulpSpritesmith({
            imgName: path.basename(dest), cssName: cssName, cssTemplate: cssTemplate, padding: 1
        }));

        // Lets take care of image
        imgStream = gulpTask.img
        // DEV: We must buffer our stream into a Buffer for `imagemin`
        .pipe(buffer())
        .pipe(imagemin())
        .pipe(gulp.dest(path.dirname(dest)));

        // Lets take care of css
        cssStream = gulpTask.css.pipe(gulp.dest(cssName));

        // Return a merged stream to handle both `end` events
        return merge(imgStream, cssStream)
        .on('end', function () { called = true; if (!called) { return false; } cb(); })
        .on('close', function () { called = true; if (!called) { return false; } cb(); })
        .on('finish', function () { called = true; if (!called) { return false; } cb(); });
    }

    if (svg) {
        task.options = task.options || {};
        options = {
            mode: task.options.mode,
            selector: task.options.selector,
            svgId: task.options.svgId,
            svg: {
                sprite: 'sprite.svg',
                defs: 'defs.svg',
                symbols: 'symbols.svg'
            }
        };

        if (task.options.preview === false) {
            options.preview = false;
        }
        if (task.options.style) {
            options.cssFile = task.options.style;
        }
        if (task.options.baseSize) {
            options.baseSize = task.options.baseSize;
        }

        if (task.options.transformData) {
            options.transformData = function (data, config) {
                /* eslint-disable no-new-func */
                return Function(task.options.transformData)(data, config);
                /* eslint-enable no-new-func */
            };
        }

        gulpTask = gulpTask.pipe(gulpSvgSprite(options));

        if (baseName.replace('svg', '') !== baseName) {
            dest = path.dirname(dest);
        }

        return gulpTask.pipe(gulp.dest(dest))
        .on('end', function () { called = true; if (!called) { return false; } cb(); })
        .on('close', function () { called = true; if (!called) { return false; } cb(); })
        .on('finish', function () { called = true; if (!called) { return false; } cb(); });
    }
}

// --------------------------------
// Export

module.exports = {
    STRUCT: STRUCT,
    build: gulpBuild
};
