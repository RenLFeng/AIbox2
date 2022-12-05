<template>
  <el-card style="width: 100%; height: 100%; padding: 10px">
    <el-row>
      <el-col :span="12">
        <json-viewer
          :value="formDataBox"
          :expand-depth="5"
          copyable
        />
      </el-col>
      <el-col :span="12">
        <json-viewer
          :value="formDataNpu"
          :expand-depth="5"
          copyable
        />
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { getBoxShadow, getBoxAiConfig } from '@/api/box/sys-box'

export default {
  name: 'ProWarnSetting',
  components: {},
  props: {
    boxIp: {
      type: String,
      default: '',
      required: true
    },
    show: {
      type: Boolean,
      default: function() {
        return false
      }
    }
  },
  data() {
    return {
      formDataBox: {},
      dialogShow: this.show,
      formDataNpu: [],
      // 查询参数
      queryParams: {
        boxIp: ''
      }
    }
  },
  watch: {
    boxIp: {
      handler(newValue, oldValue) {
        // console.log('newValue boxIp ' + newValue)
        this.queryParams.boxIp = newValue
        if (this.queryParams.boxIp) this.getList()
        // this.getList()
      },
      deep: true,
      immediate: true
    },
    // 监听父组件传来的参数变化
    show: {
      handler(newValue, oldValue) {
        // console.log('newValue show  ' + newValue)
        this.dialogShow = newValue
        if (newValue) {
          if (this.boxIp) {
            this.getList()
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    // this.queryParams.prodId = this.prodId;
  },

  methods: {
    getList() {
      // console.log('getList 执行')
      getBoxShadow(this.queryParams.boxIp).then(response => {
        this.formDataBox = response.data
      })
      getBoxAiConfig(this.queryParams.boxIp).then(response => {
        this.formDataNpu = response.data
      })
    }
  }

}
</script>

<style lang="scss" scoped></style>
