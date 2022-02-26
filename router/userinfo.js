//导入express
const express = require('express')
//创建路由实例对象
const router = express.Router()
//导入获取用户信息的处理函数模块
const userinfo_handler = require('../router_handler/userinfo')
//导入验证数据合法性的中间件
const expressJoi = require('@escook/express-joi')
//导入需要验证的规则对象，通过解构赋值只导入需要的
const { update_userinfo_schema, update_password_schema, update_avatar_schema } = require('../schema/user')
//获取用户基本信息
router.get('/userinfo', userinfo_handler.getUserinfo)
//更新用户的的基本信息
router.post('/userinfo', expressJoi(update_userinfo_schema), userinfo_handler.updataUserinfo)
//重置密码
router.post('/updatepwd', expressJoi(update_password_schema), userinfo_handler.updatePwd)
//更新用户头像
router.post('/update/avatar', expressJoi(update_avatar_schema), userinfo_handler.updateAvatar)
//向外共享路由对象
module.exports = router 