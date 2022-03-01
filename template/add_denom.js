const fs = require("fs")
const clc = require("cli-color")
const { parse } = require("csv-parse")

const { warnColor, successColor } = require("../color/color")

/**
 * 新增幣別
 *
 * @param {*} opts[0] denom
 */
function add_denom(opts) {
  const denom = opts[0]
  if(denom == undefined)
  {
    console.error(`請輸入新增幣別`)
    process.exit(1)
  }
  const denomCsv = `${denom}.csv`
  const indexList = opts[1]
  if(indexList == undefined)
  {
    console.error(`請輸入面額索引列表`)
    process.exit(1)
  }

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

        const rootPath = `add_denom`
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

        fs.writeFileSync(
          `${subPath}/README.md`,
          `請確定在後台有新增【遊戲幣別】與設定【匯率】
      後台操作可以參考 http://jira.i8.games/confluence/pages/viewpage.action?pageId=27590719
      
      請 IT 執行 alter.sql`,
          "utf8"
        )

        const nextLine = "\r\n"
        fs.writeFileSync(
          `${subPath}/alter.sql`,
          `INSERT INTO \`game\`.\`game_default_currency_denom\` (\`Currency\`,\`Denom\`) VALUES ('${denom}',"13,12,11,10,9,8,7,6,5,4")
      ON DUPLICATE KEY UPDATE \`Denom\` = VALUES(\`Denom\`);` + nextLine,
          "utf8"
        )

        fs.appendFileSync(
          `${subPath}/alter.sql`,
          `INSERT INTO \`game\`.\`game_currency_denom_setting\` (\`GameId\`, \`Currency\`, \`Denom\`) 
    VALUES` + nextLine
        )

        let lineCount = 0
        csvData.map((x) => {
          lineCount++
          if (lineCount == csvData.length) {
            fs.appendFileSync(
              `${subPath}/alter.sql`,
              `(${x},'{${denom}}',"${indexList}");` + nextLine
            )
          } else {
            fs.appendFileSync(
              `${subPath}/alter.sql`,
              `(${x},'${denom}',"${indexList}"),` + nextLine
            )
          }
        })

        console.log(successColor(`新增【遊戲幣別:`) + warnColor(`${denom}】完成!`))
      })
  })
}

module.exports = { add_denom }
