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
              <el-tag @close="delRight(scope.row, item.id)" closable>{{item.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="(item1,i) in item.children" :key="i">
                <el-col :span="4">
                  <el-tag
                    @close="delRight(scope.row, item1.id)"
                    closable
                    type="success"
                  >{{item1.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>

                <el-col :span="20">
                  <el-tag
                    @close="delRight(scope.row, item2.id)"
                    closable
                    type="warning"
                    v-for="(item2,i) in item1.children"
                    :key="i"
                  >{{item2.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <span v-if="scope.row.children.length==0">未分配权限</span>
        </template>
      </el-table-column>
      <el-table-column type="index" label width="100"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="200"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="200"></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            @click="showSetUserRoleDia(scope.row)"
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

    <!-- 对话框 -->
    <el-dialog title="修改权限" :visible.sync="dialogFormVisibleRight">
      <el-tree
        ref="tree"
        :data="treeList"
        show-checkbox
        node-key="id"
        :default-expanded-keys="arrexpand"
        :default-checked-keys="arrchecked"
        :props="defaultProps"
      ></el-tree>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRight = false">取 消</el-button>
        <el-button type="primary" @click="setRoleRight()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      dialogFormVisibleRight: false,
      roleList: [],
      treeList: [],
      arrexpand: [],
      arrchecked: [],
      currRole: "",
      defaultProps: {
        label: "authName",
        children: "children"
      }
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    async showSetUserRoleDia(role) {
      const res = await this.$http.get(`rights/tree`);
      this.treeList = res.data.data;
      this.currRole = role;
      this.arrchecked = [];
      role.children.forEach(item => {
        // this.arrchecked.push(item.id);
        item.children.forEach(item1 => {
          // this.arrchecked.push(item1.id);
          item1.children.forEach(item2 => {
            this.arrchecked.push(item2.id);
          });
        });
      });
      this.arrexpand = [];
      this.treeList.forEach(item1 => {
        this.arrexpand.push(item1.id);
      });
      this.dialogFormVisibleRight = true;
    },

    async setRoleRight() {
      let arr1 = this.$refs.tree.getCheckedKeys();
      let arr2 = this.$refs.tree.getHalfCheckedNodes();
      let arr = [...arr1, ...arr2];
      const res = await this.$http.post(`roles/${this.currRole.id}/rights`, {
        rids: arr.join(",")
      });
      const {
        meta: { status, msg }
      } = res.data;
      if (status === 200) {
        this.getRoleList()
        this.$message.success(msg)
      } else {
        this.$message.warning(msg)
      }
      this.dialogFormVisibleRight = false
    },

    async getRoleList() {
      const res = await this.$http.get(`roles`)
      this.roleList = res.data.data
    },
    async delRight(role, rightId) {
      const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      const {
        meta: { status, msg }
      } = res.data;
      if (status === 200) {
        role.children = res.data.data
        this.$message.success(msg)
      } else {
        this.$message.warning(msg)
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.addBtn {
  margin-top: 20px;
}
</style>