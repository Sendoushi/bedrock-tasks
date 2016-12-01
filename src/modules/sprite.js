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
    src: Joi.string().required(),
    dest: Joi.string().required(),
    // ignore: Joi.string().default('').allow(''),
    // order: Joi.number().default(0),
    options: OPTIONS_STRUCT
});

var SPRITE_TEMPLATE = './_assets/sprite_template.css.handlebars';

//-------------------------------------
// Functions

/**
 * Initialize tasks
 * @param  {object} task
 * @param  {function} cb
 */
function gulpBuild(task, cb) {
    var gulpTask = gulp.src(task.src);
    var isSvg = task.src.replace('.svg', '') !== task.src;
    var isImage = task.src.replace('.png', '') !== task.src || task.src.replace('.jpg', '') !== task.src;
    var dest = task.dest;
    var imgStream;
    var cssStream;
    var options;

    if (isImage) {
        gulpTask = gulpTask.pipe(gulpSpritesmith({
            imgName: path.basename(dest),
            cssName: path.basename(task.options.style),
            cssTemplate: utilsPath.getPwd(task.options.styleTemplate) || path.resolve(SPRITE_TEMPLATE),
            padding: 1
        }));

        // Lets take care of image
        imgStream = gulpTask.img
        // DEV: We must buffer our stream into a Buffer for `imagemin`
        .pipe(buffer())
        .pipe(imagemin())
        .pipe(gulp.dest(path.dirname(dest)));

        // Lets take care of css
        cssStream = gulpTask.css
        .pipe(gulp.dest(path.dirname(task.options.style)));

        // Return a merged stream to handle both `end` events
        return merge(imgStream, cssStream)
        .on('end', function () { cb(); });
    }

    if (isSvg) {
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

        if (path.basename(dest) === 'svg') {
            dest = path.dirname(dest);
        }

        return gulpTask.pipe(gulp.dest(dest))
        .on('end', function () { cb(); });
    }
}

// --------------------------------
// Export

module.exports = {
    STRUCT: STRUCT,
    build: gulpBuild
};
