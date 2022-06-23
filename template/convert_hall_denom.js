const fs = require("fs")
const clc = require("cli-color")

const { successColor, errorColor, warnColor } = require("../color/color")
const { appendAlterByFileName, createFolder } = require("../file/file")
const { getExcel, writeSinglePageExcel, writeMultiplePagesExcel } = require("./getExcel")
const { csvToArray } = require("../tool")
const { inspect } = require("util")
const { denomArray } = require("../commander/denomIndexArray")

const dayjs = require("dayjs")

/**
 * 讀取 game_default_currency_denom.xlsx
 */
function readXlsx() {
  const gameDefaultCurrencyDenomXlsx = `game_default_currency_denom.xlsx`
  if (!fs.existsSync(gameDefaultCurrencyDenomXlsx)) {
    console.error(`\n 讀檔失敗，找不到 ${gameDefaultCurrencyDenomXlsx}`)
    process.exit(1)
  }

  createSql(gameDefaultCurrencyDenomXlsx)
}

/**
 * 建立 SQL 腳本
 */
function createSql(gameDefaultCurrencyDenomXlsx) {
  console.log("讀取檔案: " + clc.magenta(`./${gameDefaultCurrencyDenomXlsx}`))

  const denomListData = getExcel(gameDefaultCurrencyDenomXlsx)

  const nowDate = dayjs(new Date()).format("YYYYMMDD")
  const dateFolder = `${nowDate}`

  const subPath = createFolder(`設定預設【遊戲幣別】面額`, dateFolder)

  const nextLine = "\r\n"

  const excelDenomOutput = []
  const excelDenomIndexOutput = []
  denomListData.map((x) => {
    const currency = x[0]
    let denom = x[1]

    if (currency !== "Currency") {
      const data = {
        currency,
        denom,
      }

      const denomArr = csvToArray(denom.toString())
      const arr = denomArr.filter(function (y) {
        return y.toString() === "15"
      })

      if (!arr.length) {
        console.log(errorColor(`【幣別】${currency} 沒有 1:1`))
        console.log(warnColor(`${inspect(data)}`))
        console.log(warnColor(`${denomArray(denom)}`))

        denom += ",15"
      }

      const insertText =
        `
    INSERT INTO \`game\`.\`game_default_currency_denom\` (\`Currency\`,\`Denom\`) 
    VALUES ("${currency}","${denom}")
    ON DUPLICATE KEY UPDATE \`Denom\` = VALUES(\`Denom\`);` + nextLine

      appendAlterByFileName(subPath, "game_default_currency_denom.sql", insertText)

      excelDenomOutput.push([currency, ...denomArray(denom)])
      excelDenomIndexOutput.push([currency, ...denomArr])
    } else {
      excelDenomOutput.push([currency, denom])
      excelDenomIndexOutput.push([currency, denom])
    }
  })

  writeSinglePageExcel("./DefaultCurrencyDenomSinglePage.xlsx", "【幣別】面額", excelDenomOutput)
  writeSinglePageExcel("./DefaultCurrencyDenomIndexSinglePage.xlsx", "【幣別】面額索引", excelDenomIndexOutput)

  const dataArray = [
    {
      name: "【幣別】面額",
      data: excelDenomOutput,
    },
    {
      name: "【幣別】面額索引",
      data: excelDenomIndexOutput,
    },
  ]
  //---

  writeMultiplePagesExcel("./DefaultCurrencyDenomMultiplePages.xlsx", dataArray)

  console.log(successColor(`產生設定預設【遊戲幣別】面額腳本建立完成!`))
}

/**
 * 設定預設【幣別】面額 - 讀取 game_default_currency_denom.xlsx、game_currency_denom_setting.xlsx (有gameId)
 * -w
 *
 * @param {*} opts[0] currency
 */
function convert_hall_denom() {
  readXlsx()
}

module.exports = { convert_hall_denom }
