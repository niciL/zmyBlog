var express = require('express');
var router = express.Router();

/* GET users listing. */
//访问登录页面
router.get('/login', function(req, res, next) {
  res.render('users/login',{title:'登录'})
});

//使用post方式提交登录信息
router.post('/login',function(req,res,next){
  var user=req.body;
  user.password=md5(user.password)
  //查询数据库，找到是否有匹配的记录
  Model("User").findOne(user,function(err,user){
    if(user){
      //用户登录成功,将用户的登录信息保存到session中
      req.session.user=user;
      return res.redirect("/");

    }
    //req.flash('err',err);
    return res.redirect("/users/login")
  })

})

//打开注册页面
router.get('/reg',function(req,res,next){
  res.render('users/reg',{title:'注册'})
});

//提交注册信息
router.post('/reg',function(req,res,next){
  //获取用户提供的表单数据
  var user=req.body;
  if(user.password!=user.repassword){
    //req.flash("error","两次密码不一致");
    //重定向到注册页面
    return res.redirect('/users/reg')
  }
  //删除确认密码的属性
  delete user.repassword;
  //把密码用md5加密
  user.password=md5(user.password)
  //根据邮箱生成头像地址
  user.avatar="http://s.gravatar.com/avatar/"+md5(user.email)+"?s=80"
  //将user对象保存到数据库中
  new Model('User')(user).save(function(err,user){
    if(err){
      //req.flash('err',err);
      res.redirect("/users/reg");
    }

    //在session中保存用户的登录信息
      req.session.user=user;
      res.redirect("/")
  })
});

//注销用户登录
router.get('/logout',function(req,res,next){
  res.render('')
});

function md5(val){
  return require('crypto').createHash('md5').update(val).digest('hex');
}

module.exports = router;
