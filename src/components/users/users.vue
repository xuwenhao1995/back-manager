<template>
  <el-card class="box-card">
    <my-bread l1="用户管理" l2="用户列表"></my-bread>

    <!-- 搜索 -->
    <el-row class="search">
      <el-col>
        <el-input
          @clear="getUserList()"
          clearable
          placeholder="请输入内容"
          v-model="query"
          class="inputSearch"
        >
          <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
        </el-input>
        <el-button plain @click="showDialog()" type="success">添加用户</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table height="550px" :data="userList" style="width: 100%">
      <el-table-column type="index" label width="40"></el-table-column>
      <el-table-column prop="username" label="姓名" width="80"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="创建时间">
        <!-- 使用全局过滤器，处理日期格式 -->
        <template slot-scope="userList">{{userList.row.create_time | fmtdate}}</template>
      </el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="userList">
          <el-switch
            @change="changeState(userList.row)"
            v-model="userList.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="userList">
          <el-button
            @click="showEditDialog(userList.row)"
            size="mini"
            plain
            type="primary"
            icon="el-icon-edit"
            circle
          ></el-button>
          <el-button
            @click="showSetUserRoleDia(userList.row)"
            size="mini"
            plain
            type="success"
            icon="el-icon-check"
            circle
          ></el-button>
          <el-button
            @click="showDel(userList.row.id)"
            size="mini"
            plain
            type="danger"
            icon="el-icon-delete"
            circle
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          <el-input :disabled="disabled" v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="title!='修改用户'" label="密码" label-width="100px">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrEditUser()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRol">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">{{form.username}}</el-form-item>

        <el-form-item label="角色" label-width="100px">
          <el-select v-model="form.rid">
            <el-option label="请选择" :value="-1"></el-option>
            <el-option v-for="(item,i) in roles" :key="i" :label="item.roleName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRol = false">取 消</el-button>
        <el-button type="primary" @click="setUserRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      userList: [],
      total: -1,
      query: "",
      pagenum: 1,
      pagesize: 6,
      title: "",
      disabled: false,
      roles: [],

      dialogFormVisible: false,
      dialogFormVisibleRol: false,
      form: {
        id: -1,
        rid: -1,
        username: "",
        password: "",
        email: "",
        mobile: ""
      }
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    //分页
    handleSizeChange(val) {
      this.pagesize = val;
      this.pagenum = 1;
      this.getUserList();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getUserList();
    },

    async changeState(user) {
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
      const {
        meta: { status, msg }
      } = res.data;
      if (status === 200) {
        this.pagenum = 1;
        this.getUserList();
        this.$message.success(msg);
      } else {
        this.$message.warning(msg);
      }
    },

    async showSetUserRoleDia(user) {
      this.form = user;
      const res = await this.$http.get(`users/${user.id}`);
      this.form = res.data.data;

      const res1 = await this.$http.get(`roles`);
      this.roles = res1.data.data;

      this.dialogFormVisibleRol = true;
    },

    async setUserRole() {
      const res = await this.$http.put(`users/${this.form.id}/role`, {rid : this.form.rid});
      const {
        meta: { status, msg }
      } = res.data;
      if (status === 200) {
        this.pagenum = 1;
        this.getUserList();
        this.$message.success(msg);
      } else {
        this.$message.warning(msg);
      }
      this.dialogFormVisibleRol = false;
    },

    showDialog() {
      this.title = "增加用户";
      this.form = {};
      this.disabled = false;
      this.dialogFormVisible = true;
    },
    showEditDialog(user) {
      this.title = "修改用户";
      this.form = user;
      this.disabled = true;
      this.dialogFormVisible = true;
    },
    showDel(userId) {
      this.$confirm("删除用户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$http.delete(`users/${userId}`);
          const {
            meta: { status, msg }
          } = res.data;
          if (status === 200) {
            this.pagenum = 1;
            this.getUserList();
            this.$message.success(msg);
          } else {
            this.$message.warning(msg);
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },

    async addOrEditUser() {
      if (this.title === "修改用户") {
        const res = await this.$http.put(`users/${this.form.id}`, this.form);
        const {
          meta: { status, msg }
        } = res.data;
        if (status === 200) {
          this.$message.success(msg);
          this.getUserList();
          this.form = {};
        } else {
          this.$message.warning(msg);
        }
        this.dialogFormVisible = false;
      } else {
        const res = await this.$http.post("users", this.form);
        const {
          meta: { status, msg }
        } = res.data;
        if (status === 201) {
          this.$message.success(msg);
          this.getUserList();
          this.form = {};
        } else {
          this.$message.warning(msg);
        }
        this.dialogFormVisible = false;
      }
    },

    async getUserList() {
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      const {
        meta: { status, msg },
        data: { users, total }
      } = res.data;
      if (status === 200) {
        this.userList = users;
        this.total = total;
        this.$message.success(msg);
      } else {
        this.$message.warning(msg);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.box-card {
  height: 100%;

  .search {
    margin-top: 20px;
  }

  .inputSearch {
    width: 300px;
  }

  .pagination {
    position: fixed;
    bottom: 30px;
  }
}
</style>