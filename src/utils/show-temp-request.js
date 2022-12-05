import axios from 'axios'

let baseUrl = ''
if (process.env.NODE_ENV === 'development') {
  baseUrl = ''
} else {
  // 你的 API 地址
  baseUrl = ''
}

export default {
  baseUrl
}

const fetch = (method = 'GET', url, param = '') => {
  // 处理 url
  url = `${baseUrl}${url}`
  return new Promise((resolve, reject) => {
    axios({
      method: method,
      url: url,
      changeOrigin: true,
      data: JSON.stringify(param)
    }).then((res) => {
      resolve(res.data)
    }, error => {
      reject(error)
    }).catch((error) => {
      reject(error)
    })
  })
}

const get = (url) => {
  return fetch('GET', url)
}

const post = (url, data) => {
  return fetch('POST', url, data)
}

const put = (url, data) => {
  return fetch('PUT', url, data)
}

const remove = (url, data) => {
  return fetch('DELETE', url, data)
}

export {
  get,
  post,
  put,
  remove
}
