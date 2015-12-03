'use strict';

import path from 'path';

/* global process */

let dashdash = false;
let optionWrap = false;

var args = process.argv.slice (2).filter (arg => {
  if (dashdash) {
    return !!arg;
  } else if (arg === '--') {
    dashdash = true;
  } else if (arg === '--wrap') {
    optionWrap = true;
  } else {
    return !!arg;
  }
});

const rootDir = path.join (process.cwd (), args[0]);

if (args.length < 3) {
  console.error ('Usage: electrum-require-components <relative-root> <dir> <suffix> <output>');
  console.error ('  additional options:');
  console.error ('  --wrap     Wraps all components with Electrum.wrap()');
  process.exit (1);
}

import main from './main.js';

main (rootDir, args, optionWrap);
