require("dotenv").config();
const connection = require("../config/connection");
const jwt = require("jsonwebtoken");
const { genid } = require("../utils/Dbutils");
const bcrypt = require("bcrypt");
const saltRounds = 12;

//user註冊
async function resgist(options) {
  const bcryptPassword = await bcrypt.hash(options.password, saltRounds);
  const defaultAvatar = process.env.YOUR_DEFAULT_AVATAR_URL;
  const defaultToken = `newUser${genid.NextId()}`;
  const defaultRole = "user";
  return new Promise((resolve, reject) => {
    connection.query(
      "select * from user where account=?",
      [options.account],
      (errRepeat, result) => {
        if (errRepeat) {
          console.log(errRepeat, "帳號註冊失敗");
          reject({
            status: "error",
            msg: "帳號註冊失敗",
          });
        } else {
          if (result.length > 0) {
            reject({
              status: "fail",
              msg: "帳號已經存在!請更換一個。",
            });
          } else {
            connection.query(
              "insert into user (id,account,password,email,token,avatar,role,create_time) values (?,?,?,?,?,?,?,?)",
              [
                options.id,
                options.account,
                bcryptPassword,
                options.email,
                defaultToken,
                defaultAvatar,
                defaultRole,
                options.create_time,
              ],
              (err) => {
                if (err) {
                  console.log(err, "新增帳號到資料庫時發生錯誤");
                  reject({
                    status: "fail",
                    msg: "新增帳號到資料庫時發生錯誤",
                  });
                } else {
                  resolve({
                    status: "success",
                    msg: "註冊成功",
                  });
                }
              }
            );
          }
        }
      }
    );
  });
}

//user登入
async function login(options) {
  return new Promise((resolve, reject) => {
    connection.query(
      "select * from user where account=? and email=?",
      [options.account, options.email],
      async (err, userDate) => {
        if (err) {
          console.log(err, "搜尋帳號時出現錯誤");
          reject({
            status: "error",
            msg: "伺服器發生問題!請聯繫管理人員處理...",
          });
        } else {
          if (!userDate[0]) {
            reject({
              status: "fail",
              msg: "帳號不存在",
            });
          } else {
            //解密
            const result = await bcrypt.compare(
              options.password,
              userDate[0].password
            );

            if (result) {
              //創建用戶令牌訊息
              const id = userDate[0].id;
              //創建密鑰字符串
              const secret = process.env.YOUR_JWT_SECRET;
              //創建令牌
              const token = jwt.sign({ id }, secret, {
                expiresIn: process.env.YOUR_JWT_EXPIRE,
              });

              connection.query(
                "update user set token=? where password=?",
                [token, userDate[0].password],
                (err) => {
                  if (err) {
                    console.log(err, "bcrypt對照密碼有誤");
                    reject({
                      status: "fail",
                      msg: "密碼輸入錯誤!請重新在試嘗試",
                    });
                  } else {
                    resolve({
                      status: "success",
                      msg: "登入成功",
                      data: {
                        id: userDate[0].id,
                        account: userDate[0].account,
                        email: userDate[0].email,
                        avatar: userDate[0].avatar,
                      },
                      token,
                    });
                  }
                }
              );
            } else {
              reject({
                status: "fail",
                msg: "登入失敗!帳號輸入錯誤!",
              });
            }
          }
        }
      }
    );
  });
}

//user資料
async function userData(id) {
  return new Promise((resolve, reject) => {
    connection.query(
      "select id,role,account,email,token,avatar,create_time,status from user where id=?",
      [id],
      (err, result) => {
        if (err) {
          console.log(err, "搜尋user失敗!");
          reject({ status: "fail", msg: "token錯誤" });
        } else {
          if (result) {
            resolve({
              status: "success",
              results: result[0],
            });
          } else {
            reject({ status: "fail", msg: "查詢不到該使用者" });
          }
        }
      }
    );
  });
}
//user更新
async function updateUser(id, options) {
  return new Promise((resolve, reject) => {
    connection.query(
      "update user set email=?,avatar=? where id=?",
      [options.email, options.avatar, id],
      (err) => {
        if (err) {
          console.log(err, "更新user失敗");
          reject({
            status: "fail",
            msg: "資料庫發生錯誤...請通知管理人員或稍後在試!!",
          });
        } else {
          resolve({ status: "success", msg: "更新完畢" });
        }
      }
    );
  });
}
//user登入狀態更新
async function updateUserLogin(id) {
  return new Promise((resolve, reject) => {
    connection.query("update user set isLogin=? where id=?", [0, id], (err) => {
      if (err) {
        console.log(err, "更新登入狀態更新遇到問題");
        reject({
          status: "fail",
          msg: "資料庫發生錯誤...請通知管理人員或稍後在試!!",
        });
      } else {
        resolve({ status: "success" });
      }
    });
  });
}
//總網站註冊人數
async function getWebAllUserDatas() {
  return new Promise((resolve, reject) => {
    connection.query("select * from user", (error, users) => {
      if (error) {
        console.log(error);
        reject({ status: "fail", msg: "伺服器發生錯誤...請聯繫管理人員!!" });
      } else {
        if (users) {
          resolve({ status: "success", users: users.length });
        } else {
          reject({ status: "fail" });
        }
      }
    });
  });
}
//列出所有用戶並分頁
/*
page 頁碼
pageSize 分頁大小
offset 當前頁面顯示幾條
*/
async function getAllUserPageData(page = 1, pageSize = 10) {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * pageSize;
    connection.query(
      "select id,role,account,email,create_time from user where status=? order by create_time desc limit ? offset ?",
      [1, pageSize, offset],
      (err, data) => {
        if (err) {
          console.log(err, "評論顯示錯誤");
          reject({ status: "fail", msg: "資料庫錯誤...請聯繫管理人員.." });
        } else {
          resolve({ status: "success", data });
        }
      }
    );
  });
}
//全部用戶
async function getAllUserData() {
  return new Promise((resolve, reject) => {
    connection.query(
      "select id,role,account,email,create_time from user",
      (err, results) => {
        if (err) {
          console.log(err, "取得所有user失敗!");
          reject({ status: "fail", msg: "無法取得資料.." });
        } else {
          if (results) {
            resolve({
              status: "success",
              results,
            });
          } else {
            reject({
              status: "fail",
              msg: "資料庫出現問題...請確認是否出錯!!",
            });
          }
        }
      }
    );
  });
}
//----權限---//
//角色更新
async function updateRole(options) {
  return new Promise((resolve, reject) => {
    connection.query(
      "update user set role=? where id=?",
      [options.role, options.id],
      (err) => {
        if (err) {
          console.log(err, "更新角色失敗");
          reject({
            status: "fail",
            msg: "資料庫發生錯誤...請通知管理人員或稍後在試!!",
          });
        } else {
          resolve({ status: "success", msg: "更新完畢" });
        }
      }
    );
  });
}
module.exports = {
  resgist,
  login,
  userData,
  getAllUserData,
  getAllUserPageData,
  getWebAllUserDatas,
  updateUser,
  updateUserLogin,
  updateRole,
};
