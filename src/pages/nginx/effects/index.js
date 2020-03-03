import { router } from 'nuomi';
import { storage, readFile, checkProcessById, cmd, checkFileExist, delay } from '../../../utils';

export default {
  // 执行命令
  async cmd(code, msg) {
    const { nginx, conf } = this.getState();
    await checkFileExist(nginx, 'nginx文件不存在');
    await checkFileExist(conf, 'conf文件不存在');
    await cmd(`"${nginx}" -c "${conf}" ${code}`, msg);
  },
  // 启动nginx
  async $start() {
    await this.cmd('', '启动失败');
    await delay();
    this.updateState({ started: true });
  },
  // 停止nginx
  async $stop() {
    await this.cmd(`-s stop`, '停止失败');
    await delay();
    this.updateState({ started: false });
  },
  // 重启nginx
  async $reload() {
    await delay();
    await this.cmd(`-s reload`, '重启失败');
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
