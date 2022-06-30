const { readDir, createFolder } = require("../file/file")
const fs = require("fs")
const clc = require("cli-color")
const { getGameIdList } = require("../template/getGameIdList")
const dayjs = require("dayjs")

/**
 * 複製 icon
 *
 */
function icon(typeList, sizeList, langList, isShowGameIdLog = false) {
  const defaultPath = "C:/company/"
  let enterPath = defaultPath + "Icon/"
  let files = readDir(enterPath)
  if (!files) {
    process.exit(1)
    return
  }
  enterPath += "common/"
  files = readDir(enterPath)
  if (!files) {
    process.exit(1)
    return
  }

  const gameIdListXlsx = `gameIdList.xlsx`
  if (!fs.existsSync(gameIdListXlsx)) {
    console.error(`\n 讀檔失敗，找不到 ${gameIdListXlsx}`)
    process.exit(1)
  }

  if (!typeList) {
    console.error(`\n 請輸入參數 typeList: rectangle,rectangle_r,square,square_r`)
    process.exit(1)
    return
  }
  if (!sizeList) {
    console.error(
      `\n 請輸入參數 sizeList: 200_300,250_203,500_300,300_540,310_190,390_180,360_360,200_200,300_300,500_500,`
    )
    process.exit(1)
    return
  }
  if (!langList) {
    console.error(`\n 請輸入參數 langList: cn,en,en_cn,id,in,jp,kr,my,th,tw,vn`)
    process.exit(1)
    return
  }

  const gameIdList = getGameIdList(gameIdListXlsx)
  console.log(clc.red("gameIdList: ") + gameIdList)

  console.log(clc.green("typeList: ") + typeList)
  const typeListArray = typeList.split(",")

  console.log(clc.green("sizeList: ") + sizeList)
  const sizeListArray = sizeList.split(",")

  console.log(clc.green("langList: ") + langList)
  const langListArray = langList.split(",")

  const nowDate = dayjs(new Date()).format("YYYYMMDD")

  const newPath = createFolder("客戶【Icon】壓縮檔案" + nowDate, "icon_" + nowDate)

  typeListArray.map((xType) => {
    const typeSubDir = xType + "/"
    const typeDir = enterPath + typeSubDir
    console.log(clc.yellow("typeDir: ") + typeDir)
    const tf = readDir(typeDir)
    if (tf) {
      console.log(typeDir + clc.magenta(" OK!"))

      const newTypePath = newPath + "/" + typeSubDir
      if (!fs.existsSync(newTypePath)) {
        fs.mkdirSync(newTypePath)
      }

      sizeListArray.map((s) => {
        const sizeSubDir = typeSubDir + s + "/"
        const sizeDir = enterPath + sizeSubDir
        const sf = readDir(sizeDir)
        if (sf) {
          console.log(sizeDir + clc.magenta(" OK!"))

          const newSizePath = newPath + "/" + sizeSubDir
          if (!fs.existsSync(newSizePath)) {
            fs.mkdirSync(newSizePath)
          }

          gameIdList.map((g) => {
            const gameIdSubDir = sizeSubDir + g + "/"
            const gameIdDir = enterPath + sizeSubDir + g + "/"
            const gf = readDir(gameIdDir, isShowGameIdLog)
            if (gf) {
              console.log(gameIdDir + clc.blue(" OK!"))

              const newGameIdPath = newPath + "/" + gameIdSubDir
              if (!fs.existsSync(newGameIdPath)) {
                fs.mkdirSync(newGameIdPath)
              }

              fs.readdirSync(gameIdDir).forEach((file) => {

                const isLang = langListArray.some((item) => file.includes("_" + item))
                if (isLang) {
                  const newFilePath = newGameIdPath + file
                  const gameIdFile = gameIdDir + file
                  fs.copyFileSync(gameIdFile, newFilePath)
                }
              })

            }
          })
        }
      })
    }
  })

  console.log(clc.magenta("==程式結束!=="))
}

module.exports = { icon }
