import React from 'react';
import { Card, Spin, Button } from 'antd';
import {
  StopOutlined,
  FolderOpenOutlined,
  FileTextOutlined,
  DeleteOutlined,
  ReloadOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { useConnect, router } from 'nuomi';
import Helper from '../Helper';
import './style.scss';

const Layout = () => {
  const [{ loadings, started }, dispatch] = useConnect();

  const stop = () => {
    dispatch({ type: '$stop' });
  };

  const start = () => {
    dispatch({ type: '$start' });
  };

  const reload = () => {
    dispatch({ type: '$reload' });
  };

  const remove = () => {
    dispatch({ type: '$delete' });
  };

  const editConf = () => {};

  const edit = () => {
    router.location('/', { edit: true });
  };

  const open = () => {};

  return (
    <Spin spinning={loadings.$checkStart}>
      <Card
        title={
          <span>
            {started ? (
              <Button onClick={stop} danger loading={loadings.$stop}>
                {!loadings.$stop && <StopOutlined />}
                停止
              </Button>
            ) : (
              <Button type="primary" onClick={start} loading={loadings.$start}>
                {!loadings.$start && <PlayCircleOutlined />}
                启动
              </Button>
            )}
            {started && (
              <Button
                className="e-ml8"
                onClick={reload}
                type="primary"
                ghost
                loading={loadings.$reload}
              >
                {!loadings.$reload && <ReloadOutlined />}
                重启
              </Button>
            )}
          </span>
        }
        extra={
          <span>
            <Button onClick={edit}>
              <FileTextOutlined />
              编辑路径
            </Button>
            <Button onClick={editConf} className="e-ml8">
              <FileTextOutlined />
              编辑配置
            </Button>
            <Button onClick={open} className="e-ml8">
              <FolderOpenOutlined />
              打开目录
            </Button>
            <Button onClick={remove} className="e-ml8" type="danger" loading={loadings.$delete}>
              {!loadings.$delete && <DeleteOutlined />}
              删除
            </Button>
            <Helper className="e-ml8" />
          </span>
        }
      />
    </Spin>
  );
};

export default Layout;
