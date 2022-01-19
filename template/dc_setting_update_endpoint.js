const fs = require("fs")

/**
 * 更新 dc_setting 的 endpoint
 *
 * @param {*} dc
 */
function dc_setting_update_endpoint(dc) {
  const rootPath = `dc_setting_update_endpoint`
  const path = `./${rootPath}`
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }
  const subPath = `${path}/${dc}`
  if (!fs.existsSync(subPath)) {
    fs.mkdirSync(subPath)
  }
  fs.writeFileSync(
    `${subPath}/README.md`,
    `調整 ${dc} 的 dc setting 設定資料的 Endpoint 設定
    1. 執行 alter.sql
    
    清除redis cache
    
    1. select 3
    
    2. del DC_SETTING:${dc}`,
    "utf8"
  )

  fs.writeFileSync(
    `${subPath}/alter.sql`,
    `UPDATE game.dc_setting
    SET Endpoint = 'https://'
    WHERE  DC='${dc}';`,
    "utf8"
  )
}

module.exports = { dc_setting_update_endpoint }
