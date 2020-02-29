import os from 'os';

const osType = os.type();

export const isMac = osType === 'Darwin';

export const isLinux = osType === 'Linux';

export const isWin = osType === 'Windows_NT';
