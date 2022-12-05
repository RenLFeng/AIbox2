<template>
  <div>
    <div style="float:left;margin:0 10px 0 0">
      <box-chart-card
        :bordered="false"
        title="设备状态"
        style="width: 300px"
        :total="statusForm"
        :show-footer="false"
      >
        <el-tooltip slot="action" content="刷新">
          <el-button
            icon="el-icon-refresh-left"
            size="mini"
            circle
            @click="setReload"
          />
        </el-tooltip>

        <span v-if="statusForm === '离线' " style="color: red"> 离线时间：{{ time }}</span>
      </box-chart-card>
    </div>
    <div
      v-for="(u, i) in aisArray"
      :key="i"
      style="float:left;margin:0 5px 0 0"
    >
      <box-chart-card
        :bordered="false"
        :title="u.aiName"
        style="width: 300px"
        :total="u.status === '0' ? '离线' : '在线'"
        :show-footer="false"
      >
        <el-tooltip slot="action" content="刷新">
          <el-button
            icon="el-icon-refresh-left"
            size="mini"
            circle
            @click="setReload"
          />
        </el-tooltip>
        <span v-if="u.status === '0'" style="color: red">
          离线时间：{{ u.updatedAt.substring(0, 19).replace("T", " ") }}</span>
      </box-chart-card>
    </div>
  </div>
</template>

<script>

import moment from 'moment'
import BoxChartCard from './BoxChartCard'
export default {
  name: 'EditorDetailStatus',
  components: {
    BoxChartCard
  },
  props: {
    status: {
      type: String,
      default: '',
      required: true
    },
    timeAt: {
      type: String,
      default: '',
      required: true
    },
    aisNpu: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      statusForm: '',
      time: '',
      aisArray: []
    }
  },
  watch: {
    status: {
      handler(newValue, oldValue) {
        if (newValue === '0') {
          this.statusForm = '离线'
        } else {
          this.statusForm = '在线'
        }
      },
      deep: true,
      immediate: true
    },
    timeAt: {
      handler(newValue, oldValue) {
        if (newValue) {
          this.time = newValue.substring(0, 19).replace('T', ' ')
        }
      },
      deep: true,
      immediate: true
    },
    aisNpu: {
      handler(newValue, oldValue) {
        this.aisArray = newValue
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    GetTime(time) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    },
    setReload() {
      this.$emit('ok')
    }
  }
}
</script>

<style lang="scss" scoped></style>
