#!/usr/bin/env node

const { inspect } = require("util")
const crypto = require("crypto")
const fs = require("fs")
const clc = require("cli-color")
const program = require("commander")
const shell = require("shelljs")
const fetch = require("node-fetch-retry")

const rsa = require("./rsa/rsa")

// template
const { dc_setting_common } = require("./template/dc_setting_common")
const { dc_setting_update_endpoint } = require("./template/dc_setting_update_endpoint")
const { add_denom } = require("./template/add_denom")
const { update_denom } = require("./template/update_denom")
const { set_denom } = require("./template/set_denom")
const { game_code_map } = require("./template/game_code_map")
const { set_dc_denom } = require("./template/set_dc_denom")

const { errorColor, warnColor, successColor, normalColor } = require("./color/color")

const { url_token } = require("./commander/url_token")
const { fixJson } = require("./commander/fix_json")
const { denomIndexArray, denomArray } = require("./commander/denomIndexArray")

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
  .option("-a | --ase <str>", successColor("ase 加解密 ") + warnColor("(-a str)"))
  .option("-b | --sha1 <str>", normalColor("sha1 密碼不可逆加密 ") + warnColor("(-b str)"))
  .option("-c | --rsa_create <dc>", successColor("產生指定 dc 的 RSA public/private key 檔案") + warnColor("(-c dc)"))
  .option("-d | --no-non_debug", normalColor("是否不顯示 debug 資訊")) // --no- 開頭會預設 non_debug 為 true
  .option(
    "-e | --rsa_encrypt <decryptString>",
    successColor("RSA 解密加密字串，須配合 private.pem") + warnColor("(-e str)")
  )
  .option(
    "-f | --denom <list>",
    normalColor("將面額字串陣列轉成數值陣列") + errorColor("(請先去掉雙引號)") + warnColor("(-f list)")
  )
  .option(
    "-g | --denomNum <list>",
    successColor("將面額數值陣列轉成字串陣列") + errorColor("(雙引號可用空白取代)") + warnColor("(-g list)")
  ) // g 的下個字母 -h 預設為說明
  .option("-i | --add_denom", normalColor("新增幣別 - 讀取 denomList.xlsx") + warnColor("(-i)"))
  .option("-j | --fix_json <str>", successColor("格式化 json 字串 ") + warnColor("(-j str)"))
  .option("-k | --update_denom <denom...>", normalColor("更新幣別面額"))
  .option("-l | --set_denom", successColor("設定幣別 - 讀取 updateDenomList.xlsx") + warnColor("(-l)"))
  .option("-m | --md5 <str>", normalColor("md5 密碼不可逆加密 ") + warnColor("(-m str)"))
  .option("-n, --numbers <numbers...>", "多個數值參數")
  .option("-o | --option_type [option_type]", successColor("顯示參數內容的格式 [option_type]"), 0) // 可以不填 option_type ，預設為 0
  .option("-p | --game_code_map", normalColor("新增 game_code_map 資料 - 讀取 gameCodeMap.xlsx"))
  .option("-q | --set_dc_denom", successColor("設定 dc 幣別 - 讀取 updateDcDenomList.xlsx") + warnColor("(-q)"))
  .option("-r, --strings <strings...>", "多個字串參數")
  .option("-s | --dcsetting_common <dc>", successColor("新增通用型單錢包的 dc_setting ") + warnColor("(-s dc)"))
  .option("-t | --url_token <token>", normalColor("使用 token 產生網址 ") + warnColor("(-t token)"))
  .option(
    "-u | --dcsetting_update_endpoint <dc...>",
    successColor("更新 dc_setting 的 endpoint ") + warnColor("(-u dc https)")
  )
  .option("-v | --ver", normalColor("客製化的版本訊息")) // -V(大寫V) 預設為顯示版本號，小寫可使用
  .option("-w | --ww", errorColor("預留"))
  .option("-x | --xx <n>", errorColor("預留"))
  .option("-y | --fetch_retry <opts...>", successColor("fetch retry"))
  .option("-z | --list", normalColor("顯示 npm 全域安裝的所有套件"))
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
if (keys <= 2) {
  console.log(clc.blue("請輸入參數，或輸入") + clc.red(" lr -h ") + clc.blue("查詢使用說明。"))
  process.exit(1)
}

console.log(
  warnColor(`是否不顯示 debug 資訊: non_debug = ${opts.non_debug} ` + (opts.non_debug ? "(不顯示)" : "(顯示)"))
)

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
 * 設定 dc 幣別 - 讀取 updateDcDenomList.xlsx
 */
 if (opts.set_dc_denom) {
  set_dc_denom()
}

/**
 * 新增 game_code_map 資料
 */
