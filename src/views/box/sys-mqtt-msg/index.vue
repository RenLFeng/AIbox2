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
            <el-form-item
              label="Sno"
              prop="mqttDeviceId"
            ><el-input
              v-model="queryParams.mqttDeviceId"
              placeholder="请输入需处理的设备Sno号"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
            </el-form-item>

            <el-form-item label="消息类别" prop="mqttType">
              <el-select
                v-model="queryParams.mqttType"
                placeholder="消息类别"
                clearable
                size="small"
              >
                <el-option
                  v-for="dict in mqttTypeOptions"
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
            <!--          <el-col :span="1.5">-->
            <!--            <el-button-->
            <!--              v-permisaction="['admin:sysmqttmsg:add']"-->
            <!--              type="primary"-->
            <!--              icon="el-icon-plus"-->
            <!--              size="mini"-->
            <!--              @click="handleAdd"-->
            <!--            >新增-->
            <!--            </el-button>-->
            <!--          </el-col>-->
            <!--          <el-col :span="1.5">-->
            <!--            <el-button-->
            <!--              v-permisaction="['admin:sysmqttmsg:edit']"-->
            <!--              type="success"-->
            <!--              icon="el-icon-edit"-->
            <!--              size="mini"-->
            <!--              :disabled="single"-->
            <!--              @click="handleUpdate"-->
            <!--            >修改-->
            <!--            </el-button>-->
            <!--                    </el-col>-->
            <el-col :span="1.5">
              <el-button
                v-permisaction="['admin:sysMqttMsg:remove']"
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="handleDelete"
              >删除全部
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                v-permisaction="['admin:sysMqttMsg:add']"
                type="primary"
                icon="el-icon-upload"
                size="mini"
                @click="handleSync"
              >同步消息
              </el-button>
            </el-col>
          </el-row>

          <el-table
            v-loading="loading"
            :data="sysmqttmsgList"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="55"
              align="center"
            /><el-table-column
              label="盒子id"
              align="center"
              prop="boxId"
              :show-overflow-tooltip="true"
            /><el-table-column
              label="发送消息的客户端ID"
              align="center"
              prop="publishClientId"
              :show-overflow-tooltip="true"
            /><el-table-column
              label="需处理的设备Sno号"
              align="center"
              prop="mqttDeviceId"
              :show-overflow-tooltip="true"
            /><el-table-column
              label="请求消息ID"
              align="center"
              prop="mqttRequestId"
              :show-overflow-tooltip="true"
            /><el-table-column
              label="主题名称"
              align="center"
              prop="mqttTopicName"
              :show-overflow-tooltip="true"
            /><el-table-column
              label="QOS等级"
              align="center"
              prop="mqttQos"
              :formatter="mqttQosFormat"
              width="100"
            >
              <template slot-scope="scope">
                {{ mqttQosFormat(scope.row) }}
              </template> </el-table-column><el-table-column
              label="消息类别"
              align="center"
              prop="mqttType"
              :formatter="mqttTypeFormat"
              width="100"
            >
              <template slot-scope="scope">
                {{ mqttTypeFormat(scope.row) }}
              </template> </el-table-column><el-table-column
              label="消息类型"
              align="center"
              prop="mqttForm"
              :formatter="mqttFormFormat"
              width="100"
            >
              <template slot-scope="scope">
                {{ mqttFormFormat(scope.row) }}
              </template> </el-table-column><el-table-column
              label="消息状态"
              align="center"
              prop="mqttStatus"
              :formatter="mqttStatusFormat"
              width="100"
            >
              <template slot-scope="scope">
                {{ mqttStatusFormat(scope.row) }}
              </template>
            </el-table-column>
            <el-table-column
              label="消息内容"
              align="center"
              prop="mqttMsg"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click="showMqttMsg(scope.row.mqttMsg)"
                >查看</el-button>
              </template>
            </el-table-column>
            <el-table-column
              label="创建时间"
              align="center"
              prop="createdAt"
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
                <!-- <el-button
                v-permisaction="['admin:sysMqttMsg:edit']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                >修改
              </el-button> -->
                <el-button
                  v-permisaction="['admin:sysMqttMsg:edit']"
                  size="mini"
                  type="text"
                  icon="el-icon-s-comment"
                  @click="showMqttMsg(scope.row.mqttMsg)"
                >消息查看
                </el-button>
                <el-button
                  v-permisaction="['admin:sysMqttMsg:remove']"
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
              <el-form-item label="盒子id" prop="boxId">
                <el-input v-model="form.boxId" placeholder="盒子id" />
              </el-form-item>
              <el-form-item label="发送消息的客户端ID" prop="publishClientId">
                <el-input
                  v-model="form.publishClientId"
                  placeholder="发送消息的客户端ID"
                />
              </el-form-item>
              <el-form-item label="需处理的设备Sno号" prop="mqttDeviceId">
                <el-input
                  v-model="form.mqttDeviceId"
                  placeholder="需处理的设备Sno号"
                />
              </el-form-item>
              <el-form-item label="请求消息ID" prop="mqttRequestId">
                <el-input
                  v-model="form.mqttRequestId"
                  placeholder="请求消息ID(UUID)"
                />
              </el-form-item>
              <el-form-item label="消息主题名称" prop="mqttTopicName">
                <el-input
                  v-model="form.mqttTopicName"
                  placeholder="消息主题名称"
                />
              </el-form-item>
              <el-form-item label="消息QOS等级" prop="mqttQos">
                <el-input v-model="form.mqttQos" placeholder="消息QOS等级" />
              </el-form-item>
              <el-form-item label="消息类别" prop="mqttType">
                <el-input v-model="form.mqttType" placeholder="消息类别" />
              </el-form-item>
              <el-form-item label="消息类型" prop="mqttForm">
                <el-input v-model="form.mqttForm" placeholder="消息类型" />
              </el-form-item>
              <el-form-item label="消息状态" prop="mqttStatus">
                <el-input v-model="form.mqttStatus" placeholder="消息状态" />
              </el-form-item>
              <el-form-item label="消息内容" prop="mqttMsg">
                <el-input v-model="form.mqttMsg" placeholder="消息内容" />
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="submitForm">确 定</el-button>
              <el-button @click="cancel">取 消</el-button>
            </div>
          </el-dialog>
        </el-card>
        <mqtt-dialog
          :show="editDialog.show"
          :content="editDialog.content"
          @showChange="editDialogToggle"
        />
      </div>
    </template>
  </BasicLayout>
