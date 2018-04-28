'use strict';
// gulp plugins
const gulp = require('gulp');
const sass = require('gulp-sass');

const scss = require('./task/scss');

/**
 * Build scss to static directory and EE css directory
 * create source map
 * cross browser with autoprefixer
 */
gulp.task('scss', scss);


/**
 * Build Js modules
 */
// gulp.task('browserify', browserify);

/**
 * Build Js modules
 */
// gulp.task('typescript', typescript);

// Temporary task to copy images and fonts.
gulp.task('asset-copy', ()=>{
    gulp.src('../src/public/fonts/*').pipe(gulp.dest('../dist/public/fonts'))
    gulp.src('../src/public/images/*').pipe(gulp.dest('../dist/public/images'))
    gulp.src('../src/public/favicon.ico').pipe(gulp.dest('../dist/public/'))
    gulp.src('../src/public/robots.txt').pipe(gulp.dest('../dist/public/'))
});

/**
 * build static FE assets
 */
gulp.task('build', [
	'scss',
    'asset-copy'
]);

/**
 * watch & build static assets
 */
// watch only build development tasks
gulp.task('watch', ['build'], require('./task/watch'));

// build assets with destributions tasks
gulp.task('default', ['build']);
