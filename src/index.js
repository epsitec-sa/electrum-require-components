'use strict';

import processDirectory from './process-directory.js';
import emit from './source-emitter.js';
import path from 'path';
import fs from 'fs';

/* global process */

var args = process.argv.slice (2);

if (args.length < 2) {
  console.error ('Usage: electrum-require-components <dir> <suffix> <output>');
  process.exit (1);
}

const rootDir    = path.join (process.cwd ());
const dir        = args[0].split (/[\\/]/);
const suffix     = args[1];
const outputPath = args.length > 2 ? path.join (rootDir, args[2]) : null;

processDirectory (rootDir, dir, suffix, (err, result) => {
  if (err) {
    console.error (err);
    process.exit (1);
  }
  if (result) {
    const source = emit (result);
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
