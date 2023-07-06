require("dotenv").config();
const mysql = require("mysql");
///////--------------------------------------------//////////////////
// const host = process.env.YOUR_LOCALHOST_ENDPORT
// const user = process.env.YOUR_LOCALHOST_USER
// const port = process.env.YOUR_LOCALHOST_PORT
// const password = process.env.YOUR_LOCALHOST_PASSWORD
// const db = process.env.YOUR_LOCALHOST_DB
///////----------------------- AWS RDS-----///////////////////////////
const host = process.env.YOUR_RDS_ENDPORT;
const user = process.env.YOUR_RDS_USER;
const port = process.env.YOUR_RDS_PORT;
const password = process.env.YOUR_RDS_PASSWORD;
const db = process.env.YOUR_RDS_DB;
//-----------------創建資料庫連接-----------////////////
const connection = mysql.createConnection({
  host: host,
  user: user,
  port: port,
  password: password,
  database: db,
});
module.exports = connection;
