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
            <el-form-item label="所属产品" prop="prodId">
              <el-select
                v-model="queryParams.prodId"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="dict in sysProductNameList"
                  :key="dict.prodId"
                  :label="dict.prodName"
                  :value="dict.prodId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="所属算法" prop="aiId">
              <el-select
                v-model="queryParams.aiId"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="dict in sysAiNameList"
                  :key="dict.aiId"
                  :label="dict.aiName"
                  :value="dict.aiId"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="固件名称"
              prop="firmName"
            ><el-input
              v-model="queryParams.firmName"
              placeholder="请输入固件名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
            </el-form-item>
            <el-form-item
              label="算法版本"
              prop="aiVersion"
            ><el-input
              v-model="queryParams.aiVersion"
              placeholder="请输入算法版本"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
            </el-form-item>
            <el-form-item
              label="升级开关"
              prop="upgradeStatus"
            ><el-select
              v-model="queryParams.upgradeStatus"
              placeholder="固件配置表升级开关"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in upgradeStatusOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
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
                v-permisaction="['admin:sysfirmware:add']"
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="handleAdd"
              >新增
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                v-permisaction="['admin:sysfirmware:edit']"
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
                v-permisaction="['admin:sysfirmware:remove']"
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
            :data="sysfirmwareList"
            @selection-change="handleSelectionChange"
            @sort-change="handleSortChang"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column
              label="编号"
              align="center"
              prop="firmId"
              sortable="custom"
            />
            <el-table-column
              label="所属产品"
              align="center"
              prop="prod.prodName"
              sortable="custom"
            />
            <el-table-column
              label="所属算法"
              align="center"
              prop="ai.aiName"
              sortable="custom"
            />
            <el-table-column
              label="固件名称"
              align="center"
              prop="firmName"
              sortable="custom"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="算法版本"
              align="center"
              prop="aiVersion"
              sortable="custom"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="后台系统版本"
              align="center"
              prop="goVersion"
              sortable="custom"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="升级开关状态"
              align="center"
              sortable="custom"
            >
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.upgradeStatus"
                  active-value="1"
                  inactive-value="0"
                  @change="handleFirmwareUpgradeStatusChange(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="创建时间"
              align="center"
              prop="createdAt"
              sortable="custom"
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
                  v-permisaction="['admin:sysfirmware:edit']"
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="showTask(scope.row)"
                >查看
                </el-button>
                <el-button
                  v-permisaction="['admin:sysfirmware:edit']"
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row)"
                >修改
                </el-button>
                <el-button
                  v-permisaction="['admin:sysfirmware:remove']"
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
          <el-dialog
            :title="title"
            :inline="true"
            :visible.sync="open"
            width="60%"
          >
            <el-form
              ref="form"
              :model="form"
              :rules="rules"
              label-width="120px"
            >
              <el-form-item label="所属产品" prop="prodId">
                <el-select v-model="form.prodId" placeholder="请选择" clearable>
                  <el-option
                    v-for="dict in sysProductNameList"
                    :key="dict.prodId"
                    :label="dict.prodName"
                    :value="dict.prodId"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="所属算法" prop="aiId">
                <el-select v-model="form.aiId" placeholder="请选择" clearable>
                  <el-option
                    v-for="dict in sysAiNameList"
                    :key="dict.aiId"
                    :label="dict.aiName"
                    :value="dict.aiId"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="固件名称" prop="firmName">
                <el-input v-model="form.firmName" placeholder="固件名称" />
              </el-form-item>
              <el-form-item label="算法版本" prop="aiVersion">
                <el-input v-model="form.aiVersion" placeholder="算法版本" />
              </el-form-item>
              <el-form-item label="后台系统版本" prop="goVersion">
                <el-input v-model="form.goVersion" placeholder="后台系统版本" />
              </el-form-item>
              <el-form-item label="升级开关状态" prop="upgradeStatus">
                <el-input
                  v-model="form.upgradeStatus"
                  placeholder="升级开关状态"
                />
              </el-form-item>
              <el-form-item label="升级文件地址" prop="upgradeAddress">
                <!-- <el-input
                v-model="form.upgradeAddress"
                placeholder="升级文件地址"
              /> -->
                <el-upload
                  style="margin:0 0 0 10px"
                  :on-error="onError"
                  :on-success="onSuccess"
                  :action="serverHost + uploadUrl"
                >
                  <el-button type="info" icon="el-icon-upload" size="mini">
                    上传
                  </el-button>
                </el-upload>
              </el-form-item>
              <el-form-item label="升级类型" prop="upgradeType">
                <el-input v-model="form.upgradeType" placeholder="升级类型" />
              </el-form-item>
              <el-form-item label="包大小" prop="upgradeSize">
                <el-input v-model="form.upgradeSize" placeholder="包大小" />
              </el-form-item>
              <el-form-item label="签名方式" prop="signMode">
                <el-input v-model="form.signMode" placeholder="签名方式" />
              </el-form-item>
              <el-form-item label="签名MD5值" prop="signMd5">
                <el-input v-model="form.signMd5" placeholder="签名MD5值" />
              </el-form-item>
              <el-form-item label="固件说明" prop="firmDescribe">
                <el-input v-model="form.firmDescribe" placeholder="固件说明" />
              </el-form-item>
              <el-form-item label="固件备注" prop="firmNote">
                <el-input v-model="form.firmNote" placeholder="固件备注" />
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="submitForm">确 定</el-button>
              <el-button @click="cancel">取 消</el-button>
            </div>
          </el-dialog>
        </el-card>
        <edit-dialog
          :id="editDialog.firmId"
          :show="editDialog.show"
          @showChange="editDialogToggle"
          @ok="getList"
        />
      </div>
    </template>
  </BasicLayout>
