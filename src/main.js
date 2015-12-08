'use strict';

import processDirectory from './process-directory.js';
import emit from './source-emitter.js';
import path from 'path';
import fs from 'fs';

/* global process */

/******************************************************************************/

export default function main (rootDir, args, options) {
  const dir        = args[1].split (/[\\/]/);
  const suffix     = args[2];
  const outputPath = args.length > 3 ? path.join (rootDir, args[3]) : null;

  function emitWrap (name, filePath, more) {
    if (more.length === 0) {
      return `Electrum.wrap ('${name}', _${name})`;
    } else {
      return `Electrum.wrap ('${name}', _${name}, {${more.map (x => `${x}: _${name}$${x}`).join (', ')}})`;
    }
  }

  function emitSource (result) {
    if (options.optionWrap) {
      return emit (result, `import Electrum from 'electrum';`, emitWrap);
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
      let source = emitSource (result);
      if (!outputPath) {
        console.log (source);
      } else {
        if (options.optionCrlf) {
          source = source.split ('\n').join ('\r\n');
        }
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
}

/******************************************************************************/
