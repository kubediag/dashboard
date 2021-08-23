import request from '@/utils/request'

// 资源数量
export function summary(params) {
  return request({
    url: '/v1/summary',
    method: 'get',
    params
  })
}
