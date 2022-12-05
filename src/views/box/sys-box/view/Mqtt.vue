<template>
  <el-card style="width: 100%; padding: 10px">
    <el-table
      v-loading="loading"
      :data="sysmqttmsgList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        label="盒子id"
        align="center"
        prop="boxId"
        :show-overflow-tooltip="true"
      /><el-table-column
        label="发送消息的客户端ID"
        align="center"
        prop="publishClientId"
        :show-overflow-tooltip="true"
      /><el-table-column
        label="需处理的设备Sno号"
        align="center"
        prop="mqttDeviceId"
        :show-overflow-tooltip="true"
      /><el-table-column
        label="请求消息ID"
        align="center"
        prop="mqttRequestId"
        :show-overflow-tooltip="true"
      /><el-table-column
        label="主题名称"
        align="center"
        prop="mqttTopicName"
        :show-overflow-tooltip="true"
      /><el-table-column
        label="QOS等级"
        align="center"
        prop="mqttQos"
        :formatter="mqttQosFormat"
        width="100"
      >
        <template slot-scope="scope">
          {{ mqttQosFormat(scope.row) }}
        </template> </el-table-column><el-table-column
        label="消息类别"
        align="center"
        prop="mqttType"
        :formatter="mqttTypeFormat"
        width="100"
      >
        <template slot-scope="scope">
          {{ mqttTypeFormat(scope.row) }}
        </template> </el-table-column><el-table-column
        label="消息类型"
        align="center"
        prop="mqttForm"
        :formatter="mqttFormFormat"
        width="100"
      >
        <template slot-scope="scope">
          {{ mqttFormFormat(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column
        label="消息状态"
        align="center"
        prop="mqttStatus"
        :formatter="mqttStatusFormat"
        width="100"
      >
        <template slot-scope="scope">
          {{ mqttStatusFormat(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column
        label="消息内容"
        align="center"
        prop="mqttMsg"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="showMqttMsg(scope.row.mqttMsg)"
          >显示消息内容</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createdAt"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createdAt) }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageIndex"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <mqtt-dialog
      :show="editDialog.show"
      :content="editDialog.content"
      @showChange="editDialogToggle"
    />
  </el-card>
</template>

<script>
import { listSysMqttMsg } from '@/api/box/sys-mqtt-msg'
import mqttDialog from './mqttDialog.vue'
export default {
  name: 'ProWarnSetting',
  components: {
    mqttDialog
  },
  props: {
    boxId: {
      type: Number,
      default: 0,
      required: true
    }
  },
  data() {
    return {
      ProWarnSetting: 'first',
      // 非单个禁用
      single: true,
      loading: false,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 弹出层标题
      title: '',
      typeOptions: [],
      sysmqttmsgList: [],
      mqttQosOptions: [],
      mqttTypeOptions: [],
      mqttFormOptions: [],
      mqttStatusOptions: [],
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        boxId: undefined,
        mqttDeviceId: undefined
      },
      editDialog: {
        show: false,
        content: ''
      }
    }
  },
  watch: {
    boxId: {
      handler(newValue, oldValue) {
        this.queryParams.boxId = newValue
        this.getList()
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    // this.queryParams.prodId = this.prodId;
    this.getDicts('sys_mqtt_qos').then(response => {
      this.mqttQosOptions = response.data
    })
    this.getDicts('sys_mqtt_type').then(response => {
      this.mqttTypeOptions = response.data
    })
    this.getDicts('sys_mqtt_form').then(response => {
      this.mqttFormOptions = response.data
    })
    this.getDicts('sys_mqtt_status').then(response => {
      this.mqttStatusOptions = response.data
    })
  },

  methods: {
    handleClick(tab, event) {
      // console.log(tab, event)
      // const { prodId } = this.$route.query
      // if (prodId) {
      //
      // }
    },
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listSysMqttMsg(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.sysmqttmsgList = response.data.list
          this.total = response.data.count
          this.loading = false
        }
      )
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.alarmId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 排序回调函数 */
    handleSortChang(column, prop, order) {
      prop = column.prop
      order = column.order
      if (this.order !== '' && this.order !== prop + 'Order') {
        this.queryParams[this.order] = undefined
      }
      if (order === 'descending') {
        this.queryParams[prop + 'Order'] = 'desc'
        this.order = prop + 'Order'
      } else if (order === 'ascending') {
        this.queryParams[prop + 'Order'] = 'asc'
        this.order = prop + 'Order'
      } else {
        this.queryParams[prop + 'Order'] = undefined
      }
      this.getList()
    },
    camManufacturerFormat(row) {
      return this.selectDictLabel(
        this.camManufacturerOptions,
        row.camManufacturer
      )
    },
    mqttQosFormat(row) {
      return this.selectDictLabel(this.mqttQosOptions, row.mqttQos)
    },
    mqttTypeFormat(row) {
      return this.selectDictLabel(this.mqttTypeOptions, row.mqttType)
    },
    mqttFormFormat(row) {
      return this.selectDictLabel(this.mqttFormOptions, row.mqttForm)
    },
    mqttStatusFormat(row) {
      return this.selectDictLabel(this.mqttStatusOptions, row.mqttStatus)
    },
    showMqttMsg(msg) {
      this.editDialog.show = true
      this.editDialog.content = msg || '4444'
    },
    editDialogToggle(value) {
      const _this = this
      _this.editDialog.show = value
    }
  }
}
</script>

<style lang="scss" scoped></style>
