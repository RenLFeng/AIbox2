import request from '@/utils/request'

// 查询SysUpgrade列表
export function listSysUpgrade(query) {
  return request({
    url: '/api/v1/sys-upgrade',
    method: 'get',
    params: query
  })
}

// 查询SysUpgrade详细
export function getSysUpgrade(upgradeId) {
  return request({
    url: '/api/v1/sys-upgrade/' + upgradeId,
    method: 'get'
  })
}

// 新增SysUpgrade
export function addSysUpgrade(data) {
  return request({
    url: '/api/v1/sys-upgrade',
    method: 'post',
    data: data
  })
}

// 修改SysUpgrade
export function updateSysUpgrade(data) {
  return request({
    url: '/api/v1/sys-upgrade/' + data.upgradeId,
    method: 'put',
    data: data
  })
}

// 删除SysUpgrade
export function delSysUpgrade(data) {
  return request({
    url: '/api/v1/sys-upgrade',
    method: 'delete',
    data: data
  })
}

// 查询SysUpgrade名称列表
export function getAllUpgradeName(query) {
  return request({
    url: '/api/v1/upgrade/getAllUpgradeName',
    method: 'get',
    params: query
  })
}
