import request from '@/utils/request'

export function entityList(params) {
  return request({
    url: '/scrm/customer-base/list',
    method: 'POST',
    data:params
  })
}

// 获取详情
export function customerDetail(params) {
  return request({
    url: '/scrm/customer-base/detail',
    method: 'get',
    params
  })
}