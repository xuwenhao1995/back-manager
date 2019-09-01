import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login/login.vue'
import Home from '../components/home/home.vue'

import Users from '../components/users/users.vue'
import Right from '../components/rights/right.vue'
import Role from '../components/rights/role.vue'
import GoodsList from '../components/goods/goodslist.vue'
import GoodsAdd from '../components/goods/goodsadd.vue'

import {Message} from 'element-ui'

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
      {name:'users',path:'/users',component:Users},
      {name:'rights',path:'/rights',component:Right},
      {name:'roles',path:'/roles',component:Role},
      {name:'goods',path:'/goods',component:GoodsList},
      {name:'goodsadd',path:'/goodsadd',component:GoodsAdd},
    ]
  }
  ]
})
//路由导航守卫
router.beforeEach((to, from, next) =>{
  if(to.path === '/login'){
    next()
  }else{
    const token = localStorage.getItem('token')
    if(!token){
      Message.warning('你未登陆！');
      router.push({name:'login'})
      return
    }
    next()
  }
})

export default router