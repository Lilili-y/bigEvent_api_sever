//这是文章分类的路由模块

const express = require('express')
//创建路由对象
const router = express.Router()
//导入文章分类的路由函数处理模块
const artcate_handler = require('../router_handler/artcate')
//导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入文章分类的验证规则模块
const { add_cate_schema, delete_cate_schema, get_cate_schema, update_cate_schema } = require('../schema/artcate')

// 获取文章分类列表数据的路由
router.get('/cates', artcate_handler.getArticleCate)
//新增文章分类的路由
router.post('/addcates', expressJoi(add_cate_schema), artcate_handler.addArticleCates)
//根据id删除文章分类的路由
router.get('/deletecate/:id', expressJoi(delete_cate_schema), artcate_handler.deleteCateById)
//根据id获取文章分类数据的路由
router.get('/cates/:id', expressJoi(get_cate_schema), artcate_handler.getCateById)
//根据id更新文章分类的路由
router.post('/updatecate', expressJoi(update_cate_schema), artcate_handler.updateCateById)
//向外共享路由对象
module.exports = router