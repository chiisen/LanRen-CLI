const fs = require("fs")
const clc = require("cli-color")

/**
 * 寫入 alter.sql
 *
 * @param {*} subPath
 * @param {*} insertText
 */
function writeAlter(subPath, insertText) {
  fs.writeFileSync(`${subPath}/alter.sql`, insertText, "utf8")
}

/**
 * 寫入 alter.sql
 *
 * @param {*} subPath
 * @param {*} insertText
 */
 function writeAlterByFileName(subPath, fileName, insertText) {
  fs.writeFileSync(`${subPath}/${fileName}`, insertText, "utf8")
}

/**
 * 插入文字到 alter.sql
 *
 * @param {*} subPath
 * @param {*} insertText
 */
 function appendAlter(subPath, insertText) {
  fs.appendFileSync(`${subPath}/alter.sql`, insertText, "utf8")
}

/**
 * 插入文字到 alter.sql
 *
 * @param {*} subPath
 * @param {*} insertText
 */
 function appendAlterByFileName(subPath, fileName,insertText) {
  fs.appendFileSync(`${subPath}/${fileName}`, insertText, "utf8")
}

/**
 * 寫入 README.md
 * @param {string} subPath
 * @param {string} insertText
 */
function writeReadme(subPath, insertText) {
  fs.writeFileSync(`${subPath}/README.md`, insertText, "utf8")
}

/**
 * 檢查路徑資料夾，沒有的狀況則新增資料夾
 *
 * @param {*} path
 */
function folderMk(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }
}

/**
 * 建立目錄，重複會自動更名
 *
 * @param {*} fs
 * @param {string} mainFolder
 */
function createFolder(mainFolder, subFolder) {
  const path = `./${mainFolder}`
  folderMk(path)
  let subPath = `${path}/${subFolder}`
  let count = 0
  let subNewPath = subPath
  do {
    if (fs.existsSync(subNewPath)) {
      count += 1
      subNewPath = `${subPath}-${count}`
      continue
    }
  } while (fs.existsSync(subNewPath))

  console.log("建立目錄: " + clc.magenta(subNewPath))
  fs.mkdirSync(subNewPath)
  return subNewPath
}

/**
 * 回傳指定路徑的所有目錄名稱
 *
 */
 function readDir(path, isShowLog = true) {
  if (!fs.existsSync(path)) {
    if(isShowLog)
    {
      console.log("目錄: " + clc.magenta(path) + " 不存在")
    }
    return null
  }
  return fs.readdirSync(path)
}

module.exports = { writeAlter, writeAlterByFileName, appendAlter, appendAlterByFileName, writeReadme, folderMk, createFolder, readDir }
