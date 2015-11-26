'use strict';


function getImport (name, path) {
  return `import ${name} from './${path}';`;
}

function getExport (inject, name, path) {
  if (inject) {
    return `module.exports.${name} = ${inject (name, path)};`;
  } else {
    return `module.exports.${name} = ${name};`;
  }
}


export default function emit (components, require, inject) {
  const imports = components.map (x => getImport (...x));
  const exports = components.map (x => getExport (inject, ...x));
  const head = `'use strict';` + '\n' + (require || '') + '\n';
  return head + imports.join ('\n') + '\n' + exports.join ('\n') + '\n';
}
