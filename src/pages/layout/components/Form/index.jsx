import React from 'react';
import { useConnect } from 'nuomi';
import { Form as AntdForm, Button } from 'antd';
import Item from './Item';
import { isWin } from '../../../../utils';
import style from './style.module.scss';

const FormItem = AntdForm.Item;

const nginxName = `nginx${isWin ? '.exe' : ''}`;

const formItemLayout = {
  labelCol: {
    sm: { span: 4 },
  },
  wrapperCol: {
    sm: { span: 20 },
  },
  className: style.form,
};

const Form = () => {
  const [, dispatch] = useConnect();
  const [form] = AntdForm.useForm();

  const onFinish = (data) => {
    dispatch({
      type: 'updateState',
      payload: {
        data,
      },
    });
  };

  const onReset = () => {
    form.resetFields();
  };

  const setValues = () => {
    //
  };

  const onSelect = (name, path) => {
    form.setFieldsValue({
      [name]: path,
    });
    setValues();
  };

  const onChange = ({ target: { value } }) => {
    setValues(value);
  };

  return (
    <AntdForm form={form} onFinish={onFinish} {...formItemLayout}>
      <Item
        extra={`选择${nginxName}后，其他项路径会被自动填充，如果错误请自行修改`}
        name={nginxName}
        label={nginxName}
        onSelect={onSelect}
        onChange={onChange}
      />
      <Item name="conf" label="nginx.conf" onSelect={onSelect} />
      <Item name="pid" label="nginx.pid" onSelect={onSelect} />
      <Item name="access" label="access.log" onSelect={onSelect} />
      <Item name="error" label="error.log" onSelect={onSelect} />
      <FormItem label=" " colon={false}>
        <Button type="primary" htmlType="submit">
          保 存
        </Button>
        <Button onClick={onReset} style={{ marginLeft: 16 }}>
          重 置
        </Button>
      </FormItem>
    </AntdForm>
  );
};

export default Form;
