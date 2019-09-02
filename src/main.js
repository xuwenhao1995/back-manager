import Vue from 'vue'
import 'babel-polyfill'//解决ES6不能兼容低版本浏览器问题

import ElementUI from 'element-ui'
import MyhttpServer from './plugins/http.js'

import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/reset.css'
import router from './router'
import App from './App.vue'
import Moment from 'moment'

//自定义组件
import MyBread from './components/cuscom/myBread.vue'
// 导入 树形表格组件
import TreeGrid from 'vue-table-with-tree-grid'



Vue.config.productionTip = false

//全局过滤器，处理日期
Vue.filter('fmtdate',(v)=>{
  return Moment(v).format('YYYY-MM-DD')
})

//使用vue插件
Vue.use(ElementUI)
Vue.use(MyhttpServer)

//全局自定义组件
Vue.component('my-bread',MyBread)
// 把 导入的树形表格，注册为 全局组件
Vue.component('tree-table', TreeGrid)

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
