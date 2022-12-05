import request from "@/utils/request";

// 查询SysAiConfig列表
export function listSysAiConfig(query) {
  return request({
    url: "/api/v1/sys-ai-config",
    method: "get",
    params: query
  });
}

// 查询SysAiConfig详细
export function getSysAiConfig(id) {
  return request({
    url: "/api/v1/sys-ai-config/" + id,
    method: "get"
  });
}

// 新增SysAiConfig
export function addSysAiConfig(data) {
  return request({
    url: "/api/v1/sys-ai-config",
    method: "post",
    data: data
  });
}

// 修改SysAiConfig
export function updateSysAiConfig(data) {
  return request({
    url: "/api/v1/sys-ai-config/" + data.id,
    method: "put",
    data: data
  });
}

// 删除SysAiConfig
export function delSysAiConfig(data) {
  return request({
    url: "/api/v1/sys-ai-config",
    method: "delete",
    data: data
  });
}

// 查询SysAiConfig详细
export function getProductLine(id) {
  return request({
    url: "/api/v1/aiConfig/getProductLine/" + id,
    method: "get"
  });
}

// 查询SysAiConfig详细
export function getTestLine(id) {
  return request({
    url: "/api/v1/aiConfig/getTestLine/" + id,
    method: "get"
  });
}

// 查询SysAiConfig详细
export function getExtendLine(id) {
  return request({
    url: "/api/v1/aiConfig/getExtendLine/" + id,
    method: "get"
  });
}

// 修改SysAiConfig
export function updateDetectionLine(data) {
  return request({
    url: "/api/v1/aiConfig/updateDetectionLine/" + data.id,
    method: "put",
    data: data
  });
}

// 修改SysAiConfig
export function updateShieldLine(data) {
  return request({
    url: "/api/v1/aiConfig/updateShieldLine/" + data.id,
    method: "put",
    data: data
  });
}
// 感兴趣区修改SysAiConfig
export function updateInterestedLine(data) {
  return request({
    url: "/api/v1/aiConfig/updateInterestLine/" + data.id,
    method: "put",
    data: data
  });
}
// 一键验证SysAiConfig
export function authentication(e) {
  const data = {
    id: e.id,
    nId: e.nId,
    bId: e.bId,
    cId: e.cId,
    aId: e.aId
  };
  return request({
    url: `/api/v1/aiConfig/checkAlgorithm`,
    method: "post",
    data: data
  });
}
// 修改SysAiConfig
export function updateBorderLine(data) {
  return request({
    url: "/api/v1/aiConfig/updateBorderLine/" + data.id,
    method: "put",
    data: data
  });
}

// 修改SysAiConfig
export function updateLine(data) {
  return request({
    url: "/api/v1/aiConfig/updateLine/" + data.id,
    method: "put",
    data: data
  });
}
// 移除算法
export function removeAiFlow(data) {
  return request({
    url: "/api/v1/aiFlow",
    method: "get",
    data: data
  });
}
