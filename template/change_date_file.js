const fs = require("fs")
const clc = require("cli-color")
const { getExcel } = require("./getExcel")
const { isNumeric } = require("../tool")
const { createFolder, writeReadme, writeAlterByFileName } = require("../file/file")

const dayjs = require("dayjs")

/**
 * 讀取 changeDateFile.xlsx
 */
function readXlsx() {
  const changeDateFileXlsx = `changeDateFile.xlsx`
  if (!fs.existsSync(changeDateFileXlsx)) {
    console.error(`\n 讀檔失敗，找不到 ${changeDateFileXlsx}`)
    process.exit(1)
  }

  createSql(changeDateFileXlsx)
}

/**
 * 建立 SQL 腳本
 */
function createSql(changeDateFileXlsx) {
  console.log("讀取檔案: " + clc.magenta(`./${changeDateFileXlsx}`))

  const listData = getExcel(changeDateFileXlsx)
  const nowDate = dayjs(new Date()).format("YYYYMMDD")
  const subPath = createFolder(`change_date_file`, `${nowDate}`)
  Readme(subPath)

  let index = 0
  listData.map((x) => {
    const sy = x[0]
    const sm = x[1]
    const sd = x[2]
    const ey = x[3]
    const em = x[4]
    const ed = x[5]

    if (isNumeric(sy)) {
      console.log(`alter${index}.sql`)
      let dateStart = `${sy}-${sm}-${sd} 00:00:00`
      console.log(dateStart)
      let dateEnd = `${ey}-${em}-${ed} 00:00:00`
      console.log(dateEnd)
  
      writeAlterByFileName(
        "./",
        subPath + `/alter${index}.sql`,
        `
  SET @start_time = '${dateStart}';
  
  SET @end_time = '${dateEnd}';
  
  DELETE FROM wagers_1.user_revenue_player WHERE AccountDate >= @start_time AND AccountDate < @end_time;
  DELETE FROM wagers_1.user_revenue_agent WHERE AccountDate >= @start_time AND AccountDate < @end_time;
  DELETE FROM wagers_1.user_revenue_hall WHERE AccountDate >= @start_time AND AccountDate < @end_time;
  DELETE FROM wagers_1.game_revenue_player WHERE AccountDate >= @start_time AND AccountDate < @end_time;
  DELETE FROM wagers_1.game_revenue_agent WHERE AccountDate >= @start_time AND AccountDate < @end_time;
  DELETE FROM wagers_1.game_revenue_hall WHERE AccountDate >= @start_time AND AccountDate < @end_time;
  
  
  INSERT INTO wagers_1.user_revenue_player( Id,AccountDate,Rounds,BaseRounds,Cid,UserName,UpId,HallId,CryDef,Currency,ExCurrency,IsDemo,RealBetGold,BetGold,BetPoint,WinGold,JPPoint,JPGold,JPConGoldOriginal,JPRealBetGold ) SELECT Id,AccountDate,Rounds,BaseRounds,Cid,UserName,UpId,HallId,CryDef,Currency,ExCurrency,IsDemo,RealBetGold,BetGold,BetPoint,WinGold,JPPoint,JPGold,JPConGoldOriginal,JPRealBetGold FROM ( SELECT MD5(CONCAT_WS('-',Cid, MAX(left(AddDate,15)),Currency,ExCurrency,CryDef )) AS Id,MAX(CONCAT(left(AddDate, 15), "0:00")) AS AccountDate,count(Cid) AS Rounds,SUM(IF(IsFreeGame = 0, 1, 0)) AS BaseRounds,MAX(Cid) AS Cid,MAX(UserName) AS UserName,MAX(UpId) AS UpId,MAX(HallId) AS HallId,MAX(CryDef) AS CryDef,MAX(Currency) AS Currency,MAX(ExCurrency) AS ExCurrency,MAX(IsDemo) AS IsDemo,SUM( TRUNCATE(RealBetGold / 1000,2) * 1000 ) AS RealBetGold,SUM( TRUNCATE(BetGold / 1000,2) * 1000 ) AS BetGold,SUM( TRUNCATE(BetPoint / 1000,2) *1000 ) AS BetPoint,SUM( TRUNCATE(WinGold / 1000,2) *1000 ) AS WinGold,SUM( TRUNCATE(JPPoint / 1000,2) *1000 ) AS JPPoint,SUM( TRUNCATE(JPGold / 1000,2) *1000 ) AS JPGold,SUM( TRUNCATE(JPConGoldOriginal / 1000,4) * 1000) AS JPConGoldOriginal,SUM(IF(JPConGoldOriginal > 0, TRUNCATE(RealBetGold / 1000,2) * 1000, 0)) AS JPRealBetGold FROM  wagers_1.wagers_bet AS w    WHERE AddDate >= @start_time AND AddDate < @end_time AND IsValid = 1 AND IsDemo = 0 GROUP BY w.Cid,left(w.AddDate,15),w.Currency,w.ExCurrency,w.CryDef,w.IsDemo ) tempTable  ON DUPLICATE KEY UPDATE Rounds=tempTable.Rounds , BaseRounds=tempTable.BaseRounds , RealBetGold=tempTable.RealBetGold , BetGold=tempTable.BetGold , BetPoint=tempTable.BetPoint , WinGold=tempTable.WinGold , JPPoint=tempTable.JPPoint , JPGold=tempTable.JPGold , JPConGoldOriginal=tempTable.JPConGoldOriginal , UpId=tempTable.UpId , JPRealBetGold=tempTable.JPRealBetGold;
  
  INSERT INTO wagers_1.user_revenue_agent( Id,AccountDate,Rounds,BaseRounds,Cid,HallId,CryDef,Currency,ExCurrency,IsDemo,RealBetGold,BetGold,BetPoint,WinGold,JPPoint,JPGold,JPConGoldOriginal,JPRealBetGold ) SELECT Id,AccountDate,Rounds,BaseRounds,Cid,HallId,CryDef,Currency,ExCurrency,IsDemo,RealBetGold,BetGold,BetPoint,WinGold,JPPoint,JPGold,JPConGoldOriginal,JPRealBetGold FROM ( SELECT MD5(CONCAT_WS('-',p.UpId,p.AccountDate,p.Currency,p.ExCurrency,p.CryDef)) AS Id,p.AccountDate,SUM(p.Rounds) AS Rounds,SUM(p.BaseRounds) AS BaseRounds,p.UpId AS Cid,MAX(p.HallId) AS HallId,p.CryDef,p.Currency,p.ExCurrency,MAX(p.IsDemo) AS IsDemo,SUM( TRUNCATE(RealBetGold / 1000,2) * 1000 ) AS RealBetGold,SUM( TRUNCATE(p.BetGold / 1000,2) * 1000 ) AS BetGold,SUM( TRUNCATE(p.BetPoint / 1000,2) *1000 ) AS BetPoint,SUM( TRUNCATE(p.WinGold / 1000,2) *1000 ) AS WinGold,SUM( TRUNCATE(p.JPPoint / 1000,2) *1000 ) AS JPPoint,SUM( TRUNCATE(p.JPGold / 1000,2) *1000 ) AS JPGold,SUM( TRUNCATE(JPConGoldOriginal / 1000,4) * 1000) AS JPConGoldOriginal,SUM(JPRealBetGold) AS JPRealBetGold FROM  wagers_1.user_revenue_player p  LEFT JOIN game.customer c ON c.Cid = p.UpId  WHERE p.AccountDate >= @start_time AND p.AccountDate < @end_time AND c.IsDemo = 0 GROUP BY p.UpId,p.AccountDate,p.Currency,p.ExCurrency,p.CryDef,c.IsDemo ) tempTable  ON DUPLICATE KEY UPDATE Rounds=tempTable.Rounds , BaseRounds=tempTable.BaseRounds , RealBetGold=tempTable.RealBetGold , BetGold=tempTable.BetGold , BetPoint=tempTable.BetPoint , WinGold=tempTable.WinGold , JPPoint=tempTable.JPPoint , JPGold=tempTable.JPGold , JPConGoldOriginal=tempTable.JPConGoldOriginal , JPRealBetGold=tempTable.JPRealBetGold;
  
  INSERT INTO wagers_1.user_revenue_hall( Id,AccountDate,Rounds,BaseRounds,Upid,Cid,CryDef,Currency,ExCurrency,RealBetGold,BetGold,BetPoint,WinGold,JPPoint,JPGold,JPConGoldOriginal,JPRealBetGold ) SELECT Id,AccountDate,Rounds,BaseRounds,Upid,Cid,CryDef,Currency,ExCurrency,RealBetGold,BetGold,BetPoint,WinGold,JPPoint,JPGold,JPConGoldOriginal,JPRealBetGold FROM ( SELECT MD5(CONCAT_WS('-',a.HallId, a.AccountDate,a.Currency,a.ExCurrency,a.CryDef)) AS Id,AccountDate,SUM(a.Rounds) AS Rounds,SUM(a.BaseRounds) AS BaseRounds,Upid,a.HallId AS Cid,a.CryDef,a.Currency,a.ExCurrency,SUM( TRUNCATE(RealBetGold / 1000,2) * 1000 ) AS RealBetGold,SUM( TRUNCATE(a.BetGold / 1000,2) * 1000 ) AS BetGold,SUM( TRUNCATE(a.BetPoint / 1000,2) * 1000 ) AS BetPoint,SUM( TRUNCATE(a.WinGold / 1000,2) * 1000 ) AS WinGold,SUM( TRUNCATE(a.JPPoint / 1000,2) * 1000 ) AS JPPoint,SUM( TRUNCATE(a.JPGold / 1000,2) * 1000 ) AS JPGold,SUM( TRUNCATE(JPConGoldOriginal / 1000,4) * 1000) AS JPConGoldOriginal,SUM( a.JPRealBetGold ) AS JPRealBetGold FROM  wagers_1.user_revenue_agent a  LEFT JOIN game.customer c ON c.Cid = a.HallId  WHERE a.AccountDate >= @start_time AND a.AccountDate < @end_time GROUP BY a.HallId,a.AccountDate,a.Currency,a.ExCurrency,a.CryDef,a.IsDemo ) tempTable  ON DUPLICATE KEY UPDATE Rounds=tempTable.Rounds , BaseRounds=tempTable.BaseRounds , RealBetGold=tempTable.RealBetGold , BetGold=tempTable.BetGold , BetPoint=tempTable.BetPoint , WinGold=tempTable.WinGold , JPPoint=tempTable.JPPoint , JPGold=tempTable.JPGold , JPConGoldOriginal=tempTable.JPConGoldOriginal , JPRealBetGold=tempTable.JPRealBetGold;
  
  INSERT INTO wagers_1.game_revenue_player( Id,AccountDate,Rounds,BaseRounds,GGId,GameId,CryDef,Currency,ExCurrency,Cid,UserName,UpId,HallId,IsDemo,RealBetGold,BetGold,BetPoint,WinGold,JPPoint,JPGold,JPConGoldOriginal,JPRealBetGold ) SELECT Id,AccountDate,Rounds,BaseRounds,GGId,GameId,CryDef,Currency,ExCurrency,Cid,UserName,UpId,HallId,IsDemo,RealBetGold,BetGold,BetPoint,WinGold,JPPoint,JPGold,JPConGoldOriginal,JPRealBetGold FROM ( SELECT MD5(CONCAT_WS('-', GameId, Cid, MAX(LEFT(AddDate,15)),Currency,ExCurrency,CryDef)) AS Id,MAX(CONCAT(LEFT(AddDate, 15), "0:00")) AS AccountDate,count(Cid) AS Rounds,SUM(IF(IsFreeGame = 0, 1, 0)) AS BaseRounds,MAX(GGId) AS GGId,GameId,CryDef,Currency,ExCurrency,Cid,MAX(UserName) AS UserName,MAX(UpId) AS UpId,MAX(HallId) AS HallId,MAX(IsDemo) AS IsDemo,SUM( TRUNCATE(RealBetGold / 1000,2) * 1000 ) AS RealBetGold,SUM( TRUNCATE( BetGold / 1000,2) * 1000 ) AS BetGold,SUM( TRUNCATE( BetPoint / 1000,2) * 1000 ) AS BetPoint,SUM( TRUNCATE( WinGold / 1000,2) * 1000 ) AS WinGold,SUM( TRUNCATE( JPPoint / 1000,2) * 1000 ) AS JPPoint,SUM( TRUNCATE( JPGold / 1000,2) * 1000 ) AS JPGold,SUM( TRUNCATE( JPConGoldOriginal / 1000,4) * 1000) AS JPConGoldOriginal,SUM(IF(JPConGoldOriginal > 0, TRUNCATE(RealBetGold / 1000,2) * 1000, 0)) AS JPRealBetGold FROM  wagers_1.wagers_bet   WHERE AddDate >= @start_time AND AddDate < @end_time AND IsValid = 1 AND IsDemo = 0 GROUP BY GameId,Cid,LEFT(AddDate,15),Currency,ExCurrency,CryDef ) tempTable  ON DUPLICATE KEY UPDATE Rounds=tempTable.Rounds , BaseRounds=tempTable.BaseRounds , RealBetGold=tempTable.RealBetGold , BetGold=tempTable.BetGold , BetPoint=tempTable.BetPoint , WinGold=tempTable.WinGold , JPPoint=tempTable.JPPoint , JPGold=tempTable.JPGold , JPConGoldOriginal=tempTable.JPConGoldOriginal , GameId=tempTable.GameId , JPRealBetGold=tempTable.JPRealBetGold;
  
  INSERT INTO wagers_1.game_revenue_agent( Id,AccountDate,Rounds,BaseRounds,GGId,GameId,CryDef,Currency,ExCurrency,Cid,HallId,IsDemo,RealBetGold,BetGold,BetPoint,WinGold,JPPoint,JPGold,JPConGoldOriginal,JPRealBetGold ) SELECT Id,AccountDate,Rounds,BaseRounds,GGId,GameId,CryDef,Currency,ExCurrency,Cid,HallId,IsDemo,RealBetGold,BetGold,BetPoint,WinGold,JPPoint,JPGold,JPConGoldOriginal,JPRealBetGold FROM ( SELECT MD5(CONCAT_WS('-', p.GameId,p.UpId,p.AccountDate,p.Currency,p.ExCurrency,p.CryDef)) AS Id,p.AccountDate,SUM(p.Rounds) AS Rounds,SUM(p.BaseRounds) AS BaseRounds,MAX(p.GGId) AS GGId,p.GameId,p.CryDef,p.Currency,p.ExCurrency,MAX(p.UpId) AS Cid,MAX(p.HallId) AS HallId,MAX(p.IsDemo) AS IsDemo,SUM( TRUNCATE(RealBetGold / 1000,2) * 1000 ) AS RealBetGold,SUM( TRUNCATE(p.BetGold / 1000,2) * 1000 ) AS BetGold,SUM( TRUNCATE(p.BetPoint / 1000,2) * 1000 ) AS BetPoint,SUM( TRUNCATE(p.WinGold / 1000,2) * 1000 ) AS WinGold,SUM( TRUNCATE(p.JPPoint / 1000,2) * 1000 ) AS JPPoint,SUM( TRUNCATE(p.JPGold / 1000,2) * 1000 ) AS JPGold,SUM( TRUNCATE(JPConGoldOriginal / 1000 , 4) * 1000 ) AS JPConGoldOriginal,SUM(JPRealBetGold) AS JPRealBetGold FROM  wagers_1.game_revenue_player p  LEFT JOIN game.customer c ON c.Cid = p.UpId  WHERE p.AccountDate >= @start_time AND p.AccountDate < @end_time AND c.IsDemo = 0 GROUP BY p.GameId,p.UpId,p.AccountDate,p.Currency,p.ExCurrency,p.CryDef,c.IsDemo ) tempTable  ON DUPLICATE KEY UPDATE Rounds=tempTable.Rounds , BaseRounds=tempTable.BaseRounds , RealBetGold=tempTable.RealBetGold , BetGold=tempTable.BetGold , BetPoint=tempTable.BetPoint , WinGold=tempTable.WinGold , JPPoint=tempTable.JPPoint , JPGold=tempTable.JPGold , JPConGoldOriginal=tempTable.JPConGoldOriginal , GameId=tempTable.GameId , JPRealBetGold=tempTable.JPRealBetGold;
  
  INSERT INTO wagers_1.game_revenue_hall( Id,AccountDate,Rounds,BaseRounds,GGId,GameId,CryDef,Currency,ExCurrency,Upid,Cid,RealBetGold,BetGold,BetPoint,WinGold,JPPoint,JPGold,JPConGoldOriginal,JPRealBetGold ) SELECT Id,AccountDate,Rounds,BaseRounds,GGId,GameId,CryDef,Currency,ExCurrency,Upid,Cid,RealBetGold,BetGold,BetPoint,WinGold,JPPoint,JPGold,JPConGoldOriginal,JPRealBetGold FROM ( SELECT MD5(CONCAT_WS('-', a.GameId, MAX(a.Cid), a.HallId,a.AccountDate,a.Currency,a.ExCurrency,a.CryDef)) AS Id,AccountDate,SUM(a.Rounds) AS Rounds,SUM(a.BaseRounds) AS BaseRounds,MAX(a.GGId) AS GGId,a.GameId,a.CryDef,a.Currency,a.ExCurrency,c.Upid AS Upid, MAX(a.HallId) AS Cid,SUM( TRUNCATE(RealBetGold / 1000,2) * 1000 ) AS RealBetGold,SUM( TRUNCATE(a.BetGold / 1000,2) * 1000 ) AS BetGold,SUM( TRUNCATE(a.BetPoint / 1000,2) * 1000) AS BetPoint,SUM( TRUNCATE(a.WinGold / 1000,2) * 1000) AS WinGold,SUM( TRUNCATE(a.JPPoint / 1000,2) * 1000) AS JPPoint,SUM( TRUNCATE(a.JPGold / 1000,2) * 1000) AS JPGold,SUM( TRUNCATE(JPConGoldOriginal / 1000 , 4) * 1000 ) AS JPConGoldOriginal,SUM(JPRealBetGold) AS JPRealBetGold FROM  wagers_1.game_revenue_agent a  LEFT JOIN game.customer c ON c.Cid = a.HallId  WHERE a.AccountDate >= @start_time AND a.AccountDate < @end_time GROUP BY a.GameId,a.HallId,a.AccountDate,a.Currency,a.ExCurrency,a.CryDef ) tempTable  ON DUPLICATE KEY UPDATE Rounds=tempTable.Rounds , BaseRounds=tempTable.BaseRounds , RealBetGold=tempTable.RealBetGold , BetGold=tempTable.BetGold , BetPoint=tempTable.BetPoint , WinGold=tempTable.WinGold , JPPoint=tempTable.JPPoint , JPGold=tempTable.JPGold , JPConGoldOriginal=tempTable.JPConGoldOriginal , GameId=tempTable.GameId , JPRealBetGold=tempTable.JPRealBetGold;
  
  
  call wagers_1.sp_checkoutGameRevenueHall(@start_time,@end_time);
  call wagers_1.sp_checkoutUserRevenueHall(@start_time,@end_time);
      `
      )
      index += 1
    }

  })
  
}

/**
 * 寫入 README
 * @param {string} subPath
 */
function Readme(subPath) {
  const insertText = `
  [UAT] 重新結算

 1.執行 alter.sql`

  writeReadme(subPath, insertText)
}

/**
 * 重新結算 - 讀取 changeDateFile.xlsx
 * -2
 *
 */
function changeDateFile() {
  readXlsx()
}

module.exports = { changeDateFile }
