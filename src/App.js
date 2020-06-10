import React, { useState } from 'react';
import './App.less';
import { Col, Row } from "antd";
import { FileAddOutlined, ImportOutlined } from "@ant-design/icons";
import uuidV4 from 'uuid/dist/v4';
import { flattenArr, objToArr } from "./utils/helper";
import fileHelper from "./utils/fileHelper";

import FileSearch from "./components/FileSearch/FileSearch.jsx";
import FileList from "./components/FileList/FileList.jsx";
import BottomBtn from "./components/BottomBtn/BottomBtn.jsx";
import TabList from "./components/TabList/TabList";

const { join, basename, extname, dirname } = window.require('path');
const { remote, ipcRenderer } = window.require('electron');
const Store = window.require('electron-store'); // 创建本地存储
const store = new Store({ name: 'Files Data' });
const saveFilesToStore = (files) => {
  // 格式化store中存储的内容
  const filesStoreObj = objToArr(files).reduce((pre, cur) => {
    const { id, path, title, createdAt, isSynced, updatedAt } = cur;
    pre[id] = {
      id,
      path,
      title,
      createdAt,
      isSynced,
      updatedAt
    }
    return pre
  }, {});
  store.set('files', filesStoreObj);
}
// import 'bootstrap/dist/css/bootstrap.min.css';
const defaultFiles = [
  {
    id: '0',
    title: 'first post',
    body: '*should be aware of this*',
    createdAt: 1563762965704
  },
  {
    id: '1',
    title: 'second post',
    body: '## this is the title',
    createdAt: 1563762965704
  },
  {
    id: '2',
    title: '你好世界',
    body: '### 这是另外一个小标题欧',
    createdAt: 1563762965704
  },
  {
    id: '3',
    title: '你好世界',
    body: '**粗体内容**',
    createdAt: 1563762965704
  }
]

function App() {
  const [files, setFiles] = useState(store.get('files') || {})
  const [activeFileId, setActiveFileId] = useState(''); // 当前的文件id
  const [openFileIds, setOpenFileIds] = useState([]); // 当前被打开的文件id
  const [unSaveFileIds, setUnSaveFileIds] = useState([]); // 未保存的文件
  const [searchedFiles, setSearchedFiles] = useState([]); // 搜索结果列表

  const openedFiles = openFileIds.map(openId => files[openId]); // 当前被打开的文件
  const filesArr = objToArr(files); // 对象形式的files转为为数组形式的field方便子组件引用
  const fileListArr = (searchedFiles.length > 0) ? searchedFiles : filesArr; // 文件搜索结果
  const savedLocation = `${remote.app.getPath('documents')}/electron`; // 文件保存在本地的位置
  console.log('app', { files })
  /**
   * 文件列表标题点击添加tab
   * @param fileId {string}
   */
  const fileClick = (fileId) => {
    // console.log({ fileId })
    setActiveFileId(fileId);
    const currentFile = files[fileId];
    const { id, title, path, isLoaded } = currentFile
    if (!isLoaded) {
      fileHelper.readFile(currentFile.path).then(value => {
        const newFile = { ...files[fileId], body: value, isLoaded: true }
        setFiles({ ...files, [fileId]: newFile })
      })
    }
    if (!openFileIds.includes(fileId)) {
      setOpenFileIds([...openFileIds, fileId]);
    } else {
    }
  }

  const fileSearch = (keyword) => {
    const newFiles = filesArr.filter(file => file.title.includes(keyword));
    setSearchedFiles(newFiles);
  }

  /**
   * tab关闭
   * @param fileId {string}
   */
  const tabClose = (fileId) => {
    const newOpenFileIds = openFileIds.filter((id) => id !== fileId);
    setOpenFileIds(newOpenFileIds);
  };

  /**
   * 修改文件列表body内容
   * @param body {string}
   * @param fileId {string}
   */
  const fileChange = (body, fileId) => {
    if (body !== files[fileId].body) {
      const newFiles = { ...files[fileId], body }
      setFiles({ ...files, [fileId]: newFiles })
      setActiveFileId(fileId);
      if (!unSaveFileIds.includes(fileId)) {
        setUnSaveFileIds([...unSaveFileIds, fileId]);
      }
    }
  }

  /**
   * 删除文件
   * @param fileId {string}
   * @param isNew {boolean} 是否为新建操作
   */
  const deleteFile = (fileId, isNew) => {
    if (isNew) {
      delete files[fileId];
      setFiles({ ...files });
      return;
    }
    fileHelper.deleteFile(files[fileId].path).then(() => {
      delete files[fileId];
      setFiles({ ...files });
      saveFilesToStore(files);
      tabClose(fileId)
    });
  }
  /**
   * 保存文件标题
   * @param title {string}
   * @param fileId {string}
   * @param isNew {boolean} 是否为新建
   */
  const saveTitle = (title, fileId, isNew = false) => {
    const newPath = isNew ? join(savedLocation, `${title}.md`) : join(dirname(files[fileId].path), `${title}.md`);
    const modifiedFile = {
      ...files[fileId],
      title,
      isNew: false,
      path: newPath
    }
    const newFile = { ...files, [fileId]: modifiedFile }
    if (isNew) {
      // 新建操作
      fileHelper.writeFile(newPath, files[fileId].body).then(() => {
        setFiles(newFile);
        saveFilesToStore(newFile);
      });
    } else {
      const oldPath = files[fileId].path;
      fileHelper.renameFile(oldPath, newPath).then(() => {
        setFiles(newFile);
        saveFilesToStore(newFile);
      })
    }
  }

  /**
   * 创建新文件
   */
  const createNewFile = () => {
    const newId = uuidV4();
    const newFile = {
      id: newId,
      title: '',
      body: '## 请输入Markdown',
      createdAt: new Date().getTime(),
      isNew: true,
    }
    setFiles({ ...files, [newId]: newFile })
  }

  return (
    <div className="wrapper">
      <Row>
        <Col span={6} style={{ height: '100vh' }}>
          <FileSearch
            onFileSearch={fileSearch}
          />
          <FileList
            files={fileListArr}
            onFileClick={fileClick}
            onFileDelete={deleteFile}
            onSaveEdit={saveTitle}
          />
          <div className="file-bottom">
            <BottomBtn
              text="新建"
              icon={<FileAddOutlined />}
              onBtnClick={createNewFile}
              type="primary"
            />
            <BottomBtn
              text="导入"
              icon={<ImportOutlined />}
              onBtnClick={() => console.log(2)}
              type="primary"
            />
          </div>
        </Col>
        <Col span={18} style={{ height: '100vh' }}>
          <TabList
            files={openedFiles}
            onCloseTap={tabClose}
            onFileBodyChange={fileChange}
            unSaveIds={unSaveFileIds}
            activeId={activeFileId}
          />
        </Col>
      </Row>
    </div>
  );
}

export default App;
