const fs = require("fs")
const clc = require("cli-color")
const { parse } = require("csv-parse")

const { warnColor, successColor } = require("../color/color")

/**
 * 新增幣別
 *
 * @param {*} opts[0] denom
 */
function set_denom(opts) {
  const denom = opts[0]
  if (denom == undefined) {
    console.error(`請輸入設定幣別`)
    process.exit(1)
  }
  const denomCsv = `gameList.csv`
  const indexList = opts[1]
  if (indexList == undefined) {
    console.error(`請輸入面額索引列表`)
    process.exit(1)
  }

  const cId = opts[2]

  if (!fs.existsSync(denomCsv)) {
    console.error(`\n 讀檔失敗，找不到 ${denomCsv}`)
    process.exit(1)
  }

  fs.readFile(`./${denomCsv}`, async (err, data) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }

    console.log(clc.cyan("csv-parse start"))

    const csvData = []
    fs.createReadStream(`./${denomCsv}`)
      .pipe(parse({ delimiter: ":" }))
      .on("data", function (csvrow) {
        //console.log(csvrow)
        //do something with csvrow
        csvData.push(csvrow)
      })
      .on("end", function () {
        //do something with csvData
        //console.log(csvData)

        console.log(clc.cyan("csv-parse end"))

        const rootPath = `set_denom`
        const path = `./${rootPath}`
        if (!fs.existsSync(path)) {
          fs.mkdirSync(path)
        }

        let subPath = `${path}/${denom}`
        let count = 0
        do {
          if (!fs.existsSync(subPath)) {
            fs.mkdirSync(subPath)
          } else {
            count += 1
            subPath += `-${count}`
            continue
          }
        } while (!fs.existsSync(subPath))

        const nextLine = "\r\n"

        fs.writeFileSync(`${subPath}/alter.sql`, `-- 設定幣別` + nextLine + nextLine, "utf8")

        csvData.map((x) => {
          if (isNumeric(x)) {
            fs.appendFileSync(
              `${subPath}/alter.sql`,
              `INSERT INTO game.game_denom_setting(Cid, GameId, Currency, Denom) 
          VALUES('${cId}','${x}', '${denom}' ,  '${indexList}'  ) 
          ON DUPLICATE KEY UPDATE Denom = '${indexList}';` +
                nextLine +
                nextLine
            )
          }
        })

        console.log(successColor(`設定【遊戲幣別:`) + warnColor(`${denom}】完成!`))
      })
  })
}

function isNumeric(value) {
  return /^-?\d+$/.test(value)
}

module.exports = { set_denom }
