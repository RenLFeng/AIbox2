import request from '@/utils/request'

// 查询SysAttendanceZone列表
export function listSysAttendanceZone(query) {
  return request({
    url: '/api/v1/sys-attendance-zone',
    method: 'get',
    params: query
  })
}

// 查询SysAttendanceZone详细
export function getSysAttendanceZone(zId) {
  return request({
    url: '/api/v1/sys-attendance-zone/' + zId,
    method: 'get'
  })
}

// 新增SysAttendanceZone
export function addSysAttendanceZone(data) {
  return request({
    url: '/api/v1/sys-attendance-zone',
    method: 'post',
    data: data
  })
}

// 新增SysAttendanceZone
export function batchAddSysAttendanceZone(data) {
  return request({
    url: '/api/v1/sys-attendance-zone/batchInsert',
    method: 'post',
    data: data
  })
}

// 修改SysAttendanceZone
export function updateSysAttendanceZone(data) {
  return request({
    url: '/api/v1/sys-attendance-zone/' + data.zId,
    method: 'put',
    data: data
  })
}

// 删除SysAttendanceZone
export function delSysAttendanceZone(data) {
  return request({
    url: '/api/v1/sys-attendance-zone',
    method: 'delete',
    data: data
  })
}

// 查询SysAttendanceZone详细
export function getAttendanceZoneTree(groupId) {
  return request({
    url: '/api/v1/attendanceZone/ledZoneTree/' + groupId,
    method: 'get'
  })
}

