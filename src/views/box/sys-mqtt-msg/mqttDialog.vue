<template>
  <el-dialog
    width="70%"
    title="MQTT信息"
    :fullscreen="false"
    :visible.sync="dialogShow"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
  >
    <json-viewer
      :value="JSON.parse(contentForm)"
      :expand-depth="5"
      copyable
      boxed
    />
  </el-dialog>
</template>

<script>
export default {
  components: {},
  props: {
    show: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    content: {
      type: String,
      default: '',
      required: true
    }
  },
  data() {
    return {
      dialogShow: this.show,
      contentForm: ''
    }
  },
  watch: {
    content: {
      handler(newValue, oldValue) {
        this.contentForm = newValue
      },
      deep: true,
      immediate: true
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
