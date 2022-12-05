import request from '@/utils/request'

// 查询SysAi列表
export function getAiList(query) {
  return request({
    url: '/api/v1/sys-ai',
    method: 'get',
    params: query
  })
}

// 查询SysAi详细
export function getSysAi(aiId) {
  return request({
    url: '/api/v1/sys-ai/' + aiId,
    method: 'get'
  })
}

// 查询算法下拉树结构
export function treeSelect() {
  return request({
    url: '/api/v1/ai/aiTree',
    method: 'get'
  })
}

// 根据角色ID查询部门树结构
export function roleAiTreeSelect(roleId) {
  return request({
    url: '/api/v1/ai/roleAiTreeSelect/' + roleId,
    method: 'get'
  })
}

// 新增SysAi
export function addSysAi(data) {
  return request({
    url: '/api/v1/sys-ai',
    method: 'post',
    data: data
  })
}

// 修改SysAi
export function updateSysAi(data, id) {
  return request({
    url: '/api/v1/sys-ai/' + id,
    method: 'put',
    data: data
  })
}

// 删除SysAi
export function delSysAi(data) {
  return request({
    url: '/api/v1/sys-ai',
    method: 'delete',
    data: data
  })
}

// 摄像头状态修改
export function changeAiEnable(e) {
  const data = {
    aiId: e.aiId,
    aiEnable: e.aiEnable
  }
  return request({
    url: '/api/v1/ai/aiEnable',
    method: 'put',
    data: data
  })
}

// 查询SysAi名称列表
export function getAllAiName(query) {
  return request({
    url: '/api/v1/ai/getAllAiName',
    method: 'get',
    params: query
  })
}

// 查询SysAi名称列表
export function getAllAiNameDict() {
  return request({
    url: '/api/v1/ai/getAllAiNameDict',
    method: 'get'
  })
}

// 查询SysAi列表
export function getAiListPackage(query) {
  return request({
    url: '/api/v1/sys-ai/getPagePackage',
    method: 'get',
    params: query
  })
}

// 新增SysAi
export function syncSysAi() {
  return request({
    url: '/api/v1/ai/syncAi',
    timeout: 100 * 1000,
    method: 'post'
  })
}

// 查询SysAi详细
export function getRelateCam(aiId) {
  return request({
    url: '/api/v1/ai/getRelateCam/' + aiId,
    method: 'get'
  })
}

// 流程算法api
export function sysAiFlow(option = {}) {
  const params = option.query ? option.query : ''
  const senData = option.data ? option.data : {}
  const method = option.method ? option.method : 'get'
  return request({
    url: '/api/v1/sys-ai-flow' + `${option.flowid ? `/${option.flowid}` : ''}`,
    method: method,
    params: params,
    data: senData
  })
}
// 算法配置列表
export function sysAiConfig(query) {
  return request({
    url: '/api/v1/sys-ai-config',
    method: 'get',
    params: query
  })
}
// 流程算法列表
export function sysAiFlowList(query) {
  return request({
    url: '/api/v1/sys-ai-flow',
    method: 'get',
    params: query
  })
}
// 流程记录列表
export function sysFlowData(query) {
  return request({
    url: '/api/v1/sys-flow-data',
    method: 'get',
    params: query
  })
}
