'use strict';

import {expect} from 'mai-chai';

import emit from '../source-emitter.js';

describe ('Require components', () => {
  describe ('emit()', () => {
    it ('produces expected source code', () => {
      const result = emit ([['a', 'bla/a.js', ['xyz']], ['b', 'foo/b.js', []]]);
      expect (result).to.equal (`'use strict';

import _a from './bla/a.js';
import _a$xyz from './bla/a.xyz.js';
import _b from './foo/b.js';
export const a = _a;
export const b = _b;
`);
    });
    it ('produces expected source code with additional require', () => {
      const result = emit ([['a', 'bla/a.js', ['xyz']], ['b', 'foo/b.js', []]],
        `require foo from 'foo';`);
      expect (result).to.equal (`'use strict';
require foo from 'foo';
import _a from './bla/a.js';
import _a$xyz from './bla/a.xyz.js';
import _b from './foo/b.js';
export const a = _a;
export const b = _b;
`);
    });
    it ('produces expected source code with additional require and inject', () => {
      const result = emit ([['a', 'bla/a.js', ['xyz', 'qrs']], ['b', 'foo/b.js', []]],
        `require foo from 'foo';`,
        (name, filePath, more) => `foo ('${name}', _${name}${more.length === 0 ? '' : ', {' + more.map (x => `${x}: _${name}$${x}`).join (', ') + '}'})`
      );
      expect (result).to.equal (`'use strict';
require foo from 'foo';
import _a from './bla/a.js';
import _a$xyz from './bla/a.xyz.js';
import _a$qrs from './bla/a.qrs.js';
import _b from './foo/b.js';
export const a = foo ('a', _a, {xyz: _a$xyz, qrs: _a$qrs});
export const b = foo ('b', _b);
`);
    });
  });
});
