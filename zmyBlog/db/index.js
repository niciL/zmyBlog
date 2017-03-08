/**
 * Created by Administrator on 2017/3/7.
 */
var mongoose=require("mongoose");
var Schema=mongoose.Schema;
var models=require('./models');
var settings=require('../settings');

mongoose.connect(settings.url);
mongoose.model('User',new Schema(models.User));
mongoose.model('Article',new Schema(models.Article));
//提供一个根据名称获取数据模型的方法
//全局
global.Model=function(type){
    return mongoose.model(type);
}