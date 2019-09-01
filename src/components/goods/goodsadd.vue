<template>
  <el-card class="card">
    <my-bread l1="商品管理" l2="商品列表"></my-bread>
    <el-alert class="alert" title="添加商品信息" type="success" center show-icon></el-alert>

    <el-steps :active="1*active" class="steps" align-center :space="200" finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>

    <el-form class="form" :label-position="labelPosition" label-width="80px" :model="addForm">
      <el-tabs @tab-click="tabChange()" v-model="active" tab-position="left">
        <el-tab-pane name="1" label="基本信息">
          <el-form-item label="商品名称">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="addForm.goods_price" type="number" min="0"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="addForm.goods_weight" type="number" min="0"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="addForm.goods_number" type="number" min="0"></el-input>
          </el-form-item>

          <el-form-item label="商品分类">
            <el-cascader
              clearable
              expand-trigger="hover"
              :options="catelist"
              v-model="addForm.goods_cat"
              :props="cascaderProps"
              @change="handleCateChanged"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="2" label="商品参数">
          <el-form-item :label="item.attr_name" v-for="(item,i) in cateattrs" :key="i">
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox
                border
                :label="item1"
                v-for="(item1,i) in item.attr_vals"
                :key="i"
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="3" label="商品属性">
          <el-form-item
            label-width="140px"
            :label="item.attr_name"
            v-for="item in staticParamsarr"
            :key="item.attr_id"
          >
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="4" label="商品图片">
          <el-form-item label-width="10px">
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :headers="uploadHeader"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :on-success="uploadSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="5" label="商品内容">
          <el-form-item label-width="10px">
            <el-button type="primary" @click="addGoods()">添加商品</el-button>
            <quillEditor v-model="addForm.goods_introduce"></quillEditor>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
//富文本编辑器
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";

export default {
  components: {
    quillEditor
  },
  data() {
    return {
      labelPosition: "right",
      active: "1",
      catelist: [],
      cascaderProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },

      cateattrs: [],
      staticParamsarr: [],
      uploadHeader: {
        // 需要手动指定一个 Authorization
        Authorization: localStorage.getItem("token")
      },
      addForm: {
        goods_name: "", // 商品名称
        goods_price: "", // 商品价格
        goods_weight: "", // 商品重量
        goods_number: "", // 商品数量
        goods_cat: [], // 商品所属的分类
        goods_introduce: "", // 商品的描述
        pics: [], // 商品的图片
        attrs: [] // 商品的属性数组
      }
    };
  },
  created() {
    this.getGoodCate();
  },
  methods: {
    async addGoods(){
      this.addForm.goods_cat = this.addForm.goods_cat.join(',')
      let arr1 = this.cateattrs.map((item)=>{//
        return{attr_id:item.attr_id, attr_value:item.attr_vals}
      })
 
      let arr2 = this.staticParamsarr.map((item)=>{//
        return{attr_id:item.attr_id, attr_value:item.attr_vals}
      })

      this.addForm.attrs = [...arr1, ...arr2]
      const res = await this.$http.post(`goods`,this.addForm);
      const {
        meta: { status, msg },
      } = res.data;
      if (status === 201) {
        this.$message.success(msg);
      } else {
        this.$message.warning(msg);
      }
      this.$router.push({name:'goods'})
    },
    handleCateChanged() {},
    handlePreview(file) {},
    handleRemove(file) {
      let index = this.addForm.pics.findIndex((item)=>{
        return item.pic === file.response.data.tmp_path
      })
      this.addForm.pics.splice(index,1)
    },
    uploadSuccess(file) {
      this.addForm.pics.push({
        pic:file.data.tmp_path
      })
    },
    async getGoodCate() {
      const res = await this.$http.get(`categories?type=3`);
      this.catelist = res.data.data;
    },
    async tabChange() {
      if (this.active === "2") {
        this.labelPosition = "top";
        if (this.addForm.goods_cat.length !== 3) {
          this.$message.warning("请选择商品的三级分类");
          return;
        }
        const res = await this.$http.get(
          `categories/${this.addForm.goods_cat[2]}/attributes?sel=many`
        );
        res.data.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        })
        this.cateattrs = res.data.data;
      } else if (this.active === "3") {
        this.labelPosition = "right";
        if (this.addForm.goods_cat.length !== 3) {
          this.$message.warning("请选择商品的三级分类");
          return;
        }
        const res = await this.$http.get(
          `categories/${this.addForm.goods_cat[2]}/attributes?sel=only`
        );
        this.staticParamsarr = res.data.data;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.card {
  height: 100%;

  .form {
    margin-top: 20px;
  }

  .alert {
    margin-top: 20px;
  }
  .steps {
    margin-top: 20px;
  }
}
.quill-editor {
  margin-top: 10px;
  height: 280px
}
</style>