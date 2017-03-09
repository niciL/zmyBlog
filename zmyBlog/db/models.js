/**
 * Created by Administrator on 2017/3/7.
 */

//保存的是数据模型

var mongoose=require("mongoose");
var ObjectId=mongoose.Schema.Types.ObjectId;
module.exports={
    //设置User的数据模型
    User:{
        username:{type:String,required:true},
        password:{type:String,required:true},
        email:{type:String,required:true},
        avatar:String,
    },
    //设置文章的数据模型
    Article:{
        //用户 ObjectId类型，指向User表
        user:{type:ObjectId,ref:'User'},
        title:{type:String,required:true},
        content:String,
        //创建时间
        createTime:{type:Date,default:Date.now}
    }
}