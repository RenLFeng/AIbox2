import request from '@/utils/request'

// 查询SysNotifyTemplate列表
export function listSysNotifyTemplate(query) {
  return request({
    url: '/api/v1/sys-notify-template',
    method: 'get',
    params: query
  })
}

// 查询SysNotifyTemplate详细
export function getSysNotifyTemplate(templateId) {
  return request({
    url: '/api/v1/sys-notify-template/' + templateId,
    method: 'get'
  })
}

// 新增SysNotifyTemplate
export function addSysNotifyTemplate(data) {
  return request({
    url: '/api/v1/sys-notify-template',
    method: 'post',
    data: data
  })
}

// 修改SysNotifyTemplate
export function updateSysNotifyTemplate(data) {
  return request({
    url: '/api/v1/sys-notify-template/' + data.templateId,
    method: 'put',
    data: data
  })
}

// 删除SysNotifyTemplate
export function delSysNotifyTemplate(data) {
  return request({
    url: '/api/v1/sys-notify-template',
    method: 'delete',
    data: data
  })
}

// 查询SysBox名称列表
export function getAllNotifyTemplateName(query) {
  return request({
    url: '/api/v1/notifyTemplate/getAllNotifyTemplateName',
    method: 'get',
    params: query
  })
}
