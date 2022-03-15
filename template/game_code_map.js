const fs = require("fs")
const clc = require("cli-color")

const { successColor } = require("../color/color")
const { writeAlter, appendAlter, writeReadme, createFolder } = require("../file/file")
const { isNumeric } = require("../tool")
const { getExcel } = require("./getExcel")

/**
 * 新增 game_code_map 資料 - 讀取 gameCodeMap.xlsx
 */
function game_code_map() {
  const gameCodeMapXlsx = `gameCodeMap.xlsx`
  if (!fs.existsSync(gameCodeMapXlsx)) {
    console.error(`\n 讀檔失敗，找不到 ${gameCodeMapXlsx}`)
    process.exit(1)
  }

  createSql(gameCodeMapXlsx)
}

/**
 * 建立 SQL 腳本
 */
function createSql(gameCodeMapXlsx) {
  console.log("讀取檔案: " + clc.magenta(`./${gameCodeMapXlsx}`))

  const xlsxData = getExcel(gameCodeMapXlsx)

  const gameCodeMapData = []
  xlsxData.map((x) => {
    const id = x[0]
    if (isNumeric(id)) {
      const data = {
        id,
        dc: x[1],
        gameId: x[2],
        gameCode: x[3],
      }
      gameCodeMapData.push(data)
    } else {
      console.log(clc.red(id) + " 不是正常值")
    }
  })
  const subPath = createFolder(`game_code_map`, "gameCodeMap")

  const nextLine = "\r\n"

  const insertReadme = `
      新增 game_code_map 資料
        1. 執行 alter.sql
        
        清除redis cache
        
        1. select 3
        
        2. del GAME_CODE_LIST`

  writeReadme(subPath, insertReadme)

  const insertData =
    `
  ------------------------------
  -- game.game_code_map
  ------------------------------
  TRUNCATE TABLE \`game\`.\`game_code_map\`;` + nextLine
  writeAlter(subPath, insertData)

  let insertText = `
  INSERT INTO \`game\`.\`game_code_map\` (\`id\`, \`dc\`, \`gameId\`, \`gameCode\`) `
  appendAlter(subPath, insertText)

  let count = 0
  gameCodeMapData.map((x) => {
    count++
    if (gameCodeMapData.length == count) {
      insertText = ` 
    (${x.id},"${x.dc}",${x.gameId},"${x.gameCode}");`
    } else if (count === 1) {
      insertText = ` 
    VALUES (${x.id},"${x.dc}",${x.gameId},"${x.gameCode}"),`
    } else {
      insertText = ` 
    (${x.id},"${x.dc}",${x.gameId},"${x.gameCode}"),`
    }

    appendAlter(subPath, insertText)
  })

  console.log(successColor(`新增多筆【game_code_map】完成!`))
}

module.exports = { game_code_map }
