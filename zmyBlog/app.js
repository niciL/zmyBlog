var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var db=require('./db');
var settings=require('./settings');
var session=require('express-session');
//保存session
var MongoStore=require('connect-mongo')(session);


//设置app应用的路由架构，引入各个功能模块对应的导航模块
var index = require('./routes/index');
var users = require('./routes/users');
var articles = require('./routes/articles');


var app = express();

// view engine setup设置模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  //secret用来防止篡改cookie,对cookie加密
  secret:settings.cookieSecret,
  //key的值为cookie中保存的键值
  key:settings.db,
  //设定cookie的有效时间为30天
  cookie:{maxAge:1000*60*60*24*30},
  //重新保存
  resave:true,
  //是否保存未初始化状态
  saveUninitialized:true,
  store:new MongoStore({
    //设置他的store参数为MongoStore实例,把会话信息存储到数据库中，以避免重启服务器时会话丢失
    /*db:settings.db,
    host:settings.host,
    port:settings.port*/
    url:settings.url
  })
}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//解析post请求提交的数据
app.use(bodyParser.json());//解析json数据
app.use(bodyParser.urlencoded({ extended: false }));//解析普通数据，解析后的数据放到了req.body
//获取cookie
app.use(cookieParser());
//设置静态路由
app.use(express.static(path.join(__dirname, 'public')));

//路由映射，路由的设定应该遵循Restful设计原则
app.use('/', index);
app.use('/users', users);
app.use('/articles', articles);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
