import { Button, List } from "antd";
import React, { useState } from "react";
import { FileMarkdownTwoTone } from "@ant-design/icons";
import styles from './FileList.module.less';

const defaultFiles = [
  {
    id: '1',
    title: 'first post',
    body: '*should be aware of this*',
    createdAt: 1563762965704
  },
  {
    id: '2',
    title: 'second post',
    body: '## this is the title',
    createdAt: 1563762965704
  },
  {
    id: '3',
    title: '你好世界',
    body: '### 这是另外一个小标题欧',
    createdAt: 1563762965704
  },
  {
    id: '4',
    title: '你好世界',
    body: '**粗体内容**',
    createdAt: 1563762965704
  }
]

/**
 * mk列表的标题展示
 * @param files {array} 所有的mk标题列表
 * @param onFileClick {function} 点击每个标题的方法
 * @param onSaveEdit {function} 保存
 * @param onFileDelete {function} 删除
 * @returns {*}
 * @constructor
 */
const FileList = ({ files, onFileClick, onSaveEdit, onFileDelete }) => {
  const [editStatus, setEditStatus] = useState(false); // 是否为可编辑状态
  const [inputValue, setInputValue] = useState(''); // 输入框的值

  return (
    <div className={styles['file-list']}>
      <List
        dataSource={files}
        renderItem={file => (
          <List.Item>
            <span className={styles['title-left']} onClick={() => onFileClick(file.id)}>
              <FileMarkdownTwoTone />
              {file.title}
            </span>
            <span className="btn-options">
              <Button
                type={"text"}
                size={"small"}
              >
                编辑
              </Button>
              <Button type={"primary"} size={"small"} danger>删除</Button>
            </span>
          </List.Item>
        )}
      />
    </div>
  )
}

export default FileList;
