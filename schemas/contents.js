
/*
 *资料的表结构
 *
 * */

var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    //关联字段  // 分类的ID
    category: {
        //类型
        type: mongoose.Schema.Types.ObjectId,
        //引用
        ref: 'Category'//  关联category表中的ID 字段
    },
    user: {
        //类型
        type: mongoose.Schema.Types.ObjectId,
        //引用
        ref: 'User'//  关联user表中的ID 字段
    },
    //所属学科
    title: String,
    //发布内容
    description: {type: String, default: ''},
    //详细资料
    content: {type: String, default: ''},
    //添加时间
    addTime: {type: Date, default: new Date()},

    //阅读数
    views: {type: Number, default: 0},

    // //评论
    // comments: {
    //     type: Array,
    //     default: []
    // }

});

module.exports = schema;