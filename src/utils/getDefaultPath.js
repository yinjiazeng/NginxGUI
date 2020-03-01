import path from 'path';
import { isWin, isLinux, isMac } from '.';

const CONF = './nginx.conf';
const PID = './nginx.pid';
const ACCESS = './access.log';
const ERROR = './error.log';
const NGINX = isMac ? '/usr/local/bin/nginx' : '';

const getDefaultPath = (nginxPath = NGINX) => {
  const defaultPath = {};
  if (nginxPath) {
    defaultPath.nginx = nginxPath;
    if (isWin) {
      defaultPath.conf = path.join(nginxPath, './conf', CONF);
      defaultPath.pid = path.join(nginxPath, './logs', PID);
      defaultPath.access = path.join(nginxPath, './logs', ACCESS);
      defaultPath.error = path.join(nginxPath, './logs', ERROR);
    } else if (isMac) {
      defaultPath.conf = path.join(nginxPath, '../../etc/nginx', CONF);
      defaultPath.pid = path.join(nginxPath, '../../var/run', PID);
      defaultPath.access = path.join(nginxPath, '../../var/log', ACCESS);
      defaultPath.error = path.join(nginxPath, '../../var/log', ERROR);
    } else if (isLinux) {
      //
    }
  }
  return defaultPath;
};

export default getDefaultPath;
