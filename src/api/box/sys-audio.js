import request from '@/utils/request'

// 获取音响列表信息
export function listSysAudioLatest(query) {
  return request({
    url: '/api/v1/sys-audio/getLatestPage',
    method: 'get',
    params: query
  })
}

// 获取音响列表信息
export function listSysAudio(query) {
  return request({
    url: '/api/v1/sys-audio',
    method: 'get',
    params: query
  })
}

// 获取音响列表信息
export function listRelateCamAudio(query) {
  return request({
    url: '/api/v1/sys-audio/getRelateCamAudio',
    method: 'get',
    params: query
  })
}

// 查询SysAudio详细
export function getSysAudio(audioId) {
  return request({
    url: '/api/v1/sys-audio/' + audioId,
    method: 'get'
  })
}

// 添加设备
export function addSysAudio(data) {
  return request({
    url: '/api/v1/sys-audio',
    method: 'post',
    data: data
  })
}

// 修改设备
export function updateSysAudio(data) {
  return request({
    url: '/api/v1/sys-audio/' + data.audioId,
    method: 'put',
    data: data
  })
}

// 一键同步
export function syncAudio() {
  return request({
    url: '/api/v1/audio/sync',
    method: 'get',
    timeout: 100 * 1000
  })
}

// 修改设备
export function updateAudioSwitch(e) {
  const data = {
    audioId: e.audioId,
    audioSwitch: e.audioSwitch
  }
  return request({
    url: '/api/v1/audio/updateAudioSwitch',
    method: 'put',
    data: data
  })
}

// 批量关闭
export function updateAudioSwitchAll(e) {
  const data = {
    audioId: 99,
    audioSwitch: e
  }
  return request({
    url: '/api/v1/audio/updateAudioSwitchAll',
    method: 'put',
    data: data
  })
}

// 删除设备
export function delSysAudio(id) {
  return request({
    url: '/api/v1/sys-audio/' + id,
    method: 'delete'
  })
}

// 获取音响关联列表信息
export function getAllAudioIdName() {
  return request({
    url: '/api/v1/audio/getAllAudioIdName',
    method: 'get'
  })
}

// 修改SysCamera
export function updateRelateAudio(data) {
  return request({
    url: '/api/v1/audio/updateRelateAudio/' + data.camId,
    method: 'put',
    data: data
  })
}

// 删除关联设备
export function delRelateAudio(camId, audioId) {
  return request({
    url: '/api/v1/audio/deleteRelateAudio/' + camId + '/' + audioId,
    method: 'delete'
  })
}
