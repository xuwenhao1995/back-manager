<template>
  <el-card>
    <my-bread l1="权限管理" l2="权限列表"></my-bread>

    <el-table class="table" height="400px" :data="rightList" border style="width: 100%">
      <el-table-column type="index" label="" width="100"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="160"></el-table-column>
      <el-table-column prop="path" label="路径" width="160"></el-table-column>
      <el-table-column label="层级">
          <template slot-scope="scope">
              <span v-if="scope.row.level==0">一级</span>
              <span v-if="scope.row.level==1">二级</span>
              <span v-if="scope.row.level==2">三级</span>
          </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      rightList: []
    };
  },
  created() {
    this.getRightList();
  },
  methods: {
    async getRightList() {
      const res = await this.$http.get(`rights/list`);
      this.rightList = res.data.data;
    }
  }
};
</script>

<style lang="scss" scoped>
    .table{
        margin-top: 20px
    }
</style>