import os from 'os';
import fs from 'fs';
import childProcess from 'child_process';
import { message } from 'antd';

const osType = os.type();

export const isMac = osType === 'Darwin';

export const isLinux = osType === 'Linux';

export const isWin = osType === 'Windows_NT';

export const normalize = (str) => (str ? str.trim().replace(/\\/g, '/') : '');

export const storage = (...args) => {
  if (!args.length) {
    return;
  }
  if (args.length === 1) {
    return localStorage.getItem(args[0]);
  }
  return localStorage.setItem(args[0], args[1]);
};

export const delay = (time = 300) => {
  return new Promise((res) => {
    setTimeout(() => res(), time);
  });
};

export const preventMutilClick = (cb) => {
  let timer = null;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      cb && cb();
    }, 100);
  };
};

export const checkFileExist = (url, msg) => {
  return new Promise((res, rej) => {
    fs.access(url, (err) => {
      if (!err) {
        res();
      } else {
        rej(msg || '文件不存在');
        msg && message.error(msg);
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

export const cmd = (code, msg) => {
  return new Promise((res, rej) => {
    childProcess.exec(code, (err) => {
      if (!err) {
        res();
      } else {
        rej(msg);
        msg && message.error(msg);
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

export const writeFile = (file, text = '') => {
  return new Promise((res, rej) => {
    fs.writeFile(file, text, (err) => {
      if (!err) {
        res();
      } else {
        rej();
      }
    });
  });
};
