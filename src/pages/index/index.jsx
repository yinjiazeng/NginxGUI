import React from 'react';
import { Redirect } from 'nuomi';
import Layout from './components/Layout';
import { storage } from '../../utils';
import effects from './effects';

export default {
  data: {
    // 是否是编辑状态
    edit: false,
  },
  effects,
  render() {
    if (this.data.edit || !storage('nginx')) {
      return <Layout />;
    }
    return <Redirect to="/nginx" />;
  },
  onInit() {
    this.store.dispatch({
      type: 'init',
    });
  },
};
