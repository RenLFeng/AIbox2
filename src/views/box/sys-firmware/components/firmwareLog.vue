<template>
  <BasicLayout>
    <template #wrapper>
      <div class="main-box">
        <el-form ref="queryForm" :model="queryParams" :inline="true">
          <el-form-item label="升级主任务名称" prop="upgradeId">
            <el-select
              v-model="queryParams.upId"
              placeholder="请选择"
              clearable
              size="mini"
            >
              <el-option
                v-for="dict in sysUpgradeNameList"
                :key="dict.upgradeId"
                :label="dict.upgradeName"
                :value="dict.upgradeId"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
            >搜索</el-button>
            <el-button
              icon="el-icon-refresh"
              size="mini"
              @click="resetQuery"
            >重置</el-button>
          </el-form-item>
        </el-form>

        <el-table
          v-loading="loading"
          :data="sysupgradehistoryList"
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
            label="盒子名称"
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
          >
            <template slot-scope="scope">
              <el-progress
                v-if="scope.row.upgradeRate"
                :text-inside="true"
                :stroke-width="22"
                status="success"
                :percentage="scope.row.upgradeRate"
              />
            </template>
          </el-table-column>
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
      </div>
    </template>
  </BasicLayout>
</template>

<script>
import { listSysUpgradeHistory } from '@/api/box/sys-upgrade-history'
import { getAllBoxName } from '@/api/box/sys-box'
import { getAllUpgradeName } from '@/api/box/sys-upgrade'

export default {
  name: 'SysUpgradeHistory',
  components: {},
  props: {
    firmId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      isEdit: false,
      // 类型数据字典
      typeOptions: [],
      sysupgradehistoryList: [],
      upgradeStateOptions: [],
      // 关系表类型

      // 名称字典
      sysBoxNameList: [],
      sysUpgradeNameList: [],
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        upId: undefined,
        boxId: undefined,
        firmId: undefined
      },
      // 表单参数
      form: {}
    }
  },
  watch: {
    firmId: {
      handler(newValue, oldValue) {
        this.queryParams.firmId = newValue
        if (this.queryParams.firmId) {
          this.getList()
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    // this.getList();
    this.getDicts('sys_upgrade_state').then(response => {
      this.upgradeStateOptions = response.data
    })
    this.getAllBoxName()
    this.getAllUpgradeName()
  },
  methods: {
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
    upgradeStateFormat(row) {
      return this.selectDictLabel(this.upgradeStateOptions, row.upgradeState)
    },
    // 关系
    // 文件
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageIndex = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.historyId)
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
    /** 查询BoxName参数列表 */
    getAllBoxName() {
      getAllBoxName().then(response => {
        this.sysBoxNameList = response.data
        // console.log(this.sysBoxNameList)
      })
    },
    /** 查询UpgradeName参数列表 */
    getAllUpgradeName() {
      getAllUpgradeName().then(response => {
        this.sysUpgradeNameList = response.data
        // console.log(this.sysBoxNameList)
      })
    }
  }
}
</script>
<style lang="scss"></style>
