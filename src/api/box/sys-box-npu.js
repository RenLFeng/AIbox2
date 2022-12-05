import request from '@/utils/request'

// 查询SysBoxNpu列表
export function listSysBoxNpu(query) {
  return request({
    url: '/api/v1/sys-box-npu',
    method: 'get',
    params: query
  })
}

// 查询SysBoxNpu详细
export function getSysBoxNpu(npuId) {
  return request({
    url: '/api/v1/sys-box-npu/' + npuId,
    method: 'get'
  })
}

// 新增SysBoxNpu
export function addSysBoxNpu(data) {
  return request({
    url: '/api/v1/sys-box-npu',
    method: 'post',
    data: data
  })
}

// 修改SysBoxNpu
export function updateSysBoxNpu(data) {
  return request({
    url: '/api/v1/sys-box-npu/' + data.npuId,
    method: 'put',
    data: data
  })
}

// 删除SysBoxNpu
export function delSysBoxNpu(data) {
  return request({
    url: '/api/v1/sys-box-npu',
    method: 'delete',
    data: data
  })
}

export function setNpuConfig(data) {
  return request({
    url: '/api/v1/npu/setNpuConfig',
    method: 'post',
    data: data
  })
}

export function getNpuConfig(data) {
  return request({
    url: '/api/v1/npu/getNpuConfig/' + data,
    method: 'get'
  })
}

export function setLine(data) {
  return request({
    url: '/api/v1/ai/setLine',
    method: 'put',
    data: data
  })
}

