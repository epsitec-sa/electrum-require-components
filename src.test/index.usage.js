/* global describe it __dirname */

import path from 'path';
import fs from 'fs';

import {expect} from 'mai-chai';

import processDirectory from '../src/process-directory.js';
import emit from '../src/source-emitter.js';

const rootDir = path.join (__dirname, '../src');
const outputPath = path.join (rootDir, 'foo.js');

describe ('Require components', () => {
  describe ('full scenario', () => {
    it ('emits source code', done => {
      processDirectory (rootDir, [ 'sample' ], '.foo.js', (_, result) => {
        if (result) {
          const source = emit (result);
          expect (source).to.be.not.empty ();
          fs.writeFile (outputPath, source, err => done (err));
        }
      });
    });
  });
});
