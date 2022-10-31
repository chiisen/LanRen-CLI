const clc = require("cli-color")
const xlsx = require("node-xlsx") // 引入 node-xlsx 模組
const fs = require("fs")

/**
 * 檢查是否為數值
 * @param {*} val
 * @returns
 */
function isNumeric(val) {
  return /^-?\d+$/.test(val)
}

/**
 * 讀取 Excel
 *
 * @param {string} fileName
 */
function getExcel(fileName, isLog = false, sheetIndex = 0) {
  console.log(clc.cyan(`"${fileName}" excel-parse start`))

  const excel = []
  const sheets = xlsx.parse(fileName)
  let sheet = undefined
  if (isNumeric(sheetIndex.toString())) {
    sheet = sheets[sheetIndex]
  } else {
    sheet = sheets.find((x) => x.name == sheetIndex)
  }

  // 輸出每行內容
  sheet.data.forEach((row) => {
    // 陣列格式, 根據不同的索引取數據
    excel.push(row)
  })

  console.log(clc.cyan(`"${fileName}" excel-parse end`))
  return excel
}

/**
 * 寫入單頁 Excel 檔案
 *
 * @param {string} fileName
 * @param {string} sheetName
 * @param {object} dataArray -> 
    const dataArray = [['name', 'age']]
 */
function writeSinglePageExcel(fileName, sheetName, dataArray) {
  const buffer = xlsx.build([
    {
      name: sheetName,
      data: dataArray,
    },
  ])

  fs.writeFileSync(fileName, buffer, { flag: "w" }) // 如果文件存在，覆盖
  console.log(clc.cyan(`${fileName} 寫入成功!`))
}

/**
 * 寫入多頁 Excel 檔案
 * 
 * @param {string} fileName
 * @param {object} dataArray -> 
    const dataArray = [
      {
        name: "sheetName1",
        data: [["name1", "age1"]],
      },
      {
        name: "sheetName2",
        data: [["name2", "age2"]],
      },
    ]
 */
function writeMultiplePagesExcel(fileName, dataArray) {
  const buffer = xlsx.build(dataArray)

  fs.writeFileSync(fileName, buffer, { flag: "w" }) // 如果文件存在，覆盖
  console.log(clc.cyan(`${fileName} 寫入成功!`))
}

module.exports = { getExcel, writeSinglePageExcel, writeMultiplePagesExcel }
