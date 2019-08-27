import Vue from 'vue'

import ElementUI from 'element-ui'
import MyhttpServer from './plugins/http.js'

import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/reset.css'
import router from './router'
import App from './App.vue'

Vue.config.productionTip = false

//使用vue插件
Vue.use(ElementUI)
Vue.use(MyhttpServer)

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
