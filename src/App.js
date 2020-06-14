import React, { useEffect, useState } from 'react';
import './App.less';
import { Col, message, Row } from "antd";
import { FileAddOutlined, ImportOutlined } from "@ant-design/icons";
import uuidV4 from 'uuid/dist/v4';
import { flattenArr, objToArr } from "./utils/helper";
import fileHelper from "./utils/fileHelper";

import FileSearch from "./components/FileSearch/FileSearch.jsx";
import FileList from "./components/FileList/FileList.jsx";
import BottomBtn from "./components/BottomBtn/BottomBtn.jsx";
import TabList from "./components/TabList/TabList";
import useIpcRenderer from "./hooks/useIpcRenderer";

const { join, basename, extname, dirname } = window.require('path');
const { remote, ipcRenderer } = window.require('electron');
const Store = window.require('electron-store'); // 创建本地存储
const store = new Store({ name: 'Files Data' });
const settingsStore = new Store({ name: 'Settings' })
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
  try {
    store.set('files', filesStoreObj);
    message.success('文件本地保存成功');
  } catch (e) {
    message.error('文件本地持久存储失败')
  }

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
  const savedLocation = settingsStore.get('savedFileLocation').toString() || `${remote.app.getPath('documents')}/electron`; // 文件保存在本地的位置
  const activeFile = files[activeFileId]; // 当前被选中的文件信息
  /**
   * 文件列表标题点击添加tab
   * @param fileId {string}
   */
  const fileClick = async (fileId) => {
    // console.log({ fileId })
    let isOpenTab = true; // 是否打开tab
    const currentFile = files[fileId];
    const { id, title, path, isLoaded } = currentFile
    if (!isLoaded) {
      await fileHelper.readFile(currentFile.path).then(value => {
        const newFile = { ...files[fileId], body: value, isLoaded: true }
        setFiles({ ...files, [fileId]: newFile })
      }).catch((err) => {
        // 源文件被删除
        console.error(err);
        message.error(`${files[fileId].title}.mk的源文件已被删除`)
        const { [fileId]: deleteValue, ...newFiles } = files;
        setFiles(newFiles);
        saveFilesToStore(newFiles);
        isOpenTab = false;
      })
    }
    if (isOpenTab) {
      if (!openFileIds.includes(fileId)) {
        setOpenFileIds([...openFileIds, fileId]);
      }
      setActiveFileId(fileId);
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
    const { [fileId]: deleteValue, ...newFiles } = files;
    if (isNew) {
      setFiles(newFiles);
      return;
    }
    fileHelper.deleteFile(files[fileId].path).then(() => {
      setFiles(newFiles);
      saveFilesToStore(newFiles);
      tabClose(fileId)
    }).catch((err) => {
      console.error(err);
      message.error(`${files[fileId].title}.mk的源文件已被删除`)
      setFiles(newFiles);
      saveFilesToStore(newFiles);
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
      }).catch(err => {
        // 源文件被删除
        console.error(err);
        message.error(`${files[fileId].title}.mk的源文件已被删除`)
        const { [fileId]: deleteValue, ...newFiles } = files;
        setFiles(newFiles);
        saveFilesToStore(newFiles);
      });
    }
  }

  /**
   * 创建新文件
   */
  const createNewFile = () => {
    // 判断当前是否有正在新建的数据
    const isCurrentNew = !!filesArr.find(file => file.isNew === true);
    if (isCurrentNew) {
      message.error('当保存上一个新建的文档,再新建文件');
      return;
    }
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

  /**
   * 保存当前点开的文件
   */
  const saveCurrentFile = () => {
    // const { path, body, title } = activeFile
    // fileHelper.writeFile(path, body).then(() => {
    //   setUnsavedFileIDs(unsavedFileIDs.filter(id => id !== activeFile.id))
    //   if (getAutoSync()) {
    //     ipcRenderer.send('upload-file', {key: `${title}.md`, path })
    //   }
    // })
  }

  /**
   * 导入本地mk文件
   */
  const importFilesArr = () => {
    remote.dialog.showOpenDialog({
      title: '选择导入Markdown文件',
      properties: ['openFile', 'multiSelections'],
      filters: [
        {
          name: 'Markdown files',
          extensions: ['md']
        },
      ]
    }).then(({ canceled, filePaths }) => {
      if (!canceled && filePaths.length > 0) {
        // 过滤文件
        const alreadyAdded = Object.values(files).map(v => v.path);
        const filteredPaths = filePaths.filter((path) => !alreadyAdded.includes(path));
        if (filteredPaths.length === 0) {
          remote.dialog.showMessageBox({
            type: 'info',
            title: '不可导入重复的文件',
            message: '不可导入重复的文件'
          })
          return;
        }
        const importFilesArr = filteredPaths.map((path) => ({
          id: uuidV4(),
          title: basename(path, extname(path)), // 使用node中ps库提供的方法,获取对应路径下文件的title
          path
        }));
        const newFiles = { ...files, ...flattenArr(importFilesArr) };
        setFiles(newFiles);
        saveFilesToStore(newFiles);
        if (importFilesArr.length > 0) {
          remote.dialog.showMessageBox({
            type: 'info',
            title: `成功导入了${importFilesArr.length}个文件`,
            message: `成功导入了${importFilesArr.length}个文件`
          })
        }
      }
    }).catch((err) => {
      console.error(err);
      message.error('文件读取失败');
    })
  }

  // useEffect(() => {
  //   const callback = () => {
  //     console.log('hello world');
  //   }
  //   ipcRenderer.on('create-new-file',callback)
  //   return () => {
  //     ipcRenderer.removeListener('create-new-file', callback);
  //   }
  // })
  useIpcRenderer({
    'create-new-file': createNewFile,
    'import-file': importFilesArr
  })


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
              onBtnClick={importFilesArr}
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
