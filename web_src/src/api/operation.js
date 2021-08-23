import request from '@/utils/request'

export function entityList(params) {
  return request({
    url: '/scrm/customer-base/list',
    method: 'POST',
    data: params
  })
}

// 获取列表
export function operations(params) {
  return request({
    url: '/v1/operations',
    method: 'get',
    params
  })
}
