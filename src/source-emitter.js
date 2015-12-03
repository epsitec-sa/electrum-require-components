'use strict';

import path from 'path';

function getImport (name, filePath) {
  return `import _${name} from './${filePath}';`;
}

function getImports (name, filePath, suffixes) {
  const dirPath = path.dirname (filePath);
  const list = [getImport (name, filePath)];
  for (let suffix of suffixes) {
    list.push (getImport (`${name}$${suffix}`, `${dirPath}/${name}.${suffix}.js`));
  }
  return list;
}

function getExport (inject, name, filePath, suffixes) {
  if (inject) {
    const more = suffixes;
    return `export const ${name} = ${inject (name, filePath, more)};`;
  } else {
    return `export const ${name} = _${name};`;
  }
}

function flatten (ary) {
  var ret = [];
  for (let value of ary) {
    if (Array.isArray (value)) {
      ret = ret.concat (flatten (value));
    } else {
      ret.push (value);
    }
  }
  return ret;
}

export default function emit (components, require, inject) {
  const imports = flatten (components.map (x => getImports (...x)));
  const exports = components.map (x => getExport (inject, ...x));
  const head = `'use strict';` + '\n' + (require || '') + '\n';
  return head + imports.join ('\n') + '\n' + exports.join ('\n') + '\n';
}
