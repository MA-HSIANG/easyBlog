# EasyBlog

> 歡迎使用 EasyBlog，此為個人手刻前後端 Blog 作品。功能盡量不使用套件完成!為個人邏輯練習作品。

## 預設
1. 本專案使用 localStorage 進行token儲存，如有需要可改為cookie方法，但要注意跨域問題。
2. 密碼加密使用 bcrypt套件，可到 userModel 內進行**加鹽**長度的設定。
3. token使用jsonWebToken創建，預設為10分鐘過期，可自行使用 YOUR_JWT_EXPIRE 再.env中設定修改。
4. 預設登入系統無法多點登錄，單個帳號登入後另一個client端會被擠下線。


## 版本

- Vue v3.2.47
- Vue-router v4.1.6
- vite v4.3.2
- pinia v2.0.35
- sass v1.62.1
- nodeJS v18.12.1
- express v4.18.2

## 使用技術

- Vue3 Composition Api : setup syntax sugar
- Vite
- pinia
- Vue-router
- NodeJs - express
- MySQL
- AWS S3 (外部儲存桶)
- AWS RDS (SQL 資料庫)
- JavaScript、HTML5、CSS3
- Sass
- ResTful API
- Naive UI

## Plugins

### Client (Vue3)

- [V-md-editor v2.3.15](https://code-farmer-i.github.io/vue-markdown-editor/zh/)
- [axios v1.4.0](https://www.npmjs.com/package/axios)

### Server (NodeJS + express + MySQL)

- [AWS-SDK-v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)

- [AWS-Lib-Storage](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-lib-storage/)

- [bcrypt](https://www.npmjs.com/package/bcrypt)

- [cors](https://www.npmjs.com/package/cors)

- [dotenv](https://www.npmjs.com/package/dotenv)

- [jsonwebToken](https://www.npmjs.com/package/jsonwebtoken)

- [multer](https://www.npmjs.com/package/multer)

- [mysql](https://www.npmjs.com/package/mysql)

- [uuid](https://www.npmjs.com/package/uuid)

## API 介紹

### 使用者(/api/v1/users)

- GET /verifyToken 身份驗證(user or admin)menu 分類
- GET /verifyId 後台進入判定(v1 邏輯分 2 個後台，後期在更新)
- GET / admin 後台取得所有用戶資料
- POST /resgist 註冊
- POST /login 登入
- GET /updateRole admin 獲取腳色選項
- PATCH /updateRole admin 更新腳色
- GET /isUser 取得自己點讚列內容
- POST /isUser 上傳大頭貼
- PATCH /isUser 更新個人資料

### 部落格(/api/v1/blogs)

- GET /new_3_blog 取得前三項最新文章
- GET /get_top3_blog 取得前三項最熱門文章
- POST /uploadImage 上傳封面圖片
- GET /webAllDatas admin 後台看板資料

CRUD (admin 角色)

- GET / 獲取首頁文章(搜尋關鍵字、分頁邏輯)
- POST / 新增文章
- GET /:id 取得單篇文章
- PUT /:id 更新文章
- PATCH /:id 刪除文章(狀態刪除 status:0)

### 分類(/api/v1/category)

CRUD (admin 角色)

- GET / 取得所有分類(含分頁邏輯、搜索)
- POST / 新增分類
- PUT /:id 更新分類
- DELETE /:id 刪除分類

### 觀看數(/api/v1/blogView)

- GET /blogViewCounts/:id 取得文章觀看數量
  -GET /:id 新增觀看數量

### 點讚(/api/v1/like)

- GET /blogLikes/:id 取得單篇文章部落格點讚數
- GET /:id 個人部落格點讚狀態
- POST /:id 用戶點讚(包含取消讚)

### 評論(/api/v1/comments)

- GET /:id 取得單篇文章評論(一級評論含分頁)
- POST / 用戶新增評論(一級評論)

# 介紹

> 本項目為個人手刻 Vue3 + NodeJS + MySQL 手刻練習作品，盡量不使用插件來實現功能(例如分頁、評論、點讚等)所以有些地方還可以再加強更新。

## DEMO (目前為動態儲存)

目前上傳空間為:render.com、圖片:AWS S3 儲存桶、MySQL:AWS RDS。狀態:動態

#### EasyBlog:

[EasyBlog](https://blog-server-6lno.onrender.com)

# 前台

1. 導航列(首頁、分類查詢、註冊、搜索)
2. 熱門文章區塊
3. 文章列表(左側)
4. 最新文章(右側)

## 首頁

![首頁](https://i.imgur.com/gNOM3Wc.png)

## 文章詳情

![文章詳情](https://i.imgur.com/gNOM3Wc.png)

## 註冊和登入

![註冊和登入](https://i.imgur.com/7cVukEd.png)

## 登入成功

![登入成功](https://i.imgur.com/gpwjohu.png)

# 後台

1. 首頁(資料看板)
2. 個人資料
3. 權限管理
4. 文章管理
5. 分類管理

## 首頁

![後台首頁](https://i.imgur.com/mchsf5A.png)

## 個人中心

![個人中心](https://i.imgur.com/9wHMYMI.png)

# RWD

## 首頁

![RWD首頁](https://i.imgur.com/TIKg2zm.png)

## 後台

![RWD後台](https://i.imgur.com/k1KiivY.png)

# 相關設定

## NodeJS

> 請安裝 dotenv，創建.env 文件。

- YOUR_HOST mySql host
- YOUR_USER mySql name
- YOUR_PORT mySql port
- YOUR_PASSWORD mySql password
- YOUR_DB nySql database
- YOUR_JWT_SECRET 創建 secret 秘密
- YOUR_JWT_EXPIRE 創建過期時間
- YOUR_UPLOAD_IMAGE_URL 上傳 URL 協定 (使用本地請用 http,外部使用 https)
- YOUR_IMAGE_BUCKET_KEY_ID 外部儲存空間 KEYID
- YOUR_IMAGE_ACC_KEY 外部儲存空間 account key

## Vue3
> vite內建.env由於本專案沒有將密鑰儲存在前端所以可以直接使用.env命名文件，如果有額外儲存私密變量可使用 .env.local 避免被git上傳。

- VITE_YOUR_API_URL api使用網址(本地請使用localhost:port)
- VITE_YOUR_MK_UPLOA_URL markdownEditor 渲染圖片網址
- VITE_YOUR_AVATAR_DEFAULT_URL 更新頭貼時預設圖片網址

# 關於此項目
## 優化
<p> 本項目基於上一版本（master分支上）進行重新構築。除了後端API更加符合RESTful API定義外，前端將整個邏輯和結構重構。例如，上一個demo練習都是基於前端邏輯，當然還有許多地方可以進行組件化和優化，這將在後續更新中進行。例如，上傳邏輯可以寫得更好....<p>

## 更新
## 2023/10/11內容修正加更新
1. 修正一些CSS樣式問題
2. 調整後臺為唯一後臺 /dashBoard
3. 調整後臺menu將原本後臺/userCenter結合為2級菜單
4. 新增二級回復(按鈕為3級回復方法目前還沒增加)
5. 新增api :

- POST /reply回復
- GET /reply獲取回復
6. 調整一些mySQL語法