</template>

<script>
import {
  addSysFirmware,
  changeFirmwareStatus,
  delSysFirmware,
  getAllFirmwareName,
  getSysFirmware,
  listSysFirmware,
  updateSysFirmware
} from '@/api/box/sys-firmware'
import { getAllProductName } from '@/api/box/sys-product'
import { getAllAiName } from '@/api/box/sys-ai'
import editDialog from './task'
const SERVER_HOST = process.env.VUE_APP_BASE_API
export default {
  name: 'SysFirmware',
  components: {
    editDialog
  },
  data() {
    return {
      serverHost: SERVER_HOST,
      uploadUrl: '/api/',
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
      sysfirmwareList: [],
      upgradeStatusOptions: [],
      upgradeTypeOptions: [],
      // 关系表类型

      // 名称字典
      sysProductNameList: [],
      sysAiNameList: [],
      sysFirmwareNameList: [],
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        prodId: undefined,
        aiId: undefined,
        firmName: undefined,
        aiVersion: undefined,
        upgradeStatus: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        prodId: [
          { required: true, message: '所属产品id不能为空', trigger: 'blur' }
        ],
        aiId: [
          { required: true, message: '所属算法id不能为空', trigger: 'blur' }
        ],
        firmName: [
          {
            required: true,
            message: '固件名称-烟火盒子V1.0不能为空',
            trigger: 'blur'
          }
        ],
        aiVersion: [
          { required: true, message: '算法版本不能为空', trigger: 'blur' }
        ],
        upgradeStatus: [
          {
            required: true,
            message: '升级开关状态(0不升级 1升级)不能为空',
            trigger: 'blur'
          }
        ]
      },
      editDialog: {
        show: false,
        firmId: undefined
      }
    }
  },
  created() {
    this.getList()
    this.getDicts('sys_upgrade_switch').then(response => {
      this.upgradeStatusOptions = response.data
    })
    this.getDicts('sys_upgrade_type').then(response => {
      this.upgradeTypeOptions = response.data
    })
    this.getAllProductName()
    this.getAllFirmwareName()
    this.getAllAiName()
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listSysFirmware(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.sysfirmwareList = response.data.list
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
        firmId: undefined,
        prodId: undefined,
        aiId: undefined,
        firmName: undefined,
        aiVersion: undefined,
        goVersion: undefined,
        upgradeStatus: undefined,
        upgradeAddress: undefined,
        upgradeType: undefined,
        upgradeSize: undefined,
        signMode: undefined,
        signMd5: undefined,
        firmDescribe: undefined,
        firmNote: undefined
      }
      this.resetForm('form')
    },
    getImgList: function() {
      this.form[this.fileIndex] = this.$refs['fileChoose'].resultList[0].fullUrl
    },
    fileClose: function() {
      this.fileOpen = false
    },
    upgradeStatusFormat(row) {
      return this.selectDictLabel(this.upgradeStatusOptions, row.upgradeStatus)
    },
    upgradeTypeFormat(row) {
      return this.selectDictLabel(this.upgradeTypeOptions, row.upgradeType)
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
      this.title = '添加固件配置表'
      this.isEdit = false
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.firmId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const firmId = row.firmId || this.ids
      getSysFirmware(firmId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改固件配置表'
        this.isEdit = true
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.firmId !== undefined) {
            updateSysFirmware(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addSysFirmware(this.form).then(response => {
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
      var Ids = (row.firmId && [row.firmId]) || this.ids

      this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(function() {
          return delSysFirmware({ ids: Ids })
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
    /** 查询FirmwareName参数列表 */
    getAllFirmwareName() {
      getAllFirmwareName().then(response => {
        this.sysFirmwareNameList = response.data
        // console.log(this.sysBoxNameList)
      })
    },
    /** 查询AiName参数列表 */
    getAllAiName() {
      getAllAiName().then(response => {
        this.sysAiNameList = response.data
        // console.log(this.sysBoxNameList)
      })
    },
    /** 查询ProductName参数列表 */
    getAllProductName() {
      getAllProductName().then(response => {
        this.sysProductNameList = response.data
        // console.log(this.sysBoxNameList)
      })
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
    // 摄像头状态修改
    handleFirmwareUpgradeStatusChange(row) {
      const text = row.upgradeStatus === '1' ? '升级' : '不升级'
      this.$confirm(
        '确认要"' + text + '""' + row.firmName + '"固件吗?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }
      )
        .then(function() {
          return changeFirmwareStatus(row)
        })
        .then(() => {
          this.msgSuccess(text + '成功')
        })
        .catch(function() {
          row.upgradeStatus = row.upgradeStatus === '1' ? '0' : '1'
        })
    },
    onError(err, file, fileList) {
      const _this = this
      _this.$message({
        message: '上传失败!' + err,
        type: 'error'
      })
    },
    onSuccess(response, file, fileList) {
      const _this = this
      if (response.statusCode === 200) {
        _this.$message({
          message: '上传成功。',
          type: 'success'
        })
        _this.form.upgradeAddress = response.url
      }
    },
    showTask(row) {
      this.editDialog.show = true
      this.editDialog.firmId = row.firmId + ''
    },
    editDialogToggle(value) {
      const _this = this
      _this.editDialog.show = value
    }
  }
}
</script>
<style lang="scss"></style>
