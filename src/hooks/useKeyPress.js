import { useEffect, useState } from "react";

/**
 * 键盘是否按下指定键值
 * @param targetKeyCode {number} 按键code值
 * @returns {boolean}
 */
const useKeyPress = (targetKeyCode) => {
  const [keyPress, setKeyPress] = useState(false);

  const keyDownHandle = ({ keyCode }) => {
    if (keyCode === targetKeyCode) {
      setKeyPress(true);
    }
  }

  const keyUpHandle = ({ keyCode }) => {
    if (keyCode === targetKeyCode) {
      setKeyPress(false);
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', keyDownHandle);
    document.addEventListener('keyup', keyUpHandle);
    return () => {
      document.removeEventListener('keydown', keyDownHandle);
      document.removeEventListener('keyup', keyUpHandle);
    };
  }, []);
  return keyPress;
}

export default useKeyPress;
