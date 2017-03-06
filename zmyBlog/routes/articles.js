var express = require('express');
var router = express.Router();

/* GET users listing. */
//打开添加文章的页面
router.get('/add', function(req, res, next) {
    res.render('articles/add',{title:'发表文章'})
});

//提交新文章的信息
router.post('/add', function(req, res, next) {
    res.send('respond with a resource');
});



module.exports = router;
