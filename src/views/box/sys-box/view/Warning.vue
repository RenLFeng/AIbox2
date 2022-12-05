<template>
  <div>
    <el-card style="padding: 10px">
      <el-table
        v-loading="loading"
        :data="sysalarmdataList"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChang"
      >
        <el-table-column
          label="编号"
          align="center"
          prop="alarmId"
          sortable="custom"
        />
        <el-table-column
          label="所属产品"
          align="center"
          prop="prod.prodName"
          sortable="custom"
        />
        <el-table-column
          label="所属盒子"
          align="center"
          prop="box.boxName"
          sortable="custom"
        /><el-table-column
          label="所属摄像头"
          align="center"
          prop="cam.camName"
          sortable="custom"
        /><el-table-column
          label="所属算法"
          align="center"
          prop="ai.aiName"
          sortable="custom"
        /><el-table-column
          label="告警类型"
          align="center"
          prop="aiId"
          sortable="custom"
        /><el-table-column
          label="告警名称"
          align="center"
          prop="alarmName"
          sortable="custom"
          :show-overflow-tooltip="true"
        /><el-table-column
          label="处理状态"
          align="center"
          prop="isConfirm"
          :formatter="isConfirmFormat"
          width="100"
          sortable="custom"
        >
          <template slot-scope="scope">
            {{ isConfirmFormat(scope.row) }}
          </template> </el-table-column><el-table-column
          label="推送云"
          align="center"
          prop="isPush"
          :formatter="isPushFormat"
          width="100"
          sortable="custom"
        >
          <template slot-scope="scope">
            {{ isPushFormat(scope.row) }}
          </template> </el-table-column><el-table-column
          label="创建时间"
          align="center"
          prop="createdAt"
          :show-overflow-tooltip="true"
          sortable="custom"
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
    </el-card>
  </div>
</template>

<script>
import { listSysAlarmData } from '@/api/box/sys-alarm-data'

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
      sysalarmdataList: [],
      isConfirmOptions: [],
      isPushOptions: [],
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        alarmId: undefined,
        prodId: undefined,
        boxId: undefined,
        camId: undefined,
        aiId: undefined,
        isConfirm: undefined,
        isPush: undefined,
        createdAt: undefined
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
    this.getDicts('sys_alarm_confirm').then(response => {
      this.isConfirmOptions = response.data
    })
    this.getDicts('sys_alarm_push').then(response => {
      this.isPushOptions = response.data
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
      listSysAlarmData(
        this.addDateRange(this.queryParams, this.dateRange)
      ).then(response => {
        this.sysalarmdataList = response.data.list
        this.total = response.data.count
        this.loading = false
      })
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
    isConfirmFormat(row) {
      return this.selectDictLabel(this.isConfirmOptions, row.isConfirm)
    },
    isPushFormat(row) {
      return this.selectDictLabel(this.isPushOptions, row.isPush)
    }
  }
}
</script>

<style lang="scss" scoped></style>
