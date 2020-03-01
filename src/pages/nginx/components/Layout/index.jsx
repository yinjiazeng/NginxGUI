import React from 'react';
import { Card, Spin } from 'antd';
import { useConnect } from 'nuomi';

const Layout = () => {
  const [{ loadings }] = useConnect();
  return (
    <Spin spinning={loadings.$dispatch}>
      <Card />
    </Spin>
  );
};

export default Layout;
