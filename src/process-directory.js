'use strict';

import fs from 'fs';
import path from 'path';

/******************************************************************************/

function findSuffixes (name, files) {
  let result = [];
  for (let file of files) {
    const regex = new RegExp (`${name}\.([a-zA-Z]+)\.js`);
    const match = file.match (regex);
    if (match) {
      result.push (match[1]);
    }
  }
  return result;
}

/******************************************************************************/

export default function processDirectory (root, dir, suffix, next) {
  if (typeof dir === 'string') {
    dir = [dir];
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
      const filePath = [...dirs, file].join (path.sep);
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
  fs.lstat (rootPath, (err, stats) => {
    if (err) {
      next (err);
    } else {
      fs.readdir (rootPath, (err, files) => {
        let pending = files.length;
        for (let file of files) {
          const filePath = path.join (root, ...dirs, file);
          fs.lstat (filePath, (err, stats) => {
            if (err) {
              next (err);
            } else {
              if (stats.isDirectory ()) {
                traverse (root, [...dirs, file], collect, err => {
                  if (err) {
                    next (err);
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
