import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login/login.vue'
import Home from '../components/home/home.vue'

import Users from '../components/users/users.vue'
import Right from '../components/rights/right.vue'
import Role from '../components/rights/role.vue'

//Element也出现该问题是因为Element也使用了vue-router
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

const router = new Router({
  routes: [{
    name: 'login',
    path: '/login',
    component: Login
  },
  {
    name: 'home',
    path: '/', 
    component: Home,
    children:[
      {name:'users',path:'users',component:Users},
      {name:'right',path:'right',component:Right},
      {name:'role',path:'role',component:Role},
    ]
  }
  ]
})

export default router