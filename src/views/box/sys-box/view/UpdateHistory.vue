<template>
  <el-card style="width: 100%; padding: 10px">
    <el-table
      v-loading="loading"
      :data="sysupgradehistoryList"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChang"
    >
      <el-table-column
        label="升级主任务"
        align="center"
        prop="upgrade.upgradeName"
        :show-overflow-tooltip="true"
        sortable="custom"
      />
      <el-table-column
        label="盒子ID"
        align="center"
        prop="box.boxName"
        :show-overflow-tooltip="true"
        sortable="custom"
      />
      <el-table-column
        label="升级状态"
        align="center"
        prop="upgradeState"
        sortable="custom"
        :formatter="upgradeStateFormat"
        width="100"
      >
        <template slot-scope="scope">
          {{ upgradeStateFormat(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column
        label="升级进度"
        align="center"
        prop="upgradeRate"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createdAt"
        sortable="custom"
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
  </el-card>
</template>

<script>
import { listSysUpgradeHistory } from '@/api/box/sys-upgrade-history'

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
      sysupgradehistoryList: [],
      upgradeStateOptions: [],
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        upgradeId: undefined,
        boxId: undefined
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
    this.getDicts('sys_upgrade_state').then(response => {
      this.upgradeStateOptions = response.data
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
      listSysUpgradeHistory(
        this.addDateRange(this.queryParams, this.dateRange)
      ).then(response => {
        this.sysupgradehistoryList = response.data.list
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
    upgradeStateFormat(row) {
      return this.selectDictLabel(this.upgradeStateOptions, row.upgradeState)
    }
  }
}
</script>

<style lang="scss" scoped></style>
