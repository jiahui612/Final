

var mongoose = require('mongoose');

//分类表结构
var schema = new mongoose.Schema({
    //分类名称
    user: {
        //类型
        type: mongoose.Schema.Types.ObjectId,
        //引用
        ref: 'User'//  关联user表中的ID 字段
    },
    name:String
    
});

module.exports = schema;


/*
 此处也可以直接
 module.exports = mongoose.model('User',userSchema);
 */