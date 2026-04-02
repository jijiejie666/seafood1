import request from '@/utils/request'

export const categoryApi = {
  // 获取品类列表
  getList() {
    return request({
      url: '/api/category/list',
      method: 'get'
    })
  },
  // 新增
  add(data) {
    return request({
      url: '/api/category/add',
      method: 'post',
      data
    })
  },
  // 修改
  update(data) {
    return request({
      url: '/api/category/update',
      method: 'put',
      data
    })
  },
  // 删除
  deleteById(id) {
    return request({
      url: `/api/category/delete/${id}`,
      method: 'delete'
    })
  }
}