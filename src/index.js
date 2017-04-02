/* global process console */
/* eslint no-console: 0 */

import path from 'path';

let dashdash = false;
let optionWrap = false;
let optionCrlf = false;

var args = process.argv.slice (2).filter (arg => {
  if (dashdash) {
    return !!arg;
  } else if (arg === '--') {
    dashdash = true;
  } else if (arg === '--wrap') {
    optionWrap = true;
  } else if (arg === '--lf') {
    optionCrlf = false;
  } else if (arg === '--crlf') {
    optionCrlf = true;
  } else {
    return !!arg;
  }
});

const rootDir = path.join (process.cwd (), args[0]);

if (args.length < 3) {
  console.error ('Usage: electrum-require-components [options...] <relative-root> <dir> <suffix> <output>');
  console.error ('');
  console.error ('  additional options:');
  console.error ('  --wrap     Wraps all components with Electrum.wrap()');
  console.error ('  --lf       Force LF as line terminator (Unix-like source files)');
  console.error ('  --crlf     Force CR+LF as line terminator (Windows source files)');
  console.error ('');
  console.error ('By default, the line terminator is selected accordingly to the platform.');
  process.exit (1);
}

import main from './main.js';

main (rootDir, args, {optionWrap, optionCrlf});
