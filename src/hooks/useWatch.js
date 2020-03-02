import { useEffect } from 'react';
import fs from 'fs';

export const useWatch = (cb, args) => {
  useEffect(() => {
    try {
      let timer = null;
      const file = args[0];
      const watcher = fs.watch(file, () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          cb();
        }, 100);
      });
      return () => {
        clearTimeout(timer);
        watcher && watcher.close();
      };
    } catch (e) {
      //
    }
  }, args);
};
