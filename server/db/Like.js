const connection = require("./connection");
//用戶點讚文章列表分頁
async function userLikeLists(options) {
  return new Promise((resolve, reject) => {
    const offset = (options.page - 1) * options.pageSize;
    connection.query(
      `select * from click_like where user_id=${options.user_id} order by create_time desc limit ${options.pageSize} offset ${offset}`,
      (err, result) => {
        try {
          if (err) {
            console.log(err, "點讚文章分頁出現問題...");
            resolve({ code: 500, msg: "點讚文章分頁出現問題..." });
            throw new Error("點讚分頁錯誤");
          } else {
            resolve({ code: 200, result });
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}
//當前用戶點讚總數列表
async function userLikeListAll(options) {
  return new Promise((resolve, reject) => {
    connection.query(
      `select * from click_like where user_id=${options.user_id}`,
      (err, results) => {
        try {
          if (err) {
            console.log(err, "用戶全部文章出現問題...");
            resolve({ code: 500, msg: "用戶全部點讚文章出現問題..." });
            throw new Error("用戶全部全部點讚文章出現錯誤");
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
//當前用戶點讚狀態
async function checkLikeStatus(options) {
  return new Promise((resolve, reject) => {
    const ifUser_id = options.user_id ? `and user_id=${options.user_id}` : "";
    connection.query(
      `select * from click_like where blog_id=${options.blog_id} ${ifUser_id}`,
      (err, results) => {
        try {
          if (err) {
            console.log(err, "當前用戶點讚狀態錯誤");
            throw new Error("當前用戶點讚查詢錯誤");
          } else {
            if (results.length === 0) {
              resolve({ result: false });
            } else {
              resolve({ result: true });
            }
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}
//用戶點讚
async function clickLike(options) {
  return new Promise((resolve, reject) => {
    connection.query(
      `select * from click_like where blog_id=${options.blog_id} and user_id=${options.user_id}`,
      (err, result) => {
        try {
          if (err) {
            console.log(err, "用戶點讚發生錯誤");
            throw new Error("用戶點讚發生錯誤");
          } else {
            if (result.length === 0) {
              connection.query(
                `insert into click_like (id,blog_id,user_id,like_status,create_time) values(${options.id},${options.blog_id},${options.user_id},1,${options.create_time})`,
                (addErr) => {
                  if (addErr) {
                    console.log("加入讚時發生錯誤", addErr);
                    throw new Error("用戶加入讚時發生錯誤");
                  } else {
                    resolve({ code: 200 });
                  }
                }
              );
            } else {
              connection.query(
                `select * from click_like where blog_id=${options.blog_id} and user_id=${options.user_id}`,
                (e, r) => {
                  const likeId = r[0].id;
                  if (e) {
                    console.log(e, "用戶取消讚時發生錯誤");
                    throw new Error("用戶取消讚時發生錯誤");
                  } else {
                    connection.query(
                      `delete from click_like where id=${likeId} and user_id=${options.user_id}`,
                      (minusErr) => {
                        if (minusErr) {
                          console.log("刪除讚時發生錯誤", minusErr);
                          throw new Error("刪除讚狀態時發生錯誤");
                        } else {
                          resolve({ code: 201 });
                        }
                      }
                    );
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
//單篇總讚數
async function allLike(options) {
  return new Promise((resolve, reject) => {
    connection.query(
      `select * from click_like where blog_id=${options.blog_id}`,
      (err, results) => {
        try {
          if (err) {
            console.log(err, "取得單篇文章讚時錯誤");
            throw new Error("取得單篇文章讚數發生錯誤");
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
//後台總讚數
async function dashBoardAllLike() {
  return new Promise((resolve, reject) => {
    connection.query(`select * from click_like`, (err, result) => {
      try {
        if (err) {
          console.log(err, "後台後取總讚數失敗");
          throw new Error("後台後取總讚數失敗");
        } else {
          resolve({ code: 200, result });
        }
      } catch (error) {
        reject(error);
      }
    });
  });
}
//後台刪除文章時刪除讚
async function dashBoardDeleteLikeCount(id) {
  return new Promise((resolve, reject) => {
    connection.query(`delete from click_like where blog_id=${id}`, (err) => {
      try {
        if (err) {
          console.log(err, "後台刪除讚數時失敗");
          throw new Error("後台刪除讚數時失敗");
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
  checkLikeStatus,
  clickLike,
  allLike,
  userLikeLists,
  userLikeListAll,
  dashBoardAllLike,
  dashBoardDeleteLikeCount,
};
