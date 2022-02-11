# LanRen-CLI
Lan(懶)Ren(人) CLI

# -p 啟用密碼
一定要輸入，可以避免誤用
```
lr -p 9468
```

# -d 是否不顯示 debug 資訊(預設不顯示)
```
lr -p 9487 -d
```

# -o 顯示參數內容的格式(預設 0)
必須在 -d 開啟才有作用
```
lr -p 9487 -d -o
```

# -e RSA 解密加密字串，須配合 private.pem

# -c 產生指定 dc 的 RSA public/private key 檔案

# -s 新增通用型單錢包的 dc_setting (-s dc)

# -u 更新 dc_setting 的 endpoint (-u dc https)

# -n 多個數值參數

# -r 多個字串參數

# 安裝 LanRen-CLI
```
npm link
```
這個指令將會幫助你把這個資料夾放進你的全域node module 中，這樣妳就不用部屬到 npm 上才能使用。

# 解安裝 LanRen-CLI
```
npm unlink LanRen-CLI


npm rm --global LanRen-CLI

npm ls --global LanRen-CLI
```

# 查看版本號
```
lr -V
or
lr --version
```

# 查看說明
```
lr -h
or
lr --help
```

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

# npm 版本發佈
首次登入 npm
```
npm login
```
發佈 npm
修改 package.json 的 version 後
```
npm publish
```