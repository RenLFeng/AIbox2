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
              label="盒子名称"
              prop="name"
            ><el-input
              v-model="queryParams.name"
              placeholder="请输入集群盒子名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
            </el-form-item>
            <el-form-item
              label="盒子状态"
              prop="status"
            ><el-select
              v-model="queryParams.status"
              placeholder="请输入集群盒子状态"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in statusOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
            </el-form-item>
            <el-form-item
              label="盒子IP"
              prop="status"
            ><el-input
              v-model="queryParams.addr"
              placeholder="请输入集群盒子IP"
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
                v-permisaction="['admin:sysFederation:add']"
                type="primary"
                icon="el-icon-add-location"
                size="mini"
                @click="handleAddAll"
              >盒子加入集群
              </el-button>
            </el-col>
            <!--          <el-col :span="1.5">-->
            <!--            <el-button-->
            <!--              v-permisaction="['admin:sysFederation:edit']"-->
            <!--              type="success"-->
            <!--              icon="el-icon-edit"-->
            <!--              size="mini"-->
            <!--              :disabled="single"-->
            <!--              @click="handleUpdate"-->
            <!--            >修改-->
            <!--            </el-button>-->
            <!--          </el-col>-->
            <!--          <el-col :span="1.5">-->
            <!--            <el-button-->
            <!--              v-permisaction="['admin:sysFederation:remove']"-->
            <!--              type="danger"-->
            <!--              icon="el-icon-delete"-->
            <!--              size="mini"-->
            <!--              :disabled="multiple"-->
            <!--              @click="handleDelete"-->
            <!--            >删除-->
            <!--            </el-button>-->
            <!--          </el-col>-->
          </el-row>

          <el-table
            v-loading="loading"
            :data="sysfederationList"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              label="集群盒子名称"
              align="center"
              prop="name"
              :show-overflow-tooltip="true"
            /><el-table-column
              label="集群盒子IP"
              align="center"
              prop="addr"
              :show-overflow-tooltip="true"
            /><el-table-column
              label="集群盒子标签"
              align="center"
              prop="tags"
              :show-overflow-tooltip="true"
            />
            <!--          <el-table-column-->
            <!--            label="集群盒子状态"-->
            <!--            align="center"-->
            <!--            prop="status"-->
            <!--            :formatter="statusFormat"-->
            <!--            width="100"-->
            <!--          >-->
            <!--            <template slot-scope="scope">-->
            <!--              {{ statusFormat(scope.row) }}-->
            <!--            </template>-->
            <el-table-column label="状态" align="center" sortable="custom">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.status === '1' ? 'success' : 'danger'"
                  disable-transitions
                >{{ statusFormat(scope.row) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-button
                  v-permisaction="['admin:sysFederation:edit']"
                  size="mini"
                  type="text"
                  icon="el-icon-circle-plus"
                  @click="handleAdd(scope.row)"
                >加入集群
                </el-button>
                <el-button
                  v-permisaction="['admin:sysFederation:edit']"
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleUpdate(scope.row)"
                >离开集群
                </el-button>
                <el-button
                  v-permisaction="['admin:sysFederation:remove']"
                  size="mini"
                  type="text"
                  icon="el-icon-remove"
                  @click="handleDelete(scope.row)"
                >删除失败节点
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
              <el-form-item label="集群盒子名称" prop="name">
                <el-input v-model="form.name" placeholder="集群盒子名称" />
              </el-form-item>
              <el-form-item label="集群盒子地址" prop="addr">
                <el-input v-model="form.addr" placeholder="集群盒子地址" />
              </el-form-item>
              <el-form-item label="集群盒子标签" prop="tags">
                <el-input v-model="form.tags" placeholder="集群盒子标签" />
              </el-form-item>
              <el-form-item label="集群盒子状态" prop="status">
                <el-input v-model="form.status" placeholder="集群盒子状态" />
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
  addSysFederation,
  joinSysFederation,
  delSysFederation,
  listSysFederation,
  updateSysFederation
} from '@/api/box/sys-federation'

export default {
  name: 'SysFederation',
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
      sysfederationList: [],
      statusOptions: [],
      // 关系表类型

      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        name: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: '集群盒子名称不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '集群盒子状态不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getDicts('sys_federation_statue').then(response => {
      this.statusOptions = response.data
      // console.info('sys_federation_statue' + JSON.stringify(this.statusOptions))
    })
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listSysFederation(
        this.addDateRange(this.queryParams, this.dateRange)
      ).then(response => {
        this.sysfederationList = response.data.list
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
        fedId: undefined,
        name: undefined,
        addr: undefined,
        tags: undefined,
        status: undefined
      }
      this.resetForm('form')
    },
    getImgList: function() {
      this.form[this.fileIndex] = this.$refs['fileChoose'].resultList[0].fullUrl
    },
    fileClose: function() {
      this.fileOpen = false
    },
    statusFormat(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
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
    handleAddAll() {
      // this.reset()
      // this.open = true
      // this.title = '添加MQTT集群查询表'
      // this.isEdit = false
      joinSysFederation().then(response => {
        if (response.code === 200) {
          this.msgSuccess(response.msg)
          this.open = false
          this.getList()
        } else {
          console.info('err' + response.msg)
          this.msgError(response.msg)
        }
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.fedId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },

    handleAdd(row) {
      addSysFederation(row).then(response => {
        if (response.code === 200) {
          this.msgSuccess(response.msg)
          this.open = false
          this.getList()
        } else {
          this.msgError(response.msg)
        }
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$confirm(
        '离开集群的节点不能重新加入集群，除非重新启动离开的节点！是否确认退出集群节点名称是"' +
          row.name +
          '"的盒子?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }
      )
        .then(function() {
          return updateSysFederation(row)
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
      // updateSysFederation(row).then(response => {
      //   if (response.code === 200) {
      //     this.msgSuccess(response.msg)
      //     this.open = false
      //     this.getList()
      //   } else {
      //     this.msgError(response.msg)
      //   }
      // })
      // this.reset()
      // const fedId =
      //   row.fedId || this.ids
      // getSysFederation(fedId).then(response => {
      //   this.form = response.data
      //   this.open = true
      //   this.title = '修改MQTT集群查询表'
      //   this.isEdit = true
      // })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.fedId !== undefined) {
            updateSysFederation(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addSysFederation(this.form).then(response => {
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
    /** 删除失败节点按钮操作 */
    handleDelete(row) {
      this.$confirm(
        '集群在线盒子不能删除！删除集群失败盒子专用！是否确认删除节点名称是"' +
          row.name +
          '"的盒子?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }
      )
        .then(function() {
          return delSysFederation(row)
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
      // var Ids = (row.fedId && [row.fedId]) || this.ids
      //
      // this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', '警告', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(function() {
      //   return delSysFederation({ 'ids': Ids })
      // }).then((response) => {
      //   if (response.code === 200) {
      //     this.msgSuccess(response.msg)
      //     this.open = false
      //     this.getList()
      //   } else {
      //     this.msgError(response.msg)
      //   }
      // }).catch(function() {
      // })
    }
  }
}
</script>
<style lang="scss">
.el-message-box__wrapper {
  .el-message-box {
    .el-message-box__header {
      text-align: center;
    }
  }
}
</style>
