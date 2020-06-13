import { Button, Input, List, message } from "antd";
import React, { useEffect, useState } from "react";
import { FileMarkdownTwoTone } from "@ant-design/icons";
import styles from './FileList.module.less';
import EditInput from "../EditInput/EditInput";

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
  console.log({ files })
  /**
   * 关闭编辑输入框
   * @param fileId {string}
   * @param isNew {boolean} 是否为新建操作生成的文件
   */
  const closeEdit = (fileId, isNew) => {
    if (isNew) {
      onFileDelete(fileId, isNew);
    }
    setEditStatus(false);
  }

  /**
   * 按下回车确认 这里做校验拦截操作
   * @param title {string} 标题内容
   * @param fileId {string} 文件if
   * @param isNew {boolean} 是否来自新建操作
   */
  const handleEnter = (title, fileId, isNew) => {
    // 判断是否同名
    const allFilesTitle = files.map((file) => file.title);
    const oldTitle = files.find(file => file.id === fileId).title;
    if (allFilesTitle.includes(title) && title !== oldTitle) {
      message.error('文件名不能相同');
      return;
    }
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
                iconClick={() => closeEdit(file.id, file.isNew)}
                defaultValue={file.title}
                onEnterPress={(value) => handleEnter(value.trim(), file.id, file.isNew)}
                onEscPress={() => closeEdit(file.id, file.isNew)}
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
