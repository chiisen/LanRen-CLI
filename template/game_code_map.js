const fs = require("fs")
const clc = require("cli-color")
const { parse } = require("csv-parse")

const { warnColor, successColor } = require("../color/color")
const { writeAlter, appendAlter, writeReadme, createFolder } = require("../file/file")
const { denomIndexArray } = require("../commander/denomIndexArray")
const { isNumeric } = require("../tool")

function game_code_map() {
  const gameCodeMapCsv = `gameCodeMap.csv`
  if (!fs.existsSync(gameCodeMapCsv)) {
    console.error(`\n 讀檔失敗，找不到 ${gameCodeMapCsv}`)
    process.exit(1)
  }

  console.log(clc.cyan("csv-parse start(gameCodeMap)"))

  const gameCodeMap = []
  fs.createReadStream(`./${gameCodeMapCsv}`)
    .pipe(parse({ delimiter: ":" }))
    .on("data", function (csvrow) {
      //do something with csvrow
      gameCodeMap.push(csvrow)
    })
    .on("end", function () {
      //do something with csvData
      console.log(clc.cyan("csv-parse end(gameList)"))

      createGameCodeMap(gameCodeMapCsv, gameCodeMap)
    })
}

/**
 *
 */
function createGameCodeMap(denomListCsv, gameIdList) {
  console.log("讀取檔案: " + clc.magenta(`./${denomListCsv}`))

  console.log(clc.cyan("csv-parse start"))

  const csvData = []
  fs.createReadStream(`./${denomListCsv}`)
    .pipe(parse({ delimiter: ":" }))
    .on("data", function (csvrow) {
      //do something with csvrow
      const strAry = csvrow[0].split(",")
      const id = strAry[0]
      if (isNumeric(id)) {
        const data = {
          id,
          dc: strAry[1],
          gameId: strAry[2],
          gameCode: strAry[3],
        }
        csvData.push(data)
      } else {
        console.log(clc.red(id) + " 不是正常值")
      }
    })
    .on("end", function () {
      //do something with csvData
      console.log(clc.cyan("csv-parse end"))

      const subPath = createFolder(`game_code_map`, "gameCodeMap")

      const nextLine = "\r\n"

      const insertData =
        nextLine +
        nextLine +
        `
  ------------------------------
  -- game.game_code_map
  ------------------------------`
      writeAlter(subPath, insertData)

      csvData.map((x) => {
        const insertText = `
  INSERT INTO \`game\`.\`game_code_map\` (\`id\`, \`dc\`, \`gameId\`, \`gameCode\`) 
  VALUES (${x.id},"${x.dc}",${x.gameId},"${x.gameCode}")
  ON DUPLICATE KEY UPDATE gameId = ${x.gameId}, gameCode = "${x.gameCode}";`

        appendAlter(subPath, insertText)
      })

      console.log(successColor(`新增多筆【game_code_map】完成!`))
    })
}

module.exports = { game_code_map }
