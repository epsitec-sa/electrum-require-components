import fs from 'fs';
import path from 'path';

/******************************************************************************/

function findSuffixes (name, files) {
  let result = [];
  for (let file of files) {
    const regex = new RegExp (`${name}\\.([a-zA-Z]+)\\.js`);
    const match = file.match (regex);
    if (match) {
      if (file.startsWith (name)) {
        result.push (match[1]);
      }
    }
  }
  return result;
}

/******************************************************************************/

export default function processDirectory (root, dir, suffix, next) {
  if (typeof dir === 'string') {
    dir = [ dir ];
  }
  if (Array.isArray (dir) === false) {
    throw new Error ('dir should be a string or an array of strings');
  }

  const filter  = new RegExp (suffix.replace ('.', '\\.') + '$');
  const pattern = new RegExp ('([^\\/\\\\]+)' + filter.source);
  let   result  = [];

  function extract (dirs, file, files) {
    const matches = file.match (pattern);
    if (matches) {
      const name = matches[1];
      const filePath = [...dirs, file].join ('/');
      const suffixes = findSuffixes (name, files.filter (x => x !== file));
      result.push ([name, filePath, suffixes]);
    }
  }

  traverse (root, dir, extract, err => {
    if (err) {
      next (err);
    } else {
      result.sort ((a, b) => a[1].localeCompare (b[1]));
      next (err, result);
    }
  });
}

/******************************************************************************/

function traverse (root, dirs, collect, next) {
  const rootPath = path.join (root, ...dirs);
  fs.lstat (rootPath, (err0) => {
    if (err0) {
      next (err0);
    } else {
      fs.readdir (rootPath, (_, files) => {
        let pending = files.length;
        for (let file of files) {
          const filePath = path.join (root, ...dirs, file);
          fs.lstat (filePath, (err1, stats) => {
            if (err1) {
              next (err1);
            } else {
              if (stats.isDirectory ()) {
                traverse (root, [...dirs, file], collect, err2 => {
                  if (err2) {
                    next (err2);
                  } else {
                    if (--pending === 0) {
                      next ();
                    }
                  }
                });
              } else {
                if (stats.isFile ()) {
                  collect (dirs, file, files);
                  if (--pending === 0) {
                    next ();
                  }
                }
              }
            }
          });
        }
      });
    }
  });
}

/******************************************************************************/
