const { successColor } = require("../color/color")

/**
 * 格式化 json 字串
 *
 * @param {string} str
 */
function fix_json(str) {
  // 置換時間格式
  str = str.replace(/(\d{4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})/, "$1-$2-$3=$4@$5@$6")

  // 布林檢查
  str = str.replace(/([a-zA-Z0-9-]+):(true)/g, '"$1":true')
  str = str.replace(/([a-zA-Z0-9-]+):(false)/g, '"$1":false')
  str = str.replace(/([a-zA-Z0-9-]+):(TRUE)/g, '"$1":TRUE')
  str = str.replace(/([a-zA-Z0-9-]+):(FALSE)/g, '"$1":FALSE')

  str = str.replace(/([a-zA-Z0-9-]+):(true),/g, '"$1":true,')
  str = str.replace(/([a-zA-Z0-9-]+):(false),/g, '"$1":false,')
  str = str.replace(/([a-zA-Z0-9-]+):(TRUE),/g, '"$1":TRUE,')
  str = str.replace(/([a-zA-Z0-9-]+):(FALSE),/g, '"$1":FALSE,')

  str = str.replace(/([a-zA-Z0-9-]+):([0-9-]+),/g, '"$1":$2,')
  str = str.replace(/([a-zA-Z0-9-]+):([a-zA-Z0-9-]+),/g, '"$1":"$2",')
  str = str.replace(/([a-zA-Z0-9-]+):/g, '"$1":')

  // 還原時間格式
  str = str.replace(/:(\d{4})-(\d{1,2})-(\d{1,2})=(\d{1,2})@(\d{1,2})@(\d{1,2})/, ':"$1-$2-$3 $4:$5:$6"')

  console.log(successColor(str))
}

module.exports = { fix_json }
