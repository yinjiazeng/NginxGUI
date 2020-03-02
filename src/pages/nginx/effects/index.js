import { router } from 'nuomi';
import { message } from 'antd';
import { storage, readFile, checkProcessById, cmd, checkFileExist } from '../../../utils';

export default {
  // 执行命令
  // eslint-disable-next-line consistent-return
  async cmd(code, msg) {
    const { nginx } = this.getState();
    try {
      await checkFileExist(nginx);
    } catch (e) {
      message.error('nginx文件不存在');
    }
    try {
      await cmd(`${nginx} ${code}`);
    } catch (e) {
      message.error(msg || '操作失败');
    }
  },
  // 启动nginx
  async $start() {
    const { conf } = this.getState();
    try {
      await checkFileExist(conf);
    } catch (e) {
      message.error('conf文件不存在');
    }
    await this.cmd(`-c ${conf}`, '启动失败');
    this.updateState({ started: true });
  },
  // 停止nginx
  async $stop() {
    await this.cmd(`-s stop`, '停止失败');
    this.updateState({ started: false });
  },
  // 重启nginx
  async $reload() {
    await this.cmd(`-s reload`, '重启失败');
  },
  // 删除nginx
  async $delete() {
    const { started } = this.getState();
    if (started) {
      await this.cmd(`-s stop`, '删除失败');
    }
    storage('nginx', '');
    router.replace('/');
  },
  // 根据pid检测nginx是否已经启动
  async $checkStart() {
    if (!this.initNginxFromStorage()) {
      router.replace('/');
      return;
    }
    const { pid } = this.getState();
    const id = await readFile(pid);
    await checkProcessById(id);
    this.updateState({ started: true });
  },
};
