/* global describe it */

import {expect} from 'mai-chai';
import emit from '../src/source-emitter.js';

describe ('Require components', () => {
  describe ('emit()', () => {
    it ('produces expected source code', () => {
      const result = emit ([['a', 'bla/a.js', [ 'xyz' ]], ['b', 'foo/b.js', []]]);
      expect (result).to.equal (`'use strict';

import _A from './bla/a.js';
import _A$xyz from './bla/a.xyz.js';
import _B from './foo/b.js';
export const A = _A;
export const B = _B;
`);
    });
    it ('produces expected source code with additional require', () => {
      const result = emit ([['a', 'bla/a.js', [ 'xyz' ]], ['b', 'foo/b.js', []]],
        'require foo from \'foo\';');
      expect (result).to.equal (`'use strict';
require foo from 'foo';
import _A from './bla/a.js';
import _A$xyz from './bla/a.xyz.js';
import _B from './foo/b.js';
export const A = _A;
export const B = _B;
`);
    });
    it ('produces expected source code with additional require and inject', () => {
      const result = emit ([['a', 'bla/a.js', ['xyz', 'qrs']], ['b', 'foo/b.js', []]],
        'require foo from \'foo\';',
        (name, filePath, more) =>
          `foo ('${name}', _${name}${
            more.length === 0 ?
            '' :
            ', {' + more.map (x => `${x}: _${name}$${x}`).join (', ') + '}'})`
      );
      expect (result).to.equal (`'use strict';
require foo from 'foo';
import _A from './bla/a.js';
import _A$xyz from './bla/a.xyz.js';
import _A$qrs from './bla/a.qrs.js';
import _B from './foo/b.js';
export const A = foo ('A', _A, {xyz: _A$xyz, qrs: _A$qrs});
export const B = foo ('B', _B);
`);
    });
  });
});
