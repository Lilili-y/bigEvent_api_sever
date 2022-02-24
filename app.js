const express = require('express')
const { urlencoded } = require('body-parser')
//创建express的服务器实例对象
const app = express()
//配置cors,解决跨域问题，将cors设置为全局中间件
const cors = require('cors')
app.use(cors())
// 配置解析application/x-www-form-urlencoded（键值对）格式的表单数据中间件
app.use(express.urlencoded({ extended: false }))
//导入并注册用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)
// 调用app.listen方法，设置端口并开启服务器
app.listen(3007, () => {
    console.log('服务器已开启,http://127.0.0.1:3007')
})