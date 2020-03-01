import React from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import { MinusCircleOutlined } from '@ant-design/icons';
import { checkFileExist } from '../../../../utils';

const { ipcRenderer } = require('electron');

const EXT_REGEXP = /\.\w+$/;

const Item = ({
  name,
  label,
  ext,
  input,
  onSelect,
  onChange,
  onRemove,
  required = true,
  ...rest
}) => {
  const selectedItem = (...args) => {
    if (args[1]) {
      onSelect(name, args[1]);
    }
    ipcRenderer.removeListener('selectedItem', selectedItem);
  };

  const onClick = () => {
    const match = ext.match(EXT_REGEXP);
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
      const match = ext.match(EXT_REGEXP);
      if (match) {
        if (val.endsWith(match[0])) {
          if (['nginx', 'conf'].includes()) {
            return checkFileExist(val);
          }
          return Promise.resolve();
        }
        return Promise.reject(`文件格式必须是 ${match[0]} 结尾`);
      }
      if (value.match(EXT_REGEXP)) {
        return Promise.reject(`文件不应该有拓展名`);
      }
      return checkFileExist(val);
    }

    return Promise.resolve();
  };

  const rules = [
    () => ({
      validator,
    }),
  ];

  if (required) {
    rules.unshift({ required: true, message: `${label}路径不能为空` });
  }

  return (
    <Form.Item {...rest} label={label}>
      <Row gutter={8}>
        <Col span={19}>
          <Form.Item name={name} noStyle rules={rules} validateTrigger="onBlur">
            <Input placeholder={`请输入或选择${label}路径`} autoComplete="off" />
          </Form.Item>
        </Col>
        <Col span={5}>
          <Button onClick={onClick}>选 择</Button>
          {onRemove ? <MinusCircleOutlined onClick={onRemove} className="e-ml8" /> : ''}
        </Col>
      </Row>
    </Form.Item>
  );
};

export default Item;
