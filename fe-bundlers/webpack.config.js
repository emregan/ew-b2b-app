// load from .env file
require('dotenv').config();

const paths = require('./helpers/paths');
const tsAliasing = require('./helpers/ts-aliasing');

const argv = require('yargs').argv;

const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

const babelOptions = {
  "presets": "es2015",
  "plugins": ["transform-object-assign"],
};

// Move this to tsAliasing class
tsAliasing.aliases.handlebars = 'handlebars/dist/handlebars.js';

paths.src.ts.entries.vendor = [
    'jquery',
    'inobounce',
    'foundation-sites',
    '@material/checkbox',
    '@material/menu',
    '@material/radio',
    '@material/select',
    '@material/textfield',
    'select2',
    'flexibility',
    'calc-polyfill',
    'jquery-validation',
    // Plugins below are used on HMH dev side, comment out as needed
    // 'shufflejs',
    // 'handlebars',
];

let wpConf = {
    cache: true,
    context: paths.projectRoot,
    devtool: 'source-map',
    entry: paths.src.ts.entries,

    output: {
        path: paths.dest.js,
        filename: '[name].bundle.js?v=[chunkhash:8]',
        sourceMapFilename: '[file].map',
    },

    plugins: [
        new webpack.DefinePlugin({
         "process.env": {
           NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production') // default value if not specified
         }
       }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
          // (the commons chunk name)

          filename: "vendor.bundle.js?v=[chunkhash:8]",
          // (the filename of the commons chunk)

          // minChunks: 3,
          // (Modules must be shared between 3 entries)

          chunks: paths.src.ts.vendor,
          // (Only use these entries)
        }),
        new ManifestPlugin({
            publicPath: '/js/',
            // stripSrc: new Rege,
            map: (file) => {
                file.name = file.name.replace(/\.[^.]+.*/, '')
                return file
            },
            filter: (file) => {
                return ( file.name.search('.map') == -1);
            }
        })
    ],

    module: {
        rules: [
        {
            test: /\.ts$/,
            use: [{
                loader: 'babel-loader',
                options: babelOptions
          }, {
                loader: 'ts-loader?' + JSON.stringify({ configFile: paths.src.tsconfig })
          }]
        }, {
            test: /(foundation|material).*?\.js$/,
            use: [{
                loader: 'babel-loader',
                options: babelOptions
            }]
        }, {
            test: require.resolve('jquery'),
            use: [{
                loader: 'expose-loader',
                options: '$'
            }, {
                loader: 'expose-loader',
                options: 'jQuery'
            }]
        }]
    },

    resolve: {
        extensions: [".ts", ".js"],
        alias: tsAliasing.aliases,
    }

}

// Uglify for production
if (process.env.NODE_ENV == 'production') {
    const uglifyConf = {
        sourceMap: true,
        uglifyOptions: {
            warnings: false
        },
    }

    wpConf.plugins.push(new UglifyJSPlugin(uglifyConf));
}

module.exports = wpConf;
