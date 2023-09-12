const connection = require("./connection");

//列出blog評論並分頁
/*
keyword 關鍵字
category_id 分類id
page 頁碼
pageSize 分頁大小
offset 當前頁面顯示幾條
*/
async function seachBlogComment(blog_id = 0, page = 1, pageSize = 10) {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * pageSize;
    connection.query(
      `select * from comment where blog_id=${blog_id} order by create_time desc limit ${pageSize} offset ${offset}`,
      (err, results) => {
        try {
          if (err) {
            console.log(err, "評論顯示錯誤");
            throw new Error("評論顯示錯誤");
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
//查詢所有
async function queryBlogComment(blog_id) {
  return new Promise((resolve, reject) => {
    connection.query(
      `select * from comment where blog_id=${blog_id}`,
      (err, lists) => {
        try {
          if (err) {
            console.log(err, "查詢所有評論失敗");
            throw new Error("查詢所有評論失敗");
          } else {
            resolve({
              code: 200,
              count: lists.length,
            });
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}
//列出評論使用者資料
async function queryCommentUser(user_id) {
  return new Promise((resolve, reject) => {
    connection.query(
      `select * from user where id=${user_id}`,
      (err, result) => {
        try {
          if (err) {
            console.log(err, "列出所有評論user資料失敗");
            throw new Error("列出所有評論user資料失敗");
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
//user評論
async function userWriteComment(options, create_time) {
  return new Promise((resolve, reject) => {
    connection.query(
      `insert into comment (id,blog_id,user_id,user_name,content,create_time,headerImg) values(${options.id},${options.blog_id},${options.user_id},'${options.user_name}','${options.content}',${create_time},'${options.header_img}')`,
      (err) => {
        try {
          if (err) {
            console.log(err, "發表評論失敗");
            resolve({
              code: 500,
              msg: "發表評論失敗",
            });
            throw new Error("發表評論失敗");
          } else {
            resolve({
              code: 200,
              msg: "發表評論成功",
            });
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}
//後台最新留言 || 所有留言
async function dashBoardAllComments(new_num) {
  const sqlLimit = [];
  if (new_num > 0) {
    sqlLimit.push(`limit ${new_num}`);
  }
  return new Promise((resolve, reject) => {
    connection.query(
      `select * from comment order by create_time desc ${sqlLimit}`,
      (err, results) => {
        try {
          if (err) {
            console.log(err);
            throw new Error("後台獲取留言總數錯誤");
          } else {
            resolve({ code: 200, results });
          }
        } catch (error) {
          reject(error);
          resolve({ code: 500, msg: `獲取異常${error.message}` });
        }
      }
    );
  });
}
//後台刪除文章時刪除留言
async function dashBoardDeleteComment(id) {
  return new Promise((resolve, reject) => {
    connection.query(`delete from comment where blog_id=${id}`, (err) => {
      try {
        if (err) {
          console.log(err, "後台刪除留言時失敗");
          throw new Error("後台刪除留言時失敗");
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

//留言回復
async function writeReply(options, create_time) {
  return new Promise((resolve, reject) => {
    connection.query(
      `insert into reply (id,comment_id,user_id,blog_id,user_name,content,create_time,avatar) values(${options.id},${options.comment_id},${options.user_id},${options.blog_id},'${options.user_name}','${options.content}',${create_time},'${options.avatar}')`,
      (err) => {
        try {
          if (err) {
            console.log(err, "發表回復失敗");
            resolve({
              code: 500,
              msg: "發表回復失敗",
            });
            throw new Error("發表回復失敗");
          } else {
            resolve({
              code: 200,
              msg: "發表回復成功",
            });
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}
//列出評論的回覆
async function seachCommentReply(comment_id = 0, page = 1, pageSize = 10) {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * pageSize;
    connection.query(
      `select * from reply where comment_id=${comment_id} order by create_time desc limit ${pageSize} offset ${offset}`,
      (err, results) => {
        try {
          if (err) {
            console.log(err, "回復顯示錯誤");
            throw new Error("回復顯示錯誤");
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
//查詢所有回復
async function queryCommentReply(comment_id) {
  return new Promise((resolve, reject) => {
    connection.query(
      `select * from reply where comment_id=${comment_id}`,
      (err, lists) => {
        try {
          if (err) {
            console.log(err, "查詢所有回復失敗");
            throw new Error("查詢所有回復失敗");
          } else {
            resolve({
              code: 200,
              count: lists.length,
            });
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}
//後台刪除文章時刪除回復
async function dashBoardDeleteReply(id) {
  return new Promise((resolve, reject) => {
    connection.query(`delete from reply where blog_id=${id}`, (err) => {
      try {
        if (err) {
          console.log(err, "後台刪除留言時失敗");
          throw new Error("後台刪除留言時失敗");
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
  userWriteComment,
  seachBlogComment,
  queryBlogComment,
  queryCommentUser,
  dashBoardAllComments,
  dashBoardDeleteComment,
  writeReply,
  seachCommentReply,
  queryCommentReply,
  dashBoardDeleteReply,
};
