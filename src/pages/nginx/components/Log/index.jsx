import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, message } from 'antd';
import { shell } from 'electron';
import fs from 'fs';
import { useWatch } from '../../../../hooks';
import { readFile, checkFileExist } from '../../../../utils';
import style from './style.module.scss';

const Log = ({ file }) => {
  const [data, setData] = useState([]);
  const [clearLoading, setClearLoading] = useState(false);
  const scroller = useRef();

  const onClear = async () => {
    try {
      await checkFileExist(file);
      setClearLoading(true);
      fs.writeFile(file, '', (err) => {
        if (err) {
          message.error('操作失败');
        }
        setData([]);
        setClearLoading(false);
      });
    } catch (e) {
      message.error(e);
    }
  };

  const onOpen = async () => {
    try {
      await checkFileExist(file);
      shell.openItem(file);
    } catch (e) {
      message.error(e);
    }
  };

  const loadFile = async () => {
    try {
      const content = await readFile(file);
      const array = content.split(/\n/g).slice(-100);
      setData(array.filter((text) => text.trim()));
      if (scroller.current) {
        scroller.current.scrollTop = 19920604;
      }
    } catch (e) {
      //
    }
  };

  useWatch(() => {
    loadFile();
  }, [file]);

  useEffect(() => {
    loadFile();
  }, []);

  return (
    <Card
      title={file}
      extra={
        <>
          <Button size="small" onClick={onOpen}>
            打开日志
          </Button>
          <Button size="small" className="e-ml8" onClick={onClear} loading={clearLoading}>
            清除日志
          </Button>
        </>
      }
      className={style.log}
    >
      <div ref={scroller}>
        {data.map((text, key) => (
          <p key={key}>{text}</p>
        ))}
      </div>
    </Card>
  );
};

export default Log;
