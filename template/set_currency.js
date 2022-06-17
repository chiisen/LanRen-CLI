const fs = require("fs")
const clc = require("cli-color")

const { successColor, errorColor, warnColor } = require("../color/color")
const { appendAlterByFileName, writeReadme, createFolder } = require("../file/file")
const { getExcel } = require("./getExcel")
const { csvToArray } = require("../tool")
const { inspect } = require("util")

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
 * 讀取 game_currency_denom_setting.xlsx (有gameId)
 */
 function readGameIdXlsx() {
  const gameCurrencyDenomSettingXlsx = `game_currency_denom_setting.xlsx`
  if (!fs.existsSync(gameCurrencyDenomSettingXlsx)) {
    console.error(`\n 讀檔失敗，找不到 ${gameCurrencyDenomSettingXlsx}`)
    process.exit(1)
  }

  createGameIdSql(gameCurrencyDenomSettingXlsx)
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
  Readme(subPath)

  const nextLine = "\r\n"

  denomListData.map((x) => {
    const currency = x[0]
    let denom = x[1]

    if (currency !== "Currency") {
      const data = {
        currency,
        denom,
      }

      const denomArray = csvToArray(denom.toString())
      const arr = denomArray.filter(function (y) {
        return y.toString() === "15"
      })

      if (!arr.length) {
        console.log(errorColor(`【幣別】${currency} 沒有 1:1`))
        console.log(warnColor(`${inspect(data)}`))

        denom += ",15"
      }

      const insertText =
        `
    INSERT INTO \`game\`.\`game_default_currency_denom\` (\`Currency\`,\`Denom\`) 
    VALUES ("${currency}","${denom}")
    ON DUPLICATE KEY UPDATE \`Denom\` = VALUES(\`Denom\`);` + nextLine

    appendAlterByFileName(subPath, "game_default_currency_denom.sql",insertText)
    }
  })

  console.log(successColor(`產生設定預設【遊戲幣別】面額腳本建立完成!`))
}

/**
 * 建立 SQL 腳本
 */
 function createGameIdSql(gameCurrencyDenomSettingXlsx) {
  console.log("讀取檔案: " + clc.magenta(`./${gameCurrencyDenomSettingXlsx}`))

  const denomListData = getExcel(gameCurrencyDenomSettingXlsx)

  const nowDate = dayjs(new Date()).format("YYYYMMDD")
  const dateFolder = `${nowDate}`

  const subPath = `設定預設【遊戲幣別】面額/${dateFolder}`

  const nextLine = "\r\n"

  denomListData.map((x) => {
    const gameId = x[0]
    const currency = x[1]
    let denom = x[2]

    if (currency !== "Currency") {
      const data = {
        gameId,
        currency,
        denom,
      }

      const denomArray = csvToArray(denom.toString())
      const arr = denomArray.filter(function (y) {
        return y.toString() === "15"
      })

      if (!arr.length) {
        console.log(errorColor(`【遊戲幣別】${currency} 沒有 1:1`))
        console.log(warnColor(`${inspect(data)}`))

        denom += ",15"
      }

      const insertText =
        `
    INSERT INTO \`game\`.\`game_currency_denom_setting\` (\`GameId\`,\`Currency\`,\`Denom\`) 
    VALUES ("${gameId}","${currency}","${denom}")
    ON DUPLICATE KEY UPDATE \`Denom\` = VALUES(\`Denom\`);` + nextLine

      appendAlterByFileName(subPath, "game_currency_denom_setting.sql",insertText)
    }
  })

  console.log(successColor(`產生設定預設【遊戲幣別】面額腳本建立完成!(${denomListData.length} 筆)`))
}

/**
 * 寫入 README
 * @param {string} subPath
 */
function Readme(subPath) {
  const insertText = `
  設定預設【遊戲幣別】面額

 1.執行 game_default_currency_denom.sql - 對應資料表 game_default_currency_denom
 2.執行 game_currency_denom_setting.sql - 對應資料表 game_currency_denom_setting (有gameId) 只有魚機2千多筆，全部1萬5千多筆，修正沒1:1面額`
  writeReadme(subPath, insertText)
}

/**
 * 設定預設【幣別】面額 - 讀取 game_default_currency_denom.xlsx、game_currency_denom_setting.xlsx (有gameId)
 * -w
 *
 * @param {*} opts[0] currency
 */
function set_currency() {
  readXlsx()
  readGameIdXlsx()
}

module.exports = { set_currency }
