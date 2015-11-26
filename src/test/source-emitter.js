'use strict';

import {expect} from 'mai-chai';

import emit from '../source-emitter.js';

describe ('Require components', () => {
  describe ('emit()', () => {
    it ('produces expected source code', () => {
      const result = emit ([['a', 'bla/a.js'], ['b', 'foo/b.js']]);
      expect (result).to.equal (`'use strict';

import a from './bla/a.js';
import b from './foo/b.js';
module.exports.a = a;
module.exports.b = b;
`);
    });
    it ('produces expected source code with additional require', () => {
      const result = emit ([['a', 'bla/a.js'], ['b', 'foo/b.js']],
        `require foo from 'foo';`);
      expect (result).to.equal (`'use strict';
require foo from 'foo';
import a from './bla/a.js';
import b from './foo/b.js';
module.exports.a = a;
module.exports.b = b;
`);
    });
    it ('produces expected source code with additional require and inject', () => {
      const result = emit ([['a', 'bla/a.js'], ['b', 'foo/b.js']],
        `require foo from 'foo';`,
        name => `foo (${name}, '${name}')`
      );
      expect (result).to.equal (`'use strict';
require foo from 'foo';
import a from './bla/a.js';
import b from './foo/b.js';
module.exports.a = foo (a, 'a');
module.exports.b = foo (b, 'b');
`);
    });
  });
});
