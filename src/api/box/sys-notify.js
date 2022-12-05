import request from '@/utils/request'

// 查询SysNotify列表
export function listSysNotify(query) {
  return request({
    url: '/api/v1/sys-notify',
    method: 'get',
    params: query
  })
}

// 查询SysNotify详细
export function getSysNotify(notifyId) {
  return request({
    url: '/api/v1/sys-notify/' + notifyId,
    method: 'get'
  })
}

// 新增SysNotify
export function addSysNotify(data) {
  return request({
    url: '/api/v1/sys-notify',
    method: 'post',
    data: data
  })
}

// 修改SysNotify
export function updateSysNotify(data) {
  return request({
    url: '/api/v1/sys-notify/' + data.notifyId,
    method: 'put',
    data: data
  })
}

// 删除SysNotify
export function delSysNotify(data) {
  return request({
    url: '/api/v1/sys-notify',
    method: 'delete',
    data: data
  })
}

// 查询SysNotify名称列表
export function getAllNotifyName(query) {
  return request({
    url: '/api/v1/notify/getAllNotifyName',
    method: 'get',
    params: query
  })
}
