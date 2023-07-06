const express = require("express");
const app = express();
require("dotenv").config();
const path = require("path");
const { verifyLogin } = require("./db/Dbutils");
const staticPath = path.join(__dirname, "../client/dist/");

//圖片上傳
const multer = require("multer");
//環境變量
const port = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.static(staticPath));
//跨域允許
app.use(function (req, res, next) {
  ///////////------------------render.com跨域允許網址-----------------------------------/////////
  res.header(
    "Access-Control-Allow-Origin",
    "Content-Type",
    "text/plain",
    "https://blog-server-6lno.onrender.com/"
  );
  /////////////---------------允許的header類型-------------------------------------------////////
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With,Content-Type, authorization"
  );

  //////////////------------------本地跨域允許網址-----------------------------------///////////
  // res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Headers", "*");
  // res.header("Content-Type", "text/plain");

  //允許的請求方式
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  if (req.method === "OPTIONS") res.sendStatus(200); //讓options請求快速通過
  else next();
});
app.use(express.json());

//上傳
const upload = multer({
  dest: "./public/upload/temp",
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});
app.use(upload.any()); //允許所有檔案
//靜態資源位置
app.use(express.static(path.join(__dirname, "public")));
//驗證登錄admin token
const ADMIN_TOKEN_PATH = "/_token";
app.all("*", async (req, res, next) => {
  if (req.path.indexOf(ADMIN_TOKEN_PATH) > -1) {
    const token = req.headers.authorization;
    const isLogin = await verifyLogin(token, "admin");

    //驗證登錄
    if (!isLogin.status) {
      res.send({
        result: {
          code: 403,
          msg: "帳號不存在",
        },
      });
      return;
    } else {
      next();
    }
  } else {
    next();
  }
});

//驗證登錄user token
const USER_TOKEN_PATH = "/_userToken";
app.all("*", async (req, res, next) => {
  if (req.path.indexOf(USER_TOKEN_PATH) > -1) {
    const userToken = req.headers.authorization;
    const isLogin = await verifyLogin(userToken, "user");

    //驗證登錄
    if (!isLogin.status) {
      res.send({
        results: {
          code: 403,
          msg: "帳號不存在",
        },
      });
      return;
    } else {
      next();
    }
  } else {
    next();
  }
});

app.use("/isLoginIn", require("./routes/TokenRoute"));
app.use("/admin", require("./routes/AdminRoute"));
app.use("/userLogin", require("./routes/UserLoginRoute"));
app.use("/category", require("./routes/CategoryRoute"));
app.use("/blog", require("./routes/BlogRoute"));
app.use("/upload2", require("./routes/UploadRoute2"));
//主頁
app.get("*", (req, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
});

app.listen(port, () => {
  console.log(`伺服器${port}運行中...`);
});
