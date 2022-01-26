# LanRen-CLI
Lan(懶)Ren(人) CLI

# 安裝 commander
```
npm install commander --save
```

# 安裝 node-rsa
```
npm install node-rsa
```

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