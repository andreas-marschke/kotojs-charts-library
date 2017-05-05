/*eslint-env node*/
"use strict";
var webpack = require("webpack");
var path = require("path");

var config = {
  context: __dirname + "/assets/js/",
  // the entry point of your library
  entry: {
    area: "./lib/entry.js"
  },
  // where 3rd-party modules can reside
  resolve: {
    modulesDirectories: ["node_modules", "assets/vendor"]
  },

  resolveLoader: {
    root: path.join(__dirname, "node_modules")
  },

  output: {
    // where to put standalone build file
    path: path.join(__dirname, "dist"),
    publicPath: "/dist/",
    // the name of the standalone build file
    filename: "js/chart.js",
    // the standalone build should be wrapped in UMD for interop
    libraryTarget: "umd",
    // the name of your library in global scope
    library: "KotoChartLibrary"
  },
  externals: {
    // Specify all libraries a user need to have in his app,
    // but which can be loaded externally, e.g. from CDN
    // or included separately with a <script> tag
    "koto": {
      root: "Koto",
      commonjs: "koto",
      commonjs2: "koto",
      amd: "koto"
    },
    "d3": "d3",
    "d3-tip": "d3-tip"
  },

  plugins: [
    new webpack.DefinePlugin({
      ON_DEV: process.env.NODE_ENV === "development" || !process.env.NODE_ENV,
      ON_TEST: process.env.NODE_ENV === "test",
      ON_PROD: process.env.NODE_ENV === "production"
    })
  ],

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|assets\/vendor)/,
        loader: "babel-loader",
        query: {
          presets: ["latest"]
        }
      }
    ]
  },
  devtool: "source-map",

  devServer: {
    contentBase: "",
    noInfo: false, //  --no-info option
    hot: true,
    inline: true
  }
};

if (process.env.NODE_ENV === "production") {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = config;
