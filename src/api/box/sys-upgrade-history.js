import request from '@/utils/request'

// 查询SysUpgradeHistory列表
export function listSysUpgradeHistory(query) {
  return request({
    url: '/api/v1/sys-upgrade-history',
    method: 'get',
    params: query
  })
}

// 查询SysUpgradeHistory详细
export function getSysUpgradeHistory(historyId) {
  return request({
    url: '/api/v1/sys-upgrade-history/' + historyId,
    method: 'get'
  })
}

// 新增SysUpgradeHistory
export function addSysUpgradeHistory(data) {
  return request({
    url: '/api/v1/',
    method: 'post',
    data: data
  })
}

// 修改SysUpgradeHistory
export function updateSysUpgradeHistory(data) {
  return request({
    url: '/api/v1/sys-upgrade-history/' + data.historyId,
    method: 'put',
    data: data
  })
}

// 删除SysUpgradeHistory
export function delSysUpgradeHistory(data) {
  return request({
    url: '/api/v1/sys-upgrade-history',
    method: 'delete',
    data: data
  })
}

export function getBoxStatueCount(query) {
  return request({
    url: '/api/v1/upgradeHistory/getBoxStatueCount',
    method: 'get',
    params: query
  })
}

export function insertTask(data) {
  return request({
    url: '/api/v1/upgradeHistory/insertTask',
    method: 'post',
    data: data
  })
}

