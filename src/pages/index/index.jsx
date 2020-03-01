import React from 'react';
import { Redirect, router } from 'nuomi';
import Layout from './components/Layout';
import { storage } from '../../utils';
import getDefaultPath from '../../utils/getDefaultPath';

export default {
  effects: {
    saveNginx({ data }) {
      this.updateState(data);
      storage('nginx', JSON.stringify(data));
      router.replace('/nginx');
    },
    init() {
      const nginx = this.initNginxFromStorage();
      if (!nginx) {
        this.updateState(getDefaultPath());
      }
    },
  },
  render() {
    return storage('nginx') ? <Redirect to="/nginx" /> : <Layout />;
  },
  onInit() {
    this.store.dispatch({
      type: 'init',
    });
  },
};
