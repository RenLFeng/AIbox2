import request from '@/utils/request'

// 查询SysFirmware列表
export function listSysFirmware(query) {
  return request({
    url: '/api/v1/sys-firmware',
    method: 'get',
    params: query
  })
}

// 查询SysFirmware详细
export function getSysFirmware(firmId) {
  return request({
    url: '/api/v1/sys-firmware/' + firmId,
    method: 'get'
  })
}

// 新增SysFirmware
export function addSysFirmware(data) {
  return request({
    url: '/api/v1/sys-firmware',
    method: 'post',
    data: data
  })
}

// 修改SysFirmware
export function updateSysFirmware(data) {
  return request({
    url: '/api/v1/sys-firmware/' + data.firmId,
    method: 'put',
    data: data
  })
}

// 删除SysFirmware
export function delSysFirmware(data) {
  return request({
    url: '/api/v1/sys-firmware',
    method: 'delete',
    data: data
  })
}

// 查询SysFirmware名称列表
export function getAllFirmwareName(query) {
  return request({
    url: '/api/v1/firmware/getAllFirmwareName',
    method: 'get',
    params: query
  })
}

// 固件状态修改
export function changeFirmwareStatus(e) {
  const data = {
    firmId: e.firmId,
    upgradeStatus: e.upgradeStatus
  }
  return request({
    url: '/api/v1/firmware/status',
    method: 'put',
    data: data
  })
}
