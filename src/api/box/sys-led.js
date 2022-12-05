import request from '@/utils/request'

// 查询SysLed列表
export function listSysLed(query) {
  return request({
    url: '/api/v1/sys-led',
    method: 'get',
    params: query
  })
}

// 查询SysLed详细
export function getSysLed(ledId) {
  return request({
    url: '/api/v1/sys-led/' + ledId,
    method: 'get'
  })
}

// 查询SysLed详细
export function getSysLedRelation(ledId) {
  return request({
    url: '/api/v1/sys-led/getRelation/' + ledId,
    method: 'get'
  })
}

// 新增SysLed
export function addSysLed(data) {
  return request({
    url: '/api/v1/sys-led',
    method: 'post',
    data: data
  })
}

// 修改SysLed
export function updateSysLed(data) {
  return request({
    url: '/api/v1/sys-led/' + data.ledId,
    method: 'put',
    data: data
  })
}

// 删除SysLed
export function delSysLed(data) {
  return request({
    url: '/api/v1/sys-led',
    method: 'delete',
    data: data
  })
}

// 修改SysBox
export function updateSysLedName(data) {
  return request({
    url: '/api/v1/sys-led/updateLedName/' + data.ledId,
    method: 'put',
    data: data
  })
}

// 修改SysBox
export function getLedZoneTree() {
  return request({
    url: '/api/v1/led/ledZoneTree',
    method: 'get'
  })
}
