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
            <el-form-item label="固件" prop="firmId">
              <el-select
                v-model="queryParams.firmId"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="dict in sysFirmwareNameList"
                  :key="dict.firmId"
                  :label="dict.firmName"
                  :value="dict.firmId"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="任务名称"
              prop="upgradeName"
            ><el-input
              v-model="queryParams.upgradeName"
              placeholder="请输入升级任务名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
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
                v-permisaction="['admin:sysupgrade:add']"
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="handleAdd"
              >新增
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                v-permisaction="['admin:sysupgrade:edit']"
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
                v-permisaction="['admin:sysupgrade:remove']"
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
            :data="sysupgradeList"
            @selection-change="handleSelectionChange"
            @sort-change="handleSortChang"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column
              label="编号"
              align="center"
              prop="upgradeId"
              sortable="custom"
            />
            <el-table-column
              label="固件"
              align="center"
              prop="firm.firmName"
              sortable="custom"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="升级任务名称"
              align="center"
              prop="upgradeName"
              sortable="custom"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="推送方式"
              align="center"
              prop="pushType"
              :formatter="pushTypeFormat"
              width="100"
            >
              <template slot-scope="scope">
                {{ pushTypeFormat(scope.row) }}
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
            <el-table-column
              label="操作"
              align="center"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-button
                  v-permisaction="['admin:sysupgrade:edit']"
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row)"
                >修改
                </el-button>
                <el-button
                  v-permisaction="['admin:sysupgrade:remove']"
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
              <!--            <el-form-item label="固件版本" prop="firmId">-->
              <!--              <el-input-->
              <!--                v-model="form.firmId"-->
              <!--                placeholder="固件ID"-->
              <!--              />-->
              <!--            </el-form-item>-->
              <el-form-item label="所属固件" prop="firmId">
                <el-select
                  v-model="queryParams.firmId"
                  placeholder="请选择"
                  clearable
                >
                  <el-option
                    v-for="dict in sysFirmwareNameList"
                    :key="dict.firmId"
                    :label="dict.firmName"
                    :value="dict.firmId"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="任务名称" prop="upgradeName">
                <el-input
                  v-model="form.upgradeName"
                  placeholder="升级任务名称"
                />
              </el-form-item>
              <el-form-item label="超时时间" prop="timeout">
                <el-input v-model="form.timeout" placeholder="超时时间" />
              </el-form-item>
              <el-form-item label="推送方式" prop="pushType">
                <el-select v-model="form.pushType" placeholder="请选择">
                  <el-option
                    v-for="dict in pushTypeOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="升级说明" prop="upgradeDescribe">
                <el-input
                  v-model="form.upgradeDescribe"
                  placeholder="升级说明使用场景等"
                />
              </el-form-item>
              <el-form-item label="升级备注" prop="upgradeNote">
                <el-input v-model="form.upgradeNote" placeholder="升级备注" />
              </el-form-item>
            </el-form>
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
  addSysUpgrade,
  delSysUpgrade,
  getSysUpgrade,
  listSysUpgrade,
  updateSysUpgrade
} from '@/api/box/sys-upgrade'
import { getAllFirmwareName } from '@/api/box/sys-firmware'

export default {
  name: 'SysUpgrade',
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
      sysupgradeList: [],
      pushTypeOptions: [],
      sysFirmwareNameList: [],
      // 关系表类型

      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        firmId: undefined,
        upgradeName: undefined,
        pushType: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        firmId: [
          { required: true, message: '固件ID不能为空', trigger: 'blur' }
        ],
        upgradeName: [
          { required: true, message: '升级任务名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getDicts('sys_upgrade_push').then(response => {
      this.pushTypeOptions = response.data
    })
    this.getAllFirmwareName()
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listSysUpgrade(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.sysupgradeList = response.data.list
          this.total = response.data.count
          this.loading = false
        }
      )
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        upgradeId: undefined,
        firmId: undefined,
        upgradeName: undefined,
        timeout: undefined,
        pushType: undefined,
        upgradeDescribe: undefined,
        upgradeNote: undefined
      }
      this.resetForm('form')
    },
    getImgList: function() {
      this.form[this.fileIndex] = this.$refs['fileChoose'].resultList[0].fullUrl
    },
    fileClose: function() {
      this.fileOpen = false
    },
    pushTypeFormat(row) {
      return this.selectDictLabel(this.pushTypeOptions, row.pushType)
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
      this.title = '添加固件升级表'
      this.isEdit = false
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.upgradeId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const upgradeId = row.upgradeId || this.ids
      getSysUpgrade(upgradeId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改固件升级表'
        this.isEdit = true
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.upgradeId !== undefined) {
            updateSysUpgrade(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addSysUpgrade(this.form).then(response => {
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
      var Ids = (row.upgradeId && [row.upgradeId]) || this.ids

      this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(function() {
          return delSysUpgrade({ ids: Ids })
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
    /** 查询FirmwareName参数列表 */
    getAllFirmwareName() {
      getAllFirmwareName().then(response => {
        this.sysFirmwareNameList = response.data
        // console.log(this.sysBoxNameList)
      })
    }
  }
}
</script>
<style lang="scss"></style>
