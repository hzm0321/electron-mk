import React, { useEffect, useRef, useState } from "react";
import { Input } from "antd";
import { CloseOutlined } from '@ant-design/icons';

import styles from './EditInput.module.less';
import useKeyPress from "../../hooks/useKeyPress";

const EditInput = ({ placeholder, defaultValue = '', iconClick, onEnterPress, onEscPress }) => {
  const [inputValue, setInputValue] = useState(defaultValue);
  const enterPressed = useKeyPress(13); // 是否按下enter
  const escPressed = useKeyPress(27); // 是否按下esc
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, [])

  useEffect(() => {
    if (enterPressed) {
      onEnterPress(inputValue);
    }
    if (escPressed) {
      onEscPress();
    }
  }, [escPressed, enterPressed])

  return (
    <div className={styles.edit}>
      <Input
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        placeholder={placeholder}
        ref={inputRef}
      />
      <CloseOutlined onClick={iconClick} />
    </div>
  )
}

export default EditInput;
