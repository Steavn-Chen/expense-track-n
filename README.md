# 家用記帳本
  使用 Node.js Express 打造家庭每天支出記錄，以掌控每月可動用的現金。
## 登入頁
![login](public/images/%E7%99%BB%E5%85%A5.PNG
)
## 首頁
![home](public/images/%E5%9C%96%E7%89%87%E4%B8%80.PNG
)

## 功能表單
<1.0 版>

    可以新增一筆新的支出，也可以對原有的支出做修改，刪除。

<2.0 版>

    使用者得先註冊帳號才能使用，此外也可以用 Google，Facebook Github 第三方帳號註冊。
    也可以依照類別、年、月瀏覽所有的記錄。

## GCP 遠端
https://expense-tracker-rbdzjma4hq-uw.a.run.app

## 測試帳號

    root@example.com/123456
    user1@example.com/123456
    user2@example.com/123456

## 啓動方式

- 將專案 clone 到本地端

https://github.com/Steavn-Chen/expense-track-v1

- 進入到專案資料夾
```
- 安裝 npm
```
  npm install
```
- 啓動專案
```
  npm run dev
```
- 終端機出現  
  Expense-tracker web is running on http://localhost:3000
```
  出現 mongodb is connected. ，代表 mongodb 資料庫連接成功

- 在終端機輸入 npm run seed
```
  看到 insertMany categories ok. 和 insertMany records ok.  種子資料建立成功
```
## 開發環境
   
- node.js -v14.15.1
- express -4.17.3
- express-handlebars-5.3.4
- mongoose 5.12.15
- mongoose-find-or-create 1.3.1 

## 使用的套件

- express-session 1.17.2
- handlebars-helpers: 0.10.0
- method-override: 3.0.0
- moment: 2.29.1
- bcryptjs 2.4.3
- connect-flash 0.1.1
- dotenv 16.0.0
- passport-local 1.0.0
- passport-facebook 3.0.0
- passport-github-oauth20 1.0.4
- passport-google-oauth20 2.0.0
   
