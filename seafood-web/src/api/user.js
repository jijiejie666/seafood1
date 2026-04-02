import request from '@/utils/request'

export const userApi = {
  // 获取员工列表（支持分页和姓名搜索）
  getList(params) {
    return request({ url: '/api/user/list', method: 'get', params })
  },
  // 新增员工
  add(data) {
    return request({ url: '/api/user/add', method: 'post', data })
  },
  // 修改员工信息
  update(data) {
    return request({ url: '/api/user/update', method: 'put', data })
  },
  // 删除员工
  delete(id) {
    return request({ url: `/api/user/delete/${id}`, method: 'delete' })
  },
  // 重置密码
  resetPassword(id) {
    return request({ url: `/api/user/resetPwd/${id}`, method: 'put' })
  }
}