/**
 * 紅色
 * 
 * @param {*} str 
 * @returns 
 */
function errorColor(str) {
  // 新增 ANSI 轉義字元，以將文字輸出為紅色
  return `\x1b[31m${str}\x1b[0m`
}

/**
 * 黃色
 * 
 * @param {*} str 
 * @returns 
 */
function warnColor(str) {
  return `\x1b[33m${str}\x1b[0m`
}

/**
 * 綠色
 * 
 * @param {*} str 
 * @returns 
 */
function successColor(str) {
  return `\x1b[32m${str}\x1b[0m`
}

/**
 * 藍色
 * 
 * @param {*} str 
 * @returns 
 */
function normalColor(str) {
  return `\x1b[34m${str}\x1b[0m`
}

module.exports = { errorColor, warnColor, successColor, normalColor }
