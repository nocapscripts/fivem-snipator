//@ts-check

'use strict';

const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

/** @typedef {import('webpack').Configuration} WebpackConfig */

/** @type WebpackConfig */
const extensionConfig = {
  target: 'node', // VS Code extensions run in a Node.js-context 📖 -> https://webpack.js.org/configuration/node/
  mode: 'none', // leave source code as close to original as possible (for packaging, set to 'production')

  entry: './src/extension.ts', // 📖 https://webpack.js.org/configuration/entry-context/
  output: {
    path: path.resolve(__dirname, 'dist'), // 📖 https://webpack.js.org/configuration/output/
    filename: 'extension.js',
    libraryTarget: 'commonjs2'
  },
  externals: {
    vscode: 'commonjs vscode' // don't bundle the vscode module 📖 https://webpack.js.org/configuration/externals/
  },
  resolve: {
    extensions: ['.ts', '.js'] // support .ts and .js files
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              compilerOptions: {
                sourceMap: true
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin()
  ],
  devtool: 'nosources-source-map', // enable sourcemaps for better stack traces
  infrastructureLogging: {
    level: "log", // enables logging required for problem matchers
  },
  node: {
    __dirname: false,
    __filename: false
  }
};

module.exports = [extensionConfig];
