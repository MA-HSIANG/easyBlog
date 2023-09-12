const { promisify } = require("util");
require("dotenv").config();
const {
  resgist,
  login,
  updateRole,

} = require("../models/userModel.js");
const { findUser } = require("../controller/userController.js");
const { genid } = require("../utils/Dbutils.js");

const jwt = require("jsonwebtoken");
const secret = process.env.YOUR_JWT_SECRET;

exports.resgist = async (req, res) => {
  try {
    const options = {
      id: genid.NextId(),
      account: req.body.account,
      password: req.body.password,
      email: req.body.email,
      create_time: new Date().getTime(),
    };

    const data = await resgist(options);
    res.status(201).json({
      data,
    });
  } catch (error) {
    res.status(400).json({
      status: error.status,
      msg: error.msg,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const options = {
      account: req.body.account,
      password: req.body.password,
      email: req.body.email,
    };

    const data = await login(options);
    res.status(200).json({
      data,
    });
  } catch (error) {
    res.status(400).json({
      status: error.status,
      msg: error.msg,
    });
  }
};

//驗證token
exports.verifyToken = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization) {
      token = req.headers.authorization;
    }

    if (!token) {
      res.status(403).json({
        msg: "你尚未登入....",
      });
      return;
    }

    //驗證都是正確的user
    const decoded = await promisify(jwt.verify)(token, secret);
    const checkUser = await findUser(decoded.id);
  
    if (checkUser.results.token !== token) {
      res.status(401).json({
        msg: "該帳號已經在另外一個客戶端登錄!!請確認是否為本人或通知管理人員處理!!",
      });
      return;
    }
    req.user = checkUser;
    next();
  } catch (error) {
    if (error.message === "jwt expired") {
      error.message = "帳號登錄逾期...請重新登錄!!";
    }
    res.status(419).json({
      msg: error.message,
    });
  }
};
//後台判定(admin or user)
exports.toWhere = (req, res) => {
  try {
    const user = req.user.results;
    let idCard;

    if (user.role !== "admin") {
      idCard = "user";
    }
    if (user.role !== "user") {
      idCard = "admin";
    }

    res.status(200).json({
      status: "success",
      data: {
        idCard,
        user,
      },
    });
  } catch (error) {
    console.log(error, "119");
    res.status(400).json({
      status: "fail",
    });
  }
};

//角色驗證
exports.verifyRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.results.role)) {
      res.status(403).json({
        msg: "你沒有權限進行這項操作",
      });
      return;
    }
    next();
  };
};

//判定登入狀態 + 分辨角色
exports.loginVerified = (req, res) => {
  try {
    const user = req.user.results;

    let menuData;
    if (user.role === "admin") {
      menuData = [
        { label: "後台管理", key: "dashBoard", icon: "Pencil" },
        { label: "退出登錄", key: "logout", icon: "LogoutIcon" },
      ];
    }
    if (user.role === "user") {
      menuData = [
        {
          label: "編輯資料",
          key: "editor",
          icon: "Pencil",
        },
        {
          label: "退出登錄",
          key: "logout",
          icon: "LogoutIcon",
        },
      ];
    }

    res.status(200).json({
      status: "success",
      data: {
        user,
        menu: menuData,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      msg: "驗證失敗..請確認帳號是否正確..",
    });
  }
};

//更改角色
exports.updateRole = async (req, res) => {
  try {
    const options = {
      id: req.body.id,
      role: req.body.role,
    };

    const data = await updateRole(options);
    res.status(200).json({
      data,
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};
//角色選單 (可改為資料庫用法)
exports.getRoleSelect = (req, res) => {
  try {
    const roleData = ["admin", "user"];
    res.status(200).json({
      status: "success",
      data: roleData,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      msg: "資料庫發生問題...無法取得角色表單..",
    });
  }
};
