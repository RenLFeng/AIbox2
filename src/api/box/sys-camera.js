import request from '@/utils/request'

// 查询SysCamera列表
export function listSysCamera(query) {
  return request({
    url: '/api/v1/sys-camera',
    method: 'get',
    timeout: 20 * 1000,
    params: query
  })
}

// 查询SysCamera详细
export function getSysCamera(camId) {
  return request({
    url: '/api/v1/sys-camera/' + camId,
    method: 'get'
  })
}

// 查询SysCamera详细
export function getSysCameraRelateAi(camId) {
  return request({
    url: '/api/v1/sys-camera/getRelateAi/' + camId,
    method: 'get'
  })
}

// 新增SysCamera
export function addSysCamera(data) {
  return request({
    url: '/api/v1/sys-camera',
    method: 'post',
    data: data
  })
}

// 修改SysCamera
export function updateSysCamera(data) {
  return request({
    url: '/api/v1/sys-camera',
    method: 'put',
    data: data
  })
}

// 删除SysCamera
export function delSysCamera(data) {
  return request({
    url: '/api/v1/sys-camera',
    method: 'delete',
    data: data
  })
}

// 摄像头状态修改
export function changeCamEnable(e) {
  const data = {
    camId: e.camId,
    camEnable: e.camEnable
  }
  return request({
    url: '/api/v1/camera/camEnable',
    method: 'put',
    data: data
  })
}

// 摄像头状态修改
export function changeCamAlarmStatus(e) {
  const data = {
    camId: e.camId,
    camAlarmStatus: e.camAlarmStatus
  }
  return request({
    url: '/api/v1/camera/camAlarmStatus',
    method: 'put',
    data: data
  })
}

// 摄像头状态修改
export function changeCamAiStatus(e) {
  const data = {
    camId: e.camId,
    camAiStatus: e.camAiStatus
  }
  return request({
    url: '/api/v1/camera/camAiStatus',
    method: 'put',
    data: data
  })
}

// 查询SysCamera名称列表
export function getAllCameraName(query) {
  return request({
    url: '/api/v1/camera/getAllCameraName',
    method: 'get',
    params: query
  })
}

// 查询SysCamera名称列表
export function getAllCameraNameDict() {
  return request({
    url: '/api/v1/camera/getAllCameraNameDict',
    method: 'get'
  })
}

export function grabImage(camId, acId, aId) {
  return request({
    url: `/api/v1/camera/grabImage/${camId}/${acId}/${aId}`,
    method: 'get'
  })
}

// 定时任务
export function webImgPlayTicker(id) {
  return request({
    url: '/api/v1/camera/webImgPlayTicker/' + id,
    // url: '/api/v1/camera/webImgPlayTicker',
    method: 'get'
  })
}

// 修改SysCamera
export function updateRelateAi(data) {
  return request({
    url: '/api/v1/camera/updateRelateAi',
    method: 'put',
    data: data
  })
}

// 查询摄像头下拉树结构
export function treeselect() {
  return request({
    url: '/api/v1/camera/camTree',
    method: 'get'
  })
}

// 预览流添加
export function streamAdd(camId) {
  return request({
    url: '/api/v1/preview/stream/' + camId + '/add',
    method: 'get'
  })
}

// 预览流删除
export function streamDelete(camId) {
  return request({
    url: '/api/v1/preview/stream/' + camId + '/delete',
    method: 'get'
  })
}

// 预览
export function preview(data) {
  return request({
    url: '/api/v1/preview/stream/' + data.uuid + '/channel' + data.channel + '/webrtc',
    method: 'post',
    data: data
  })
}

