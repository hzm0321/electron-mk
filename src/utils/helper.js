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
