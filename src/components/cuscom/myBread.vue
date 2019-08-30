<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item>首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{l1}}</el-breadcrumb-item>
    <el-breadcrumb-item>{{l2}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: ["l1", "l2"]
};
</script>

<style>
</style>