import request from '@/utils/request'

// 查询SysProduct列表
export function listSysProduct(query) {
  return request({
    url: '/api/v1/sys-product',
    method: 'get',
    params: query
  })
}

// 查询SysProduct详细
export function getSysProduct(prodId) {
  return request({
    url: '/api/v1/sys-product/' + prodId,
    method: 'get'
  })
}

// 新增SysProduct
export function addSysProduct(data) {
  return request({
    url: '/api/v1/sys-product',
    method: 'post',
    data: data
  })
}

// 修改SysProduct
export function updateSysProduct(data) {
  return request({
    url: '/api/v1/sys-product/' + data.prodId,
    method: 'put',
    data: data
  })
}

// 删除SysProduct
export function delSysProduct(data) {
  return request({
    url: '/api/v1/sys-product',
    method: 'delete',
    data: data
  })
}

// 产品状态修改
export function changeProductStatus(e) {
  const data = {
    prodId: e.prodId,
    isPublish: e.isPublish
  }
  return request({
    url: '/api/v1/product/status',
    method: 'put',
    data: data
  })
}

// 查询SysProduct名称列表
export function getAllProductName(query) {
  return request({
    url: '/api/v1/product/getAllProductName',
    method: 'get',
    params: query
  })
}

// 查询SysProduct名称列表
export function getAllProductNamePid(query) {
  return request({
    url: '/api/v1/product/getAllProductNamePid',
    method: 'get',
    params: query
  })
}

// 查询SysProduct名称列表
export function getAllProductNameDict() {
  return request({
    url: '/api/v1/product/getAllProductNameDict',
    method: 'get'
  })
}

// 产品图标上传
export function uploadAvatar(data) {
  return request({
    url: '/api/v1/product/avatar',
    method: 'post',
    data: data
  })
}
