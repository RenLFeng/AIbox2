import request from '@/utils/request'

// 查询InfraFile列表
export function listInfraFile(query) {
  return request({
    url: '/api/v1/infra-file',
    method: 'get',
    params: query
  })
}

// 查询InfraFile详细
export function getInfraFile(id) {
  return request({
    url: '/api/v1/infra-file/' + id,
    method: 'get'
  })
}

// 新增InfraFile
export function addInfraFile(data) {
  return request({
    url: '/api/v1/infra-file',
    method: 'post',
    data: data
  })
}

// 修改InfraFile
export function updateInfraFile(data) {
  return request({
    url: '/api/v1/infra-file/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除InfraFile
export function delInfraFile(data) {
  return request({
    url: '/api/v1/infra-file',
    method: 'delete',
    data: data
  })
}

