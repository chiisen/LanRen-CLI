const rsa = require("node-rsa")
const fs = require("fs")
const dayjs = require("dayjs")

const { createFolder, writeReadme, folderMk } = require("../file/file")

/**
 * 解密
 * @param {*} privateKey
 * @param {*} x
 * @returns
 */
function decrypt(privateKey, x) {
  const key = new rsa(privateKey)
  key.setOptions({ encryptionScheme: "pkcs1_oaep" })
  const decrypt = key.decrypt(x, "utf8")
  return decrypt
}

/**
 * 加密
 * @param {*} publicKey
 * @param {*} x
 * @returns
 */
function encrypt(publicKey, x) {
  const key = new rsa(publicKey)

  key.setOptions({ encryptionScheme: "pkcs1_oaep" })
  const encrypt = key.encrypt(x, "base64", "utf8")
  return encrypt
}

/**
 *
 * @returns 產出 RSA public/private key 與 sql script
 */
function exportKey(folder, dc, env) {
  const subPath = createFolder(folder, dc)

  const nowDate = dayjs(new Date()).format("YYYYMMDD")
  const dateFolder = `${subPath}/${nowDate}`
  folderMk(dateFolder)

  const insertText = `
[${dc}][${env}]新增 dc_rsa_key 資料
1. 執行 alter.sql
`
  writeReadme(dateFolder, insertText)

  const key = new rsa({ b: 2048 })
  const rsa_key = {
    publicKey: key.exportKey("pkcs8-public-pem"),
    privateKey: key.exportKey("pkcs1-private-pem"),
  }

  const rsaFile = `${subPath}/${dc}`
  folderMk(rsaFile)
  console.log(`publicKey = ${rsa_key.publicKey}`)
  fs.writeFileSync(`${rsaFile}/public.pem`, rsa_key.publicKey, "utf8")
  console.log(`write File = public.pem`)

  console.log(`privateKey = ${rsa_key.privateKey}`)
  fs.writeFileSync(`${rsaFile}/private.pem`, rsa_key.privateKey, "utf8")
  console.log(`write File = private.pem`)

  const now = new Date()
  const createTime = now.toISOString().split(".")[0].split("T").join(" ")
  const sql = `INSERT INTO \`game\`.\`dc_rsa_key\` (DC, PublicKey, PrivateKey, CreateDate) VALUES ("${dc}","${rsa_key.publicKey
    .split("\n")
    .join("")}","${rsa_key.privateKey.split("\n").join("")}","${createTime}");`

  const sqlFileName = "alter.sql"
  console.log(`dc = ${dc}`)
  fs.writeFileSync(`${dateFolder}/${sqlFileName}`, sql, "utf8")
  console.log(`write File = ${sqlFileName}`)

  return rsa_key
}

module.exports = { decrypt, encrypt, exportKey }
