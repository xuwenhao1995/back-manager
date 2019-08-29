import Vue from 'vue'
import 'babel-polyfill'//解决ES6不能兼容低版本浏览器问题

import ElementUI from 'element-ui'
import MyhttpServer from './plugins/http.js'

import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/reset.css'
import router from './router'
import App from './App.vue'
import Moment from 'moment'

Vue.config.productionTip = false

//全局过滤器，处理日期
Vue.filter('fmtdate',(v)=>{
  return Moment(v).format('YYYY-MM-DD')
})

//使用vue插件
Vue.use(ElementUI)
Vue.use(MyhttpServer)

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
