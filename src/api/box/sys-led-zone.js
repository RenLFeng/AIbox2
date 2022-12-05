import request from '@/utils/request'

// 查询SysLedZone列表
export function listSysLedZone(query) {
  return request({
    url: '/api/v1/sys-led-zone',
    method: 'get',
    params: query
  })
}

// 查询SysLedZone详细
export function getSysLedZone(id) {
  return request({
    url: '/api/v1/sys-led-zone/' + id,
    method: 'get'
  })
}

// 新增SysLedZone
export function addSysLedZone(data) {
  return request({
    url: '/api/v1/sys-led-zone',
    method: 'post',
    data: data
  })
}

// 修改SysLedZone
export function updateSysLedZone(data) {
  return request({
    url: '/api/v1/sys-led-zone/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除SysLedZone
export function delSysLedZone(data) {
  return request({
    url: '/api/v1/sys-led-zone',
    method: 'delete',
    data: data
  })
}

// testLed
export function testLed(data) {
  return request({
    url: '/api/v1/sys-led-zone/testLed',
    method: 'post',
    data: data
  })
}

