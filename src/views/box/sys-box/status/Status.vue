<template>
  <!--  <el-spinner :spinning="false">-->
  <el-row id="device-instance-status" :gutter="24">
    <el-col>
      <editor-detail-status />
    </el-col>
  </el-row>
<!--  </el-spinner>-->
</template>

<script>
import EditorDetailStatus from '@/views/box/sys-box/status/DeviceState'
export default {
  name: 'InsEditorStatus',
  components: {
    EditorDetailStatus
  }
}
</script>

<style lang="scss" scoped>

</style>
