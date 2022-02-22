# LanRen-CLI
Lan(懶)Ren(人) CLI

![程式碼美圖](https://i.imgur.com/cAcoxOp.jpg)

# 安裝(全域)
```
npm install -g lanren-cli
```

```
npm list -g
```
或是
```
npm list -g --depth=0
```
可以查詢安裝過的 package

![npm list](https://i.imgur.com/a56xdBl.png)

# 原始程式碼連結安裝 LanRen-CLI
```
npm link
```
這個指令將會幫助你把這個資料夾放進你的全域node module 中，這樣妳就不用部屬到 npm 上才能使用。

# 原始程式碼連結解安裝 LanRen-CLI
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

# -d 是否不顯示 debug 資訊(預設不顯示)
```
lr  -d
```

# -o 顯示參數內容的格式(預設 0)
必須在 -d 開啟才有作用
```
lr  -d -o
```

# -e RSA 解密加密字串，須配合 private.pem
## private.pem
例如:下方為 private.pem 檔案內容，放在執行目錄下:
```
-----BEGIN RSA PRIVATE KEY----- MIIEpQIBAAKCAQEAtrXgwgPpAAwqgKzvLVbVzN318hqpKnF+GzTnxvNBh641of4G SfzVSPmwdIVNqNyxsFoD7bIh2XGD3aPSnn7Jd/9f7riEel5j2XOaTQzma9dozJlO vHHxsj912u46gZ4EeX2lp7Evsz5tQT5zLrZg+34SMBfS/LebZbdSY0hF4kNo/c1J 1gsqpAJ4xxfXxnpDPEgFCq25h4XgFOhK/7+DRbsOrng6Amm2YEA+ftjbxLw60pyI hgynvktfbFrhAAkmh2TdE2baXp5lPyTSGUv3MaClZU0R2Yy4iqFPDAFFUff2Louv dXapwBwYiJSmXtErWaToCuaHHMlE+x4eNLzqDwIDAQABAoIBAC5TlWZ8KVLqwsgX kRl04Abu7JJzchsh5bCuTGpkeWQWpuCpER0nb0jujnAs8JD1TFSDrmVRekWxA5dq F1g6m4jChqd3v5drYXPcXO5WbAJB/v+Ji646Uec5Mf/N0aXV1Bqd4ifPxGF1Xaxi UkAw3AxIXgI1uDh9sXgr8EbeJ2ID+R7TDh1cHLsulPADmqK+MAytu85GXf0Z3jE0 NcGsJdMZtjM4gco/Ucm00GskBtpk0p1AuoERWZboh7CVTiE9ROF8kMCWUYekzf3G ugNY5eFZOOrzgSkfJxLGThHBIEIpaDeRPpqS1f1XVtyZcFmasKkT+SUnWgzQFb6U J/S3MkECgYEA890Am0BNNCO5RV9a6Fp4URjdpy7QSo3BWGi8eVQY+6FxHmbAp+MY hIPP8KLsUtk0uMtvJR3wACATdhfz6dcvo/YsWCcPNes3xF8CDPoIMeGEmiETlSUv g9LWGW8cGg0XBmfsvbPQfqFM9hp+8RVx9/uCarBVPqJVSj8dEc1ALOECgYEAv82+ WvxvMOpxeFJ0QWwWXKQ2VVrKpk50yNKx9XnEhHrOz1fl1aZ0xDeCV7BRgVloxePQ wZ3xQved92S/ehIS1WSo9pnfmQUqnNSKHbhqjzAr6HJMEJ9YeSrisMBbSTLENtQM N0FbeM9Daki8elfKi4Isvx6hgJ1sIRW6yg2PhO8CgYEA0kQwjay35MkYqpQ5kjbP nz1NgSWAO4hWuaA1QngcwnrFSm1WmGvbbAcreFVCZ30ZVG00fFB/69u8bArjKTF9 xmYwfiHPn7Ic95jj78R25GuLJkp21BaoDYXxTSTcminHPKLHIhq1Hzp9XYYjBkRz bFrUbKF2Hvdhiw84RW0wdIECgYEAqbdeBphzsu7f9L3RDMqdht/vC9vIkRu/DqwQ t8tFboxUTvfR8RjXHYCYnwrvM+tvYBtTbt9Yyg7dAjltjJBNhfEJ6RsC1R3TNO6E QAQclhLj50yrrdGxsZWW/RtYKw72vCUpogL884tCddtim0bvfD51Za+u7GVfdm8J 1xvksJUCgYEApTXNIdEHRdXuyVrgyM9/krpwcqP5RZ6cgNB0wCcZrxxQ6stKpXO9 JH+MmnFkYG6TlUoDQO79UW+ftNPC9kuZTW2cdQmCMjUEbrS248lKSSZcxiAOlGyF mgKIPLvSzpWfTqMZG4owQ5fmBTBJmlT64MKNVTl9Vs0TnO0J/gWOpQc= -----END RSA PRIVATE KEY-----
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

# -c 產生指定 dc 的 RSA public/private key 檔案
```
lr -c dc
```
.\rsa_create\dc\ 目錄內會有
alter.sql
private.pem
public.pem
這三個檔案

# -s 新增通用型單錢包的 dc_setting
```
lr -s dc
```
.\dc_setting_common\dc\ 目錄內會有
alter.sql
README.md
這兩個檔案

# -u 更新 dc_setting 的 endpoint
```
lr -u dc https
```
.\dc_setting_update_endpoint\dc\ 目錄內會有
alter.sql
README.md
這兩個檔案

# -t 使用 token 產生網址
```
lr -t b5744b06397049c586842cae91a4d3ff
```

# -j 格式化 json 字串
```
lr -j "{method:addWagers,data:[{Cid:oSY7SDQdnpjx2vphGpC8iC,PlayerName:i81642059481483iod6lf,Wid:wp2hkzo9foqn18030297wz0215150846932,GameId:180302,GGId:3,RoundId:wp2hkzo9foqn180302Cexi0215150846931,TotalWinGold:0,RealBetGold:10,RealBetPoint:1,WinGold:0,JPGold:0,JPPoolId:0,JPConGold:0,JPConGoldOriginal:0,Currency:THB,Denom:10,GameStatusCode:0,Repair:0,AddDate:2022-02-15 15:08:46,IsDemo:0}]}"
```

# -m md5 密碼不可逆加密
```
lr -m str
```

# sha1 密碼不可逆加密
```
lr -b str
```

# ase 加解密
```
lr -a str
```
# -n 多個數值參數

# -r 多個字串參數

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