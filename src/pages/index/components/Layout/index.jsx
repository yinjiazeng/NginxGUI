import React, { useRef } from 'react';
import { useConnect, useNuomi } from 'nuomi';
import { Form, Button, Modal, Row, Col, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Item from './Item';
import { isWin } from '../../../../utils';
import getDefaultPath from '../../../../utils/getDefaultPath';
import style from './style.module.scss';

const FormItem = Form.Item;
const FormList = Form.List;
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

const buttonItemLayout = {
  labelCol: {
    sm: { span: 0 },
  },
  wrapperCol: {
    sm: { span: 24 },
  },
};

const defaultLogs = [
  {
    name: 'access',
    label: 'Access Log',
  },
  {
    name: 'error',
    label: 'Error Log',
  },
];

const Layout = () => {
  const [{ loadings, ...data }, dispatch] = useConnect();
  const { nuomiProps } = useNuomi();
  const [form] = Form.useForm();
  const formRef = useRef();
  let voidFields = null;

  const onFinish = (values) => {
    dispatch({
      type: '$saveNginx',
      payload: values,
    });
  };

  const onSave = async () => {
    try {
      await form.validateFields();
      dispatch({
        type: 'save',
        payload: form.getFieldsValue(),
      });
      message.success('保存成功');
      // eslint-disable-next-line no-empty
    } catch (e) {}
  };

  const onReset = () => {
    Modal.confirm({
      content: '确定要清空吗？',
      onOk: () => {
        const clearFields = {};
        ['nginx', 'conf', 'pid', 'access', 'error'].forEach((value) => {
          clearFields[value] = '';
        });
        form.setFieldsValue({
          ...clearFields,
          logs: [],
        });
      },
    });
  };

  const setValues = (path) => {
    if (voidFields) {
      const setFields = {};
      const defaultPath = getDefaultPath(path);
      voidFields.forEach((field) => {
        setFields[field] = defaultPath[field];
      });
      form.setFieldsValue(setFields);
    }
  };

  const setVoidFields = () => {
    const fields = form.getFieldsValue();
    Object.keys(fields).forEach((value) => {
      if (!['nginx', 'logs'].includes(value) && !fields[value]) {
        if (!voidFields) {
          voidFields = [];
        }
        voidFields.push(value);
      }
    });
  };

  const clearVoidFields = () => {
    voidFields = null;
  };

  const onSelect = (name, path) => {
    form.setFieldsValue({
      [name]: path,
    });
    if (name === 'nginx') {
      setVoidFields();
      setValues(path);
      clearVoidFields();
    }
  };

  const onNginxChange = ({ target: { value } }) => {
    setValues(value);
  };

  const onAdd = (add) => {
    add();
    setTimeout(() => {
      formRef.current.scrollTop = 19920604;
    }, 0);
  };

  return (
    <Form form={form} onFinish={onFinish} {...formItemLayout} initialValues={data}>
      <div ref={formRef}>
        <Item
          extra={`选择${nginxName}后，其他项路径会被自动填充，如果错误请自行修改`}
          name="nginx"
          label="Nginx"
          ext={isWin ? '.exe' : ''}
          onSelect={onSelect}
          onChange={onNginxChange}
          onFocus={setVoidFields}
          onBlur={clearVoidFields}
        />
        <Item name="conf" label="Conf" ext=".conf" onSelect={onSelect} />
        <Item name="pid" label="Pid" ext=".pid" onSelect={onSelect} />
        {defaultLogs.map(({ name, label }) => (
          <Item
            key={name}
            name={name}
            label={label}
            ext=".log"
            onSelect={onSelect}
            required={false}
          />
        ))}
        <FormList name="logs">
          {(fields, { add, remove }) => {
            return (
              <>
                {fields.map((field, index) => (
                  <Item
                    {...field}
                    label={index === 0 ? 'Other Log' : ''}
                    wrapperCol={index === 0 ? null : { sm: { offset: 4, span: 20 } }}
                    ext=".log"
                    onRemove={() => remove(field.name)}
                    onSelect={onSelect}
                    required={false}
                  />
                ))}
                <FormItem label=" " colon={false} required={false} className="e-mb8">
                  <Row gutter={8}>
                    <Col span={19}>
                      <Button type="dashed" onClick={() => onAdd(add)} style={{ width: '100%' }}>
                        <PlusOutlined /> 新增日志项
                      </Button>
                    </Col>
                  </Row>
                </FormItem>
              </>
            );
          }}
        </FormList>
        <FormItem className={style.buttonItem} {...buttonItemLayout}>
          <Button type="primary" htmlType="submit" loading={loadings.$saveNginx}>
            进入应用
          </Button>
          {nuomiProps.data.edit && (
            <Button type="primary" onClick={onSave} className="e-ml16">
              保 存
            </Button>
          )}
          <Button onClick={onReset} className="e-ml16">
            清 空
          </Button>
        </FormItem>
      </div>
    </Form>
  );
};

export default Layout;
