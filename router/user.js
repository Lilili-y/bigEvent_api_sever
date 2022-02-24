const express = require('express')
//创建路由对象
const router = express.Router()
// 导入用户路由处理函数
const userHandler = require('../router_handler/user')
//用户注册
router.post('/reguser', userHandler.regUser)
// 登录
router.post('/login', userHandler.login)
module.exports = router