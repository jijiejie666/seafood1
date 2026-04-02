import request from '@/utils/request'

export const purchaseApi = {
  getList() {
    return request({ url: '/api/purchase/list', method: 'get' })
  },
  add(data) {
    return request({ url: '/api/purchase/add', method: 'post', data })
  }
}