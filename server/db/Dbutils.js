const connection = require("../db/connection");
const GenId = require("../utils/snowFlake");
const jwt = require("jsonwebtoken");
const genid = new GenId({ WorkerId: 1 });

//執行sql查詢
async function exQuery(from) {
  return new Promise((resolve, reject) => {
    connection.query(`select * from ${from}`, (err, results, fields) => {
      try {
        if (err) {
          console.log(err);
          resolve({ code: 500, msg: "查詢失敗" });
        } else {
          resolve({ code: 500, results: results[0] });
        }
      } catch (error) {
        reject(error);
      }
    });
  });
}

//列出user
async function userLists() {
  return new Promise((resolve, reject) => {
    connection.query(`select * from user`, (err, data) => {
      try {
        if (err) {
          console.log(err, "獲取user列表出錯");
          throw new Error("獲取user列表出錯");
        } else {
          if (!data) {
            resolve({ code: 500 });
          } else {
            resolve({ code: 200, data });
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  });
}

//jwt過期時間
function verifyTime(exp, jwtLogTime) {
  const time = parseInt(new Date().getTime() / 1000);

  if (time - exp > jwtLogTime) {
    return true;
  }
}
//驗證登錄
async function verifyLogin(token, list) {
  const jwtObj = jwt.decode(token) || "";

  return new Promise((resolve, reject) => {
    if (token === null) {
      resolve({ status: "null" });
    }
    connection.query(
      `select * from ${list} where token='${token}'`,
      (err, result) => {
        if (err) {
          console.log(err, "登入驗證錯誤");
          throw new Error("登入驗證錯誤");
        } else {
          try {
            //jwt時間限制秒
            if (verifyTime(jwtObj.exp, 600)) {
              resolve({ status: false });
              return;
            }
            if (result.length > 0) {
              resolve({ status: true });
              return;
            }
            if (result.length <= 0) {
              resolve({ status: false });
              return;
            }
          } catch (error) {
            reject(error);
          }
        }
      }
    );
  });
}
module.exports = {
  exQuery,
  genid,
  verifyLogin,
  userLists,
};
