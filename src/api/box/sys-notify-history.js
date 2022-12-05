import request from '@/utils/request'

// 查询SysNotifyHistory列表
export function listSysNotifyHistory(query) {
  return request({
    url: '/api/v1/sys-notify-history',
    method: 'get',
    params: query
  })
}

// 查询SysNotifyHistory详细
export function getSysNotifyHistory(historyId) {
  return request({
    url: '/api/v1/sys-notify-history/' + historyId,
    method: 'get'
  })
}

// 新增SysNotifyHistory
export function addSysNotifyHistory(data) {
  return request({
    url: '/api/v1/sys-notify-history',
    method: 'post',
    data: data
  })
}

// 修改SysNotifyHistory
export function updateSysNotifyHistory(data) {
  return request({
    url: '/api/v1/sys-notify-history/' + data.historyId,
    method: 'put',
    data: data
  })
}

// 删除SysNotifyHistory
export function delSysNotifyHistory(data) {
  return request({
    url: '/api/v1/sys-notify-history',
    method: 'delete',
    data: data
  })
}

