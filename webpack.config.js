/*
 * React.js Starter Kit
 * Copyright (c) Konstantin Tarkus (@koistya), KriaSoft LLC
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path';
import webpack, {DefinePlugin, BannerPlugin } from 'webpack';
import merge from 'lodash/object/merge';
import autoprefixer from 'autoprefixer-core';
import minimist from 'minimist';
import CompressionPlugin from 'compression-webpack-plugin';


const argv = minimist(process.argv.slice(2));
const DEBUG = !argv.release;
const STYLE_LOADER = 'style-loader/useable';
const CSS_LOADER = DEBUG ? 'css-loader' : 'css-loader?minimize';
const AUTOPREFIXER_BROWSERS = [
  'Android 2.3',
  'Android >= 4',
  'Chrome >= 20',
  'Firefox >= 24',
  'Explorer >= 8',
  'iOS >= 6',
  'Opera >= 12',
  'Safari >= 6'
];
const GLOBALS = {
  'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
  '__DEV__': DEBUG
};

//
// Common configuration chunk to be used for both
// client-side (app.js) and server-side (server.js) bundles
// -----------------------------------------------------------------------------

const config = {

  output: {
    publicPath: path.resolve(__dirname, '/'),
    sourcePrefix: '  '
  },

  cache: DEBUG,
  debug: DEBUG,

  stats: {
    colors: true,
    reasons: DEBUG
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/)
  ],

  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', 'json']
  },

  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: path.resolve(__dirname, './node_modules/'),
        loader: 'eslint-loader'
      }
    ],
    loaders: [
      {
        test: /\.css$/,
        loader: `${STYLE_LOADER}!${CSS_LOADER}!postcss-loader`
      },
      {
        test: /\.less$/,
        loader: `${STYLE_LOADER}!${CSS_LOADER}!postcss-loader!less-loader`
      },
      {
        test: /\.json$/,
        loader: "json-loader"
      },
      {
        test: /\.gif/,
        loader: 'url-loader?limit=10000&mimetype=image/gif'
      },
      {
        test: /\.jpg/,
        loader: 'url-loader?limit=10000&mimetype=image/jpg'
      },
      {
        test: /\.png/,
        loader: 'url-loader?limit=10000&mimetype=image/png'
      },
      {
        test: /\.svg/,
        loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
      },
      {
        test: /\.woff$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.ttf$/,
        loader: "url-loader?limit=10000&mimetype=application/octet-stream"
      },
      {
        test: /\.eot$/,
        loader: "file-loader"
      },
      {
        test: /\.jsx?$/,
        exclude: path.resolve(__dirname, './node_modules/'),
        loader: 'babel-loader'
      }
    ]
  },

  postcss: [autoprefixer(AUTOPREFIXER_BROWSERS)]
};

//
// Configuration for the client-side bundle (app.js)
// -----------------------------------------------------------------------------

const appConfig = merge({}, config, {
  entry: path.resolve(__dirname, './src/app.js'),
  output: {
    path: path.resolve(__dirname, './build/public'),
    filename: "app.[chunkhash].js"
  },
  devtool: DEBUG ? 'source-map' : false,
  plugins: config.plugins.concat([
      function() {
        this.plugin('done', function(stats) {
          var datas = stats.toJson(), stats;
          stats = path.join(__dirname, './', 'stats.json');
          require('fs').writeFileSync(stats, JSON.stringify(datas.assetsByChunkName));
        });
      },
      //new webpack.IgnorePlugin(/config.js$/),
      new DefinePlugin(merge(GLOBALS, {'__SERVER__': false})),
      new webpack.optimize.UglifyJsPlugin(),
      new CompressionPlugin({
        asset: "{file}.gz",
        algorithm: "gzip",
        regExp: /\.js$|\.css$/,
        threshold: 10240,
        minRatio: 0.8
      })
    ].concat(DEBUG ? [] : [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.MinChunkSizePlugin(),
      new webpack.optimize.AggressiveMergingPlugin()
    ])
  )
});

//
// Configuration for the server-side bundle (server.js)
// -----------------------------------------------------------------------------

const serverConfig = merge({}, config, {
  entry: [path.resolve(__dirname, './src/server.js')],
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'server.js',
    libraryTarget: 'commonjs2'
  },
  target: 'node',
  externals: /^[a-z][a-z\.\-0-9]*$/,
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false
  },
  devtool: DEBUG ? 'source-map' : 'cheap-module-source-map',
  plugins: config.plugins.concat(
    //new webpack.IgnorePlugin(/config.js$/),
    new DefinePlugin(merge(GLOBALS, {'__SERVER__': true})),
    new BannerPlugin('require("source-map-support").install();',
      { raw: true, entryOnly: false })
  ),
  module: {
    loaders: config.module.loaders.map(function(loader) {
      // Remove style-loader
      return merge(loader, {
        loader: loader.loader = loader.loader.replace(STYLE_LOADER + '!', '')
      });
    })
  }
});

//
// Configuration for the newRelic Nodejs Agent (server.js)
// -----------------------------------------------------------------------------

const newRelic = merge({}, config, {
  entry: [path.resolve(__dirname, './src/newrelic.js')],
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'newrelic.js',
    libraryTarget: 'commonjs2'
  }
})


//
// Configuration for the stats data for server.js require
// -----------------------------------------------------------------------------

const stats = merge({}, config, {
  entry: [path.resolve(__dirname, './stats.json')],
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'stats.json',
    libraryTarget: 'commonjs2'
  }
})


export default [stats, newRelic, appConfig, serverConfig];
