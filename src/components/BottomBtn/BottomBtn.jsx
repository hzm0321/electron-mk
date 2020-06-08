import { Button } from "antd";
import React from "react";

/**
 * 底部新建保存按钮
 * @param text {string} 按钮内文字
 * @param type {string} 按钮样式类型
 * @param icon {string} 按钮所接受的antd图标
 * @param onBtnClick {function} 点击按钮方法
 * @returns {*}
 * @constructor
 */
const BottomBtn = ({ text, type = "primary", icon, onBtnClick }) => (
  <Button
    type={type}
    onClick={onBtnClick}
    icon={icon}
  >
    {text}
  </Button>
)

export default BottomBtn;
