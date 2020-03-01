import React from 'react';
import { Form, Input, Button, Row, Col } from 'antd';

const { ipcRenderer } = require('electron');

const Item = ({ name, input, label, onSelect, onChange, ...rest }) => {
  const selectedItem = (...args) => {
    if (args[1]) {
      onSelect(name, args[1]);
    }
    ipcRenderer.removeListener('selectedItem', selectedItem);
  };

  const onClick = () => {
    const match = label.match(/\.\w+$/);
    ipcRenderer.send('open-directory-dialog', {
      properties: ['openFile'],
      filters: [
        {
          name: 'All Files',
          extensions: [match ? match[0].substr(1) : '*'],
        },
      ],
    });
    ipcRenderer.on('selectedItem', selectedItem);
  };

  const validator = (rule, value) => {
    if (value) {
      const val = value.trim();
      const match = label.match(/\.\w+$/);
      if (match) {
        if (val.endsWith(match[0])) {
          return Promise.resolve();
        }
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject(`文件格式必须是 ${match[0]} 结尾`);
      }
      if (value.match(/\.\w+$/)) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject(`nginx文件不应该有拓展名`);
      }
    }

    return Promise.resolve();
  };

  return (
    <Form.Item {...rest} label={label}>
      <Row gutter={8}>
        <Col span={19}>
          <Form.Item
            name={name}
            noStyle
            rules={[
              { required: true, message: `${label}路径不能为空` },
              () => ({
                validator,
              }),
            ]}
          >
            <Input placeholder={`请输入或选择${label}路径`} autoComplete="off" />
          </Form.Item>
        </Col>
        <Col span={5}>
          <Button onClick={onClick}>选 择</Button>
        </Col>
      </Row>
    </Form.Item>
  );
};

export default Item;
