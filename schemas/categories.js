

var mongoose = require('mongoose');

//学科表结构
var schema = new mongoose.Schema({
    //学科名称
    user: {
        //类型
        type: mongoose.Schema.Types.ObjectId,
        //引用
        ref: 'User'//  关联user表中的ID 字段
    },
    name:String
    
});

module.exports = schema;


