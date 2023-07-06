const connection = require("../db/connection");

//搜索並分頁
/*
keyword 關鍵字
category_id 分類id
page 頁碼
pageSize 顯示多少資料
offset 當前頁面顯示幾條
*/
//搜尋
async function seachQuery(
  keyword = "",
  category_id = 0,
  page = 1,
  pageSize = 10
) {
  const offset = (page - 1) * pageSize; //計算返回頁面數據
  const whereSql = [];

  if (category_id != 0) {
    whereSql.push(` category_id=${category_id} `);
  }
  if (keyword != "") {
    whereSql.push(`title like "%${keyword}%" or content like "%${keyword}%" `);
  }
  let whereSqlStr = "";
  if (whereSql.length > 0) {
    whereSqlStr = `where ${whereSql.join(" and ")}`;
  }
  //substr(content,1,100)
  const sql = `select id,category_id,coverImage,title,description,content,create_time,uid,watch_count from blog ${whereSqlStr} order by create_time desc limit ${pageSize} offset ${offset}`;

  //資料庫查詢
  return new Promise((resolve, reject) => {
    connection.query(sql, (error, lists) => {
      try {
        if (error) {
          console.log(error, "文章搜尋出錯");
          throw new Error("文章搜尋出錯");
        } else {
          resolve({
            code: 200,
            lists,
            keyword,
            category_id,
            page,
            pageSize,
            offset,
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  });
}
//查詢所有文章總數
async function queryBlog() {
  return new Promise((resolve, reject) => {
    connection.query(`select * from blog`, (error, lists) => {
      try {
        if (error) {
          console.log(error, "查詢blog總數錯誤");
          throw new Error("查詢blog總數錯誤");
        } else {
          resolve({
            code: 200,
            count: lists.length,
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  });
}

//新增
async function addBlog(id, options, create_time) {
  return new Promise((resolve, reject) => {
    //新增分類
    connection.query(
      `insert into blog (id, uid,category_id,coverImage,title,description,content,create_time) values(${id},'${options.uid}','${options.category_id}','${options.cover_image}','${options.title}','${options.description}','${options.content}',${create_time})`,
      (error) => {
        try {
          if (error) {
            console.log(error, "新增分類錯誤");
            resolve({
              code: 500,
              msg: "添加失敗",
            });
            throw new Error("分類添加錯誤");
          } else {
            resolve({
              code: 200,
              msg: "添加成功",
            });
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}
//刪除
async function delBlog(id) {
  return new Promise((resolve, reject) => {
    //新增分類
    connection.query(`delete from blog where id=${id}`, (error) => {
      try {
        if (error) {
          console.log(error, "文章刪除錯誤");
          resolve({
            code: 500,
            msg: "刪除失敗",
          });
          throw new Error("文章刪除錯誤");
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
//修改
async function updateBlog(id, options) {
  return new Promise((resolve, reject) => {
    connection.query(
      `update blog set category_id=${options.category_id},coverImage='${options.cover_image}',title='${options.title}',description='${options.description}',content='${options.content}',create_time=${options.create_time} where id=${id}`,
      (error) => {
        try {
          if (error) {
            console.log(error, "更新文章錯誤");
            resolve({
              code: 500,
              msg: "更新失敗",
            });
            throw new Error("更新文章錯誤");
          } else {
            resolve({
              code: 200,
              msg: "更新完成",
            });
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}
//id查詢
async function queryBlogId(id) {
  return new Promise((resolve, reject) => {
    connection.query(`select * from blog where id=${id}`, (error, list) => {
      try {
        if (error) {
          console.log(error, "id查詢文章錯誤");
          resolve({
            code: 500,
            msg: "查詢失敗...",
          });
          throw new Error("id查詢文章錯誤");
        } else {
          resolve({
            code: 200,
            list,
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  });
}

module.exports = {
  addBlog,
  delBlog,
  seachQuery,
  queryBlog,
  updateBlog,
  queryBlogId,
};
