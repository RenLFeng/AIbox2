<template>
  <el-card style="width: 100%; padding: 10px">
    <el-table
      v-loading="loading"
      :data="sysaiList"
      row-key="aiId"
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="编号"
        align="center"
        prop="aiId"
        width="80"
      /><el-table-column
        label="算法名称"
        align="center"
        prop="aiName"
        :show-overflow-tooltip="true"
      />
      <el-table-column prop="sort" align="center" label="排序" width="80" />
      <el-table-column label="关联表名" align="center" prop="aiTable" />
      <el-table-column
        label="算法权重"
        align="center"
        prop="aiWeight"
        width="80"
      />
      <el-table-column
        label="算法描述"
        align="center"
        prop="aiDescribe"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="更新时间" align="center" prop="updatedAt">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updatedAt) }}</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import { getAiListPackage } from '@/api/box/sys-ai'

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
      sysaiList: [],
      aiEnableOptions: [],
      // 查询参数
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        aiName: undefined,
        aiEnable: '1',
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
    this.getDicts('sys_device_status').then(response => {
      this.aiEnableOptions = response.data
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
      getAiListPackage(
        this.addDateRange(this.queryParams, this.dateRange)
      ).then(response => {
        this.sysaiList = response.data
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
    aiEnableFormat(row) {
      return this.selectDictLabel(this.aiEnableOptions, row.aiEnable)
    }
  }
}
</script>

<style lang="scss" scoped></style>
