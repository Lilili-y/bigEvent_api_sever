//文章分类的函数处理模块

//导入数据库操作模块
const db = require('../db/index')
// 获取文章分类列表数据的处理函数
exports.getArticleCate = (req, res) => {
    // 根据分类的状态，获取所有未被删除的分类列表数据
    // is_delete 为 0 表示没有被 标记为删除 的数据
    const sql = `select * from ev_article_cate where is_delete=0 order by id asc`
    //执行SQL查询语句
    db.query(sql, (err, results) => {
        //执行SQL语句失败
        if (err) return res.cc(err)
        //执行SQL语句成功
        res.send({
            status: 0,
            message: '获取文章分类列表成功！',
            data: results,
        })
    })
}