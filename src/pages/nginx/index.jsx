import React from 'react';
import Layout from './components/Layout';
import effects from './effects';

export default {
  state: {
    // 是否启动
    started: false,
  },
  effects,
  render() {
    return <Layout />;
  },
  onInit() {
    this.store.dispatch({
      type: '$checkStart',
    });
  },
};
