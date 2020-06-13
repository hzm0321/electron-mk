/**
 * 数组转为对象id形式
 * @param arr {array}
 * @returns {*}
 */
export const flattenArr = (arr) => {
  return arr.reduce((map, item) => {
    map[item.id] = item
    return map
  }, {})
}

/**
 * 对象id转为数组形式
 * @param obj {object}
 * @returns {*[]}
 */
export const objToArr = (obj) => {
  return Object.keys(obj).map(key => obj[key])
}

/**
 * 获取父节点
 * @param node {dom} 当前子节点
 * @param parentClassName {string} 父节点类名称
 * @returns {node|boolean}
 */
export const getParentNode = (node, parentClassName) => {
  let current = node;
  while (current !== null) {
    // 循环出口
    if (current.classList.contains(parentClassName)) {
      return current
    }
    current = current.parentNode;
  }
  return false;
}
