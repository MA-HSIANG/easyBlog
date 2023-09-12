/*
Navicat MySQL Data Transfer

Source Server         : mysql 8.0
Source Server Version : 80031
Source Host           : localhost:3306
Source Database       : blogs

Target Server Type    : MYSQL
Target Server Version : 80031
File Encoding         : 65001

Date: 2023-09-13 02:14:29
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for blog
-- ----------------------------
DROP TABLE IF EXISTS `blog`;
CREATE TABLE `blog` (
  `id` bigint NOT NULL,
  `coverImage` varchar(255) DEFAULT NULL,
  `title` varchar(200) DEFAULT NULL,
  `content` text,
  `create_time` bigint DEFAULT NULL,
  `uid` varchar(200) DEFAULT NULL,
  `view_count` bigint DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `category_id` bigint DEFAULT NULL,
  `category_name` varchar(255) DEFAULT NULL,
  `likes` bigint DEFAULT NULL,
  `status` bigint DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of blog
-- ----------------------------
INSERT INTO `blog` VALUES ('477821353394245', 'http://localhost:3000/upload/coverImage/13fc77fa98ff1caa405edeec2d431b7c.jpg', 'test1', 'test1', '1694492403856', '477233291755589', null, 'test1', 'user01', 'http://localhost:3000/upload/avatar/defaultUser.jpg', null, '前端', null, '1');
INSERT INTO `blog` VALUES ('477998250119237', 'http://localhost:3000/upload/coverImage/63241f02e58ee138d949c50545945717.jpg', 'test2', 'test2', '1694535591533', '477233291755589', null, 'test2', 'user01', 'http://localhost:3000/upload/avatar/defaultUser.jpg', null, '後端', null, '1');
INSERT INTO `blog` VALUES ('477998318420037', 'http://localhost:3000/upload/coverImage/5c7ddd389d915ed6c6607edc93e70e2a.jpg', 'test3', 'test3', '1694535608208', '477233291755589', null, 'test3', 'user01', 'http://localhost:3000/upload/avatar/defaultUser.jpg', '0', 'Vue3', null, '1');

-- ----------------------------
-- Table structure for blog_view
-- ----------------------------
DROP TABLE IF EXISTS `blog_view`;
CREATE TABLE `blog_view` (
  `id` bigint NOT NULL,
  `blog_id` bigint DEFAULT NULL,
  `ip_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `view_count` bigint DEFAULT NULL,
  `view_create_time` bigint DEFAULT NULL,
  `status` bigint DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of blog_view
-- ----------------------------
INSERT INTO `blog_view` VALUES ('478008792244293', '477998318420037', '::1', '1', '1694538165294', '1');
INSERT INTO `blog_view` VALUES ('478009991704645', '477821353394245', '::1', '1', '1694538458131', '1');
INSERT INTO `blog_view` VALUES ('478010329677893', '477998250119237', '::1', '1', '1694538540644', '1');

-- ----------------------------
-- Table structure for category
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `id` bigint NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of category
-- ----------------------------
INSERT INTO `category` VALUES ('477286341292101', '前端');
INSERT INTO `category` VALUES ('477286364745797', '後端');
INSERT INTO `category` VALUES ('477286382989381', 'Vue3');
INSERT INTO `category` VALUES ('477622595899461', 'Vue');
INSERT INTO `category` VALUES ('477633298067525', 'NodeJS');

-- ----------------------------
-- Table structure for click_like
-- ----------------------------
DROP TABLE IF EXISTS `click_like`;
CREATE TABLE `click_like` (
  `id` bigint NOT NULL,
  `blog_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `like_status` bigint DEFAULT NULL,
  `create_time` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of click_like
-- ----------------------------
INSERT INTO `click_like` VALUES ('477938463326277', '477821353394245', '477233291755589', '1', '1694520995148');
INSERT INTO `click_like` VALUES ('478010829942853', '477821353394245', '477295019483205', '1', '1694538662779');

-- ----------------------------
-- Table structure for comments
-- ----------------------------
DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments` (
  `id` bigint NOT NULL,
  `blog_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  `create_time` bigint DEFAULT NULL,
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `status` varchar(255) DEFAULT '1',
  `parent_comment_id` bigint DEFAULT NULL,
  `parent_comment_user_id` bigint DEFAULT NULL,
  `reply_comment_id` bigint DEFAULT NULL,
  `reply_comment_user_id` bigint DEFAULT NULL,
  `comment_lv` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of comments
-- ----------------------------
INSERT INTO `comments` VALUES ('477999491928133', '477821353394245', '477233291755589', 'user01', '測試\r\n', '1694535894709', 'http://localhost:3000/upload/avatar/defaultUser.jpg', '1', null, null, null, null, '1');
INSERT INTO `comments` VALUES ('477999828541509', '477998250119237', '477233291755589', 'user01', '123', '1694535976890', 'http://localhost:3000/upload/avatar/defaultUser.jpg', '1', null, null, null, null, '1');
INSERT INTO `comments` VALUES ('478010921410629', '477821353394245', '477295019483205', 'user02', 'OK', '1694538685110', 'http://localhost:3000/upload/avatar/user-2cee268e5d889c02b9b7846ecca7a99f.jpg', '1', null, null, null, null, '1');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `role` varchar(255) DEFAULT NULL,
  `account` varchar(255) DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `create_time` bigint DEFAULT NULL,
  `status` bigint DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=477449464680518 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('477233291755589', 'admin', 'user01', '$2b$12$XK/wsbb9b/UV6IpqoJK7/u3AFSd5co/cx8iPHrJ1Jq73u27Oh1ifW', 'user01@gmail.com', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDc3MjMzMjkxNzU1NTg5LCJpYXQiOjE2OTQ1NDIxNDksImV4cCI6MTY5NDU0Mjc0OX0.E74NhOCuFNHsRSQb-0dypztnuOPMZng3NAaxK6QTJFE', 'http://localhost:3000/upload/avatar/defaultUser.jpg', '1694348834120', '1');
INSERT INTO `user` VALUES ('477295019483205', 'user', 'user02', '$2b$12$6oHDltGafEy1ZY4mMMZ7ru7NQAKwinStKYkjNJXXfhhAqslKU4YQO', 'user02@gmail.com', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDc3Mjk1MDE5NDgzMjA1LCJpYXQiOjE2OTQ1Mzg1NzAsImV4cCI6MTY5NDUzOTE3MH0.L3oYlyUSfUQgQ0PFsTwsZ1hcHtiPH2n8vVizOA_0-MA', 'http://localhost:3000/upload/avatar/user-2cee268e5d889c02b9b7846ecca7a99f.jpg', '1694363904367', '1');
INSERT INTO `user` VALUES ('477304681078853', 'user', 'user03', '$2b$12$fKHpr6wvDFjdslkRKCvsUuW8A.kiOQExfYbOUgN.wA19tTcYK0kQG', 'user03@gmail.com', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDc3MzA0NjgxMDc4ODUzLCJpYXQiOjE2OTQzNjc2NzMsImV4cCI6MTY5NDM2ODI3M30.QyMglD7Gj1FCsW2ingtl1J2NZiEnY7J4zFHujV3qmiY', 'http://localhost:3000/upload/avatar/defaultUser.jpg', '1694366263154', '1');
INSERT INTO `user` VALUES ('477307156906053', 'user', 'user04', '$2b$12$3mw/fc2I7CCOUx4AXG5hgOyTYEqM9cD4hDKDwJpYeXeaJwzjhBLea', 'user04@gmail.com', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDc3MzA3MTU2OTA2MDUzLCJpYXQiOjE2OTQzNjgzOTQsImV4cCI6MTY5NDM2ODk5NH0.BrtsO6kbgSAAMzW701LsIDjLHaT2bhZ57wMpJQuVrUc', 'http://localhost:3000/upload/avatar/defaultUser.jpg', '1694366867604', '1');
INSERT INTO `user` VALUES ('477449464680517', 'user', 'user05', '$2b$12$SqA7zDbvbKi7TAqsmkmhP.rU5L.cbAmFQ3PZZ.d7kUEQ6JPUe8kkK', 'user05@gmail.com', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDc3NDQ5NDY0NjgwNTE3LCJpYXQiOjE2OTQ0MDE2MjMsImV4cCI6MTY5NDQwMjIyM30.rkGP8LxogRL42clx2h8kJFS1dlx3PnTh_QN3HnwIaJU', 'http://localhost:3000/upload/avatar/defaultUser.jpg', '1694401610713', '1');
