import React, { useState } from "react";

import styles from './index.module.less';
import { Button, Input, message } from "antd";

const { Search } = Input;
const { remote } = window.require('electron');
const Store = window.require('electron-store')
const settingsStore = new Store({ name: 'Settings' })


export default () => {
  const [storageValue, setStorageValue] = useState(settingsStore.get('savedFileLocation') || '');

  /**
   * 选择文件存储位置
   */
  const handlerStorageClick = () => {
    remote.dialog.showOpenDialog({
      properties: ['openDirectory'],
      message: '选择文件的存储路径',
    }).then(({ canceled, filePaths }) => {
      setStorageValue(filePaths);

    })
  }

  /**
   * 保存文件路径
   */
  const handelSaveClick = () => {
    if (storageValue) {
      settingsStore.set('savedFileLocation', storageValue);
      message.success('保存成功');
    } else {
      message.error('保存失败');
    }
  }

  return (
    <div className={styles.wrapper}>
      <h2>设置</h2>
      <p>选择文件存储位置</p>
      <Search
        value={storageValue}
        placeholder="当前存储的地址"
        enterButton="选择新的位置"
        size="large"
        onSearch={handlerStorageClick}
      />
      <Button
        type={"primary"}
        style={{ marginTop: 20 }}
        disabled={!storageValue}
        onClick={handelSaveClick}
      >
        保存
      </Button>
    </div>
  )
}
