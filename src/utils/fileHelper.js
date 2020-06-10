const fs = window.require('fs').promises;

/**
 * 读取文件
 * @param path {string} 文件路径
 * @param cb {function} 回调函数
 */
const fileHelper = {
  readFile: (path) => fs.readFile(path, { encoding: 'utf8' }),
  writeFile: (path, content) => fs.writeFile(path, content, { encoding: 'utf8' }),
  renameFile: (path, newPath) => fs.rename(path, newPath),
  deleteFile: (path) => fs.unlink(path)
}

export default fileHelper;
