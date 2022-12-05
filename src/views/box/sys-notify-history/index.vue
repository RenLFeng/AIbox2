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
            <el-form-item label="所属通知" prop="nId">
              <el-select
                v-model="queryParams.nId"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="dict in sysNotifyNameList"
                  :key="dict.notifyId"
                  :label="dict.notifyName"
                  :value="dict.notifyId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="所属模版" prop="nId">
              <el-select
                v-model="queryParams.tId"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="dict in sysNotifyTemplateNameList"
                  :key="dict.templateId"
                  :label="dict.templateName"
                  :value="dict.templateId"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="通知消息状态"
              prop="state"
            ><el-select
              v-model="queryParams.state"
              placeholder="消息通知历史表通知消息状态"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in stateOptions"
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
                v-permisaction="['admin:sysnotifyhistory:add']"
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="handleAdd"
              >新增
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                v-permisaction="['admin:sysnotifyhistory:edit']"
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
                v-permisaction="['admin:sysnotifyhistory:remove']"
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
            :data="sysnotifyhistoryList"
            @selection-change="handleSelectionChange"
            @sort-change="handleSortChang"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column
              label="模版ID"
              align="center"
              prop="historyId"
              sortable="custom"
            />
            <el-table-column
              label="通知ID"
              align="center"
              prop="notify.notifyName"
              sortable="custom"
            />
            <el-table-column
              label="模版ID"
              align="center"
              prop="template.templateName"
              sortable="custom"
            />
            <el-table-column
              label="通知消息状态"
              align="center"
              prop="state"
              :formatter="stateFormat"
              width="100"
            >
              <template slot-scope="scope">
                {{ stateFormat(scope.row) }}
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-button
                  v-permisaction="['admin:sysnotifyhistory:edit']"
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row)"
                >修改
                </el-button>
                <el-button
                  v-permisaction="['admin:sysnotifyhistory:remove']"
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
              <el-form-item label="所属通知" prop="nId">
                <el-select
                  v-model="queryParams.notId"
                  placeholder="请选择"
                  clearable
                >
                  <el-option
                    v-for="dict in sysNotifyNameList"
                    :key="dict.notifyId"
                    :label="dict.notifyName"
                    :value="dict.notifyId"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="所属模版" prop="tId">
                <el-select
                  v-model="queryParams.tId"
                  placeholder="请选择"
                  clearable
                >
                  <el-option
                    v-for="dict in sysNotifyTemplateNameList"
                    :key="dict.templateId"
                    :label="dict.templateName"
                    :value="dict.templateId"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="模版内容" prop="content">
                <el-input v-model="form.content" placeholder="模版内容" />
              </el-form-item>
              <el-form-item label="通知消息状态" prop="state">
                <el-input v-model="form.state" placeholder="通知消息状态" />
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
  addSysNotifyHistory,
  delSysNotifyHistory,
  getSysNotifyHistory,
  listSysNotifyHistory,
  updateSysNotifyHistory
} from '@/api/box/sys-notify-history'
import { getAllNotifyName } from '@/api/box/sys-notify'
import { getAllNotifyTemplateName } from '@/api/box/sys-notify-template'

export default {
  name: 'SysNotifyHistory',
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
      sysnotifyhistoryList: [],
      stateOptions: [],
      // 关系表类型

      // 名称字典
      sysNotifyNameList: [],
      sysNotifyTemplateNameList: [],
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        nId: undefined,
        tId: undefined,
        state: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        nId: [{ required: true, message: '通知ID不能为空', trigger: 'blur' }],
        tId: [{ required: true, message: '模版ID不能为空', trigger: 'blur' }],
        state: [
          { required: true, message: '通知消息状态不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getAllNotifyName()
    this.getAllNotifyTemplateName()
    this.getDicts('sys_notice_status').then(response => {
      this.stateOptions = response.data
    })
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listSysNotifyHistory(
        this.addDateRange(this.queryParams, this.dateRange)
      ).then(response => {
        this.sysnotifyhistoryList = response.data.list
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
        nId: undefined,
        tId: undefined,
        content: undefined,
        state: undefined
      }
      this.resetForm('form')
    },
    getImgList: function() {
      this.form[this.fileIndex] = this.$refs['fileChoose'].resultList[0].fullUrl
    },
    fileClose: function() {
      this.fileOpen = false
    },
    stateFormat(row) {
      return this.selectDictLabel(this.stateOptions, row.state)
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
      this.title = '添加消息通知历史表'
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
      getSysNotifyHistory(historyId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改消息通知历史表'
        this.isEdit = true
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.historyId !== undefined) {
            updateSysNotifyHistory(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addSysNotifyHistory(this.form).then(response => {
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
          return delSysNotifyHistory({ ids: Ids })
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
    /** 查询Notify参数列表 */
    getAllNotifyName() {
      getAllNotifyName().then(response => {
        this.sysNotifyNameList = response.data
      })
    },
    /** 查询Notify参数列表 */
    getAllNotifyTemplateName() {
      getAllNotifyTemplateName().then(response => {
        this.sysNotifyTemplateNameList = response.data
      })
    }
  }
}
</script>
<style lang="scss"></style>
