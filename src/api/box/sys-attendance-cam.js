import request from '@/utils/request'

// 查询SysAttendanceCam列表
export function listSysAttendanceCam(query) {
  return request({
    url: '/api/v1/sys-attendance-cam',
    method: 'get',
    params: query
  })
}

// 查询SysAttendanceCam详细
export function getSysAttendanceCam(cId) {
  return request({
    url: '/api/v1/sys-attendance-cam/' + cId,
    method: 'get'
  })
}

// 新增SysAttendanceCam
export function addSysAttendanceCam(data) {
  return request({
    url: '/api/v1/sys-attendance-cam',
    method: 'post',
    data: data
  })
}

// 修改SysAttendanceCam
export function updateSysAttendanceCam(data) {
  return request({
    url: '/api/v1/sys-attendance-cam/' + data.cId,
    method: 'put',
    data: data
  })
}

// 删除SysAttendanceCam
export function delSysAttendanceCam(data) {
  return request({
    url: '/api/v1/sys-attendance-cam',
    method: 'delete',
    data: data
  })
}

// 修改SysAttendanceCam
export function attendanceCamResetZero(data) {
  return request({
    url: '/api/v1/sys-attendance-cam/resetZero/' + data,
    method: 'put',
    data: data
  })
}
