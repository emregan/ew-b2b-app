'use strict';
const paths = require('../helpers/paths.js');
const gulp = require('gulp');

module.exports = () => {
    gulp.watch(paths.watch.scss, ['scss']);
}
