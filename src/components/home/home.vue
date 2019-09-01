<template>
  <el-container class="container">
    <el-header class="header">
      <div class="logo_tile">
        <h2>电商后台管理系统</h2>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside class="aside" width="200px">
        <el-menu :router="true" :unique-opened="true">

          <el-submenu :index="item.order+''" v-for="(item,i) in menus" :key="i">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>

            <el-menu-item v-for="(item1,i) in item.children" :key="i" :index="item1.path">
              <i class="el-icon-menu"></i>
              <span>{{item1.authName}}</span>
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
  beforeCreate() {
    const token = localStorage.getItem("token");

    if (!token) {
      this.$router.push({ name: "login" });
    }
  },

  data() {
    return {
      menus: []
    };
  },
  created() {
    this.getMenus();
  },
  methods: {
    async getMenus() {
      const res = await this.$http.get(`menus`);
      this.menus = res.data.data;
    },
    logout() {
      localStorage.clear();
      this.$message.success("已安全退出");
      this.$router.push({ name: "login" });
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
        font-family: "微软雅黑";
        font-weight: bold;
        margin-left: 15px;
      }
    }
    .el-button {
      margin-right: 10px;
    }
  }
  .aside {
    margin-top: 20px;
    background-color: white;
  }
  .main {
    background-color: #d3dce6;
  }
}
</style>