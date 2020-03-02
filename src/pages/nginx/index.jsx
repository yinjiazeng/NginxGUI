import React from 'react';
import { Redirect } from 'nuomi';
import Layout from './components/Layout';
import effects from './effects';
import { storage } from '../../utils';

export default {
  state: {
    nginx: '',
    conf: '',
    pid: '',
    access: '',
    error: '',
    logs: [],
    // 是否启动
    started: false,
  },
  effects,
  render() {
    return !storage('nginx') ? <Redirect to="/" /> : <Layout />;
  },
  onInit() {
    this.store.dispatch({
      type: '$checkStart',
    });
  },
};
