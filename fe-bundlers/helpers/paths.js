const join = require('path').join;
const fs = require('fs');

class GulpPaths{
    constructor(){
        // Absolute paths to project
        this.projectRoot = join(__dirname, '../..');
        // Absolute path to source files
        this.src = this.setSrc();
        // Directories to watch
        this.watch = this.setWatch();
        // where to drop compiled files
        this.dest = this.setDest();
    }

    setSrc(){
        return {
            scss: this.makeAbs('/src/public/scss/*.scss'),
            ts: this.getTypeScriptEntryPoints('/src/public/ts/'),
            tsconfig: this.makeAbs('/fe-bundlers/helpers/tsconfig.json'),
            core: this.makeAbs('/src/public/ts/core/'),
            service: this.makeAbs('/src/public/ts/services/'),
            module: this.makeAbs('/src/public/ts/modules/'),
            js: this.makeAbs('/src/public/js/lib/'),
        }
    }

    setWatch(){
        return {
            scss: this.makeAbs('/src/public/scss/**/*.scss'),
            ts: this.makeAbs('/src/public/ts/**/*.ts'),
            html: this.makeAbs('/views/**/*.twig'),
        }
    }

    setDest(){
        return {
            css: this.makeAbs('/dist/public/css/'),
            js: this.makeAbs('/dist/public/js/'),
        }
    }

    makeAbs(path){
        return this.projectRoot + path;
    }

    getTypeScriptEntryPoints(entryDirPath){
        let entries = {};
        const path = this.makeAbs(entryDirPath);
        const files = fs.readdirSync(path);
        const fileExtension = '.ts';

        files.forEach((entry)=>{
            let isTSfile = /\.ts/.test(entry);
            let keyName = entry.replace(fileExtension, '');
            if (!isTSfile) {
                return false;
            }
            entries[keyName] = path + entry;
        });

        return { path, entries };
    }
}
module.exports = new GulpPaths();
