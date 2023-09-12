require("dotenv").config();
const mysql = require("mysql");
///////--------------------------------------------//////////////////
const host = process.env.YOUR_HOST;
const user = process.env.YOUR_USER;
const port = process.env.YOUR_PORT;
const password = process.env.YOUR_PASSWORD;
const db = process.env.YOUR_DB;

//-----------------創建資料庫連接-----------////////////
const connection = mysql.createConnection({
  host,
  user,
  port,
  password,
  database: db,
});
module.exports = connection;
