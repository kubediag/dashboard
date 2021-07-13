import request from '@/utils/request'

// 图表1
export function dashboardgraph(params) {
  return request({
    url: '/scrm/dashboard/graph',
    method: 'get',
    params
  })
}

// card数据
export function dashboardTable(params) {
  return request({
    url: '/scrm/dashboard/table',
    method: 'get',
    params
  })
}
