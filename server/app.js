const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const path = require("path");

const staticPath = path.join(__dirname, "../client/dist/");

app.use(express.json());
//圖片上傳
const multer = require("multer");
//環境變量
const port = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.static(staticPath));
//跨域允許
// app.use(function (req, res, next) {
//   ///////////------------------render.com跨域允許網址-----------------------------------/////////
//   // res.header(
//   //   "Access-Control-Allow-Origin",
//   //   "Content-Type",
//   //   "text/plain",
//   //   "https://blog-server-6lno.onrender.com/"
//   // );
//   /////////////---------------允許的header類型-------------------------------------------////////
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With,Content-Type, authorization"
//   );

//   //////////////------------------本地跨域允許網址-----------------------------------///////////
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "*");
//   res.header("Content-Type", "text/plain");

//   //允許的請求方式
//   res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
//   if (req.method === "OPTIONS") res.sendStatus(200); //讓options請求快速通過
//   else next();
// });
app.use(cors());
app.options("*", cors());
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


app.use("/api/v1/users", require("./routes/userRoute"));
app.use("/api/v1/blogs", require("./routes/blogsRoute"));
app.use("/api/v1/category", require("./routes/categorysRoute"));
app.use("/api/v1/like", require("./routes/likeRoute"));
app.use("/api/v1/comments", require("./routes/commentsRoute"));
app.use("/api/v1/blogView", require("./routes/blogViewRoute"));

//主頁
app.get("*", (req, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
});

app.listen(port, () => {
  console.log(`伺服器${port}運行中...`);
});
//全局錯誤 後續再定義
//---multer錯誤
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({ msg: "文件大小超過限制 5MB" });
  } else {
    // 其他錯誤
    res.status(500).json({ msg: "伺服器錯誤" });
  }
});
