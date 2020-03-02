import React from 'react';
import { Router, Route } from 'nuomi';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import index from './pages/index';
import nginx from './pages/nginx';
import './assets/style.scss';

const App = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <Route path="/" {...index} />
        <Route path="/nginx" cache {...nginx} />
      </Router>
    </ConfigProvider>
  );
};

export default App;
