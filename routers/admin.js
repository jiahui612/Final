

/*
 *   admin 模块//管理模块
 *   /                            首页
 *   ##用户管理
 *   /user                        用户列表
 *   ##分类管理
 *   /category                    学科列表
 *   /category/add                学科添加
 *   /category/edit               学科修改
 *   /category/delete             学科删除
 *   ##文章内容管理
 *   /article                     资料列表
 *   /article/add                 资料添加
 *   /article/edit                资料编辑
 *   /article/delete              资料删除

 */

var express = require('express');
var routerAdmin = express.Router();

var User = require('../models/User');//用户模型
var Category = require('../models/Category');//学科模型
var Content = require('../models/Content');//资料模型
//
routerAdmin.use(function (req, res, next) {
    //对进入用户身份进行验证
    if (!req.userInfo.isAdmin) {
        res.send('你不是管理员，不能访问后台管理！');
        return;
    }
    next();
});

//管理首页
routerAdmin.get('/', function (req, res, next) {
    // res.send('后台管理首页');
    res.render('admin/adminIndex', {
        userInfo: req.userInfo
    });
});

// //用户管理
// routerAdmin.get('/user', function (req, res, next) {
//     // 从数据库中读取所有用户数据
//     /*
//      *   sort() 可对字段指定排序 传值 -1降序 1 升序
//      *   对数据进行分页
//      *   limit(number) 限制从数据库中取出条数
//      *   skip(number) 忽略数据的条数
//      *
//      *   eg:每页显示2条
//      *   第一页：1-2 skip 0  -> 当前页 -1 * limit
//      *   第二页：3-4 skip 2 ->
//      *   ...
//      *
//      * */
//     // var page = 1;
//     // console.log(req.query.page);
//     var reqPage = Number((req.query.page) === undefined ? 0 : req.query.page);
//     // console.log(reqPage);
//     var page = reqPage <= 0 ? 1 : reqPage;
//     var limit = 2;
//     var pages = 0;
//     var skip = (page - 1) * limit;
//     //
//     User.count().then(function (count) {
//         // console.log(count);
//         //总页数
//         pages = Math.ceil(count / limit);
//         //
//         User.find().sort({_id: -1}).limit(limit).skip(skip).then(function (users) {
//             // console.log(users);
//             res.render('admin/user_index', {
//                 userInfo: req.userInfo,
//                 users: users,
//                 count: count,
//                 limit: limit,
//                 pages: pages,
//                 page: page
//             });
//         });
//     });

// });
// *学科首页
routerAdmin.get('/category', function (req, res, next) {
    // 从数据库中读取所有学科数据
    var reqPage = Number((req.query.page) === undefined ? 0 : req.query.page);
    var page = reqPage <= 0 ? 1 : reqPage;
    var limit = 2;
    var pages = 0;
    var skip = (page - 1) * limit;
    //
    Category.count().then(function (count) {
        // console.log(count);
        //总页数
        pages = Math.ceil(count / limit);
        //
        Category.find().sort({_id: -1}).limit(limit).skip(skip).then(function (categories) {
            // console.log('学科首页回显数据  ' + categories);
            res.render('admin/category_index', {
                userInfo: req.userInfo,
                categories: categories,
                count: count,
                limit: limit,
                pages: pages,
                page: page
            });
        });
    });


});
//学科添加页面
routerAdmin.get('/category/add', function (req, res, next) {
    res.render('admin/category_add', {
        userInfo: req.userInfo
    });
});
//学科添加数据上传
routerAdmin.post('/category/add', function (req, res, next) {
    // console.log(req.body);
    var name = req.body.name || '';
    if (name === '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '名称不能为空',
            url: ''
        });
    }
    else {
        //名称部位空//验证数据库只能怪是否存在
        Category.findOne({
            name: name
        }).then(function (resData) {
            if (resData) {
                //数据库中已经存在
                res.render('admin/error', {
                    userInfo: req.userInfo,
                    message: '分类已经存在'
                });
            }
            else {
                //不存在则写入数据
                return new Category({
                    name: name
                }).save();
            }
        }).then(function (newCategory) {
            //返回新的分类数据
            res.render('admin/success', {
                userInfo: req.userInfo,
                message: '学科保存成功',
                url: '/admin/category',
                categories: newCategory
            });
        });
    }

});
//学科编辑
routerAdmin.get('/category/edit', function (req, res) {
    //获取要修改的数据//以表单形式展现出来
    var id = req.query.id || '';
    Category.findOne({
        _id: id
    }).then(function (category) {
        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '学科信息不存在'
            });
            // Promise.reject(reason)方法返回一个用reason拒绝的Promise
            return Pramise.reject();
        }
        else {
            res.render('admin/category_edit', {
                userInfo: req.userInfo,
                category: category
            });
        }
    });

});
//学科修改 保存
routerAdmin.post('/category/edit', function (req, res) {
    //获取要修改的学科信息
    var id = req.query.id || '';
    //获取Post提交过来的 修改的名称
    var newName = req.body.name || '';

    //判断数据库是否已有
    Category.findOne({
        _id: id
    }).then(function (category) {
        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '学科信息不存在'
            });
            return Pramise.reject();
        }
        else {
            
            if (newName === category.name) {
                res.render('admin/error', {
                    userInfo: req.userInfo,
                    message: '修改成功',
                    url: '/admin/category'
                });
            }
            else {
                //要修改的学科名称是否在数据库中已存在
                return Category.findOne({
                    _id: {$ne: id},
                    name: newName
                });
            }

        }
    }).then(function (sameCategory) {
        if (sameCategory) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '数据库中已经存在同名分类',
            });
            return Pramise.reject();
        }
        else {
            return Category.update({
                    //条件-当前ID
                    _id: id
                }, {
                    //修改的内容- 更新的名称
                    name: newName
                }
            );
        }
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '修改成功',
            url: '/admin/category'
        });
    });


});
//学科删除
routerAdmin.get('/category/delete', function (req, res) {
    //获取要删除的学科ID
    var id = req.query.id || '';
    Category.remove({
        _id: id
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/category'
        })
    });
});
//资料管理首页
routerAdmin.get('/content', function (req, res, next) {
    // res.render('admin/content_index',{});
    // 从数据库中读取所有学科数据
    var reqPage = Number((req.query.page) === undefined ? 0 : req.query.page);
    var page = reqPage <= 0 ? 1 : reqPage;
    var limit = 2;
    var pages = 0;
    var skip = (page - 1) * limit;
    //
    Content.count().then(function (count) {
        // console.log(count);
        //总页数
        pages = Math.ceil(count / limit);
        //
        Content.find().sort({addTime: -1}).limit(limit).skip(skip).populate('category').then(function (contents) {
            // console.log('学科首页回显数据' + contents);
            res.render('admin/content_index', {
                userInfo: req.userInfo,
                contents: contents,
                count: count,
                limit: limit,
                pages: pages,
                page: page
            });
        });
    });
});
//资料添加
routerAdmin.get('/content/add', function (req, res, next) {
    //资料添加//下拉选择学科//从数据库取出学科数据
    Category.find().sort({_id: -1}).then(function (categories) {
        res.render('admin/content_add', {
            userInfo: req.userInfo,
            categories: categories
        });
    });
});

