<template>
  <el-card style="width: 100%; padding: 10px">
    <el-table
      v-loading="loading"
      :data="syscameraList"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChang"
    >
      <el-table-column
        label="编号"
        align="center"
        prop="camId"
        sortable="custom"
      /><el-table-column
        label="名称"
        align="center"
        prop="camName"
        sortable="custom"
        :show-overflow-tooltip="true"
      /><el-table-column
        label="型号"
        align="center"
        prop="camModel"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.camModel === ''">暂无</div>
          <div v-else>{{ scope.row.camModel }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="厂商"
        align="center"
        prop="camManufacturer"
        sortable="custom"
        :formatter="camManufacturerFormat"
      >
        <template slot-scope="scope">
          {{ camManufacturerFormat(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column
        label="IP地址"
        align="center"
        prop="camIp"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="IP状态"
        width="90"
        align="center"
        sortable="custom"
      >
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.camOnlineStatus === '0' ? 'danger' : 'success'"
            disable-transitions
          >{{ camOnlineStatusFormat(scope.row) }}
          </el-tag>
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
  </el-card>
</template>

<script>
import { listSysBoxCam } from '@/api/box/sys-box'

export default {
  name: 'ProWarnSetting',
  components: {},
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
      syscameraList: [],
      camManufacturerOptions: [],
      camTypeOptions: [],
      camFormOptions: [],
      camEnableOptions: [],
      camOnlineStatusOptions: [],
      camAlarmStatusOptions: [],
      camAiStatusOptions: [],
      // 查询参数
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        boxId: 0,
        createdAtOrder: 'desc'
      }
    }
  },
  watch: {
    boxId: {
      handler(newValue, oldValue) {
        this.queryParams.boxId = newValue
        // console.info('Camera boxID watch' + this.queryParams.boxId)
        if (this.queryParams.boxId !== 0) this.getList()
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.getDicts('sys_cam_manu').then(response => {
      this.camManufacturerOptions = response.data
    })
    // this.getDicts('sys_cam_model').then(response => {
    //   this.camTypeOptions = response.data
    // })
    // this.getDicts('sys_cam_form').then(response => {
    //   this.camFormOptions = response.data
    // })
    // this.getDicts('sys_cam_status').then(response => {
    //   this.camEnableOptions = response.data
    //   // console.log(this.camEnableOptions)
    // })
    this.getDicts('sys_box_status').then(response => {
      this.camOnlineStatusOptions = response.data
    })
    // this.getDicts('sys_alarm_switch').then(response => {
    //   this.camAlarmStatusOptions = response.data
    // })
    // this.getDicts('sys_ai_stauts').then(response => {
    //   this.camAiStatusOptions = response.data
    // })
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
      // console.info('listSysBoxCam queryParams' + JSON.stringify(this.queryParams))
      listSysBoxCam(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          // console.info('listSysBoxCam' + JSON.stringify(response.data.list))
          this.syscameraList = response.data.list
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
    camTypeFormat(row) {
      return this.selectDictLabel(this.camTypeOptions, row.camType)
    },
    camFormFormat(row) {
      return this.selectDictLabel(this.camFormOptions, row.camForm)
    },
    camEnableFormat(row) {
      return this.selectDictLabel(this.camEnableOptions, row.camEnable)
    },
    camOnlineStatusFormat(row) {
      return this.selectDictLabel(
        this.camOnlineStatusOptions,
        row.camOnlineStatus
      )
    },
    camAlarmStatusFormat(row) {
      return this.selectDictLabel(
        this.camAlarmStatusOptions,
        row.camAlarmStatus
      )
    },
    camAiStatusFormat(row) {
      return this.selectDictLabel(this.camAiStatusOptions, row.camAiStatus)
    }
  }
}
</script>

<style lang="scss" scoped></style>
