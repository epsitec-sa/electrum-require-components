# electrum-require-components

[![NPM version](https://img.shields.io/npm/v/electrum-require-components.svg)](https://www.npmjs.com/package/electrum-require-components)

This tool synthesizes a source file with a list of requires.

```
electrum-require-components --wrap ./src widgets .component.js all.js
```

Produces file `./src/all.js` while recursively exploring folder `widgets`
found in the source folder `./src`, looking for `*.component.js`.

The `--wrap` option inserts calls to `Electrum.wrap()`.

Here is an example of a resulting source file with `--wrap`:

```javascript
'use strict';
import Electrum from 'electrum';
import CheckBox from './widgets/Buttons/CheckBox.component.js'
import Panel from './widgets/Layout/Panel.component.js';
module.exports.CheckBox = Electrum.wrap ('CheckBox', CheckBox);
module.exports.Panel = Electrum.wrap ('Panel', Panel);
```

And the same example without `--wrap`:

```javascript
'use strict';
import CheckBox from './widgets/Buttons/CheckBox.component.js'
import Panel from './widgets/Layout/Panel.component.js';
module.exports.CheckBox = CheckBox;
module.exports.Panel = Panel;
```
