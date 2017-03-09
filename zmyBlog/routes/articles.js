var express = require('express');
var router = express.Router();
var middleware=require("../middleware/index")

/* GET users listing. */
//打开添加文章的页面
router.get('/add',middleware.checkLogin,function(req, res, next) {
    res.render('articles/add',{title:'发表文章'})
});

//提交新文章的信息
router.post('/add',middleware.checkLogin, function(req, res, next) {
    var article=req.body;
    article.user=req.session.user._id;

    new Model('Article')(article).save(function(err,art){
        if(err){
            //发表文章如果失败，转到发表页面
            return res.redirect("/articles/add")
        }
        //发表成功，转到首页
        return res.redirect("/")
    })
});



module.exports = router;
