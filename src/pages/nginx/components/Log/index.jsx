import React, { useState, useEffect, useRef } from 'react';
import { Button, Card } from 'antd';
import { shell } from 'electron';
import { useWatch } from '../../../../hooks';
import { readFile, checkFileExist, writeFile, preventMutilClick } from '../../../../utils';
import style from './style.module.scss';

const Log = ({ file }) => {
  const [data, setData] = useState([]);
  const [clearLoading, setClearLoading] = useState(false);
  const scroller = useRef();

  const onClear = preventMutilClick(async () => {
    await checkFileExist(file, '日志文件不存在');
    setClearLoading(true);
    await writeFile(file, '');
    setData([]);
    setClearLoading(false);
  });

  const onOpen = preventMutilClick(async () => {
    await checkFileExist(file, '日志文件不存在');
    shell.openItem(file);
  });

  const loadFile = async () => {
    const content = await readFile(file);
    const array = content.split(/\n/g).slice(-100);
    setData(array.filter((text) => text.trim()));
    if (scroller.current) {
      scroller.current.scrollTop = 19920604;
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
            全部日志
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
