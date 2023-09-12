const express = require("express");
const router = express.Router();

const blogViewController = require("../controller/blogViewController");

router.route("/blogViewCounts/:id").get(blogViewController.getBlogViewCounts);

router.route("/:id").get(blogViewController.createArticleView);

module.exports = router;
