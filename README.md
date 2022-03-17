# LanRen-CLI
Lan(懶)Ren(人) CLI

![logo](https://img.my-best.tw/press_component/images/c14b4ca9124f4e97dda730eab61dfa43.jpg?ixlib=rails-4.2.0&q=70&lossless=0&w=690&fit=max)

---

[LanRen-CLI : npm 說明頁面連結](https://www.npmjs.com/package/lanren-cli)

---

# 安裝
安裝方式如下:
```
npm install -g lanren-cli
```
安裝後，可以用下列指令查詢安裝過的套件:
```
npm list -g --depth=0
```

![npm list](https://i.imgur.com/a56xdBl.png)

---

# 原始程式碼連結安裝
```
npm link
```
這個指令將會幫助你把這個資料夾放進你的全域node module 中，
這樣你就不用部署到 npm 上就能直接使用。

# 原始程式碼連結解安裝
```
npm unlink LanRen-CLI
```

# 移除專案
```
npm rm --global LanRen-CLI
```
移除後可以用下面指令查詢安裝套件
```
npm ls --global LanRen-CLI
```

---

# 查看版本號
```
lr -V
or
lr --version
```
大寫 -V 或 --version
![version](https://i.imgur.com/0sou4Hj.png)
```
lr -v
```
小寫 -v
![-v](https://i.imgur.com/4zHEXGx.png)

---

# 查看說明
```
lr -h
or
lr --help
```
![help](https://i.imgur.com/FRsCUGL.png)

---

# -d 是否不顯示 debug 資訊(預設不顯示)
```
lr  -d
```

---

# -o 顯示參數內容的格式(預設 0)
必須在 -d 開啟才有作用
```
lr  -d -o
```

---

# 設定 dc 幣別 - 讀取 updateDcDenomList.xlsx
```
lr  -q
```
![excel格式](https://i.imgur.com/If9GTrW.png)

---

# 新增 game_code_map 資料 - 讀取 gameCodeMap.xlsx
```
lr  -p
```
![excel格式](https://i.imgur.com/nLOg8G1.png)

---

# 設定幣別 - 讀取 updateDenomList.xlsx
```
lr -l
```
![excel格式](https://i.imgur.com/yNbLo8B.png)

---

# 新增幣別 - 讀取 denomList.xlsx
```
lr -i
```
![excel格式](https://i.imgur.com/JTq7j6t.png)

---

# 更新幣別面額
```
lr -k "DOG" "1,2,3"
```

---

# -z 顯示 npm 全域安裝的所有套件
```
lr  -z
```
![顯示 npm 全域安裝的所有套件](https://i.imgur.com/Mu0Ufs6.png)

---

# -f 將面額字串陣列轉成數值陣列
```
lr -f "1:5000,1:2000,1:1000,1:500,1:200,1:100,1:50,1:20,1:10,1:5,1:2,1:1,2:1,5:1"
```

---

# -g 將面額數值陣列轉成字串陣列
```
lr -g "28,14,7,3"
```

---

# -e RSA 解密加密字串，須配合 private.pem
## private.pem
例如:下方為 private.pem 檔案內容，放在執行目錄下:
```
-----BEGIN RSA PRIVATE KEY----- MIIEpQIBAAKCAQEAtrXgwgPpAAwqgKzvLVbVzN318hqpKnF+GzTnxvNBh641of4G 
....
+ftNPC9kuZTW2cdQmCMjUEbrS248lKSSZcxiAOlGyF mgKIPLvSzpWfTqMZG4owQ5fmBTBJmlT64MKNVTl9Vs0TnO0J/gWOpQc= -----END RSA PRIVATE KEY-----
```
## 解密內容
執行下面指令，就可以解開內容:
```
lr -e GcJm/aznlvdMCgL1cdKPMjELp0BnoFhWxtHZUvmH8DXSwac9P0PgeJg1W+RCtIuCbA6XdXdkQpQd+A1JuWNzRn1C9EgpbWgCQpki1gf0Pm1On/1EB2dc5pdx6niv5BR6XMt0VQGf3fjRYyyQR1JnnsAtM/jETfLEJN+ZHB9e/slnaYSEWPAeqMC/nNj+lqa1B4EmZGlnK4gA2M5G3GNNBYo3uCJRK5mnzG24Wkw11ZM/20WHG1qdeQLIwWivXTwLXu1CxilslzCT8SJEv+97C+0TYrKNZmjQMkewmZQhYXfL1SUYq1XNmA33MxKr0oty7Pvt9jcrVZKCy92dCbqmnw==
```
解密內容如下所示:
```
{"ts":"1644546067938","secureToken":"25b88970ed5c608a8642dd3cdae5d530bd698d45d4c9b3e9cec55162c820d378","action":99,"username":"test001","gameId":200536}
```

---

# -c 產生指定 dc 的 RSA public/private key 檔案
```
lr -c dc
```
.\【產生指定 dc 的 RSA KEY】\dc\ 目錄內會有
.\YYYYMMDD\
        alter.sql
        README.md
.\dc\
    private.pem
    public.pem
這四個檔案
![RSA KEY](https://i.imgur.com/zPeJG8I.png)

---

# -s 新增通用型單錢包的 dc_setting
```
lr -s dc
```
.\dc_setting_common\dc\ 目錄內會有
alter.sql
README.md
這兩個檔案

---

# -u 更新 dc_setting 的 endpoint
```
lr -u dc https
```
.\dc_setting_update_endpoint\dc\ 目錄內會有
alter.sql
README.md
這兩個檔案

---

# -t 使用 token 產生網址
```
lr -t b5744b06397049c586842cae91a4d3ff
```

---

# -j 格式化 json 字串
```
lr -j "{method:addWagers,data:[{Cid:oSY7SDQdnpjx2vphGpC8iC,PlayerName:i81642059481483iod6lf,Wid:wp2hkzo9foqn18030297wz0215150846932,GameId:180302,GGId:3,RoundId:wp2hkzo9foqn180302Cexi0215150846931,TotalWinGold:0,RealBetGold:10,RealBetPoint:1,WinGold:0,JPGold:0,JPPoolId:0,JPConGold:0,JPConGoldOriginal:0,Currency:THB,Denom:10,GameStatusCode:0,Repair:0,AddDate:2022-02-15 15:08:46,IsDemo:0}]}"
```

---

# -m md5 密碼不可逆加密
```
lr -m str
```

---

# sha1 密碼不可逆加密
```
lr -b str
```

---

# ase 加解密
```
lr -a str
```

---

# -n 多個數值參數

---

# -r 多個字串參數

---

# 偵錯 launch.json
## 多參數偵錯
```
"args": [
                "-p","9487",
                "-u", "ddcc", "httphttp"
            ],
```
## 偵錯訊息輸出到指定視窗
```
"console": "internalConsole"
```
或
```
"console": "integratedTerminal"
```

---

# npm 版本發佈
* 首次登入 npm
```
npm login
```
![](https://i.imgur.com/ncvwdmS.png)

* 發佈 npm
修改 package.json 的 version 後
```
npm publish
```
![npm publish](https://i.imgur.com/QDYx7NG.png)

---

