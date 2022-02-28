const fs = require("fs")
const { warnColor, successColor } = require("../color/color")

/**
 * 新增幣別
 *
 * @param {*} opts[0] denom
 */
 function add_denom(opts) {
    const denom = opts[0]

    if (!fs.existsSync("gameList.csv")) {
      console.error(`\n 讀檔失敗，找不到 gameList.csv`)
      process.exit(1)
    }
    
  
    const rootPath = `add_enom`
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
  
    fs.writeFileSync(
      `${subPath}/alter.sql`,
      `INSERT INTO \`game\`.\`game_default_currency_denom\` (\`Currency\`,\`Denom\`) VALUES ('${denom}',"13,12,11,10,9,8,7,6,5,4")
      ON DUPLICATE KEY UPDATE \`Denom\` = VALUES(\`Denom\`);`,
      "utf8"
    )

    console.log(successColor(`新增【遊戲幣別: ${denom}】完成!`))
 }

 module.exports = { add_denom }