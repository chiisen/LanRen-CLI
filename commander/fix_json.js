const { successColor } = require("../color/color")

/**
 * 格式化 json 字串
 *
 * @param {string} str
 */
function fix_json(str) {

  str = str.replace(/\\/g,'')
  str = str.replace(/_/g,'0bottomLine0')

  // 置換時間格式
  //2022-02-22T06:32:26.000Z
  str = str.replace(/(\d{4})-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2}).(\d{3})Z/, "$1-$2-$3T$4@$5@$6.$7Z")
  //2022-02-23 01:15:06.995
  str = str.replace(/(\d{4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2}).(\d{3})/, "$1-$2-$3=$4@$5@$6.$7")
  //2020-02-17 04:15:11
  str = str.replace(/(\d{4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})/, "$1-$2-$3=$4@$5@$6")
  //2022-03-08
  str = str.replace(/(\d{4})-(\d{1,2})-(\d{1,2})/, "$1-$2-$3")

  //IP檢查
  //::ffff:210.242.152.252
  str = str.replace(/::ffff:(\d{1,3}).(\d{1,3}).(\d{1,3}).(\d{1,3})/, `@@ffff@$1.$2.$3.$4`)

  //沒填資料的情況 'currency:'
  str = str.replace(/([a-zA-Z0-9-]+):,/g, '"$1":"",')
  //資料為 null 的情況 'currency:null'
  str = str.replace(/([a-zA-Z0-9-]+):null,/g, '"$1":null,')
  str = str.replace(/([a-zA-Z0-9-]+):NULL,/g, '"$1":NULL,')
  //最後一筆資料的情況 'currency:MYR}'
  str = str.replace(/([a-zA-Z0-9-]+):([a-zA-Z0-9-]+)}/g, '"$1":"$2"}')

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

  // 還原 IP 格式
  str = str.replace(/@@ffff@(\d{1,3}).(\d{1,3}).(\d{1,3}).(\d{1,3})/, `"::ffff:$1.$2.$3.$4"`)

  // 還原時間格式
  str = str.replace(/(\d{4})-(\d{1,2})-(\d{1,2})T(\d{1,2})@(\d{1,2})@(\d{1,2}).(\d{3})Z/, `"$1-$2-$3T$4:$5:$6.$7Z"`)
  str = str.replace(/(\d{4})-(\d{1,2})-(\d{1,2})=(\d{1,2})@(\d{1,2})@(\d{1,2}).(\d{3})/, `"$1-$2-$3 $4:$5:$6.$7"`)
  str = str.replace(/:(\d{4})-(\d{1,2})-(\d{1,2})=(\d{1,2})@(\d{1,2})@(\d{1,2})/, ':"$1-$2-$3 $4:$5:$6"')
  str = str.replace(/:(\d{4})-(\d{1,2})-(\d{1,2})/, ':"$1-$2-$3"')

  str = str.replace(/0bottomLine0/g,'_')

  console.log(successColor(str))
}

module.exports = { fix_json }
