import React, { useEffect, useRef, useState } from "react";
import { Empty, Tabs } from "antd";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import styles from './TabList.module.less';

const { TabPane } = Tabs;

/**
 * 标签栏组件
 * @param files {array} 当前打开的files
 * @param activeId
 * @param unSaveIds {array} 未保存的数组
 * @param onTabClick
 * @param onCloseTap {function} 关闭标签
 * @param onFileBodyChange {function} mk内容改变
 * @returns {*}
 * @constructor
 */
const TabList = ({ files, activeId, unSaveIds, onTabClick, onCloseTap, onFileBodyChange }) => {
  const [activeKey, setActiveKey] = useState(() => files.length > 0 ? files[0].id : undefined);
  console.log({ files })
  const saveFiles = useRef(files);

  // 当files内容发生变更
  useEffect(() => {
    // 如果当前激活状态存在不变更
    // if (activeKey) {
    //   return;
    // }
    if (files.length > 0 && files.length === saveFiles.current.length) {
      return
    } else if (files.length > 0 && files.length > saveFiles.current.length) {
      setActiveKey(files[files.length - 1].id);
    }
    // 临时保存files
    saveFiles.current = files;
  }, [files, activeKey])

  useEffect(() => {
    setActiveKey(activeId);
  }, [activeId])

  const onEdit = (targetKey, action) => {
    // console.log(targetKey, action)
    if (action === 'remove') {
      onCloseTap(targetKey);
    }
  }

  const changeTabsKey = (key) => {
    // 如果key的界面没有,重置显示最后一个files的页面
    if (files.find(file => file.id === key)) {
      setActiveKey(key);
    } else {
      if (files.length > 0) {
        setActiveKey(files[files.length - 1].id);
      }
    }
  }

  const tabTitle = (title, fileId) => unSaveIds.includes(fileId) ? `*${title}` : title

  return (
    <div className={styles['tab-list']}>
      {files.length > 0 ? (
        <Tabs
          hideAdd
          type="editable-card"
          onChange={changeTabsKey}
          activeKey={activeKey}
          onEdit={onEdit}
        >
          {files.map(file => (
            <TabPane tab={<span>{tabTitle(file.title, file.id)}</span>} key={file.id}>
              <SimpleMDE
                value={file.body}
                onChange={body => onFileBodyChange(body, file.id)}
                options={{
                  minHeight: '515px'
                }}
                style={{ paddingLeft: '15px', height: '100%' }}
              />
            </TabPane>
          ))}
        </Tabs>
      ) : (
        <Empty description="选择或者创建新的 Markdown 文档" />
      )}
    </div>
  )
}

export default TabList;
