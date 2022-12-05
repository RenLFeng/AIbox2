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
            <el-form-item label="盒子id" prop="boxId">
              <el-select
                v-model="queryParams.boxId"
                placeholder="请选择盒子"
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
            <el-form-item label="状态" prop="npuStatus">
              <el-select
                v-model="queryParams.npuStatus"
                placeholder="请选择NPU状态"
                clearable
                size="small"
              >
                <el-option
                  v-for="dict in npuStatusOptions"
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
                v-permisaction="['admin:sysboxnpu:add']"
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="handleAdd"
              >新增
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                v-permisaction="['admin:sysboxnpu:edit']"
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
                v-permisaction="['admin:sysboxnpu:remove']"
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
            :data="sysboxnpuList"
            @selection-change="handleSelectionChange"
            @sort-change="handleSortChang"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column
              label="编号"
              align="center"
              prop="npuId"
              sortable="custom"
            />
            <el-table-column
              label="所属盒子"
              align="center"
              prop="box.boxName"
              sortable="custom"
            />
            <el-table-column
              label="排序"
              align="center"
              prop="npuSort"
              sortable="custom"
            />
            <el-table-column
              label="权重"
              align="center"
              prop="npuWeight"
              sortable="custom"
            />
            <el-table-column
              label="围界算法"
              align="center"
              prop="a1"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="烟火算法"
              align="center"
              prop="a2"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="算法3"
              align="center"
              prop="a3"
              :show-overflow-tooltip="true"
            />
            <!--          <el-table-column-->
            <!--            label="算法4配置表数组"-->
            <!--            align="center"-->
            <!--            prop="a4"-->
            <!--            :show-overflow-tooltip="true"-->
            <!--          />-->
            <!--          <el-table-column-->
            <!--            label="算法5配置表数组"-->
            <!--            align="center"-->
            <!--            prop="a5"-->
            <!--            :show-overflow-tooltip="true"-->
            <!--          />-->
            <!--          <el-table-column-->
            <!--            label="算法6配置表数组"-->
            <!--            align="center"-->
            <!--            prop="a6"-->
            <!--            :show-overflow-tooltip="true"-->
            <!--          /><el-table-column-->
            <!--            label="算法7配置表数组"-->
            <!--            align="center"-->
            <!--            prop="a7"-->
            <!--            :show-overflow-tooltip="true"-->
            <!--          /><el-table-column-->
            <!--            label="算法8配置表数组"-->
            <!--            align="center"-->
            <!--            prop="a8"-->
            <!--            :show-overflow-tooltip="true"-->
            <!--          />-->
            <!--          <el-table-column-->
            <!--            label="算法9配置表数组"-->
            <!--            align="center"-->
            <!--            prop="a9"-->
            <!--            :show-overflow-tooltip="true"-->
            <!--          />-->
            <el-table-column label="NPU状态" align="center" sortable="custom">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.boxStatus === '0' ? 'danger' : 'success'"
                  disable-transitions
                >{{ npuStatusFormat(scope.row) }}
                </el-tag>
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
                  v-permisaction="['admin:sysboxnpu:edit']"
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row)"
                >修改
                </el-button>
                <el-button
                  v-permisaction="['admin:sysboxnpu:remove']"
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                >删除
                </el-button>
                <el-button
                  v-permisaction="['admin:sysboxnpu:edit']"
                  type="text"
                  icon="el-icon-edit"
                  size="mini"
                  @click="handleSet(scope.row)"
                >配置
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
          <edit-dialog
            :show="editDialog.show"
            :box-id="editDialog.boxId"
            :npu-id="editDialog.npuId"
            @showChange="editDialogToggle"
            @ok="getList"
          />
          <!-- 添加或修改对话框 -->
          <el-dialog :title="title" :visible.sync="open" width="500px">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
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
              <el-form-item label="排序" prop="npuSort">
                <el-input v-model="form.npuSort" placeholder="排序" />
              </el-form-item>
              <el-form-item label="权重" prop="npuWeight">
                <el-input v-model="form.npuWeight" placeholder="权重" />
              </el-form-item>
              <el-form-item label="围界算法" prop="a1">
                <el-input v-model="form.a1" placeholder="算法1配置表数组" />
              </el-form-item>
              <el-form-item label="烟火算法" prop="a2">
                <el-input v-model="form.a2" placeholder="算法2配置表数组" />
              </el-form-item>
              <el-form-item label="算法3" prop="a3">
                <el-input v-model="form.a3" placeholder="算法3配置表数组" />
              </el-form-item>
              <!--            <el-form-item label="算法4配置表数组" prop="a4">-->
              <!--              <el-input-->
              <!--                v-model="form.a4"-->
              <!--                placeholder="算法4配置表数组"-->
              <!--              />-->
              <!--            </el-form-item>-->
              <!--            <el-form-item label="算法5配置表数组" prop="a5">-->
              <!--              <el-input-->
              <!--                v-model="form.a5"-->
              <!--                placeholder="算法5配置表数组"-->
              <!--              />-->
              <!--            </el-form-item>-->
              <!--            <el-form-item label="算法6配置表数组" prop="a6">-->
              <!--              <el-input-->
              <!--                v-model="form.a6"-->
              <!--                placeholder="算法6配置表数组"-->
              <!--              />-->
              <!--            </el-form-item>-->
              <!--            <el-form-item label="算法7配置表数组" prop="a7">-->
              <!--              <el-input-->
              <!--                v-model="form.a7"-->
              <!--                placeholder="算法7配置表数组"-->
              <!--              />-->
              <!--            </el-form-item>-->
              <!--            <el-form-item label="算法8配置表数组" prop="a8">-->
              <!--              <el-input-->
              <!--                v-model="form.a8"-->
              <!--                placeholder="算法8配置表数组"-->
              <!--              />-->
              <!--            </el-form-item>-->
              <!--            <el-form-item label="算法9配置表数组" prop="a9">-->
              <!--              <el-input-->
              <!--                v-model="form.a9"-->
              <!--                placeholder="算法9配置表数组"-->
              <!--              />-->
              <!--            </el-form-item>-->
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
  addSysBoxNpu,
  delSysBoxNpu,
  getSysBoxNpu,
  listSysBoxNpu,
  updateSysBoxNpu
} from '@/api/box/sys-box-npu'
import { getAllBoxName } from '@/api/box/sys-box'
import editDialog from './components/editDialog'

