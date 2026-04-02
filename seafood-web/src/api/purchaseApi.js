import request from '@/utils/request'

export const purchaseApi = {
  /**
   * 获取采购订单列表
   * 对应后端：GET /api/purchase/list
   */
  getList(params) {
    return request({
      url: '/api/purchase/list',
      method: 'get',
      params // 预留分页或搜索参数
    })
  },

  /**
   * 新增采购入库登记
   * 对应后端：POST /api/purchase/add
   * 数据包含：seafoodId, quantity, totalAmount, orderStatus, planId
   */
  add(data) {
    return request({
      url: '/api/purchase/add',
      method: 'post',
      data
    })
  },

  /**
   * 修改采购订单
   * 对应后端：PUT /api/purchase/update
   */
  update(data) {
    return request({
      url: '/api/purchase/update',
      method: 'put',
      data
    })
  },

  /**
   * 删除/撤销采购记录
   * 对应后端：DELETE /api/purchase/delete/{id}
   */
  delete(id) {
    return request({
      url: `/api/purchase/delete/${id}`,
      method: 'delete'
    })
  }
}