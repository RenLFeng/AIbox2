import request from "@/utils/request";

// 查询SysAttendance列表
export function listSysAttendance(query) {
  return request({
    url: "/api/v1/sys-attendance",
    method: "get",
    params: query
  });
}

// 查询SysAttendance详细
export function getSysAttendance(groupId) {
  return request({
    url: "/api/v1/sys-attendance/" + groupId,
    method: "get"
  });
}

// 查询SysAttendance详细
export function getSysAttendanceName(groupId) {
  return request({
    url: "/api/v1/sys-attendance/getName/" + groupId,
    method: "get"
  });
}

// 新增SysAttendance
export function addSysAttendance(data) {
  return request({
    url: "/api/v1/sys-attendance",
    method: "post",
    data: data
  });
}

// 修改SysAttendance
export function updateSysAttendance(data) {
  return request({
    url: "/api/v1/sys-attendance/" + data.groupId,
    method: "put",
    data: data
  });
}

// 删除SysAttendance
export function delSysAttendance(data) {
  return request({
    url: "/api/v1/sys-attendance",
    method: "delete",
    data: data
  });
}

// 修改SysAttendance
export function attendanceResetZero(data) {
  return request({
    url: "/api/v1/sys-attendance/resetZero/" + data,
    method: "put",
    data: data
  });
}
// 修改 人员计数  当前人数
export function attendancesetAmount(data, query) {
  return request({
    url: `/api/v1/sys-attendance/setAmount`,
    method: "put",
    params: query,
    data: data
  });
}
