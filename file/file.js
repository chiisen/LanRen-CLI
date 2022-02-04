const fs = require("fs")

/**
 * 檢查路徑資料夾，沒有的狀況則新增資料夾
 * @param {*} path 
 */
function folderCheck(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }
}

module.exports = { folderCheck }
