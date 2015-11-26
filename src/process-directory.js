'use strict';

import fs from 'fs';
import path from 'path';

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

  function extract (dirs, file) {
    const matches = file.match (pattern);
    if (matches) {
      const name = matches[1];
      const filePath = [...dirs, file].join ('/');
      result.push ([name, filePath]);
    }
  }

  traverse (root, dir, extract, err => {
    if (err) {
      next (err);
    } else {
      next (err, result);
    }
  });
}

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
                  collect (dirs, file);
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
