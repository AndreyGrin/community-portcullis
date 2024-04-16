<template>
  <div>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :router="true">
      <el-menu-item index="/">Home</el-menu-item>
      <el-menu-item index="/instructions">Instructions</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  data () {
    return {
        activeIndex: this.$router.currentRoute.path
    }
  }
}
</script>