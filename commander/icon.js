const { readDir } = require("../file/file")

/**
 * 複製 icon
 *
 */
function icon(path) {
  const files = readDir("./Icon")

  if(!files){
    return
  }

  console.log("==目錄列表==")
  files.forEach(x => {
    console.log(x)
  })
}

module.exports = { icon }
