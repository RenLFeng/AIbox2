<template>
  <BasicLayout>
    <template #wrapper>
      <div class="main-box">
        <el-card class="box-card">
          <el-form
            ref="queryForm"
            :model="queryParams"
            :inline="true"
            label-width="68px"
          >
            <el-form-item label="升级主任务名称" prop="upgradeId">
              <el-select
                v-model="queryParams.upgradeId"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="dict in sysUpgradeNameList"
                  :key="dict.upgradeId"
                  :label="dict.upgradeName"
                  :value="dict.upgradeId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="所属盒子" prop="boxId">
              <el-select
                v-model="queryParams.boxId"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="dict in sysBoxNameList"
                  :key="dict.boxId"
                  :label="dict.boxName"
                  :value="dict.boxId"
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

          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button
                v-permisaction="['admin:sysupgradehistory:add']"
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="handleAdd"
              >新增
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                v-permisaction="['admin:sysupgradehistory:edit']"
                type="success"
                icon="el-icon-edit"
                size="mini"
                :disabled="single"
                @click="handleUpdate"
              >修改
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                v-permisaction="['admin:sysupgradehistory:remove']"
                type="danger"
                icon="el-icon-delete"
                size="mini"
                :disabled="multiple"
                @click="handleDelete"
              >删除
              </el-button>
            </el-col>
          </el-row>

          <el-table
            v-loading="loading"
            :data="sysupgradehistoryList"
            @selection-change="handleSelectionChange"
            @sort-change="handleSortChang"
          >
            <el-table-column type="selection" width="55" align="center" />
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
            <el-table-column
              label="操作"
              align="center"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-button
                  v-permisaction="['admin:sysupgradehistory:edit']"
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row)"
                >修改
                </el-button>
                <el-button
                  v-permisaction="['admin:sysupgradehistory:remove']"
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                >删除
                </el-button>
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

          <!-- 添加或修改对话框 -->
          <el-dialog :title="title" :visible.sync="open" width="500px">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
              <el-form-item label="升级主任务" prop="upgradeId">
                <el-select
                  v-model="queryParams.upgradeId"
                  placeholder="请选择升级主任务"
                  clearable
                >
                  <el-option
                    v-for="dict in sysUpgradeNameList"
                    :key="dict.upgradeId"
                    :label="dict.upgradeName"
                    :value="dict.upgradeId"
                  />
                </el-select>
                <el-form-item label="所属盒子" prop="boxId">
                  <el-select
                    v-model="queryParams.boxId"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="dict in sysBoxNameList"
                      :key="dict.boxId"
                      :label="dict.boxName"
                      :value="dict.boxId"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="升级状态" prop="upgradeState">
                  <el-input
                    v-model="form.upgradeState"
                    placeholder="升级状态"
                  />
                </el-form-item>
                <el-form-item label="升级进度" prop="upgradeRate">
                  <el-input v-model="form.upgradeRate" placeholder="升级进度" />
                </el-form-item> </el-form-item></el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="submitForm">确 定</el-button>
              <el-button @click="cancel">取 消</el-button>
            </div>
          </el-dialog>
        </el-card>
      </div>
    </template>
  </BasicLayout>
</template>

<script>
import {
  addSysUpgradeHistory,
  delSysUpgradeHistory,
  getSysUpgradeHistory,
  listSysUpgradeHistory,
  updateSysUpgradeHistory
} from '@/api/box/sys-upgrade-history'
import { getAllBoxName } from '@/api/box/sys-box'
import { getAllUpgradeName } from '@/api/box/sys-upgrade'

export default {
  name: 'SysUpgradeHistory',
  components: {},
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
        upgradeId: undefined,
        boxId: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        upgradeId: [
          { required: true, message: '升级主任务ID不能为空', trigger: 'blur' }
        ],
        boxId: [{ required: true, message: '盒子ID不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
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
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        historyId: undefined,
        upgradeId: undefined,
        boxId: undefined,
        upgradeState: undefined,
        upgradeRate: undefined
      }
      this.resetForm('form')
    },
    getImgList: function() {
      this.form[this.fileIndex] = this.$refs['fileChoose'].resultList[0].fullUrl
    },
    fileClose: function() {
      this.fileOpen = false
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加固件升级历史表'
      this.isEdit = false
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.historyId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const historyId = row.historyId || this.ids
      getSysUpgradeHistory(historyId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改固件升级历史表'
        this.isEdit = true
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.historyId !== undefined) {
            updateSysUpgradeHistory(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addSysUpgradeHistory(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      var Ids = (row.historyId && [row.historyId]) || this.ids

      this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(function() {
          return delSysUpgradeHistory({ ids: Ids })
        })
        .then(response => {
          if (response.code === 200) {
            this.msgSuccess(response.msg)
            this.open = false
            this.getList()
          } else {
            this.msgError(response.msg)
          }
        })
        .catch(function() {})
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
