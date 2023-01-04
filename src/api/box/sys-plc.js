import request from "@/utils/request";
// plc api集合
export function sysPlcRequest(option = {}) {
  const params = option.query ? option.query : "";
  const senData = option.data ? option.data : {};
  const method = option.method ? option.method : "get";
  return request({
    url: "/api/v1/sys-plc" + `${option.plcId ? `/${option.plcId}` : ""}`,
    method: method,
    params: params,
    data: senData
  });
}
// plc列表
export function sysPlcQueryList(query) {
  return request({
    url: "/api/v1/sys-plc",
    method: "get",
    params: query
  });
}
// 获取plc输入方式下拉
export const plcDictData = (params) => {
  return request({
    url: "/api/v1/dict-data/option-select",
    method: "get",
    params: params
  });
};
// plc 配置 api集合
export function sysPlcConfigRequest(option = {}) {
  const params = option.query ? option.query : "";
  const senData = option.data ? option.data : {};
  const method = option.method ? option.method : "get";
  return request({
    url: "/api/v1/sys-plc-config" + `${option.acId ? `/${option.acId}` : ""}`,
    method: method,
    params: params,
    data: senData
  });
}