export default {
  name: 'SysBoxNpu',
  components: {
    editDialog
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
      sysboxnpuList: [],
      npuStatusOptions: [],
      // 关系表类型
      // 名称字典
      sysBoxNameList: [],
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        boxId: undefined,
        npuStatus: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        boxId: [{ required: true, message: '盒子id不能为空', trigger: 'blur' }],
        npuStatus: [
          {
            required: true,
            message: 'NPU状态(0离线1在线2未使用)不能为空',
            trigger: 'blur'
          }
        ]
      },
      editDialog: {
        show: false,
        boxId: undefined,
        npuId: undefined
      }
    }
  },
  created() {
    this.getList()
    this.getAllBoxName()
    this.getDicts('sys_box_status').then(response => {
      this.npuStatusOptions = response.data
    })
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listSysBoxNpu(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.sysboxnpuList = response.data.list
          this.total = response.data.count
          this.loading = false
        }
      )
    },
    /** 查询BoxName参数列表 */
    getAllBoxName() {
      getAllBoxName().then(response => {
        this.sysBoxNameList = response.data
        // console.log(this.sysBoxNameList)
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
        npuId: undefined,
        boxId: undefined,
        npuStatus: undefined,
        npuSort: undefined,
        npuWeight: undefined,
        a1: undefined,
        a2: undefined,
        a3: undefined,
        a4: undefined,
        a5: undefined,
        a6: undefined,
        a7: undefined,
        a8: undefined,
        a9: undefined
      }
      this.resetForm('form')
    },
    getImgList: function() {
      this.form[this.fileIndex] = this.$refs['fileChoose'].resultList[0].fullUrl
    },
    fileClose: function() {
      this.fileOpen = false
    },
    npuStatusFormat(row) {
      return this.selectDictLabel(this.npuStatusOptions, row.npuStatus)
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
      this.title = '添加盒子NPU配置表'
      this.isEdit = false
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.npuId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const npuId = row.npuId || this.ids
      getSysBoxNpu(npuId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改盒子NPU配置表'
        this.isEdit = true
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.npuId !== undefined) {
            updateSysBoxNpu(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addSysBoxNpu(this.form).then(response => {
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
      var Ids = (row.npuId && [row.npuId]) || this.ids

      this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(function() {
          return delSysBoxNpu({ ids: Ids })
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
    handleSet(row) {
      this.editDialog.boxId = row.bId + ''
      this.editDialog.npuId = row.npuId + ''
      this.editDialog.show = true
    },
    editDialogToggle(value) {
      this.editDialog.show = value
    }
  }
}
</script>
<style lang="scss"></style>
