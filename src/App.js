import React, { useState } from 'react';
import './App.less';
import { Button, Col, Row } from "antd";
import { FileAddOutlined, ImportOutlined } from "@ant-design/icons";
import uuidV4 from 'uuid/dist/v4';


import FileSearch from "./components/FileSearch/FileSearch.jsx";
import FileList from "./components/FileList/FileList.jsx";
import BottomBtn from "./components/BottomBtn/BottomBtn.jsx";
import TabList from "./components/TabList/TabList";

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
  const [files, setFiles] = useState(defaultFiles); // 文件列表数组
  const [activeFileId, setActiveFileId] = useState(''); // 当前的文件id
  const [openFileIds, setOpenFileIds] = useState([]); // 当前被打开的文件
  const [unSaveFileIds, setUnSaveFileIds] = useState([]); // 未保存的文件

  const openedFiles = openFileIds.map(openId => files.find(v => v.id === openId))

  /**
   * 文件列表标题点击添加tab
   * @param fileId {string}
   */
  const fileClick = (fileId) => {
    // console.log({ fileId })
    if (!openFileIds.includes(fileId)) {
      setOpenFileIds([...openFileIds, fileId]);
    } else {
      setActiveFileId(fileId);
    }
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
    const newFiles = files.map((file) => {
      if (file.id === fileId) {
        file.body = body;
      }
      return file;
    })
    setFiles(newFiles);
    setActiveFileId(fileId);
    if (!unSaveFileIds.includes(fileId)) {
      setUnSaveFileIds([...unSaveFileIds, fileId]);
    }
  }

  /**
   * 删除文件
   * @param fileId {string}
   */
  const deleteFile = (fileId) => {
    const newFiles = files.filter(file => file.id !== fileId);
    setFiles(newFiles);
    tabClose(fileId);
  }

  /**
   * 保存文件
   * @param title {string}
   * @param fileId {string}
   * @param isNew {boolean} 是否为新建
   */
  const saveTitle = (title, fileId, isNew = false) => {
    const newFiles = files.map(file => {
      if (file.id === fileId) {
        file.title = title
        file.isNew = false
      }
      return file
    });
    setFiles(newFiles);
  }

  /**
   * 创建新文件
   */
  const createNewFile = () => {
    const newId = uuidV4();
    const newFiles = [
      ...files,
      {
        id: newId,
        title: '',
        body: '## 请输入内容',
        createdAt: new Date().getTime(),
        isNew: true,
      }
    ]
    setFiles(newFiles);
  }

  return (
    <div className="wrapper">
      <Row>
        <Col span={6} style={{ height: '100vh' }}>
          <FileSearch
            onFileSearch={(v) => {
              console.log(v)
            }}
          />
          <FileList
            files={files}
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
