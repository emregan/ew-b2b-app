'use strict';
// paths
const path = require('../helpers/paths.js');
const argv = require('yargs').argv;

// gulp plugins
const gulp = require('gulp');
const gulpif = require('gulp-if')
const notify = require("gulp-notify");
const gutil = require('gulp-util');
const webpack = require('webpack-stream');

const webpackConfig = require('../helpers/webpack.config.js')
const notifyOpt = {
    message: 'Typescript - Complete',
    onLast: true
};

function wpError(err) {
    if (argv.production) {
        process.stdout.write(err.toString()+ '\n');
        process.exit(err ? 1 : 0);
    }
    return this.queue(null);
}

module.exports = () => {
    return gulp.src(path.src.ts.path)
        .pipe( webpack(webpackConfig) ).on('error', wpError)
        .pipe( gulp.dest(path.dest.js) )
        .pipe(
            gulpif( !argv.production, notify(notifyOpt) )
        )
}
