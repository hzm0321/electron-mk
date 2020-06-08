import React, { useEffect, useRef, useState } from "react";
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import { Input } from "antd";
import PropTypes from 'prop-types';

import './FileSearch.less';
import EditInput from "../EditInput/EditInput";
import useKeyPress from "../../hooks/useKeyPress";

/**
 * mk标题内容搜索组件
 * @param title {string} 应用标题
 * @param onFileSearch {function} 搜索方法
 * @returns {*}
 * @constructor
 */
const FileSearch = ({ title, onFileSearch }) => {
  const [inputActive, setInputActive] = useState(false); // 输入框是否被激活

  const startSearch = () => {
    setInputActive(true);
  }

  const closeSearch = () => {
    setInputActive(false);
    onFileSearch(false);
  }

  return (
    <div className="search-wrapper">
      {inputActive ?
        <div className="search-input">
          <EditInput
            placeholder="请输入要搜索的内容"
            iconClick={closeSearch}
            onEnterPress={onFileSearch}
            onEscPress={closeSearch}
          />
        </div>
        :
        <div className="search-content">
          <span>{title}</span>
          <span>
            <SearchOutlined onClick={startSearch} style={{ fontSize: 20, padding: '0 10px 0 10px' }} />
          </span>
        </div>}
    </div>
  )
}

FileSearch.prototype = {
  title: PropTypes.string,
  onFileSearch: PropTypes.func.isRequired
}

FileSearch.defaultProps = {
  title: '我的云文档'
}

export default FileSearch;
