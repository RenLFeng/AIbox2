import * as request from '@/utils/show-temp-request'

/**
 * 接口封装
 */
export default {
  getOverall() {
    const url = `/api/covid-19/overall?_=${Math.random()}`
    return request.get(url)
  },
  getProvinceDataList() {
    const url = `/api/covid-19/area/latest/list?_=${Math.random()}`
    return request.get(url)
  },
  getDailyList() {
    const url = `/api/covid-19/list?t=${Math.random()}`
    return request.get(url)
  }
}
