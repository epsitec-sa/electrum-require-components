'use strict';

import processDirectory from './process-directory.js';
import emit from './source-emitter.js';
import path from 'path';
import fs from 'fs';

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

if (args.length < 3) {
  console.error ('Usage: electrum-require-components <relative-root> <dir> <suffix> <output>');
  console.error ('  additional options:');
  console.error ('  --wrap     Wraps all components with E.wrapComponent()');
  process.exit (1);
}

const rootDir    = path.join (process.cwd (), args[0]);
const dir        = args[1].split (/[\\/]/);
const suffix     = args[2];
const outputPath = args.length > 3 ? path.join (rootDir, args[3]) : null;

function emitSource (result) {
  if (optionWrap) {
    return emit (result, `import {E} from 'electrum';`, name => `E.wrapComponent ('${name}', ${name})`);
  } else {
    return emit (result);
  }
}

processDirectory (rootDir, dir, suffix, (err, result) => {
  if (err) {
    console.error (err);
    process.exit (1);
  }
  if (result) {
    const source = emitSource (result);
    if (!outputPath) {
      console.log (source);
    } else {
      fs.writeFile (outputPath, source, err => {
        if (err) {
          console.error (err);
          process.exit (1);
        } else {
          console.log ('Generated ' + outputPath + ', ' + source.split ('\n').length + ' lines');
        }
      });
    }
  }
});
