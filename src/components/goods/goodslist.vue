<template>
  <div class="goods">
    <!-- 搜索区域 -->
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input clearable placeholder="请输入内容" class="input-with-select" v-model="queryinfo.query">
          <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="goAdd">添加商品</el-button>
      </el-col>
    </el-row>

    <!-- table 表格区域 -->
    <el-table class="table" :data="goodslist" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name"></el-table-column>
      <el-table-column label="商品价格(元)" prop="goods_price" width="95"></el-table-column>
      <el-table-column label="商品重量" prop="goods_weight" width="70"></el-table-column>
      <el-table-column label="创建时间" width="140">
        <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template>
      </el-table-column>
      <el-table-column label="操作" width="130">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="remove(scope)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryinfo.pagenum"
      :page-sizes="[10, 15, 20, 30]"
      :page-size="queryinfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询参数
      queryinfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      // 商品列表数据，默认为空
      goodslist: [],
      // 总数据条数
      total: 0
    };
  },
  created(){
    this.getGoodsList()
  },
  methods: {
    // 根据查询参数获取商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryinfo
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取商品列表失败！");
      this.goodslist = res.data.goods;
      this.total = res.data.total;
      
    },
    // 监听 pageSize 的变化，并立即获取最新的数据
    handleSizeChange(newSize) {
      this.queryinfo.pagesize = newSize;
      this.getGoodsList();
    },
    // 监听 pageNum 的变化，并立即获取最新的数据
    handleCurrentChange(newPage) {
      this.queryinfo.pagenum = newPage;
      this.getGoodsList();
    },
    // 根据商品Id，删除商品数据
    async remove(scope) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该商品, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      // 用户取消了删除
      if (confirmResult !== "confirm") {
        return this.$message({
          type: "info",
          message: "已取消删除"
        });
      }

      // 用户确认了删除
      const { data: res } = await this.$http.delete(
        "goods/" + scope.row.goods_id
      );
      if (res.meta.status !== 200) return this.$message.error("删除商品失败！");
      this.$message.success("删除商品成功！");
      this.getGoodsList();
    },
    // 跳转到添加页面
    goAdd() {
      this.$router.push("/goodsadd");
    }
  }
}
</script>

<style lang="scss" scoped>
.goods{
  height: 100%;

  .table{
    height: 100%;
  }
}
</style>