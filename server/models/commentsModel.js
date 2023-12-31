const connection = require("../config/connection");
//列出blog評論並分頁(一級)
/*
keyword 關鍵字
category_id 分類id
page 頁碼
pageSize 分頁大小
offset 當前頁面顯示幾條
*/
async function seachBlogComments(blog_id, page = 1, pageSize = 10) {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * pageSize;
    connection.query(
      "select * from comments where blog_id=? and comment_lv=? order by create_time desc limit ? offset ?",
      [blog_id, 1, pageSize, offset],
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
//二級評論
async function seachBlogReply(
  blog_id,
  parent_comment_id,
  parent_comment_user_id,
  page = 1,
  pageSize = 3
) {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * pageSize;
    connection.query(
      "select * from comments where blog_id=? and parent_comment_id =? and parent_comment_user_id =? and comment_lv=? order by create_time desc limit ? offset ?",
      [blog_id, parent_comment_id, parent_comment_user_id, 2, pageSize, offset],
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

//獲取當前部落格所有評論(一級)
async function getBlogCommentCount(id, lv) {
  return new Promise((resolve, reject) => {
    connection.query(
      "select * from comments where blog_id=? and comment_lv=?",
      [id, lv],
      (error, data) => {
        if (error) {
          console.log(error);
          reject({ status: "fail", msg: "伺服器發生錯誤...請聯繫管理人員!!" });
        } else {
          if (data) {
            resolve({ status: "success", data });
          } else {
            reject({ status: "fail" });
          }
        }
      }
    );
  });
}
//獲取當前部落格所有評論(二級)
async function getBlogReplyCount(id, parent_comment_id) {
  return new Promise((resolve, reject) => {
    connection.query(
      "select * from comments where blog_id=? and parent_comment_id =? and comment_lv=?",
      [id, parent_comment_id, 2],
      (error, data) => {
        if (error) {
          console.log(error);
          reject({ status: "fail", msg: "伺服器發生錯誤...請聯繫管理人員!!" });
        } else {
          if (data) {
            resolve({ status: "success", data });
          } else {
            reject({ status: "fail" });
          }
        }
      }
    );
  });
}
//1級評論
async function userWriteComment(id, options, create_time) {
  return new Promise((resolve, reject) => {
    connection.query(
      "insert into comments (id,blog_id,user_id,user_name,content,create_time,avatar,comment_lv) values(?,?,?,?,?,?,?,?)",
      [
        id,
        options.blog_id,
        options.user_id,
        options.user_name,
        options.content,
        create_time,
        options.avatar,
        1,
      ],
      (err) => {
        if (err) {
          console.log(err, "發表評論失敗");
          reject({
            status: "fail",
            msg: "發表評論失敗",
          });
        } else {
          resolve({
            status: "success",
            msg: "發表評論成功",
          });
        }
      }
    );
  });
}
//user評論(二級)
async function userWriteReply(id, options, create_time) {
  return new Promise((resolve, reject) => {
    connection.query(
      "insert into comments (id,blog_id,user_id,user_name,content,create_time,avatar,parent_comment_id,parent_comment_user_id,comment_lv) values(?,?,?,?,?,?,?,?,?,?)",
      [
        id,
        options.blog_id,
        options.user_id,
        options.user_name,
        options.content,
        create_time,
        options.avatar,
        options.parent_comment_id,
        options.parent_comment_user_id,
        2,
      ],
      (err) => {
        if (err) {
          console.log(err, "發表評論失敗");
          reject({
            status: "fail",
            msg: "發表評論失敗",
          });
        } else {
          resolve({
            status: "success",
            msg: "發表評論成功",
          });
        }
      }
    );
  });
}
//總網站所有評論
async function getWebAllComments() {
  return new Promise((resolve, reject) => {
    connection.query(
      "select * from comments where status=1",
      (error, comments) => {
        if (error) {
          console.log(error);
          reject({ status: "fail", msg: "伺服器發生錯誤...請聯繫管理人員!!" });
        } else {
          if (comments) {
            resolve({
              status: "success",
              comments: comments.length,
              data: comments,
            });
          } else {
            reject({ status: "fail" });
          }
        }
      }
    );
  });
}

module.exports = {
  seachBlogComments,
  seachBlogReply,
  userWriteComment,
  userWriteReply,
  getBlogCommentCount,
  getBlogReplyCount,
  getWebAllComments,
};
