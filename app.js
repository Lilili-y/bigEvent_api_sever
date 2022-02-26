const express = require('express')
const { urlencoded } = require('body-parser')
//创建express的服务器实例对象
const app = express()
//导入用户验证模块
const joi = require('joi')
//配置cors,解决跨域问题，将cors设置为全局中间件
const cors = require('cors')
app.use(cors())
// 配置解析application/x-www-form-urlencoded（键值对）格式的表单数据中间件
app.use(express.urlencoded({ extended: false }))
//响应数据的中间件，在挂载路由之前res对象封装一个res.cc()函数
app.use((req, res, next) => {
    res.cc = function (err, status = 1) {
        //status默认值为1
        res.send({
            status,
            //描述状态，判断err是错误对象还是字符串
            message: err instanceof Error ? err.message : err,
        })
    }
    next()
})
//这里是解析token的中间件，必须配置在路由模块之前
//导入全局配置文件
const config = require('./config')
// 导入解析token的模块
const expressJWT = require('express-jwt')
app.use(expressJWT({
    secret: config.jwtSecretKey,
    algorithms: ['HS256']
}).unless({ path: [/^\/api/] }))
//导入并注册用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)
//导入并注册用户信息模块
const userinfoRouter = require('./router/userinfo')
app.use('/my', userinfoRouter)
//定义错误级别的中间件
app.use((err, req, res, next) => {
    //表单数据验证导致的错误
    if (err instanceof joi.ValidationError) return res.cc(err)
    //解析token后抛出的错误
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
    //未知的错误
    res.cc(err)
})
// 调用app.listen方法，设置端口并开启服务器
app.listen(3007, () => {
    console.log('服务器已开启,http://127.0.0.1:3007')
})