<template>
  <el-card>
    <my-bread l1="权限管理" l2="角色列表"></my-bread>
    <el-row class="addBtn">
      <el-col>
        <el-button type="info">添加角色</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table height="550px" :data="roleList" style="width: 100%">
      <el-table-column type="expand" label width="40">
          <template slot-scope="scope">
              <el-row v-for="(item,i) in scope.row.children" :key="i">
                  <el-col :span="4">
                      <el-tag closable>{{item.authName}}</el-tag>
                      <i class="el-icon-arrow-right"></i>
                  </el-col>
                  <el-col :span="20">
                      <el-row v-for="(item1,i) in item.children" :key="i">
                          <el-col :span="4">
                              <el-tag closable type="success">{{item1.authName}}</el-tag>
                              <i class="el-icon-arrow-right"></i>
                          </el-col>
                          <el-col :span="20">
                              <el-tag closable type="warning" v-for="(item2,i) in item1.children" :key="i">
                                  {{item2.authName}}
                              </el-tag>
                          </el-col>
                      </el-row>
                  </el-col>
              </el-row>
              <span v-if="scope.row.children.lenght===0">未分配权限</span>
          </template>
      </el-table-column>
      <el-table-column type="index" label width="100"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="200"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="200"></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            @click="showEditDialog(scope.row)"
            size="mini"
            plain
            type="primary"
            icon="el-icon-edit"
            circle
          ></el-button>
          <el-button
            @click="showSetUserRoleDia(scope.row)"
            size="mini"
            plain
            type="success"
            icon="el-icon-check"
            circle
          ></el-button>
          <el-button
            @click="showDel(scope.row.id)"
            size="mini"
            plain
            type="danger"
            icon="el-icon-delete"
            circle
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      roleList: []
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    async getRoleList() {
      const res = await this.$http.get(`roles`);
      this.roleList = res.data.data;
    }
  }
};
</script>

<style lang="scss" scoped>
.addBtn {
  margin-top: 20px;
}
</style>