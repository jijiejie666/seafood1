import request from '@/utils/request'

export const costApi = {
  // 分页获取成本核算列表
  getList(params) {
    return request({
      url: '/api/cost-accounting/list',
      method: 'get',
      params
    })
  },
  // 新增核算记录
  add(data) {
    return request({
      url: '/api/cost-accounting/add',
      method: 'post',
      data
    })
  },
  // 删除记录
  delete(id) {
    return request({
      url: `/api/cost-accounting/delete/${id}`,
      method: 'delete'
    })
  }
}