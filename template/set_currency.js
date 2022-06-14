const fs = require("fs")
const clc = require("cli-color")

const { successColor } = require("../color/color")
const { writeAlter, appendAlter, writeReadme, createFolder } = require("../file/file")
const { getExcel } = require("./getExcel")

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
  const subPath = createFolder(`set_currency`, `denomList`)
  Readme(subPath)

  const nextLine = "\r\n"
  const insertTitleDefault = `
------------------------------`
  writeAlter(subPath, insertTitleDefault)

  denomListData.map((x) => {
    const currency = x[0]
    const denom = x[1]

    if (currency !== "Currency") {
      const data = {
        currency,
        denom,
      }

      console.log(data)

      const insertText =
        `
    INSERT INTO \`game\`.\`game_default_currency_denom\` (\`Currency\`,\`Denom\`) 
    VALUES ("${currency}","${denom}")
    ON DUPLICATE KEY UPDATE \`Denom\` = VALUES(\`Denom\`);` + nextLine

      appendAlter(subPath, insertText)
    }

    console.log(successColor(`產生設定預設【幣別】面額腳本建立完成!`))
  })
}

/**
 * 寫入 README
 * @param {string} subPath
 */
function Readme(subPath) {
  const insertText = `
  設定預設【幣別】面額 - 對應資料表 game.game_default_currency_denom

 1.執行 alter.sql`
  writeReadme(subPath, insertText)
}

/**
 * 設定預設【幣別】面額 - 讀取 game_default_currency_denom.xlsx
 * -w
 *
 * @param {*} opts[0] currency
 */
function set_currency() {
  readXlsx()
}

module.exports = { set_currency }
