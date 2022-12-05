<template>
  <el-card
    style="width:100%;padding:10px"
  >
    <el-tabs v-model="ProPyhModel" type="card" @tab-click="handleClick">
      <el-tab-pane label="属性定义" name="first">属性定义 {{ prodId }}</el-tab-pane>
      <el-tab-pane label="功能定义" name="second">功能定义</el-tab-pane>
      <el-tab-pane label="事件定义" name="third">事件定义</el-tab-pane>
      <el-tab-pane label="标签定义" name="fourth">标签定义</el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>

export default {
  name: 'ProPhyModel',
  components: {

  },
  props: {
    prodId: {
      type: String,
      default: '',
      required: true
    }
  },
  data() {
    return {
      ProPyhModel: 'first'
    }
  },
  created() {

  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event)
      // const { prodId } = this.$route.query
      // if (prodId) {
      //
      // }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
