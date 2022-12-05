import request from '@/utils/request'

// 查询InfraFileConfig列表
export function listInfraFileConfig(query) {
  return request({
    url: '/api/v1/infra-file-config',
    method: 'get',
    params: query
  })
}

// 查询InfraFileConfig详细
export function getInfraFileConfig(id) {
  return request({
    url: '/api/v1/infra-file-config/' + id,
    method: 'get'
  })
}

// 新增InfraFileConfig
export function addInfraFileConfig(data) {
  return request({
    url: '/api/v1/infra-file-config',
    method: 'post',
    data: data
  })
}

// 修改InfraFileConfig
export function updateInfraFileConfig(data) {
  return request({
    url: '/api/v1/infra-file-config/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除InfraFileConfig
export function delInfraFileConfig(data) {
  return request({
    url: '/api/v1/infra-file-config',
    method: 'delete',
    data: data
  })
}

