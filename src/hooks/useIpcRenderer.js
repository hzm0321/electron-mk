import { useEffect } from "react";

const { ipcRenderer } = window.require('electron');

/**
 * 监听事件
 * @param keyCallbackMap {object}
 * keyCallbackMap 参数举例
 * {
 *   eventAdd: ()=>{...},
 *   eventDelete: ()=>{...}
 * }
 */
const useIpcRenderer = (keyCallbackMap) => {
  useEffect(() => {
    Object.keys(keyCallbackMap).forEach((key) => {
      ipcRenderer.on(key, keyCallbackMap[key]);
    })
    return () => {
      Object.keys(keyCallbackMap).forEach((key) => {
        ipcRenderer.removeListener(key, keyCallbackMap[key]);
      })
    }
  })
}

export default useIpcRenderer;