//资料添加 数据上传
routerAdmin.post('/content/add', function (req, res, next) {
    //
    var postData = req.body;
    // console.log('添加内容传入的数据' + postData.category);
    // console.dir(postData.category);
    //字段检测等可放前端检测
    //前端检测 可对输入框等 进行响应交互等处理
    if (postData.category === '' || postData.title === '' || postData.content === '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '有未填写的信息'
        });
        return;
    }
    else {
        //数据写入到数据库
        var newContent = new Content({
            category: postData.category,
            user: req.userInfo._id.toString(),
            title: postData.title,
            description: postData.description,
            content: postData.content
        });
        // console.log(newContent);
        newContent.save().then(function (rs) {
            res.render('admin/success', {
                userInfo: req.userInfo,
                message: '保存成功',
                url: '/admin/content'
            });
        });
    }
});


//修改资料
routerAdmin.get('/content/edit', function (req, res, next) {
    //
    var id = req.query.id || '';
    var resCategories = {};
    Category.find().sort({_id: -1}).then(function (categories) {
        resCategories = categories;
        return Content.findOne({
            _id: id
        }).populate('category').then(function (content) {
            if (!content) {
                res.render('admin/error', {
                    userInfo: req.userInfo,
                    message: '资料信息不存在'
                });
                // Promise.reject(reason)方法返回一个用reason拒绝的Promise
                return Pramise.reject();
            }
            else {
                res.render('admin/content_edit', {
                    userInfo: req.userInfo,
                    categories: resCategories,
                    content: content
                });
            }
        });
    });

});

//保存修改资料
routerAdmin.post('/content/edit', function (req, res, next) {
    //
    var id = req.query.id || '';
    var postData = req.body;
    // console.log('添加内容传入的数据' + postData.category);
    //字段检测等可放前端检测
    //前端检测 可对输入框等 进行响应交互等处理
    if (postData.category === '' || postData.title === '' || postData.content === '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '有未填写的信息'
        });
        return;
    }
    else {
        //保存数据到数据库
        Content.update({
            //条件
            _id: id
        }, {
            //更新的数据字段
            category: postData.category,
            title: postData.title,
            description: postData.description,
            content: postData.content
        }).then(function () {
            res.render('admin/success', {
                userInfo: req.userInfo,
                message: '修改成功',
                //保存成功可跳转到指定Url页面 eg:内容展示详情页面
                // url: '/admin/content/edit?id=' + id
                url: '/admin/content'
            });
        });
    }

});
//资料删除
routerAdmin.get('/content/delete', function (req, res, next) {
    var id = req.query.id || '';
    Content.remove({
        //删除的条件
        _id: id
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/content'
        });
    });
});


//退出
routerAdmin.get('/logout', function (req, res) {
    req.cookies.set('userInfo', null);
    res.render('main/mainIndex', {});
});

module.exports = routerAdmin;




