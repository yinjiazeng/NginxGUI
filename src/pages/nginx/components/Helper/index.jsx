import React from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Menu, Dropdown } from 'antd';
import { Link } from 'nuomi';

const menu = (
  <Menu>
    <Menu.Item>
      <Link to="/help">常见问题</Link>
    </Menu.Item>
  </Menu>
);

const Helper = (props) => {
  return (
    <Dropdown overlay={menu} placement="bottomRight">
      <QuestionCircleOutlined {...props} />
    </Dropdown>
  );
};

export default Helper;
