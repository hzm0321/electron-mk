import { Button, Input, List } from "antd";
import React, { useEffect, useState } from "react";
import { FileMarkdownTwoTone } from "@ant-design/icons";
import styles from './FileList.module.less';
import EditInput from "../EditInput/EditInput";

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
 * @param isCloseEdit
 * @returns {*}
 * @constructor
 */
const FileList = ({ files, onFileClick, onSaveEdit, onFileDelete }) => {
  const [editStatus, setEditStatus] = useState(false); // 是否为可编辑状态

  const closeEdit = () => {
    setEditStatus(false);
  }

  /**
   * 按下回车确认
   * @param title {string} 标题内容
   * @param fileId {string} 文件if
   * @param isNew {boolean} 是否来自新建操作
   */
  const handleEnter = (title, fileId, isNew) => {
    setEditStatus(false);
    onSaveEdit(title, fileId, isNew)
  }

  return (
    <div className={styles['file-list']}>
      <List
        dataSource={files}
        renderItem={file => (
          <List.Item>
            {file.id === editStatus || file.isNew ?
              // <div>
              //   <Input
              //     placeholder="可编辑状态"
              //     value={inputValue}
              //     onChange={e => setInputValue(e.target.value)}
              //   />
              // </div>
              <EditInput
                placeholder="请输入新的标题"
                iconClick={closeEdit}
                defaultValue={file.title}
                onEnterPress={(value) => handleEnter(value, file.id, file.isNew)}
              />
              :
              (<>
                  <span className={styles['title-left']} onClick={() => onFileClick(file.id)}>
                    <FileMarkdownTwoTone />
                    {file.title}
                  </span>
                <span className={styles['btn-options']}>
                  <Button
                    type={"primary"}
                    size={"small"}
                    onClick={e => {
                      setEditStatus(file.id);
                    }}
                  >
                    编辑
                  </Button>
                  <Button
                    type={"primary"}
                    size={"small"}
                    danger
                    onClick={() => onFileDelete(file.id)}
                  >
                    删除
                  </Button>
                  </span>
              </>)}
          </List.Item>
        )}
      />
    </div>
  )
}

export default FileList;
