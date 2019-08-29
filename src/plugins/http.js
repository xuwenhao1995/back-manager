//插件模块
import axios from 'axios'

const MyhttpServer = {}

MyhttpServer.install =  (Vue) => {

  axios.interceptors.request.use(function(config) {
    // 手动为 axios 的请求，追加 Authorization 请求头
    config.headers.Authorization = window.localStorage.getItem('token')
    return config
  })
  axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

  // 4. 添加实例方法
  Vue.prototype.$http = axios
}

export default MyhttpServer