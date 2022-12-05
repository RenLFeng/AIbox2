import request from '@/utils/request'

// 查询SysMqttMsg列表
export function listSysMqttMsg(query) {
  return request({
    url: '/api/v1/sys-mqtt-msg',
    method: 'get',
    params: query
  })
}

// 查询SysMqttMsg详细
export function getSysMqttMsg(mqttId) {
  return request({
    url: '/api/v1/sys-mqtt-msg/' + mqttId,
    method: 'get'
  })
}

// 新增SysMqttMsg
export function addSysMqttMsg(data) {
  return request({
    url: '/api/v1/sys-mqtt-msg',
    method: 'post',
    data: data
  })
}

// 修改SysMqttMsg
export function updateSysMqttMsg(data) {
  return request({
    url: '/api/v1/sys-mqtt-msg/' + data.mqttId,
    method: 'put',
    data: data
  })
}

// 删除SysMqttMsg
export function delSysMqttMsg(data) {
  return request({
    url: '/api/v1/sys-mqtt-msg',
    method: 'delete',
    data: data
  })
}

// 删除SysMqttMsg
export function delAllSysMqttMsg(data) {
  return request({
    url: '/api/v1/sys-mqtt-msg/deleteAll',
    method: 'post',
    data: data
  })
}

// 删除SysMqttMsg
export function syncAllSysMqttMsg(data) {
  return request({
    url: '/api/v1/sys-mqtt-msg/sync',
    method: 'post',
    data: data
  })
}
