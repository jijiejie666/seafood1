// src/api/seafood.js
import request from '@/utils/request'

export const seafoodApi = {
  /**
   * 获取海鲜列表 (对应后端 getList 方法)
   * @param {Object} params 包含 SeafoodDTO 对应字段的查询对象
   */
  getList(params) {
    return request({
      url: '/api/seafood/list',
      method: 'get',
      params // 包含 name, categoryId 等查询条件
    })
  },
  
  addSeafood(data) {
    return request({
      url: '/api/seafood/add',
      method: 'post',
      data // 后端使用 @RequestBody 接收，所以数据放在 data 属性中
    })
  },
  // 保存新增
  save(data) {
    return request({ url: '/api/seafood/add', method: 'post', data })
  },
  // 修改库存/海鲜信息 [核心]
  updateSeafood(data) {
    return request({ url: '/api/seafood/update', method: 'put', data })
  },
  // 删除海鲜 [核心]
  deleteById(id) {
    return request({ url: `/api/seafood/delete/${id}`, method: 'delete' })
  }



}