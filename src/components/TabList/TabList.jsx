import React, { useEffect, useState } from "react";
import { Empty, Tabs } from "antd";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import styles from './TabList.module.less';

const { TabPane } = Tabs;

const initialPanes = [
  { title: 'Tab 1', content: 'Content of Tab 1', key: '1' },
  { title: 'Tab 2', content: 'Content of Tab 2', key: '2' },
  {
    title: 'Tab 3',
    content: 'Content of Tab 3',
    key: '3',
    closable: false,
  },
];

/**
 * 标签栏组件
 * @param files
 * @param activeId
 * @param unSaveIds
 * @param onTabClick
 * @param onCloseTap
 * @returns {*}
 * @constructor
 */
const TabList = ({ files, activeId, unSaveIds, onTabClick, onCloseTap }) => {
  const [activeKey, setActiveKey] = useState(() => {
    if (files.length > 0) {
      return files[0].id
    }
    return null;
  });
  console.log({ files })
  useEffect(() => {
    if (files.length > 0) {
      setActiveKey(files[files.length - 1].id);
    }
  }, [files])

  const onEdit = (targetKey, action) => {
    console.log(targetKey, action)
    if (action === 'remove') {
      onCloseTap(targetKey);
    }
  }

  return (
    <div className={styles['tab-list']}>
      {files.length > 0 ? (
        <Tabs
          hideAdd
          type="editable-card"
          onChange={(key) => setActiveKey(key)}
          activeKey={activeKey}
          onEdit={onEdit}
        >
          {files.map(pane => (
            <TabPane tab={pane.title} key={pane.id}>
              <SimpleMDE
                value={pane.body}
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
