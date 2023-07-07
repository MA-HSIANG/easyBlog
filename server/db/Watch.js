const connection = require("../db/connection");

//觀看文章
async function watchArticle(options) {
  return new Promise((resolve, reject) => {
    connection.query(
      `select * from watch where blog_id=${options.blog_id} and user_id=${options.user_id}`,
      (err, results) => {

        try {
          if (err) {
            console.log(err, "獲取觀看紀錄錯誤");
            throw new Error("獲取觀看紀錄錯誤");
          } else {
            if (results.length === 0) {
              connection.query(
                `insert into watch (id,blog_id,user_id,watch_status) values(${options.id},${options.blog_id},${options.user_id},1)`,
                (addErr) => {
                  try {
                    if (addErr) {
                      console.log(addErr, "新增觀看紀錄錯誤");
                      throw new Error("新增觀看數錯誤");
                    }
                  } catch (error) {
                    reject(error);
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
//單篇文章觀看查詢
async function allWatch(options) {
  return new Promise((resolve, reject) => {
    connection.query(
      `select * from watch where blog_id=${options.blog_id}`,
      (err, results) => {
        try {
          if (err) {
            console.log(err);
            throw new Error(`單篇文章查詢失敗!傳入資料${options.blog_id}`);
          } else {
            resolve({ code: 200, count: results.length });
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}
//總觀看數
async function allWatchCounts() {
  return new Promise((resolve, reject) => {
    connection.query(`select * from watch`, (err, results) => {
      try {
        if (err) {
          console.log(err, "查詢總觀看數異常");
          throw new Error("查詢總觀看數異常");
        } else {
          resolve({ code: 200, counts: results });
        }
      } catch (error) {
        reject(error);
      }
    });
  });
}
//後台刪除文章時刪除觀看數
async function dashBoardDeleteWatchCount(id) {
  return new Promise((resolve, reject) => {
    connection.query(`delete from watch where blog_id=${id}`, (err) => {
      try {
        if (err) {
          console.log(err, "後台刪除觀看數時失敗");
          throw new Error("後台刪除觀看數失敗");
        } else {
          resolve({
            code: 200,
            msg: "刪除成功",
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  });
}
module.exports = {
  watchArticle,
  allWatchCounts,
  allWatch,
  dashBoardDeleteWatchCount,
};
