import request from '@/utils/request'

export const stockApi = {
  /**
   * 分页获取出库记录
   */
  getStockOutList(params) {
    return request({
      url: '/api/stock/out/list',
      method: 'get',
      params
    })
  }
}