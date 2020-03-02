import os from 'os';
import fs from 'fs';
import childProcess from 'child_process';

const osType = os.type();

export const isMac = osType === 'Darwin';

export const isLinux = osType === 'Linux';

export const isWin = osType === 'Windows_NT';

export const normalize = (str) => str.replace(/\\/g, '/');

export const storage = (...args) => {
  if (!args.length) {
    return;
  }
  if (args.length === 1) {
    // eslint-disable-next-line consistent-return
    return localStorage.getItem(args[0]);
  }
  // eslint-disable-next-line consistent-return
  return localStorage.setItem(args[0], args[1]);
};

export const checkFileExist = (url) => {
  return new Promise((res, rej) => {
    fs.access(url, (err) => {
      if (!err) {
        res();
      } else {
        rej('文件不存在');
      }
    });
  });
};

export const readFile = (url) => {
  return new Promise((res, rej) => {
    fs.readFile(url, (err, content) => {
      if (!err) {
        res(content.toString());
      } else {
        rej();
      }
    });
  });
};

export const cmd = (code) => {
  return new Promise((res, rej) => {
    childProcess.exec(code, (err) => {
      if (!err) {
        res();
      } else {
        rej();
      }
    });
  });
};

export const checkProcessById = (id) => {
  let code = 'lsof -nP -i | grep';
  if (isWin) {
    code = 'tasklist|findstr';
  }
  return cmd(`${code} ${id}`);
};