</template>

<script>
import {
  addSysMqttMsg,
  delAllSysMqttMsg,
  getSysMqttMsg,
  listSysMqttMsg,
  syncAllSysMqttMsg,
  updateSysMqttMsg
} from '@/api/box/sys-mqtt-msg'
import { getAllBoxName } from '@/api/box/sys-box'
import mqttDialog from './mqttDialog.vue'
export default {
  name: 'SysMqttMsg',
  components: { mqttDialog },
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
      sysmqttmsgList: [],
      mqttQosOptions: [],
      mqttTypeOptions: [],
      mqttFormOptions: [],
      mqttStatusOptions: [],
      // 关系表类型

      // 名称字典
      sysBoxNameList: [],
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        boxId: undefined,
        mqttDeviceId: undefined,
        createdAtOrder: 'desc'
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        boxId: [{ required: true, message: '盒子id不能为空', trigger: 'blur' }],
        mqttDeviceId: [
          {
            required: true,
            message: '需处理的设备ID(Sno号)不能为空',
            trigger: 'blur'
          }
        ]
      },
      editDialog: {
        show: false,
        content: ''
      }
    }
  },
  created() {
    this.getList()
    this.getDicts('sys_mqtt_qos').then(response => {
      this.mqttQosOptions = response.data
    })
    this.getDicts('sys_mqtt_type').then(response => {
      this.mqttTypeOptions = response.data
    })
    this.getDicts('sys_mqtt_form').then(response => {
      this.mqttFormOptions = response.data
    })
    this.getDicts('sys_mqtt_status').then(response => {
      this.mqttStatusOptions = response.data
    })
    this.getAllBoxName()
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listSysMqttMsg(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.sysmqttmsgList = response.data.list
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
        mqttId: undefined,
        boxId: undefined,
        publishClientId: undefined,
        mqttDeviceId: undefined,
        mqttRequestId: undefined,
        mqttTopicName: undefined,
        mqttQos: undefined,
        mqttType: undefined,
        mqttForm: undefined,
        mqttStatus: undefined,
        mqttMsg: undefined
      }
      this.resetForm('form')
    },
    getImgList: function() {
      this.form[this.fileIndex] = this.$refs['fileChoose'].resultList[0].fullUrl
    },
    fileClose: function() {
      this.fileOpen = false
    },
    mqttQosFormat(row) {
      return this.selectDictLabel(this.mqttQosOptions, row.mqttQos)
    },
    mqttTypeFormat(row) {
      return this.selectDictLabel(this.mqttTypeOptions, row.mqttType)
    },
    mqttFormFormat(row) {
      return this.selectDictLabel(this.mqttFormOptions, row.mqttForm)
    },
    mqttStatusFormat(row) {
      return this.selectDictLabel(this.mqttStatusOptions, row.mqttStatus)
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
      this.title = '添加MQTT消息记录表'
      this.isEdit = false
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.mqttId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const mqttId = row.mqttId || this.ids
      getSysMqttMsg(mqttId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改MQTT消息记录表'
        this.isEdit = true
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.mqttId !== undefined) {
            updateSysMqttMsg(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addSysMqttMsg(this.form).then(response => {
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
    handleDelete() {
      this.$confirm('是否确认删除所有数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(function() {
          return delAllSysMqttMsg()
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
    /** 删除按钮操作 */
    handleSync() {
      this.$confirm('是否确认同步所有数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(function() {
          return syncAllSysMqttMsg()
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
    /** 查询BoxName参数列表 */
    getAllBoxName() {
      getAllBoxName().then(response => {
        this.sysBoxNameList = response.data
        // console.log(this.sysBoxNameList)
      })
    },
    showMqttMsg(msg) {
      this.editDialog.show = true
      this.editDialog.content = msg || '无'
    },
    editDialogToggle(value) {
      const _this = this
      _this.editDialog.show = value
    }
  }
}
</script>
<style lang="scss"></style>
