import React, { useMemo } from 'react';
import { Card, Spin, Button, message } from 'antd';
import { shell } from 'electron';
import path from 'path';
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
import Log from '../Log';
import { useWatch } from '../../../../hooks';
import { checkFileExist } from '../../../../utils';
import style from './style.module.scss';

const Layout = () => {
  const [{ loadings, started, nginx, conf, error, access, logs }, dispatch] = useConnect();

  const logFiles = useMemo(() => {
    return [access, error].concat(logs || []);
  }, [access, error, logs]);

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

  const editConf = async () => {
    try {
      await checkFileExist(conf);
      shell.openItem(conf);
    } catch (e) {
      message.error(e);
    }
  };

  const edit = () => {
    router.location('/', { edit: true });
  };

  const open = async () => {
    try {
      await checkFileExist(path.dirname(nginx));
      shell.showItemInFolder(nginx);
    } catch (e) {
      message.error('目录不存在');
    }
  };

  useWatch(() => {
    started && reload();
  }, [conf, started]);

  return (
    <Spin spinning={loadings.$checkStart}>
      <Card
        className={style.card}
        bordered={false}
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
      >
        {logFiles.map((log, k) => (
          <Log file={log} key={`${log || ''}_${k}`} />
        ))}
      </Card>
    </Spin>
  );
};

export default Layout;
