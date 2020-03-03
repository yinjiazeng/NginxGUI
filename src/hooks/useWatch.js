import { useEffect } from 'react';
import fs from 'fs';
import path from 'path';
import { checkFileExist, writeFile, preventMutilClick } from '../utils';

export const useWatch = (cb, args) => {
  useEffect(() => {
    const watch = async () => {
      const file = args[0];
      if (!file) {
        return null;
      }
      const ext = path.extname(file);
      // 不存在先创建
      if (ext === '.log') {
        try {
          await checkFileExist(file);
        } catch (e) {
          await writeFile(file, '');
        }
      }
      try {
        return fs.watch(file, preventMutilClick(cb));
      } catch (e) {
        //
      }
    };
    const watcherPromise = watch();
    return async () => {
      const watcher = await watcherPromise;
      watcher && watcher.close();
    };
  }, args);
};
