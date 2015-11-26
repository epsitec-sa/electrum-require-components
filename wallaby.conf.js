/*globals __dirname */
'use strict';

var babel = require ('babel-core');
var fs = require ('fs');
var path = require ('path');

var babelConfig = JSON.parse (fs.readFileSync (path.join (__dirname, '.babelrc')));

babelConfig.babel = babel;

module.exports = function (wallaby) {
  return {
    files: [
      {pattern: 'src/sample/**/*.js'},
      {pattern: 'test/test-helper.js'},
      {pattern: 'src/*.js'}
    ],
    tests: [
      {pattern: 'src/test/**/*.js'},
    ],
    compilers: {
      '**/*.js*': wallaby.compilers.babel (babelConfig)
    },
    debug: true,
    env: {
      type: 'node',
      runner: 'node'
    },
    bootstrap: function () {
    },
    teardown: function () {
    }
  };
};
