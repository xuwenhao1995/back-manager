<template>
  <el-container class="container">
    <el-header class="header">
      <div class="logo_tile">
        <img src="../../assets/image/logo.jpg" alt height="70px" />
        <h2>电商后台管理系统</h2>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside class="aside" width="200px">
        <el-menu 
        :router="true"
        :unique-opened="true">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="users">
              <i class="el-icon-menu"></i>
              <span>用户列表</span>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="2-1">
              <i class="el-icon-menu"></i>
              <span>角色列表</span>
            </el-menu-item>
            <el-menu-item index="2-1">
              <i class="el-icon-menu"></i>
              <span>权限列表</span>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item index="3-1">
              <i class="el-icon-menu"></i>
              <span>商品列表</span>
            </el-menu-item>
            <el-menu-item index="3-2">
              <i class="el-icon-menu"></i>
              <span>分类参数</span>
            </el-menu-item>
            <el-menu-item index="3-3">
              <i class="el-icon-menu"></i>
              <span>商品分类</span>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item index="4-1">
              <i class="el-icon-menu"></i>
              <span>订单列表</span>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item index="5-1">
              <i class="el-icon-menu"></i>
              <span>数据报表</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {

  //判断是否登陆
  beforeCreate(){
    const token = localStorage.getItem('token')

    if(!token){
      this.$router.push({name:'login'})
    }
  },

  data() {
    return {};
  },
  methods: {
    logout() {
      localStorage.clear()
      this.$message.success('已安全退出');
      this.$router.push({name:'login'})
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  .header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between; //均匀排列每个元素首个元素放置于起点，末尾元素放置于终点
    align-items: center;
    padding: 0;
    user-select: none; //文本不能被选择
    .logo_tile {
      display: flex;
      align-items: center;
      color: white;
      h2 {
        font-weight: 200;
        margin-left: 15px;
      }
    }
    .el-button {
      margin-right: 10px;
    }
  }
  .aside {
    background-color: white;
  }
  .main {
    background-color: #d3dce6;
  }
}
</style>