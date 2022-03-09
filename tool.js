/**
 * 檢查是否為數值
 * @param {*} value
 * @returns
 */
function isNumeric(value) {
  return /^-?\d+$/.test(value)
}

module.exports = { isNumeric }
