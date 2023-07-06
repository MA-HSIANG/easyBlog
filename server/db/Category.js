const connection = require("../db/connection");
//列出所有
async function allList() {
  return new Promise((resolve, reject) => {
    connection.query(`select * from category`, (err, data) => {
      try {
        if (err) {
          console.log(err, "列出所有分類失敗");
          throw new Error("列出所有分類錯誤");
        } else {
          resolve({ code: 200, data });
        }
      } catch (error) {
        reject(error);
      }
    });
  });
}
//id查詢
async function queryCategoryId(id) {
  return new Promise((resolve, reject) => {
    connection.query(`select * from category where id=${id}`, (error, list) => {
      try {
        if (error) {
          console.log(error, "id查詢分類錯誤");
          resolve({
            code: 500,
            msg: "查詢失敗...",
          });
          throw new Error("id查詢分類錯誤");
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

//新增
async function addClass(id, name) {
  return new Promise((resolve, reject) => {
    //新增分類
    connection.query(
      `insert into category (id,name) values(${id},'${name}')`,
      (err) => {
        try {
          if (err) {
            console.log(err, "新增分類失敗");
            resolve({
              code: 500,
              msg: "添加失敗",
            });
            throw new Error("添加分類失敗");
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
async function delClass(id) {
  return new Promise((resolve, reject) => {
    //新增分類
    connection.query(`delete from category where id=${id}`, (err) => {
      try {
        if (err) {
          console.log(err, "刪除分類失敗");
          resolve({
            code: 500,
            msg: "刪除失敗",
          });
          throw new Error("刪除分類失敗");
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
async function updateClass(id, name) {
  return new Promise((resolve, reject) => {
    connection.query(
      `update category set name='${name}' where id=${id}`,
      (err) => {
        try {
          if (err) {
            console.log(err, "修改分類失敗");
            resolve({ code: 500, msg: "修改失敗" });
            throw new Error("修改分類失敗");
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
module.exports = { addClass, delClass, allList, updateClass, queryCategoryId };
