const connection = require("../config/connection");
const GenId = require("../utils/snowFlake");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const genid = new GenId({ WorkerId: 1 });
const bcrypt = require("bcrypt");
const saltRounds = 12;

//列出admin
async function adminLists() {
  return new Promise((resolve, reject) => {
    connection.query(`select * from admin`, (err, data) => {
      try {
        if (err) {
          console.log(err, "列出admin列表失敗");
          throw new Error("列出admin列表失敗");
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
//查詢admin (id查詢)
async function queryAdmin(id, adminToken) {
  return new Promise((resolve, reject) => {
    connection.query(
      `select * from admin where id='${id}' or token='${adminToken}'`,
      (err, results) => {
        try {
          if (err) {
            console.log(err);
            throw new Error("管理員查詢失敗!可能是傳入id或token有誤");
          } else {
            resolve({ code: 200, results });
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}

//admin登入前更新token
async function exlogin(from, options) {
  return new Promise((resolve, reject) => {
    connection.query(
      `select * from ${from} where account='${options.account}'`,
      async (err, results) => {
        try {
          //創建用戶令牌訊息
          const adminPal = { account: options.account };
          //創建密鑰字符串 uuid
          const secret = uuidv4();
          //創建令牌
          const token = jwt.sign(adminPal, secret);
          //解密
          const parePass = await bcrypt.compare(
            options.password,
            results[0].password
          );

          if (err) {
            console.log(err, "登入查詢帳號時資料庫發生問題");
            throw new Error("登入admin時資料庫發生問題");
          } else {
            if (results.length === 0) {
              console.log(err, "無此帳號");
              resolve({ code: 401, msg: "無此帳號" });
            } else {
              if (parePass) {
                connection.query(
                  `update ${from} set token='${token}' where password='${results[0].password}'`,
                  (loginErr) => {
                    try {
                      if (loginErr) {
                        console.log(loginErr);
                        throw new Error("帳號登入異常!狀態無法更新");
                      } else {
                        resolve({
                          code: 200,
                          id: results[0].id,
                          account: results[0].account,
                          password: options.password,
                          token,
                          avatar: results[0].avatar,
                          msg: "登錄成功!!",
                        });
                      }
                    } catch (loginErr) {
                      console.log(loginErr);
                      reject(loginErr);
                    }
                  }
                );
              } else {
                resolve({ code: 500, msg: "密碼錯誤" });
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
//新增admin
async function insertAdmin(options) {
  const bcrypAddminPassword = await bcrypt.hash(options.password, saltRounds);
  return new Promise((resolve, reject) => {
    connection.query(
      `insert into admin (account,password,token,avatar) values('${options.account}','${bcrypAddminPassword}','token','/src/assets/public/default/user01.jpg')`,
      (err) => {
        try {
          if (err) {
            console.log(err, "新增admin到資料庫出錯了");
            resolve({ code: 500, msg: "添加失敗" });
            throw new Error("新增admin到資料庫出錯了");
          } else {
            resolve({ code: 200, msg: "添加成功" });
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}
//修改admin
async function updateAdmin(id, options) {
  const bcrypAddminPassword = await bcrypt.hash(options.password, saltRounds);
  return new Promise((resolve, reject) => {
    connection.query(
      `update admin set account='${options.account}',password='${bcrypAddminPassword}' where id=${id}`,
      (err) => {
        try {
          if (err) {
            console.log(err, "修改admin到資料庫時出錯了");
            resolve({ code: 500, msg: "修改失敗" });
            throw new Error("修改admin到資料庫時出錯了");
          } else {
            resolve({ code: 200, msg: "修改成功" });
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}
//刪除admin
async function delAdmin(id) {
  return new Promise((resolve, reject) => {
    connection.query(`delete from admin where id='${id}'`, (err) => {
      try {
        if (err) {
          console.log(err, "admin刪除失敗!可能是傳入id錯誤");
          resolve({ code: 500, msg: "刪除失敗" });
          throw new Error("admin刪除失敗!可能是傳入id錯誤");
        } else {
          resolve({ code: 200, msg: "刪除成功" });
        }
      } catch (error) {
        reject(error);
      }
    });
  });
}
module.exports = {
  adminLists,
  queryAdmin,
  exlogin,
  insertAdmin,
  updateAdmin,
  delAdmin,
};
