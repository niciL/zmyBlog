var express = require('express');
var router = express.Router();
var middleware=require("../middleware/index");
var md=require("markdown").markdown;

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

router.get('/detail/:_id',function(req,res,next){
    //路径参数中如果参数是id那么名字必须是_id
    var articleId=req.params._id;
    Model('Article').findOne({_id:articleId},function(err,article){
        article.content = md.toHTML(article.content);
        res.render('articles/detail',{title:'查看文章',art:article});
    })
});

router.get('/delete/:_id',function(req,res,next){
    var articleId=req.params._id;
    Model('Article').remove({_id:articleId},function(err,art){
        if(err){
            //发表文章如果失败，转到发表页面
            req.flash("error","删除失败")
        }
        //发表成功，转到首页
        req.flash("success","删除成功")
        res.redirect("/");
    })
});

router.get('/edit/:_id',function(req,res,next){
    var articleId=req.params._id;
    Model('Article').findOne({_id:articleId},function(err,article){
        //添加权限判断，判断当前的登录人和文章发表人是否一致,如果不一致，转回详情页面，并显示错误信息
        if(req.session.user && req.session.user._id!=article.user){
            req.flash("error","你没有权限修改文章")
            return res.redirect("/articles/detail/"+article._id);
        }
        res.render("articles/edit",{title:"重新编辑",article:article})
    })
})

router.post('/edit/:_id',middleware.checkLogin,function(req,res,next){
    var article=req.body;
    Model('Article').update({_id:req.params._id},article,function(error,article){
        if(error){
            req.flash("error","更新失败");
        }

        req.flash("success",'更新成功');
        res.redirect("/articles/detail/"+req.params._id);
    })
})

//get  //articles/list/3/2
//post //articles/list/3/2
router.all('/list/:pageNum/:pageSize',function(req,res,next){
    var searchBtn=req.body.searchBtn;

    //pageNum表示当前第几页，默认值第一页
    var pageNum=parseInt(req.params.pageNum) && parseInt(req.params.pageNum)>0 ? parseInt(req.params.pageNum) : 0;
    //pageNum表示每页多少条，默认值两条
    var pageSize=parseInt(req.params.pageSize) && parseInt(req.params.pageSize)>0 ? parseInt(req.params.pageSize) : 2;

    //搜索条件
    var query={};
    var keyword=req.body.keyword;
    if(searchBtn){
        //把关键字存到session中防止丢失
        req.session.keyword=keyword;
    }
    if(req.session.keyword){
        query['title']=new RegExp(req.session.keyword,'ig');
    }
    //查询搜索结果一共多少条数据；方便计算页数
    Model('Article').count(query,function(error,count){
        console.log(count);
        //查询符合条件的当前的这一页的数据
        //要查询第n页的数据，就要跳过n-1页的数据
        Model('Article').find(query).sort({'createTime':-1})
            .skip((pageNum-1)*pageSize).limit(pageSize).populate('user').exec(function(error,articles){
            res.render('index',{title:'首页',articles:articles,count:count,pageNum:pageNum,pageSize:pageSize,keyword:req.session.keyword})
        });
    })
})



module.exports = router;
