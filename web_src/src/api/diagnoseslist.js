import request from '@/utils/request'

// 获取列表
export function diagnoses(params) {
  return request({
    url: '/v1/diagnoses',
    method: 'get',
    params
  })
}

// 获取列表
export function creatediagnoses(params) {
  return request({
    url: `/v1/diagnoses/${params.name}`,
    method: 'post',
    data: params
  })
}

// 获取列表
export function nodes() {
  return request({
    url: `/v1/nodes`,
    method: 'get'
  })
}
// 获取列表
export function namespaces() {
  return request({
    url: `/v1/namespaces`,
    method: 'get'
  })
}
// 获取列表
export function podsByNamespace(namespace) {
  return request({
    url: `/v1/namespaces/${namespace}/pods`,
    method: 'get'
  })
}
// 获取列表
export function checkName(params) {
  // kind目前为Diagnosis, Operation, OperationSet, Trigger
  return request({
    url: `/v1/checkName/${params.name}`,
    method: 'get'
  })
}
