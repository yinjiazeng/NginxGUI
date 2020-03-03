import React from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Menu, Dropdown } from 'antd';
import { shell } from 'electron';

const menus = [
  {
    url: 'https://github.com/yinjiazeng/NginxGUI/issues',
    title: '常见问题',
  },
  {
    url: 'https://github.com/yinjiazeng/NginxGUI/issues/new',
    title: '建议反馈',
  },
  {
    url: 'https://github.com/yinjiazeng/NginxGUI/blob/master/README.md',
    title: '关于NginxGUI',
  },
];

const menu = (
  <Menu>
    {menus.map(({ url, title }) => (
      <Menu.Item key={title}>
        <a onClick={() => shell.openExternal(url)}>{title}</a>
      </Menu.Item>
    ))}
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
