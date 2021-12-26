var mongoose = require('mongoose');
var userSchema = require('../schemas/users');

/*
*   User用户与管理员模型
*
**/

module.exports = mongoose.model('User',userSchema);