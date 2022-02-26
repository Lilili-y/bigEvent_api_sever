// 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用

//导入数据库操作模块
const db = require('../db/index')
//导入密码加密模块
const bcrypt = require('bcryptjs')
//导入生成Token值的模块
const jwt = require('jsonwebtoken')
//导入全局配置文件
const config = require('../config')
// 注册用户的处理函数
exports.regUser = (req, res) => {
    //获取客户端提交的数据
    const userinfo = req.body
    //对提交表单的数据，进行合法性校验
    //此处使用验证规则第三方包来实现
    // if (!userinfo.username || !userinfo.password)
    //     // return res.send({status: 1,msg: '用户名或密码不能为空！'})
    //     return res.cc('用户名或密码不能为空！')
    //定义SQL查询语句，查询用户名是否被占用
    const sqlStr = 'select * from ev_users where username=?'  //符号？是占位符
    db.query(sqlStr, userinfo.username, (err, results) => {
        //执行SQL语句失败
        if (err) {
            // return res.send({ status: 1, message: err.message })
            return res.cc(err)

        }
        //用户名被占用
        if (results.length > 0) {
            // return res.send({ status: 1, message: '用户名已被占用，请更换其他用户名！' })
            return res.cc('用户名已被占用，请更换其他用户名！')
        }
        //用户密码加密
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)
        //插入新注册用户,set快速设置值
        const sql = 'insert into ev_users set ?'
        db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, results) => {
            //执行SQL语句失败
            if (err) {
                // return res.send({ status: 1, message: err.message })
                return res.cc(err)
            }
            //执行SQL语句成功，但影响行数不为1
            if (results.affectedRows !== 1) {
                // return res.send({ status: 1, message: '注册失败，请稍后再试！' })
                return res.cc('注册失败，请稍后再试！')
            }
            //注册成功
            // res.send({ status: 0, message: '注册成功！' })
            res.cc('注册成功！', 0)
        })
    })
}

// 登录的处理函数
exports.login = (req, res) => {
    //接受表单的数据
    const userinfo = req.body
    //定义查询SQL语句
    const sql = 'select * from ev_users where username=?'
    //执行SQL语句，根据用户名查询用户信息
    db.query(sql, userinfo.username, (err, results) => {
        //执行SQL语句错误
        if (err) return res.cc(err)
        //查询成功，但查询到的数据条数不等于1
        if (results.length !== 1) return res.cc('登录失败！')
        //判断密码是否正确
        // 拿着用户输入的密码,和数据库中存储的密码进行对比
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        // 如果对比的结果等于 false, 则证明用户输入的密码错误 
        if (!compareResult) {
            return res.cc('登录失败！')
        }
        // 在服务器端生成token的值，需要提前清空用户的密码和头像
        //使用剩余参数方法赋值，并且使用覆盖赋值的方式清空密码和头像
        const user = { ...results[0], password: '', user_pic: '' }
        //对用户信息进行加密，生成token字符串
        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: '10h' })
        //将token的值响应给客户端
        res.send({
            status: 0,
            message: '登录成功！',
            token: 'Bearer ' + tokenStr,
        })
    })

}