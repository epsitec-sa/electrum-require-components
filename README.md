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
import _CheckBox from './widgets/Buttons/CheckBox.component.js'
import _Panel from './widgets/Layout/Panel.component.js';
export const CheckBox = Electrum.wrap ('CheckBox', _CheckBox);
export const Panel = Electrum.wrap ('Panel', _Panel);
```

And the same example without `--wrap`:

```javascript
'use strict';
import _CheckBox from './widgets/Buttons/CheckBox.component.js'
import _Panel from './widgets/Layout/Panel.component.js';
export const CheckBox = _CheckBox;
export const Panel = _Panel;
```

## Companion files

If there are companion files (e.g. `Panel.styles.js` located beside
the `Panel.component.js` file), then they will also get imported and
provided to `Electrum.wrap` as an additional argument:

```javascript
'use strict';
import Electrum from 'electrum';
import _Panel from './widgets/Layout/Panel.component.js';
import _Panel$about from './widgets/Layout/Panel.about.js';
import _Panel$styles from './widgets/Layout/Panel.styles.js';
export const Panel = Electrum.wrap ('Panel', _Panel, {about: _Panel$about, styles: _Panel$styles});
```
