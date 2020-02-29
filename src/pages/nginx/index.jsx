import React from 'react';
import Layout from './components/Layout';

export default {
  state: {
    errorLog: [],
    accessLog: [],
  },
  effects: {},
  render() {
    return <Layout />;
  },
  onInit() {
    // console.log(1);
  },
};
