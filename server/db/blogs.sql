/*
Navicat MySQL Data Transfer

Source Server         : mysql 8.0
Source Server Version : 80031
Source Host           : localhost:3306
Source Database       : blogs

Target Server Type    : MYSQL
Target Server Version : 80031
File Encoding         : 65001

Date: 2023-05-17 02:09:31
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for admin
-- ----------------------------
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `account` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of admin
-- ----------------------------
INSERT INTO `admin` VALUES ('1', 'admin', 'admin', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50IjoiYWRtaW4iLCJpYXQiOjE2ODQyNTEwMzB9.qcBJip_jYUIwfE95MDTa3Nl8-8fAgTsdeUCSdlYIj2A');

-- ----------------------------
-- Table structure for blog
-- ----------------------------
DROP TABLE IF EXISTS `blog`;
CREATE TABLE `blog` (
  `id` bigint NOT NULL,
  `category_id` bigint DEFAULT NULL,
  `title` varchar(200) DEFAULT NULL,
  `content` text,
  `create_time` bigint DEFAULT NULL,
  `uid` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of blog
-- ----------------------------
INSERT INTO `blog` VALUES ('432190349033541', '434519804813381', '標題修改了', '<p>內容456</p>', '1684088389409', 'abcdefgdddd');
INSERT INTO `blog` VALUES ('434844340850757', '434519841316933', '測試02', '<p>hell02</p>', '1683999969153', '1');
INSERT INTO `blog` VALUES ('434851765448773', '434519804813381', 'HTML', '<p><br></p><p style=\"text-align: start;\"><strong>超文本標記語言</strong>（英語：<strong>HyperText Markup Language</strong>，簡稱：<strong>HTML</strong>）是一種用於建立<a href=\"https://zh.wikipedia.org/wiki/%E7%BD%91%E9%A1%B5\" target=\"\">網頁</a>的標準<a href=\"https://zh.wikipedia.org/wiki/%E6%A0%87%E8%AE%B0%E8%AF%AD%E8%A8%80\" target=\"\">標記語言</a>。HTML是一種基礎技術，常與<a href=\"https://zh.wikipedia.org/wiki/CSS\" target=\"\">CSS</a>、<a href=\"https://zh.wikipedia.org/wiki/JavaScript\" target=\"\">JavaScript</a>一起被眾多網站用於設計網頁、網頁應用程式以及行動應用程式的使用者介面<sup>[3]</sup>。<a href=\"https://zh.wikipedia.org/wiki/%E7%BD%91%E9%A1%B5%E6%B5%8F%E8%A7%88%E5%99%A8\" target=\"\">網頁瀏覽器</a>可以讀取HTML檔案，並將其彩現成視覺化網頁。HTML描述了一個網站的結構語意隨著線索的呈現，使之成為一種標記語言而非<a href=\"https://zh.wikipedia.org/wiki/%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80\" target=\"\">程式語言</a>。</p><p style=\"text-align: start;\"><a href=\"https://zh.wikipedia.org/wiki/HTML%E5%85%83%E7%B4%A0\" target=\"\">HTML元素</a>是構建網站的基石。HTML允許嵌入圖像與物件，並且可以用於建立互動式表單，它被用來結構化資訊——例如標題、段落和列表等等，也可用來在一定程度上描述文件的外觀和<a href=\"https://zh.wikipedia.org/wiki/%E8%AF%AD%E4%B9%89\" target=\"\">語意</a>。HTML的語言形式為<a href=\"https://zh.wikipedia.org/wiki/%E6%8B%AC%E5%8F%B7\" target=\"\">尖括號</a>包圍的HTML元素（如<span style=\"color: rgb(0, 0, 0); background-color: rgb(248, 249, 250);\"><code>&lt;html&gt;</code></span>），瀏覽器使用HTML標籤和指令碼來詮釋網頁內容，但不會將它們顯示在頁面上。</p><p style=\"text-align: start;\">HTML可以嵌入如<a href=\"https://zh.wikipedia.org/wiki/JavaScript\" target=\"\">JavaScript</a>的<a href=\"https://zh.wikipedia.org/wiki/%E8%84%9A%E6%9C%AC%E8%AF%AD%E8%A8%80\" target=\"\">手稿語言</a>，它們會影響HTML網頁的行為。網頁瀏覽器也可以參照<a href=\"https://zh.wikipedia.org/wiki/%E5%B1%82%E5%8F%A0%E6%A0%B7%E5%BC%8F%E8%A1%A8\" target=\"\">階層式樣式表</a>（CSS）來定義文字和其它元素的外觀與布局。維護HTML和CSS標準的組織<a href=\"https://zh.wikipedia.org/wiki/%E4%B8%87%E7%BB%B4%E7%BD%91%E8%81%94%E7%9B%9F\" target=\"\">全球資訊網協會</a>（W3C）鼓勵人們使用CSS替代一些用於表現的HTML元素<sup>[4]</sup>。</p>', '1684001781799', '1');
INSERT INTO `blog` VALUES ('435018595467333', '434519841316933', '修改完成了05', '<p><img src=\"http://localhost:3000/upload/image/435206200254533.jpg\" alt=\"\" data-href=\"\" style=\"\"/>這是拿來修改的</p>', '1684089771354', '1');
INSERT INTO `blog` VALUES ('435193146839109', '434519841316933', '修改測試01', '<p>拿來修改01</p>', '1684088241316', '1');
INSERT INTO `blog` VALUES ('435206653755461', '434519804813381', '新增拿來測試頁面', '<p>hell測試了</p>', '1684088424452', '1');

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
INSERT INTO `category` VALUES ('434519804813381', '前端');
INSERT INTO `category` VALUES ('434519841316933', '後端');
INSERT INTO `category` VALUES ('435367777726533', 'Vue3');
