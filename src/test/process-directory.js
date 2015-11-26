'use strict';

import path from 'path';

import {expect} from 'mai-chai';
import {processDirectory} from '../process-directory.js';

const rootDir = path.join (__dirname, '..');

describe ('Require components', () => {
  describe ('processDirectory()', () => {
    it ('does not produce an error, with existing dir', done => {
      processDirectory (rootDir, 'sample', '.foo.js', err => {
        expect (err).to.be.undefined ();
        done ();
      });
    });

    it ('produces an error, with missing dir', done => {
      processDirectory (rootDir, 'xxx', '.foo.js', err => {
        expect (err).to.be.an.instanceof (Error);
        done ();
      });
    });

    it ('produces expected results', done => {
      processDirectory (rootDir, 'sample', '.foo.js', (err, result) => {
        expect (result).to.have.length (2);
        expect (result[0]).to.deep.equal (['a', 'sample/a/a.foo.js']);
        expect (result[1]).to.deep.equal (['b', 'sample/b/b.foo.js']);
        done ();
      });
    });
  });
});
