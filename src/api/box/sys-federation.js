import request from '@/utils/request'

// 查询SysFederation列表
export function listSysFederation(query) {
  return request({
    url: '/api/v1/sys-federation',
    method: 'get',
    params: query
  })
}

// 查询SysFederation详细
export function getSysFederation(fedId) {
  return request({
    url: '/api/v1/sys-federation/' + fedId,
    method: 'get'
  })
}

// 新增SysFederation
export function joinSysFederation(data) {
  return request({
    url: '/api/v1/sys-federation/join',
    method: 'post',
    data: data
  })
}

// 新增SysFederation
export function addSysFederation(data) {
  return request({
    url: '/api/v1/sys-federation',
    method: 'post',
    data: data
  })
}

// 修改SysFederation
export function updateSysFederation(data) {
  return request({
    url: '/api/v1/sys-federation/' + data.fedId,
    method: 'put',
    timeout: 10 * 1000,
    data: data
  })
}

// 删除SysFederation
export function delSysFederation(data) {
  return request({
    url: '/api/v1/sys-federation',
    method: 'delete',
    data: data
  })
}

