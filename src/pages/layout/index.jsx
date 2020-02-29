import React from 'react';
import Layout from './components/Layout';

export default {
  id: 'global',
  state: {
    data: null,
  },
  effects: {
    addNginxFromStorage() {
      const storageData = window.localStorage.getItem('nginx');
      if (storageData) {
        this.updateState({ data: JSON.parse(storageData) });
      }
    },
    removeNginx() {
      this.updateState({ data: null });
      window.localStorage.setItem('nginx', '');
    },
  },
  render() {
    return <Layout nginx={this.children} />;
  },
  onInit() {
    this.store.dispatch({
      type: 'addNginxFromStorage',
    });
  },
};
