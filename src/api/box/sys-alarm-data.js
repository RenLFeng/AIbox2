import request from '@/utils/request'

// 查询SysAlarmData列表
export function listSysAlarmData(query) {
  return request({
    url: '/api/v1/sys-alarm-data',
    method: 'get',
    params: query
  })
}

// 查询SysAlarmData详细
export function getSysAlarmData(alarmId) {
  return request({
    url: '/api/v1/sys-alarm-data/' + alarmId,
    method: 'get'
  })
}

// 新增SysAlarmData
export function addSysAlarmData(data) {
  return request({
    url: '/api/v1/sys-alarm-data',
    method: 'post',
    data: data
  })
}

// 修改SysAlarmData
export function updateSysAlarmData(data) {
  return request({
    url: '/api/v1/sys-alarm-data/' + data.alarmId,
    method: 'put',
    data: data
  })
}

// 修改SysAlarmData
export function UpdateAlarmDataConfirm(data) {
  return request({
    url: '/api/v1/sys-alarm-data/updateAlarmDataConfirm/' + data.alarmId,
    method: 'put',
    data: data
  })
}

// 删除SysAlarmData
export function delSysAlarmData(data) {
  return request({
    url: '/api/v1/sys-alarm-data',
    method: 'delete',
    data: data
  })
}

// 新增SysAlarmData
export function getGroupByAi() {
  return request({
    url: '/api/v1/alarmData/getGroupByAi',
    method: 'get'
  })
}

// 新增SysAlarmData
export function getGroupByCam() {
  return request({
    url: '/api/v1/alarmData/getGroupByCam',
    method: 'get'
  })
}

// 新增SysAlarmData
export function getGroupByCamOrder() {
  return request({
    url: '/api/v1/alarmData/getGroupByCamOrder',
    method: 'get'
  })
}

// 推送SysAlarmData
export function pushSysAlarmData(alarmId) {
  return request({
    url: '/api/v1/sys-alarm-data/alarmPush/' + alarmId,
    method: 'put'
  })
}
