//导入数据库操作模块
const db = require('../db/index')
//导入处理密码的模块
const bcryptjs = require('bcryptjs')
//获取用户基本信息的处理函数
module.exports.getUserinfo = (req, res) => {
    //定义SQL查询语句
    // 注意：为了防止用户的密码泄露，需要排除 password 字段
    const sql = `select id,username,nickname,email,user_pic from ev_users where id=?`
    //执行SQL查询语句
    // 注意：req 对象上的 user 属性，是 Token 解析成功，express-jwt 中间件帮我们挂载上去的
    db.query(sql, req.user.id, (err, results) => {
        //执行SQL语句失败
        if (err) return res.cc(err)
        //执行SQL语句成功，但查询到的数据条数不等于1
        if (results.length !== 1) return res.cc('获取用户信息失败！')
        //将用户信息响应给客户端
        res.send({
            status: 0,
            message: '获取用户信息成功！',
            data: results[0],
        })
    })
}
//更新用户基本信息的处理函数
module.exports.updataUserinfo = (req, res) => {
    //定义更新SQL语句
    const sql = `update ev_users set ? where id=?`
    // 执行SQL更新语句
    db.query(sql, [req.body, req.body.id], (err, results) => {
        //执行SQL语句失败
        if (err) return res.cc(err)
        //执行SQL语句成功，但影响行数不等于1
        if (results.affectedRows !== 1) return res.cc('更新用户基本信息失败！')
        //响应客户端
        res.cc('更新用户信息成功', 0)
    })
}
//重置密码的处理函数
module.exports.updatePwd = (req, res) => {
    //根据id查询用户信息的SQL语句
    const sql = `select * from ev_users where id= ?`
    //执行SQL语句查询用户是否存在
    db.query(sql, req.user.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('用户不存在！')
        //判断用户输入的原密码是否与数据库中的密码一致
        const compareResult = bcryptjs.compareSync(req.body.oldPwd, results[0].password)
        if (!compareResult) return res.cc('原密码错误！')
        //定义更新密码的SQL语句
        const sql = `update ev_users set password= ? where id = ?`
        //对新密码进行bcryptjs加密处理
        const newPwd = bcryptjs.hashSync(req.body.newPwd, 10)
        db.query(sql, [newPwd, results[0].id], (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('更新密码失败！')
            res.cc('更新密码成功！', 0)
        })
    })
}
//更新用户头像的处理函数
module.exports.updateAvatar = (req, res) => {
    //定义更新用户头像的SQL语句
    const sql = `update ev_users set user_pic=? where id=?`
    //执行SQL语句，更新对应头像
    db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
        //执行SQL语句失败
        if (err) return res.cc(err)
        //执行SQL语句成功，但是影响行数不等于1
        if (results.affectedRows !== 1) return res.cc('更新用户头像失败！')
        //更新用户头像成功
        res.cc('更新用户头像成功', 0)
    })
}