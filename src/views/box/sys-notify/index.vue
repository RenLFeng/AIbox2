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
            <el-form-item
              label="消息通知名称"
              prop="notifyName"
            ><el-input
              v-model="queryParams.notifyName"
              placeholder="请输入消息通知名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
            </el-form-item>
            <el-form-item
              label="消息通知类型"
              prop="notifyType"
            ><el-select
              v-model="queryParams.notifyType"
              placeholder="请选择消息通知类型"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in notifyTypeOptions"
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
                v-permisaction="['admin:sysnotify:add']"
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="handleAdd"
              >新增
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                v-permisaction="['admin:sysnotify:edit']"
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
                v-permisaction="['admin:sysnotify:remove']"
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
            :data="sysnotifyList"
            @selection-change="handleSelectionChange"
            @sort-change="handleSortChang"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column
              label="编号"
              align="center"
              prop="notifyId"
              sortable="custom"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="消息通知名称"
              align="center"
              prop="notifyName"
              sortable="custom"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="消息通知类型"
              align="center"
              prop="notifyType"
              sortable="custom"
              :formatter="notifyTypeFormat"
              width="100"
            >
              <template slot-scope="scope">
                {{ notifyTypeFormat(scope.row) }}
              </template>
            </el-table-column>
            <el-table-column
              label="消息通知服务商"
              align="center"
              prop="notifyProvider"
              sortable="custom"
              :formatter="notifyProviderFormat"
              width="100"
            >
              <template slot-scope="scope">
                {{ notifyProviderFormat(scope.row) }}
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-button
                  v-permisaction="['admin:sysnotify:edit']"
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row)"
                >修改
                </el-button>
                <el-button
                  v-permisaction="['admin:sysnotify:remove']"
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
              <el-form-item label="消息通知名称" prop="notifyName">
                <el-input
                  v-model="form.notifyName"
                  placeholder="消息通知名称"
                />
              </el-form-item>

              <el-form-item label="消息通知类型" prop="notifyType">
                <el-select
                  v-model="form.notifyType"
                  placeholder="请选择消息通知类型"
                >
                  <el-option
                    v-for="dict in notifyTypeOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="消息通知服务商" prop="notifyProvider">
                <el-select
                  v-model="form.notifyProvider"
                  placeholder="请选择消息通知服务商"
                >
                  <el-option
                    v-for="dict in notifyProviderOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="通知说明" prop="notifyDescribe">
                <el-input
                  v-model="form.notifyDescribe"
                  placeholder="通知说明"
                />
              </el-form-item>
              <el-form-item label="钉钉appKey" prop="appKey">
                <el-input v-model="form.appKey" placeholder="钉钉appKey" />
              </el-form-item>
              <el-form-item label="钉钉appSecrect" prop="appSecrect">
                <el-input
                  v-model="form.appSecrect"
                  placeholder="钉钉appSecrect"
                />
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
  addSysNotify,
  delSysNotify,
  getSysNotify,
  listSysNotify,
  updateSysNotify
} from '@/api/box/sys-notify'

export default {
  name: 'SysNotify',
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
      sysnotifyList: [],
      notifyTypeOptions: [],
      notifyProviderOptions: [],
      // 关系表类型

      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        notifyName: undefined,
        notifyType: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        notifyName: [
          { required: true, message: '消息通知名称不能为空', trigger: 'blur' }
        ],
        notifyType: [
          { required: true, message: '消息通知类型不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getDicts('sys_notify_type').then(response => {
      this.notifyTypeOptions = response.data
    })
    this.getDicts('sys_notify_provider').then(response => {
      this.notifyProviderOptions = response.data
    })
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listSysNotify(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.sysnotifyList = response.data.list
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
        notifyId: undefined,
        notifyName: undefined,
        notifyType: undefined,
        notifyProvider: undefined,
        notifyDescribe: undefined,
        appKey: undefined,
        appSecrect: undefined
      }
      this.resetForm('form')
    },
    getImgList: function() {
      this.form[this.fileIndex] = this.$refs['fileChoose'].resultList[0].fullUrl
    },
    fileClose: function() {
      this.fileOpen = false
    },
    notifyTypeFormat(row) {
      return this.selectDictLabel(this.notifyTypeOptions, row.notifyType)
    },
    notifyProviderFormat(row) {
      return this.selectDictLabel(
        this.notifyProviderOptions,
        row.notifyProvider
      )
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
      this.title = '添加消息通知配置表'
      this.isEdit = false
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.notifyId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const notifyId = row.notifyId || this.ids
      getSysNotify(notifyId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改消息通知配置表'
        this.isEdit = true
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.notifyId !== undefined) {
            updateSysNotify(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addSysNotify(this.form).then(response => {
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
      var Ids = (row.notifyId && [row.notifyId]) || this.ids

      this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(function() {
          return delSysNotify({ ids: Ids })
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
    }
  }
}
</script>
<style lang="scss"></style>
