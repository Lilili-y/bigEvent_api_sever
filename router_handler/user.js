// 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用

//导入数据库操作模块
const { send } = require('process')
const db = require('../db/index')
//导入密码加密模块
const bcrypt = require('bcryptjs'
// 注册用户的处理函数
exports.regUser = (req, res) => {
        //获取客户端提交的数据
        const userinfo = req.body
        //对提交表单的数据，进行合法性校验
        if (!userinfo.username || !userinfo.password)
            return res.send({
                status: 1,
                msg: '用户名或密码不能为空！'
            })
        //定义SQL查询语句，查询用户名是否被占用
        const sqlStr = 'select * from ev_users where username=?'  //符号？是占位符
        db.query(sqlStr, userinfo.username, (err, results) => {
            //执行SQL语句失败
            if (err) {
                return res.send({ status: 1, message: err.message })
            }
            //用户名被占用
            if (results.length > 0) {
                return res.send({ status: 1, message: '用户名已被占用，请更换其他用户名！' })
            }
            userinfo.password = bcrypt.hashSync(userinfo.password, 10)
        })
    }

// 登录的处理函数
exports.login = (req, res) => {
        res.send('登录接口 OK')
    }