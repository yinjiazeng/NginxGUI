import { router } from 'nuomi';
import path from 'path';
import {
  storage,
  readFile,
  checkProcessById,
  cmd,
  checkFileExist,
  delay,
  isWin,
} from '../../../utils';

export default {
  getCode(code) {
    const { nginx, conf } = this.getState();
    // nginx -c conf -s signal -p prefix
    return `"${nginx}" -c "${conf}"${code}${isWin ? ` -p "${path.dirname(nginx)}"` : ''}`;
  },
  async checkExist() {
    const { nginx, conf } = this.getState();
    await checkFileExist(nginx, 'nginx文件不存在');
    await checkFileExist(conf, 'conf文件不存在');
  },
  // 执行命令
  async cmd(code, msg) {
    await this.checkExist();
    await cmd(this.getCode(code), msg);
  },
  // 启动nginx
  async $start() {
    // windows 启动命令不会退出，所以不会执行Promise回调
    if (isWin) {
      await this.checkExist();
      cmd(this.getCode(''));
    } else {
      await this.cmd('', '启动失败');
    }
    await delay();
    this.updateState({ started: true });
  },
  // 停止nginx
  async $stop() {
    await this.cmd(` -s stop`, '停止失败');
    await delay();
    this.updateState({ started: false });
  },
  // 重启nginx
  async $reload() {
    await delay();
    await this.cmd(` -s reload`, '重启失败');
  },
  // 删除nginx
  async $delete() {
    const { started } = this.getState();
    if (started) {
      await this.$stop();
    }
    storage('nginx', '');
    router.replace('/');
  },
  // 根据pid检测nginx是否已经启动
  async $checkStart() {
    const nginx = storage('nginx');
    const state = nginx ? JSON.parse(nginx) : this.state;
    try {
      await delay(100);
      const id = await readFile(state.pid);
      await checkProcessById(id);
      this.updateState({ ...state, started: true });
    } catch (e) {
      this.updateState(state);
    }
  },
};
