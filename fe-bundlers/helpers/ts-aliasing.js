const paths = require('./paths');
const fs = require('fs');

class tsAliasing {
    constructor() {
        this.ignoreFiles = ['.DS_Store'];
        this.fileTree = {};
        this.aliases = {};
        this.getTree();
    }

    getTree(){
        // console.log(paths.src.ts.path)

        this.fileTree.core = fs.readdirSync(paths.src.core).filter(this.filterFiles.bind(this));
        this.fileTree.module = fs.readdirSync(paths.src.module).filter(this.filterFiles.bind(this));
        this.fileTree.service = fs.readdirSync(paths.src.service).filter(this.filterFiles.bind(this));

        Object.keys(this.fileTree).forEach(this.sectionLoop.bind(this));
    }


    sectionLoop(sectionName) {
        this.fileTree[sectionName].forEach(
            (moduleName)=>this.assignAlias(sectionName, moduleName)
        );
    }

    filterFiles(fileName){
        return (this.ignoreFiles.indexOf(fileName) == -1)
    }

    assignAlias(sectionName, moduleName){
    const keyName = `@${sectionName}/${moduleName}`;
        const modulePath = `${paths.src[sectionName]}${moduleName}/${moduleName}.ts`;
    this.aliases[keyName] = modulePath;
    //this.aliases[`jquery`] = `/node_modules/jquery/dist/jquery.js`;
    //this.aliases[`foundation`] = `/node_modules/foundation-sites/js/foundation.core`;
    }
}

module.exports = new tsAliasing()
