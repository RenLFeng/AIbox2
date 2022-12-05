<template>
  <div>
    <!-- <el-button><svg-icon icon-class="menu" /></el-button> -->
    <el-popover
      placement="bottom"
      title="标题"
      width="200"
      trigger="click"
    >
      <el-checkbox v-model="showState.showCol">编号</el-checkbox>
      <el-checkbox v-model="showState.camName">摄像头名称</el-checkbox>
      <el-checkbox v-model="showState.camManufacturer">厂商</el-checkbox>
      <el-checkbox v-model="showState.camModel">型号</el-checkbox>
      <el-checkbox v-model="showState.camType">外观类型</el-checkbox>
      <el-checkbox v-model="showState.camForm">传输类型</el-checkbox>
      <el-checkbox v-model="showState.camIp">IP地址</el-checkbox>
      <el-checkbox v-model="showState.sound">关联音响</el-checkbox>
      <el-checkbox v-model="showState.box">关联盒子</el-checkbox>
      <el-checkbox v-model="showState.algorithm">算法</el-checkbox>
      <el-checkbox v-model="showState.IPState">IP状态</el-checkbox>
      <el-button slot="reference" size="medium"><svg-icon icon-class="menu" /></el-button>
    </el-popover>
  </div>
</template>
<script>
export default {
  name: 'SysShowState',
  props: {
    showState: {
      require: true,
      default: true
    }
  }

  // data() {
  //   return {
  //     showState: {
  //       camManufacturerChecked: true
  //     }
  //   }
  // }
}
</script>
