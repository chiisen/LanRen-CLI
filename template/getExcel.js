const clc = require("cli-color")
const xlsx = require("node-xlsx") // 引入 node-xlsx 模組

/**
 * 取得 getExcel
 * 
 * @param {string} excelXlsx
 */
function getExcel(excelXlsx) {
  console.log(clc.cyan("excel-parse start"))

  const excel = []
  const sheets = xlsx.parse(excelXlsx)
  const sheet = sheets[0]
  // 輸出每行內容
  sheet.data.forEach((row) => {
    // 陣列格式, 根據不同的索引取數據
    excel.push(row)
  })

  console.log(clc.cyan("excel-parse end"))
  return excel
}

module.exports = { getExcel }
