const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

router.post("/_token/rich_editor_upload2", async (req, res) => {
  try {
    if (!req.files) return;
    //上傳檔案
    const files = req.files;
    //返回上傳網址
    const filesImge = [];
    for (const file of files) {
      const newFiles = `${file.filename}.jpg`;
      //移動檔案(上傳到temp臨時存放區,移動到圖片區image)
      const sourceFile = path.join(
        __dirname,
        `../public/upload/temp/${file.filename}`
      );
      const targetFile = path.join(
        __dirname,
        `../public/upload/image/${newFiles}`
      );
      fs.renameSync(sourceFile, targetFile);
      filesImge.push(`/upload/image/${newFiles}`);
      res.send({
        code: 200,
        data: {
          url: filesImge[0],
        },
      });
    }
  } catch (error) {
    res.status(500).send("發生了上傳錯誤....");
  }
});
router.post("/_token/coverImage", async (req, res) => {
  try {
    if (!req.files) return;
    //上傳檔案
    const files = req.files;
    //返回上傳網址
    const filesImge = [];
    const protocol = req.protocol; //http
    const protocols = "https";
    const host = req.hostname;
    const port = process.env.PORT || 3000;
    const serverUrl = `${protocols}://${host}`;

    for (const file of files) {
      const newFiles = `${file.filename}.jpg`;
      //移動檔案(上傳到temp臨時存放區,移動到圖片區image)
      const sourceFile = path.join(
        __dirname,
        `../public/upload/temp/${file.filename}`
      );
      const targetFile = path.join(
        __dirname,
        `../public/upload/coverImage/${newFiles}`
      );
      fs.renameSync(sourceFile, targetFile);
      filesImge.push(`${serverUrl}/upload/coverImage/${newFiles}`);

      res.send({
        url: filesImge[0],
      });
    }
  } catch (error) {
    res.status(500).send(`${error}發生了上傳錯誤....`);
  }
});
router.post("/_userToken/avatar", async (req, res) => {
  try {
    if (!req.files) return;
    //上傳檔案
    const files = req.files;
    //返回上傳網址
    const filesImge = [];
    const protocol = req.protocol; //http
    const protocols = "https";
    const host = req.hostname;
    const port = process.env.PORT || 3000;
    const serverUrl = `${protocols}://${host}`;

    for (const file of files) {
      const newFiles = `${file.filename}.jpg`;
      //移動檔案(上傳到temp臨時存放區,移動到圖片區image)
      const sourceFile = path.join(
        __dirname,
        `../public/upload/temp/${file.filename}`
      );
      const targetFile = path.join(
        __dirname,
        `../public/upload/avatar/${newFiles}`
      );
      fs.renameSync(sourceFile, targetFile);
      filesImge.push(`${serverUrl}/upload/avatar/${newFiles}`);

      res.send({
        url: filesImge[0],
      });
    }
  } catch (error) {
    res.status(500).send(`${error}發生了上傳錯誤....`);
  }
});
module.exports = router;
