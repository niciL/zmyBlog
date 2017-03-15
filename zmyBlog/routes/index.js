var express = require('express');
//路由模块
var router = express.Router();
var md=require('markdown').markdown;

/* GET home page. */
router.get('/', function(req, res, next) {
  /*//查询数据库，获取文章列表
  Model('Article').find({}).populate('user').exec(function(err,articles){
    articles.forEach(function(a){
      a.content=md.toHTML(a.content);
    })
    console.log(articles);
    res.render('index', {title: '主页',articles:articles});
  });*/

  //切换首页时，要清空session里的关键字
  req.session.keyword=null
  res.redirect("/articles/list/1/2");
});

module.exports = router;
