#!/usr/bin/env node

const { inspect } = require("util")

const rsa = require("./rsa/rsa")
const { dc_setting_common } = require("./template/dc_setting_common")
const { dc_setting_update_endpoint } = require("./template/dc_setting_update_endpoint")

const { errorColor, warnColor, successColor } = require("./color/color")

const { url_token } = require("./commander/url_token")
const { fix_json } = require("./commander/fix_json")

const fs = require("fs")

const program = require("commander")

const package = require("./package.json")

program
  .version(package.version)
  .name(package.name) // 專案名稱
  .usage("-[命令參數] '副參數1' '副參數2' ...") // 使用說明
program
  .addHelpText(
    "beforeAll",
    `
Example:
  $ lr -h`
  )
  .description(package.description)
  .option("-d | --no-non_debug", "是否不顯示 debug 資訊") // --no- 開頭會預設 non_debug 為 true
  .option("-o | --option_type [option_type]", "顯示參數內容的格式 [option_type]", 0) // 可以不填 option_type ，預設為 0
  .option("-e | --rsa_encrypt <decryptString>", "RSA 解密加密字串，須配合 private.pem")
  .option("-c | --rsa_create <dc>", "產生指定 dc 的 RSA public/private key 檔案")
  .option("-s | --dcsetting_common <dc>", "新增通用型單錢包的 dc_setting (-s dc)")
  .option("-u | --dcsetting_update_endpoint <dc...>", "更新 dc_setting 的 endpoint (-u dc https)")
  .option("-t | --url_token <token>", "使用 token 產生網址 (-t token)")
  .option("-j | --fix_json <str>", "格式化 json 字串 (-j str)")
  .option("-n, --numbers <numbers...>", "多個數值參數")
  .option("-r, --strings <strings...>", "多個字串參數")
  .showHelpAfterError(errorColor("<使用 -h 參數可以提示更多使用功能>")) // 錯誤提示訊息
  .configureOutput({
    // 此處使輸出變得容易區分
    writeOut: (str) => process.stdout.write(`[OUT] ${str}`),
    writeErr: (str) => process.stdout.write(`[ERR] ${str}`),
    // 將錯誤高亮顯示
    outputError: (str, write) => write(errorColor(str)),
  })
  .parse()

const opts = program.opts()
const keys = Object.keys(opts).length
if(keys <= 2)
{
  console.log(errorColor("請輸入參數，或輸入 lr -h 查詢使用說明。"))
  return
}

console.log(warnColor(`是否不顯示 debug 資訊: non_debug = ${opts.non_debug} ` + (opts.non_debug ? "(不顯示)" : "(顯示)")))

/**
 *  印出 option 的參數
 */
if (!opts.non_debug) {
  // 顯示參數內容的格式
  console.log(`顯示參數內容的格式: opts.option_type = ${opts.option_type} `)
  if (opts.option_type === 0) {
    console.log("command option: " + inspect(opts)) // 全部一行
  } else {
    for (const key in opts) {
      console.log(`command type: ${key} ${program.getOptionValue(key)}`) // 一個一行印
    }
  }
}

/**
 *  多個數值參數
 */
if (opts.numbers) {
  opts.numbers.map((x) => {
    console.log(`numbers=${x}`)
  })
}

/**
 *  多個字串參數
 */
if (opts.strings) {
  opts.strings.map((x) => {
    console.log(`strings=${x}`)
  })
}

/**
 *  RSA 解密加密字串，須配合 private.pem
 */
if (opts.rsa_encrypt) {
  console.log(`\n 開始 RSA 解密`)
  // ``
  // 上面可測試解密
  const decryptString = program.getOptionValue("rsa_encrypt")

  // Load private key by dc
  if (!fs.existsSync("private.pem")) {
    console.error(`\n RSA 解密失敗，找不到 private.pem`)
    return
  }
  const privateKey = fs.readFileSync("private.pem", { encoding: "utf8" }) // private.pem 目前是 FATCAT
  console.log(`privateKey = \n${privateKey}`)
  const decrypted = rsa.decrypt(privateKey, decryptString)
  console.log("\ndecrypted=\n" + decrypted)
  console.log(`\n 結束 RSA 解密`)
}

/**
 *  產生指定 dc 的 RSA public/private key 檔案與 sql script
 */
if (opts.rsa_create) {
  rsa.exportKey(`rsa_create`, program.getOptionValue("rsa_create"))
}

/**
 *  新增通用型單錢包的 dc_setting
 */
if (opts.dcsetting_common) {
  dc_setting_common(program.getOptionValue("dcsetting_common"))
}

/**
 *  更新 dc_setting 的 endpoint
 */
if (opts.dcsetting_update_endpoint) {
  dc_setting_update_endpoint(opts.dcsetting_update_endpoint)

  const dc = opts.dcsetting_update_endpoint[0]
  const endpoint = opts.dcsetting_update_endpoint[1]
  console.log(
    successColor(`dc = ${dc}
  endpoint = ${endpoint}
  更新 dc_setting 的 endpoint 完成!`)
  )
}

/**
 * 使用 token 產生網址
 */
if (opts.url_token) {
  url_token(program.getOptionValue("url_token"))
}

/**
 * 格式化 json 字串
 */
if (opts.fix_json) {
  fix_json(program.getOptionValue("fix_json"))
}
