import request from '@/utils/request'

// 获取列表
export function triggers(params) {
  return request({
    url: '/v1/triggers',
    method: 'get',
    params
  })
}

// 获取列表
export function createtrigger(params) {
  return request({
    url: `/v1/triggers/${params.name}`,
    method: 'post',
    data: params
  })
}
