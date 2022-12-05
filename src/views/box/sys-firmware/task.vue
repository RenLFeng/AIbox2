<template>
  <el-dialog
    width="75%"
    title="升级信息"
    :fullscreen="false"
    :visible.sync="dialogShow"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="升级任务" name="first">
        <firm-update :firm-id="formData.id" />
      </el-tab-pane>
      <el-tab-pane label="升级记录" name="second">
        <log-update :firm-id="formData.id" />
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import firmUpdate from './components/firmwareUpdate'
import logUpdate from './components/firmwareLog'
export default {
  components: {
    firmUpdate,
    logUpdate
  },
  props: {
    show: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    id: {
      type: String,
      default: '',
      required: true
    }
  },
  data() {
    return {
      dialogShow: this.show,
      activeName: 'first',
      formData: {
        id: undefined //
      }
    }
  },
  watch: {
    id: {
      handler(newValue, oldValue) {
        this.formData.id = newValue
      },
      deep: true
    },
    show: {
      handler(newValue, oldValue) {
        this.dialogShow = newValue
      },
      deep: true
    },
    // 子控件显示状态改变，执行父级showChange方法
    dialogShow: {
      handler(newValue, oldeValue) {
        this.$emit('showChange', newValue)
      },
      deep: true
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped></style>
