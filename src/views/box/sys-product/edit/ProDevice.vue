<template>
  <el-card style="width: 100%; padding: 10px">
    <el-table
      v-loading="loading"
      :data="sysboxList"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChang"
    >
      <el-table-column
        label="编号"
        align="center"
        width="75"
        prop="boxId"
        sortable="custom"
      />
      <el-table-column
        label="盒子名称"
        align="center"
        prop="boxName"
        sortable="custom"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="产品"
        align="center"
        prop="prod.prodName"
        sortable="custom"
      />
      <el-table-column
        label="机构"
        align="center"
        prop="dept.deptName"
        sortable="custom"
      />
      <el-table-column label="序列号" align="center" prop="boxSno" />
      <el-table-column
        label="IP"
        align="center"
        prop="boxIp"
        sortable="custom"
      />
      <el-table-column label="型号" align="center" prop="boxModel" />
      <el-table-column label="算法" align="center" prop="boxType" width="100">
        <template slot-scope="scope">
          {{ boxTypeFormat(scope.row) }}
        </template>
      </el-table-column>

      <el-table-column label="状态" align="center" sortable="custom">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.boxStatus === '0' ? 'danger' : 'success'"
            disable-transitions
          >{{ boxStatusFormat(scope.row) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="激活时间"
        align="center"
        prop="registryAt"
        sortable="custom"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.registryAt) }}</span>
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
import { listSysBox } from '@/api/box/sys-box'
export default {
  name: 'ProPhyModel',
  components: {},
  props: {
    prodId: {
      type: String,
      default: '',
      required: true
    }
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 弹出层标题
      title: '',
      // 类型数据字典
      typeOptions: [],
      sysboxList: [],
      sysboxListByIP: [],
      boxTypeOptions: [],
      transportProtocolOptions: [],
      networkWayOptions: [],
      boxStatusOptions: [],
      deptOptions: [],
      // 关系表类型
      // 产品
      prodOptions: [],
      multipleSelection: [],
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        pId: undefined,
        deptId: undefined,
        parentId: undefined,
        boxName: undefined,
        boxStatus: undefined
      }
    }
  },
  watch: {
    prodId: {
      handler(newValue, oldValue) {
        this.queryParams.pId = newValue
        this.getList()
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.getDicts('sys_box_status').then(response => {
      this.boxStatusOptions = response.data
    })
    this.getDicts('sys_prod_type').then(response => {
      this.boxTypeOptions = response.data
    })
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listSysBox(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.sysboxList = response.data.list
          this.total = response.data.count
          this.loading = false
        }
      )
    },
    boxTypeFormat(row) {
      return this.selectDictLabel(this.boxTypeOptions, row.boxType)
    },
    transportProtocolFormat(row) {
      return this.selectDictLabel(
        this.transportProtocolOptions,
        row.transportProtocol
      )
    },
    networkWayFormat(row) {
      return this.selectDictLabel(this.networkWayOptions, row.networkWay)
    },
    boxStatusFormat(row) {
      return this.selectDictLabel(this.boxStatusOptions, row.boxStatus)
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.boxId)
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
    }
  }
}
</script>

<style lang="scss" scoped></style>
