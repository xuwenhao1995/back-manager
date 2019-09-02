<template>
  <el-card>
    <my-bread l1="商品管理" l2="分类参数"></my-bread>
    <el-alert class="alert" title="只允许为第三级分类设置参数" type="error" left show-icon></el-alert>

    <el-form class="form" label-position="left" label-width="80px">
      <el-form-item label="商品分类">
        <el-cascader
          clearable
          :show-all-levels="false"
          expand-trigger="hover"
          :options="catelist"
          v-model="selecteOptions"
          :props="cascaderProps"
          @change="handleCateChanged"
        ></el-cascader>
      </el-form-item>
    </el-form>

    <el-tabs v-model="active" @tab-click="handleClick">
      <el-tab-pane label="动态参数" name="1">
        <el-button type="danger">设置动态参数</el-button>

        <el-table :data="cateattrs" style="with: 100%">
          <el-table-column type="expand" label="#">
            <template slot-scope="scope">
              <el-tag
                v-for="tag in scope.row.attr_vals"
                :key="tag"
                closable
                :disable-transitions="false"
                @close="handleClose(scope.row, tag)"
              >{{tag}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              ></el-input>
              <!-- 按钮 -->
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(scope)"
              >+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column label="属性名称" prop="attr_name"></el-table-column>
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
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="2">
        <el-button type="danger">设置静态参数</el-button>

        <el-table :data="staticParamsarr" style="with: 100%">
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="属性名称" prop="attr_name"></el-table-column>
          <el-table-column label="属性值" prop="attr_vals"></el-table-column>
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
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      active: "1",
      catelist: [],
      selecteOptions: [],
      cascaderProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      cateattrs: [],
      staticParamsarr: [],
      list: [],
      inputVisible: false,
      inputValue: ""
    };
  },
  created() {
    this.getGoodCate();
  },
  methods: {
    async handleInputConfirm(scope) {
      let value = this.inputValue;
      if (value) {
        scope.attr_vals.push(value);
      } else {
        return;
      }

      let putData = {
        attr_name: scope.attr_name,
        attr_sel: "many",
        attr_vals: scope.attr_vals.join(",")
      };

      const res = await this.$http.put(
        `categories/${this.selecteOptions[2]}/attributes/${scope.attr_id}`,
        putData
      );
      const {
        meta: { status, msg }
      } = res.data;
      if (status === 200) {
        this.$message.success(msg);
      } else {
        this.$message.warning(msg);
      }

      this.inputVisible = false;
      this.inputValue = "";
    },
    async handleClose(scope, tag) {
      scope.attr_vals.splice(scope.attr_vals.indexOf(tag), 1);
      let putData = {
        attr_name: scope.attr_name,
        attr_sel: "many",
        attr_vals: scope.attr_vals.join(",")
      };

      const res = await this.$http.put(
        `categories/${this.selecteOptions[2]}/attributes/${scope.attr_id}`,
        putData
      );
      const {
        meta: { status, msg }
      } = res.data;
      if (status === 200) {
        this.$message.success(msg);
      } else {
        this.$message.warning(msg);
      }
    },
    handleClick() {
      if(this.active === '2'){
        if(this.selecteOptions.length === 3){

        }
      }
    },
    showInput(scope) {
      this.inputVisible = true;
    },

    async handleCateChanged() {
      if (this.selecteOptions.length === 3) {
        const res = await this.$http.get(
          `categories/${this.selecteOptions[2]}/attributes?sel=many`
        );
        res.data.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];
        });
        this.cateattrs = res.data.data;

        const res1 = await this.$http.get(
          `categories/${this.selecteOptions[2]}/attributes?sel=only`
        );
        this.staticParamsarr = res1.data.data;
      }
    },
    async getGoodCate() {
      const res = await this.$http.get(`categories?type=3`);
      this.catelist = res.data.data;
    }
  }
};
</script>

<style>
.alert {
  margin-top: 20px;
}
.form {
  margin-top: 20px;
}
.input-new-tag {
  width: 120px;
}
</style>