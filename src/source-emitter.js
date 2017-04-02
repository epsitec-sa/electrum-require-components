import path from 'path';

/******************************************************************************/

function upperWord (name) {
  return name.charAt (0).toUpperCase () + name.slice (1);
}

function upper (name) {
  return name.split ('-').map (x => upperWord (x)).join ('');
}

function getImport (name, filePath) {
  return `import _${upper (name)} from './${filePath}';`;
}

function getImports (name, filePath, suffixes) {
  const dirPath = path.dirname (filePath);
  const list = [ getImport (name, filePath) ];
  for (let suffix of suffixes) {
    list.push (getImport (`${upper (name)}$${suffix}`, `${dirPath}/${name}.${suffix}.js`));
  }
  return list;
}

function getExport (inject, name, filePath, suffixes) {
  const Name = upper (name);
  if (inject) {
    const more = suffixes;
    return `export const ${Name} = ${inject (Name, filePath, more)};`;
  } else {
    return `export const ${Name} = _${Name};`;
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

/******************************************************************************/

export default function emit (components, require, inject) {
  const imports = flatten (components.map (x => getImports (...x)));
  const exports = components.map (x => getExport (inject, ...x));
  const head = (require ? require + '\n' : '');
  return head + imports.join ('\n') + '\n' + exports.join ('\n') + '\n';
}

/******************************************************************************/
