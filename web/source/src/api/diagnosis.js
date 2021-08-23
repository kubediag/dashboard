import request from '@/utils/request'

export function operationSets(params) {
  return request({
    url: '/v1/operationSets',
    method: 'POST',
    data: params
  })
}

// 获取列表
// export function operations(params) {
//   return request({
//     url: '/v1/operations',
//     method: 'get',
//     params
//   })
// }
