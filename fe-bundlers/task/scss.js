'use strict';
// paths
const paths = require('../helpers/paths.js');
const argv = require('yargs').argv;

// gulp plugins
const gulp = require('gulp');
const gulpif = require('gulp-if')
const sass = require('gulp-sass');
const notify = require("gulp-notify");
const sourcemaps = require('gulp-sourcemaps');
const rev = require('gulp-rev');

// scss plugins
const autoprefixer = require('gulp-autoprefixer');

let scssConfig = {}
scssConfig.outputStyle = argv.production ? 'compressed' : 'expanded'
scssConfig.sourceMapEmbed = true;
scssConfig.includePaths = ['../node_modules'];

const prefixConf = {
    browsers: [
    'last 2 versions',
    'ie >= 9',
    'iOS >= 5'
    ]
}

const notifyOpt = {
    message: 'SCSS - Complete',
    onLast: true
};

// formats the manifest the way webpack does it
const manifestTransformer = {
    parse: (...args) => {
        return JSON.parse.apply(JSON, args);
    },
    stringify: (data, ...args) => {
        const manifest = {};

        // remove .css from source filename
        // add /css/ path to dest filename
        Object.keys(data).forEach((key) => {
            manifest[key.replace(/\.css$/, '')] = `/css/${data[key]}`;
        });

        args.unshift(manifest);

        return JSON.stringify.apply(JSON, args);
    }
};

module.exports = () => {
    return gulp.src(paths.src.scss)
        .pipe( sourcemaps.init() )
        .pipe( sass(scssConfig).on('error', sass.logError))
        .pipe( autoprefixer(prefixConf) )
        .pipe( gulp.dest(paths.dest.css) )
        .pipe(
            gulpif( argv.production, rev() )
        )
        .pipe( sourcemaps.write('.') )
        .pipe(
            gulpif( argv.production, gulp.dest(paths.dest.css) )  // write rev'd assets to build dir
        )
        .pipe(
            gulpif( argv.production, rev.manifest({
                path: 'manifest.json',
                transformer: manifestTransformer
            }) )
        )
        .pipe(
            gulpif( argv.production, gulp.dest(paths.dest.css) )  // write manifest to build dir
        )
        .pipe(
            gulpif( !argv.production, notify(notifyOpt) )
        )
}
