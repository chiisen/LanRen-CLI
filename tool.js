/**
 * 檢查是否為數值
 *
 * @param {*} value
 * @returns
 */
function isNumeric(value) {
  return /^-?\d+$/.test(value)
}

/**
 * csv To Array
 *
 * @param { string } str
 * @param { string } delimiter
 * @returns
 */
function csvToArray(str, delimiter = ",") {
  if (str.indexOf(delimiter) === -1) {
    const array = [str]
    return array
  }

  const rows = str.split(delimiter)

  const arr = rows.map(function (row) {
    return row.split(delimiter)
  })

  return arr
}

module.exports = { isNumeric, csvToArray }
