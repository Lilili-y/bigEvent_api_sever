const express = require('express')
//创建路由对象
const router = express.Router()
// 导入用户路由处理函数
const userHandler = require('../router_handler/user')
//导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
//导入需要的验证规则对象,{reg_login_schema}是解构赋值，不使用解构赋值导入的是一个exports对象
const {reg_login_schema}=require('../schema/user')
//用户注册
router.post('/reguser', expressJoi(reg_login_schema),userHandler.regUser)
// 登录
router.post('/login',expressJoi(reg_login_schema), userHandler.login)
module.exports = router