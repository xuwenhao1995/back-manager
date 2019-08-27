<template>
  <div id="app">
    <!-- 路由容器 -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
    }
  },
  created() {}
}
</script>

<style lang="scss">
  #app{
    height: 100%;
  }

</style>
