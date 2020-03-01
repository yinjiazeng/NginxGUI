import React from 'react';
import { router } from 'nuomi';
import { message } from 'antd';
import Layout from './components/Layout';
import { storage, readFile, checkProcessById, cmd, checkFileExist } from '../../utils';

export default {
  state: {
    start: false,
  },
  effects: {
    async cmd(code) {
      const { nginx } = this.getState();
      try {
        await checkFileExist(nginx);
      } catch (e) {
        message.error('nginx文件不存在');
        router.replace('/');
      }
      await cmd(`${nginx} ${code}`);
    },
    async $start() {
      const { conf } = this.getState();
      try {
        await checkFileExist(conf);
      } catch (e) {
        message.error('conf文件不存在');
        router.replace('/');
      }
      await this.cmd(`-c ${conf}`);
      this.updateState({ start: true });
    },
    async $stop() {
      await this.cmd(`-s stop`);
      this.updateState({ start: false });
    },
    async $reload() {
      await this.cmd(`-s reload`);
    },
    async $remove() {
      await this.cmd(`-s stop`);
      storage('nginx', '');
      router.replace('/');
    },
    async $checkStart() {
      this.initNginxFromStorage();
      const { pid } = this.getState();
      const id = await readFile(pid);
      await checkProcessById(id);
      this.updateState({ start: true });
    },
  },
  render() {
    return <Layout />;
  },
  onInit() {
    this.store.dispatch({
      type: '$checkStart',
    });
  },
};
