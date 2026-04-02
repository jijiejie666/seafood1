import request from '@/utils/request'

export const damageApi = {
  // 获取报损列表
  getList() {
    return request({
      url: '/api/damage/list',
      method: 'get'
    })
  },
  // 提交报损
  add(data) {
    return request({
      url: '/api/damage/add',
      method: 'post',
      data
    })
  }
}