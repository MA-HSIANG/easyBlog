const connection = require("./connection");
const GenId = require("../utils/snowFlake");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { genid } = require("./Dbutils");
const bcrypt = require("bcrypt");
const saltRounds = 12;
//user註冊
async function resgistUser(options) {
  const bcryptPassword = await bcrypt.hash(options.password, saltRounds);
  const defaultAvatar = "http://localhost:3000/upload/avatar/defaultUsre.jpg";
  const defaultToken = `newUser${genid.NextId()}`;
  return new Promise((resolve, reject) => {
    connection.query(
      `select * from user where account='${options.account}'`,
      (errRepeat, result) => {
        try {
          if (errRepeat) {
            console.log(errRepeat, "帳號註冊失敗");
            throw new Error("帳號註冊失敗");
          } else {
            if (result.length > 0) {
              resolve({
                code: 402,
                msg: "帳號已經存在!請更換一個。",
              });
            } else {
              connection.query(
                `insert into user (id,account,password,email,token,headerImg) values (${options.id},'${options.account}','${bcryptPassword}','${options.email}','${defaultToken}','${defaultAvatar}')`,
                (err) => {
                  if (err) {
                    console.log(err, "新增帳號到資料庫時發生錯誤");
                    throw new Error("新增帳號到資料庫時發生異常錯誤");
                  } else {
                    resolve({
                      code: 200,
                      msg: "註冊成功",
                    });
                  }
                }
              );
            }
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}
//user登入
async function userLogin(options) {
  return new Promise((resolve, reject) => {
    connection.query(
      `select * from user where account='${options.account}' and email='${options.email}'`,
      async (err, userDate) => {
        //創建用戶令牌訊息
        const userPal = { account: options.account };
        //創建密鑰字符串 uuid
        const secret = uuidv4();
        //創建令牌
        const token = jwt.sign(userPal, secret, { expiresIn: 600 });
        try {
          if (err) {
            console.log(err, "搜尋帳號時出現錯誤");
            throw new Error("搜尋帳號出現錯誤");
          } else {
            if (!userDate[0]) {
              resolve({
                code: 402,
                msg: "帳號不存在",
              });
            } else {
              //解密
              const result = await bcrypt.compare(
                options.password,
                userDate[0].password
              );

              if (result) {
                setTimeout(() => {
                  connection.query(
                    `update user set token='${token}' where password='${userDate[0].password}'`,
                    (err) => {
                      if (err) {
                        console.log(err, "bcrypt對照密碼有誤");
                        throw new Error("bcrypt對照密碼有誤");
                      } else {
                        resolve({
                          code: 200,
                          msg: "登入成功",
                          id: userDate[0].id,
                          account: userDate[0].account,
                          email: userDate[0].email,
                          headerImg: userDate[0].headerImg,
                          token,
                        });
                      }
                    }
                  );
                }, 500);
              } else {
                resolve({ code: 403, msg: "登入失敗..密碼輸入錯誤.." });
              }
            }
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}
//user資料
async function userData(userToken) {
  return new Promise((resolve, reject) => {
    connection.query(
      `select * from user where token='${userToken}'`,
      (err, result) => {
        try {
          if (err) {
            console.log(err, "搜尋user失敗!可能是token有問題");
            throw new Error("搜尋user失敗!可能是token有問題");
          } else {
            if (result) {
              resolve({
                code: 200,
                results: result[0],
              });
            } else {
              resolve({ code: 500, msg: "查詢不到該使用者" });
            }
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}
//user更新
async function updateUser(options) {
  return new Promise((resolve, reject) => {
    connection.query(
      `update user set email='${options.email}',headerImg='${options.headerImg}' where id=${options.id}`,
      (err) => {
        try {
          if (err) {
            console.log(err, "更新user失敗");
            resolve({ code: 500, msg: "修改失敗" });
            throw new Error("更新user失敗");
          } else {
            resolve({
              code: 200,
              msg: "修改成功",
            });
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}

module.exports = { resgistUser, userLogin, userData, updateUser };
