const connection = require("../config/connection");


//----------搜索並分頁---------//////
/*
keyword 關鍵字
category_id 分類id
page 頁碼
pageSize 顯示多少資料
offset 當前頁面顯示幾條
*/
//------------------------------////
//搜尋
async function seachBlogs(
  keyword = "",
  category_name = "",
  page = 1,
  pageSize = 10
) {
  const offset = (page - 1) * pageSize; //計算返回頁面數據
  const whereSql = [];

  if (category_name != "") {
    whereSql.push(` category_name='${category_name}'`);
  }
  if (keyword != "") {
    whereSql.push(`title like "%${keyword}%" or content like "%${keyword}%" `);
  }
  let whereSqlStr = "";
  if (whereSql.length > 0) {
    whereSqlStr = `where status=1 and ${whereSql.join(" and ")}`;
  } else {
    whereSqlStr = " where status=1 ";
  }
  //substr(content,1,100)
  const sql = `select id,category_name,coverImage,title,description,content,create_time,uid,name,avatar,view_count from blog ${whereSqlStr}order by create_time desc limit ${pageSize} offset ${offset}`;

  //資料庫查詢
  return new Promise((resolve, reject) => {
    connection.query(sql, (error, lists) => {
      if (error) {
        console.log(error);
        reject({ status: "fail", msg: "文章搜尋出錯" });
      } else {
        resolve({
          status: "success",
          lists,
          keyword,
          category_name,
          page,
          pageSize,
          offset,
        });
      }
    });
  });
}
//獲得全部部落格
async function getAllBlogData() {
  return new Promise((resolve, reject) => {
    connection.query(
      "select * from blog where status=? ",
      [1],
      (error, blogs) => {
        if (error) {
          reject({
            status: "fail",
            msg: "查詢失敗...",
          });
        } else {
          resolve({
            status: "success",
            blogs,
          });
        }
      }
    );
  });
}
//獲得一條部落格
async function getBlogData(id) {
  return new Promise((resolve, reject) => {
    connection.query(
      "select * from blog where id=? and status=?",
      [id, 1],
      (error, data) => {
        if (error) {
          reject({
            status: "fail",
            msg: "查詢失敗...部落格ID錯誤!!",
          });
        } else {
          resolve({
            status: "success",
            data,
          });
        }
      }
    );
  });
}
//新增
async function createBlog(id, options, create_time) {
  return new Promise((resolve, reject) => {
    connection.query(
      "insert into blog (id, uid,name,avatar,category_id,category_name,coverImage,title,description,content,create_time) values(?,?,?,?,?,?,?,?,?,?,?)",
      [
        id,
        options.uid,
        options.name,
        options.avatar,
        options.category_id,
        options.category_name,
        options.cover_image,
        options.title,
        options.description,
        options.content,
        create_time,
      ],
      (error) => {
        if (error) {
          console.log(error);
          reject({ status: "fail", msg: "新增錯誤" });
        } else {
          resolve({
            status: "success",
            msg: "添加成功",
          });
        }
      }
    );
  });
}
//修改
async function updateBlog(id, options) {
  return new Promise((resolve, reject) => {
    connection.query(
      "update blog set category_id=?,coverImage=?,title=?,description=?,content=?,create_time=? where id=?",
      [
        options.category_id,
        options.cover_image,
        options.title,
        options.description,
        options.content,
        options.create_time,
        id,
      ],
      (error) => {
        if (error) {
          reject({
            status: "fail",
            msg: "更新失敗",
          });
        } else {
          resolve({
            status: "success",
            msg: "更新完成",
          });
        }
      }
    );
  });
}

//刪除
async function deleteBlog(id) {
  return new Promise((resolve, reject) => {
    //新增分類
    connection.query(
      "update blog set status=? where id=?",
      [0, id],
      (error) => {
        if (error) {
          resolve({
            status: "fail",
            msg: "刪除失敗",
          });
        } else {
          resolve("");
        }
      }
    );
  });
}

module.exports = {
  createBlog,
  seachBlogs,
  getAllBlogData,
  getBlogData,
  updateBlog,
  deleteBlog,
};
