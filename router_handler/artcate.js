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
//新增文章分类的处理函数
exports.addArticleCates = (req, res) => {
    // 定义查询 分类名称 与 分类别名 是否被占用的 SQL 语句
    const sql = `select * from ev_article_cate where name=? or alias =?`
    // 执行查询的SQL语句
    db.query(sql, [req.body.name, req.body.alias], (err, results) => {
        //执行查询的SQL语句失败
        if (err) return res.cc(err)
        //执行查询的SQL语句成功，但是名称或者别名都被占用
        if (results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！')
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('分类名称与别名被占用，请更换后重试！')
        //分类名称被占用
        if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
        //分类别名被占用
        if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')
        // 定义新增文章分类的SQL语句
        const sql = 'insert into ev_article_cate set ?'
        //执行新增文章分类的SQL语句
        db.query(sql, req.body, (err, results) => {
            //执行SQL语句失败
            if (err) return res.cc(err.message)
            //执行SQL语句成功，但影响行数不等于1
            if (results.affectedRows !== 1) return res.cc('新增文章分类失败！')
            //添加成功
            res.cc('新增文章分类成功！', 0)
        })
    })
}
//根据id删除文章分类的处理函数
exports.deleteCateById = (req, res) => {
    //定义标记删除的SQL语句，并没有真的删除，将删除状态改成1
    const sql = `update ev_article_cate set is_delete =1 where id=?`
    //执行标记删除的SQl语句
    db.query(sql, req.params.id, (err, results) => {
        //执行SQL语句失败
        if (err) return res.cc(err)
        //执行SQL语句成功，但影响行数不等于1
        if (results.affectedRows !== 1) return res.cc('删除文章分类失败！')
        res.cc('删除文章分类成功！', 0)
    })
}
//根据id获取文章分类数据的处理函数
exports.getCateById = (req, res) => {
    //定义根据 Id 获取文章分类的SQL语句
    const sql = `select * from ev_article_cate where id=?`
    // 执行SQL语句
    db.query(sql, req.params.id, (err, results) => {
        //执行SQL语句失败
        if (err) return res.cc(err)
        //执行SQL语句成功，但得到的数据条数不等于1
        if (results.length !== 1) return res.cc('获取文章分类数据失败！')
        //获取成功
        res.send({
            status: 0,
            message: '获取文章分类数据成功',
            data: results[0],
        })
    })
}
//根据更新文章分类数据的处理函数
exports.updateCateById = (req, res) => {
    // 定义查询分类名称与分类别名是否被占用的SQL语句
    const sql = `select * from ev_article_cate where id<>? and(name=?or alias=?)`
    // 执行SQL语句
    db.query(sql, [req.body.Id, req.body.name, req.body.alias], (err, results) => {
        //执行SQL语句失败   
        if (err) return res.cc(err)
        //分类名称和分类别名都被占用
        if (results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！')
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('分类名称与别名被占用，请更换后重试！')
        //分类名称或分类别名被占用
        if (results.length=== 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
        if (results.length=== 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')
        // 定义更新文章分类的SQL语句
        const sql = `update ev_article_cate set ? where Id=?`
        // 执行SQL语句
        db.query(sql, [req.body, req.body.Id], (err, results) => {
            //执行SQL语句失败
            if (err) return res.cc(err)
            //执行SQL语句成功，但影响行数不等于1
            if (results.affectedRows !== 1) return res.cc('更新文章分类失败！')
            //更新文章分类成功
            res.cc('更新文章分类成功！', 0)
        })

    })
}