if (opts.game_code_map) {
  game_code_map()
}

/**
 * 更新幣別面額
 */
if (opts.update_denom) {
  update_denom(opts.update_denom)
}

/**
 * 新增幣別
 */
if (opts.add_denom) {
  add_denom(opts.add_denom)
}

/**
 * 設定幣別
 */
if (opts.set_denom) {
  set_denom()
}

/**
 * fetch retry
 */
if (opts.fetch_retry) {
  const input = { ...opts.fetch_retry }
  const url = input[0]
  const retry = input[1]

  const opt = {
    method: "GET",
    retry,
    callback: (retry) => {
      console.log(`${url} Trying: ${retry}`)
    },
  }

  const sync = async () => {
    const response = await fetch(url, opt)
    console.log(response)
  }

  console.log(clc.cyan("fetch"))

  sync()
}

/**
 * 顯示 npm 全域安裝的所有套件
 */
if (opts.list) {
  shell.echo(clc.cyan("shell 執行開始!"))
  shell.echo(clc.red(`============================`))

  // 檢查指令是否安裝
  const cmd = "npm"
  if (!shell.which(cmd)) {
    shell.echo(`${errorColor("無法執行指令")}: ${warnColor(cmd)}`)
    shell.exit(1)
  }

  // 同步執行外部指令
  const extCmd = "npm list -g --depth=0"
  shell.echo(`執行 "${warnColor(extCmd)}"`)
  shell.echo(clc.blue(`============================`))
  const code = shell.exec(extCmd).code
  shell.echo(clc.blue(`============================`))
  shell.echo(`code= ${warnColor(code)}`)
  shell.echo(clc.red(`============================`))
  if (code !== 0) {
    shell.echo(`${errorColor("執行結果發生錯誤")}: ${warnColor(extCmd)}`)
    shell.exit(1)
  }
  shell.echo(clc.cyan("shell 執行結束!"))
}

/**
 * 客製化的版本訊息
 */
if (opts.ver) {
  console.log(clc.blue("########################"))
  console.log(clc.blue("# ") + clc.magenta("專案名稱: ") + clc.red(package.name) + clc.blue(" #"))
  console.log(clc.blue("# ") + clc.magenta("目前版本: ") + clc.red(package.version) + clc.blue("      #"))
  console.log(clc.blue("########################"))
  console.log(clc.magenta("專案說明: ") + clc.red(package.description))
  console.log(clc.magenta("author: ") + clc.red(package.author))
  console.log(clc.magenta("repository: ") + clc.red(inspect(package.repository)))
  console.log(clc.magenta("license: ") + clc.red(package.license))
  console.log(clc.magenta("dependencies: ") + clc.red(inspect(package.dependencies)))
  console.log(clc.magenta("keywords: ") + clc.red(package.keywords))
}
/**
 * 將面額字串陣列轉成數值陣列
 */
if (opts.denom) {
  const str = program.getOptionValue("denom")
  denomIndexArray(str)
}

/**
 * 將面額數值陣列轉成字串陣列
 */
if (opts.denomNum) {
  const str = program.getOptionValue("denomNum")
  denomArray(str)
}

/**
 * md5 不可逆加密
 */
if (opts.md5) {
  const str = program.getOptionValue("md5")
  const pwd = crypto.createHash("md5").update(str).digest("hex")
  console.log("md5 不可逆加密: " + clc.yellow(pwd))
}

/**
 * sha1 不可逆加密
 */
if (opts.sha1) {
  const str = program.getOptionValue("sha1")
  const pwd = crypto.createHash("sha1").update(str).digest("hex")
  console.log("sha1 不可逆加密: " + clc.yellow(pwd))
}

/**
 * ASE 加解密
 */
if (opts.ase) {
  const data = program.getOptionValue("ase")

  const mode = "aes-128-cbc"

  const key = "9vApxLk5G3PAsJrM"
  console.log("ASE key: " + key)
  const iv = "FnJL7EDzjqWjcaY9"
  console.log("ASE iv: " + iv)

  // 加密
  let sign = ""
  const cipher = crypto.createCipheriv(mode, key, iv)
  sign = cipher.update(data, "utf8", "hex")
  sign += cipher.final("hex")
  console.log("ASE 加密: " + sign)

  // 解密
  let src = ""
  const decipher = crypto.createDecipheriv(mode, key, iv)
  src = decipher.update(sign, "hex", "utf8")
  src += decipher.final("utf8")
  console.log("ASE 解密: " + src)
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
    process.exit(1)
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
  rsa.exportKey(`【產生指定 dc 的 RSA KEY】`, program.getOptionValue("rsa_create"))
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
  fixJson(program.getOptionValue("fix_json"))
}
