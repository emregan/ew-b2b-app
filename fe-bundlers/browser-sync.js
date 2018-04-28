// const browserSync = require('browser-sync').create('hmhco');
const paths = require('./helpers/paths.js');
const browserSync = require('browser-sync').create('hmhco');

let delay;
let filesChanged = [];

const reloadPages = () => {
    browserSync.reload(filesChanged);
    filesChanged = [];
}

const reloadForPageAsset = (file) => {
    const fielName = file.split('/');
    filesChanged.push( fielName[fielName.length-1] );
    clearTimeout(delay);
    delay = setTimeout(reloadPages, 1000);
}

browserSync.init({
    proxy: "localhost:3030",
    files: paths.watch.html
});

browserSync.watch([
    paths.projectRoot+'/dist/public/css/*.css',
    paths.projectRoot+'/dist/public/js/*.js'
]).on('change', reloadForPageAsset);

browserSync.watch(paths.projectRoot+'/views/**/*').on('change', browserSync.reload);

