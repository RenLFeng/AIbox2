import request from '@/utils/request'

// 查询SysBox列表
export function listSysBox(query) {
  return request({
    url: '/api/v1/sys-box',
    method: 'get',
    timeout: 20 * 1000,
    params: query
  })
}

// 查询SysBox列表
export function listSysBoxCam(query) {
  return request({
    url: '/api/v1/sys-box/getBoxCamPage',
    method: 'get',
    params: query
  })
}
// 查询SysBox详细
export function getSysBox(boxId) {
  return request({
    url: '/api/v1/sys-box/' + boxId,
    method: 'get'
  })
}

// 查询SysBox详细
export function getSysBoxName(boxId) {
  return request({
    url: '/api/v1/sys-box/getBoxName/' + boxId,
    method: 'get'
  })
}

// 新增SysBox
export function addSysBox(data) {
  return request({
    url: '/api/v1/sys-box',
    method: 'post',
    data: data
  })
}

// 修改SysBox
export function updateSysBox(data) {
  return request({
    url: '/api/v1/sys-box/' + data.boxId,
    method: 'put',
    data: data
  })
}

// 修改SysBox
export function updateSysBoxName(data) {
  return request({
    url: '/api/v1/sys-box/updateBoxName',
    method: 'put',
    data: data
  })
}

// 删除SysBox
export function delSysBox(data) {
  return request({
    url: '/api/v1/sys-box',
    method: 'delete',
    data: data
  })
}

// 根据IP扫描SysBox列表
export function listSysBoxByIP(query) {
  return request({
    url: '/api/v1/sysBoxByIPScan',
    method: 'get',
    timeout: 100 * 1000,
    params: query
  })
}

// 新增SysBox局域网扫描根据Sno
export function addSysBoxByIP(data) {
  const requestData = {
    data
  }
  return request({
    url: '/api/v1/box',
    method: 'post',
    data: requestData
  })
}

// 盒子状态修改
export function changeBoxStatus(boxId, boxStatue) {
  const data = {
    boxId,
    boxStatue
  }
  return request({
    url: '/api/v1/sys-box/' + data.boxId,
    method: 'put',
    data: data
  })
}

// 查询SysBox列表
export function getBoxStatueCount(query) {
  return request({
    url: '/api/v1/box/getBoxStatueCount',
    method: 'get',
    params: query
  })
}

// 查询SysBox名称列表
export function getAllBoxName(query) {
  return request({
    url: '/api/v1/box/getAllBoxName',
    method: 'get',
    params: query
  })
}

// 查询SysBox名称列表
export function getAllBoxNameDict() {
  return request({
    url: '/api/v1/box/getAllBoxNameDict',
    method: 'get'
  })
}

// 更新盒子激活注册状态
export function updateSysBoxesRegistry(data) {
  return request({
    url: '/api/v1/sys-box/sysBoxesRegistry',
    method: 'put',
    data: data
  })
}

// 更新盒子注销状态
export function updateSysBoxesCancel(data) {
  return request({
    url: '/api/v1/sys-box/sysBoxesCancel',
    method: 'put',
    data: data
  })
}

// 同步设备状态
export function UpdateSysBoxesState(data) {
  return request({
    url: '/api/v1/sys-box/sysBoxesState',
    method: 'put',
    data: data
  })
}

// 获取影子文件
export function getBoxShadow(boxIp) {
  return request({
    url: '/api/v1/box/getBoxShadowReq/' + boxIp,
    method: 'get'
  })
}

export function getBoxAiConfig(boxIp) {
  return request({
    url: '/api/v1/box/getBoxAiConfigReq/' + boxIp,
    method: 'get'
  })
}

export function getOutBoundIP(query) {
  return request({
    url: '/api/v1/getOutBoundIP',
    method: 'get',
    params: query
  })
}

// 查询SysBox详细
export function updateSysCameras(data) {
  return request({
    url: '/api/v1/sys-box/updateSysCameras/' + data.boxId,
    method: 'put',
    data: data
  })
}

export function updateSysAis(data) {
  return request({
    url: '/api/v1/sys-box/updateSysAis/' + data.boxId,
    method: 'put',
    data: data
  })
}

// 查询SysBox详细
export function getAllBoxRelateAi(deptId) {
  return request({
    url: '/api/v1/box/getAllBoxRelateAi/' + deptId,
    method: 'get'
  })
}

// 查询SysBox列表
export function syncAllBox() {
  return request({
    url: '/api/v1/sys-box/syncAllBox',
    method: 'post',
    timeout: 100 * 1000
  })
}

// 鉴权SysBox
export function authSysBox(data) {
  return request({
    url: '/api/v1/sys-box/auth',
    method: 'post',
    data: data
  })
}
