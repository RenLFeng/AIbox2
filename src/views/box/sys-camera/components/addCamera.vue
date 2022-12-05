<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="800px"
    class="editDialog"
    :close-on-click-modal="false"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-position="left"
    >
      <el-col :span="24">
        <el-divider
          content-position="left"
          style="color: #C3C1C7;"
        ><i class="el-icon-info" />基本信息
        </el-divider>
      </el-col>
      <el-col :span="24">
        <el-form-item label="名称" prop="camName" label-width="60px">
          <el-input
            v-model="form.camName"
            placeholder="请输入摄像头名称"
            type="text"
            maxlength="40"
            show-word-limit
            style="width:400px;"
            @input="change"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item
          label="厂商"
          prop="camManufacturer"
          label-width="60px"
        >
          <el-select
            v-model="form.camManufacturer"
            placeholder="请选择摄像头厂商"
            style="width:400px;"
            :disabled="isEdit"
            @change="change"
          >
            <el-option
              v-for="dict in camManufacturerOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item
          label="型号"
          prop="camModel"
          label-width="50px"
          @change="change"
        >
          <el-input
            v-model="form.camModel"
            placeholder="请选择摄像头型号"
            type="text"
            maxlength="40"
            show-word-limit
            style="width:410px;"
            @input="change"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item
          label="外观类型"
          prop="camType"
          label-width="80px"
        >
          <el-select
            v-model="form.camType"
            placeholder="请选择外观类型"
            style="width:380px;"
            @change="change"
          >
            <el-option
              v-for="dict in camTypeOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item
          label="传输类型"
          prop="camForm"
          label-width="80px"
        >
          <el-select
            v-model="form.camForm"
            placeholder="请选择传输类型"
            style="width:380px;"
            @change="change"
          >
            <el-option
              v-for="dict in camFormOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-divider
          content-position="left"
        ><i class="el-icon-share" />连接信息
        </el-divider>
      </el-col>
      <el-col :span="24">
        <el-form-item label="IP" prop="camIp" label-width="50px">
          <el-input
            v-model="form.camIp"
            placeholder="请输入摄像头IP地址"
            :disabled="isEdit"
            type="text"
            maxlength="15"
            show-word-limit
            @change="change"
          />
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item
          label="账号"
          prop="camUserName"
          label-width="60px"
        >
          <el-input
            v-model="form.camUserName"
            placeholder="请输入摄像头账号"
            :disabled="isEdit"
            maxlength="40"
            show-word-limit
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item
          label="密码"
          prop="camPassword"
          label-width="60px"
        >
          <el-input
            v-model="form.camPassword"
            placeholder="请输入摄像头密码"
            show-password
            maxlength="40"
            show-word-limit
            @input="change"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="端口" prop="camPort" label-width="60px">
          <el-input
            v-model="form.camPort"
            placeholder="请输入摄像头端口号"
            :disabled="isEdit"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item
          v-if="showCol"
          label="通道号"
          prop="camSequence"
          label-width="80px"
        >
          <el-input-number
            v-model="form.camSequence"
            controls-position="right"
            :min="1"
            :max="3"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item
          v-if="showCol"
          label="视频编码"
          prop="camCoding"
          label-width="80px"
        >
          <el-select
            v-model="form.camCoding"
            placeholder="请选择视频编码"
            style="width:380px;"
          >
            <el-option
              v-for="dict in camCodingOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item
          label="RTSP地址"
          prop="pullStreamUrl"
          label-width="80px"
        >
          <!--                <span slot="label">-->
          <!--                  RTSP地址-->
          <!--                  <el-tooltip content="访问此页面自定义的url地址，建议/开头书写，例如 /app-name/menu-name" placement="top">-->
          <!--                    <i class="el-icon-question" />-->
          <!--                  </el-tooltip>-->
          <!--                </span>-->
          <el-input
            v-model="form.pullStreamUrl"
            placeholder="请输入主码流RTSP地址"
            :disabled="isEdit"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item
          v-if="showCol"
          label="分发地址"
          prop="pushStreamUrl"
          label-width="80px"
        >
          <el-input
            v-model="form.pushStreamUrl"
            placeholder="流媒体分发地址"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item
          v-if="showCol"
          label="子码流地址"
          prop="minorRtspUrl"
          label-width="90px"
        >
          <el-input
            v-model="form.minorRtspUrl"
            placeholder="子码流地址"
          />
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-divider
          v-if="showCol"
          content-position="left"
        ><i class="el-icon-circle-plus" />其他配置
        </el-divider>
      </el-col>
      <el-col :span="8">
        <el-form-item
          v-if="showCol"
          label="序列号"
          prop="camSno"
          label-width="80px"
        >
          <el-input v-model="form.camSno" placeholder="摄像头序列号" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item
          v-if="showCol"
          label="可视半径"
          prop="camRadius"
          label-width="80px"
        >
          <el-input
            v-model="form.camRadius"
            placeholder="摄像头可视半径"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item
          v-if="showCol"
          label="通道总数"
          prop="camChannelSum"
          label-width="80px"
        >
          <el-input-number
            v-model="form.camChannelSum"
            controls-position="right"
            :min="1"
            :max="5"
          />
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item
          v-if="showCol"
          label="经度"
          prop="camLongitude"
          label-width="50px"
        >
          <el-input v-model="form.camLongitude" placeholder="经度" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item
          v-if="showCol"
          label="纬度"
          prop="camLatitude"
          label-width="50px"
        >
          <el-input v-model="form.camLatitude" placeholder="纬度" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item
          v-if="showCol"
          label="海拔"
          prop="camAltitude"
          label-width="50px"
        >
          <el-input v-model="form.camAltitude" placeholder="海拔" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item
          v-if="showCol"
          label="塔高"
          prop="camTowerHeight"
          label-width="50px"
        >
          <el-input v-model="form.camTowerHeight" placeholder="塔高" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item
          v-if="showCol"
          label="备注"
          prop="camNote"
          label-width="50px"
        >
          <el-input v-model="form.camNote" placeholder="备注" />
        </el-form-item>
      </el-col>
    </el-form>

    <div slot="footer" class="dialog-footer-11">
      <div class="confirm">
        <el-button @click="cancel">取 消</el-button>
        <el-button
          v-if="title==='修改摄像头'"
          type="primary"
          :disabled="isEditSubmit"
          @click="submitForm"
        >确 定</el-button>
        <el-button
          v-else
          type="primary"
          :disabled="isEditSubmit"
          @click="submitForm"
        >添 加</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import {
  addSysCamera,
  changeCamAiStatus,
  changeCamAlarmStatus,
  changeCamEnable,
  getSysCamera,
  listSysCamera,
  updateSysCamera
} from '@/api/box/sys-camera'
export default {
  name: 'AddCamera',
  props: {
    title: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const checkoutIP = (rule, value, callback) => {
      const ipRules = /^((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9]))$/
      if (!ipRules.test(value)) {
        callback(new Error('请输入正确的IP格式'))
      } else {
        callback()
      }
    }
    return {
      // 用户权限控制列显示
      showCol: true,
      // 是否显示弹出层
      open: false,
      isEdit: false,
      isEditSubmit: false,
      dialogVisible: false,
      form: {
        camSequence: '1',
        camChannelSum: '1'
      },
      rules: {
        camName: [
          { required: true, message: '请输入摄像头名称', trigger: 'change' }
        ],
        camManufacturer: [
          {
            required: true,
            message: '请选择摄像头厂商',
            trigger: 'change'
          }
        ],
        camType: [
          {
            required: true,
            message: '请选择摄像头外观类型',
            trigger: 'change'
          }
        ],
        camForm: [
          {
            required: true,
            message: '请选择摄像头传输类型',
            trigger: 'change'
          }
        ],
        camIp: [
          {
            required: true,
            message: '请输入摄像头IP',
            trigger: 'change'
          },
          { validator: checkoutIP, trigger: 'blur' }
        ],
        camUserName: [
          {
            required: true,
            message: '请输入摄像头账号',
            trigger: 'change'
          }
        ],
        camPassword: [
          {
            required: true,
            message: '请输入摄像头密码',
            trigger: 'change'
          }
        ],
        camPort: [
          {
            required: true,
            type: 'integer',
            min: 0,
            max: 65535,
            message: '请输入摄像头端口号且范围是0到65535',
            trigger: 'change',
            transform(value) {
              return Number(value)
            }
          }
        ],
        camSequence: [
          {
            required: true,
            message: '请输入摄像头通道号',
            trigger: 'change'
          }
        ],
        camCoding: [
          {
            required: true,
            message: '请输入摄像头视频编码',
            trigger: 'change'
          }
        ]
      },
      // 类型数据字典
      typeOptions: [],
      syscameraList: [],
      camManufacturerOptions: [],
      camTypeOptions: [],
      camFormOptions: [],
      camEnableOptions: [],
      camOnlineStatusOptions: [],
      camAlarmStatusOptions: [],
      camAiStatusOptions: [],
      camCodingOptions: [],
      // 关系表类型

      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        camName: undefined,
        camModel: undefined,
        camManufacturer: undefined,
        camType: undefined,
        camForm: undefined,
        camEnable: undefined,
        camOnlineStatus: undefined,
        createdAtOrder: 'desc'
      }
    }
  },
  created() {
    this.getList()
    this.getDicts('sys_cam_manu').then(response => {
      this.camManufacturerOptions = response.data
    })
    this.getDicts('sys_cam_model').then(response => {
      this.camTypeOptions = response.data
    })
    this.getDicts('sys_cam_form').then(response => {
      this.camFormOptions = response.data
    })
    this.getDicts('sys_device_status').then(response => {
      this.camEnableOptions = response.data
    })
    this.getDicts('sys_box_query').then(response => {
      this.camOnlineStatusOptions = response.data
    })
    this.getDicts('sys_ai_switch').then(response => {
      this.camAlarmStatusOptions = response.data
    })
    this.getDicts('sys_ai_switch').then(response => {
      this.camAiStatusOptions = response.data
    })
    this.getDicts('sys_cam_coding').then(response => {
      this.camCodingOptions = response.data
    })
    // websocket
    // this.id = this.guid()
    // this.group = 'camera'
    // this.initWebSocket()
    // 权限控制
    // console.info("user", this.$store.state.user);
    const roles = this.$store.state.user.roles
    if (roles.indexOf('normal') !== -1) {
      // 修改对应角色名，控制权限
      this.showCol = false
    }
  },
  methods: {
    // 表单重置
    reset() {
      this.form = {
        camSno: undefined,
        camName: undefined,
        camModel: undefined,
        camManufacturer: undefined,
        camType: undefined,
        camForm: undefined,
        camRadius: undefined,
        camIp: undefined,
        camPort: undefined,
        camUserName: undefined,
        camPassword: undefined,
        camChannelNum: undefined,
        camChannelSum: 1,
        camPresetId: undefined,
        camSequence: 1,
        camStartId: undefined,
        camWindowId: undefined,
        pullStreamUrl: undefined,
        pushStreamUrl: undefined,
        minorRtspUrl: undefined,
        camLinePath: undefined,
        camLoginId: undefined,
        camRealPlayId: undefined,
        camLongitude: undefined,
        camLatitude: undefined,
        camAltitude: undefined,
        camTowerHeight: undefined,
        camEnable: undefined,
        camOnlineStatus: undefined,
        camAlarmStatus: undefined,
        camAiStatus: undefined,
        camCoding: '0',
        camNote: undefined
      }
      this.resetForm('form')
    },
    getImgList: function() {
      this.form[this.fileIndex] = this.$refs['fileChoose'].resultList[0].fullUrl
    },
    fileClose: function() {
      this.fileOpen = false
    },
    camManufacturerFormat(row) {
      return this.selectDictLabel(
        this.camManufacturerOptions,
        row.camManufacturer
      )
    },
    camTypeFormat(row) {
      return this.selectDictLabel(this.camTypeOptions, row.camType)
    },
    camFormFormat(row) {
      return this.selectDictLabel(this.camFormOptions, row.camForm)
    },
    camEnableFormat(row) {
      return this.selectDictLabel(this.camEnableOptions, row.camEnable)
    },
    camOnlineStatusFormat(row) {
      return this.selectDictLabel(
        this.camOnlineStatusOptions,
        row.camOnlineStatus
      )
    },
    camAiStatusFormat(row) {
      return this.selectDictLabel(this.camAiStatusOptions, row.camAiStatus)
    },
    camCodingFormat(row) {
      return this.selectDictLabel(this.camCodingOptions, row.camCoding)
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
      this.queryParams['createdAtOrder'] = 'desc'
      this.handleQuery()
    },
    // /** 新增按钮操作 */
    // handleAdd() {
    //   this.reset()
    //   this.open = true
    //   this.title = '添加摄像头'
    //   this.isEdit = false
    // },
    // 取消按钮
    cancel() {
      this.visible = false
      this.reset()
    },
    /** 修改摄像头名称 */
    change() {
      this.isEditSubmit = false
    },
    getList() {
      // debugger
      // console.log('查询', 123)
      this.loading = true
      listSysCamera(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.syscameraList = response.data.list
          // console.info(JSON.stringify(this.syscameraList))
          this.total = response.data.count
          this.loading = false
        }
      )
    },
    handleCamEnableChange(row) {
      const text = row.camEnable === '1' ? '启用' : '关闭'
      this.$confirm(
        '确认要"' + text + '""' + row.camName + '"摄像头吗?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }
      )
        .then(function() {
          return changeCamEnable(row)
        })
        .then(() => {
          this.msgSuccess(text + '成功')
        })
        .catch(function() {
          row.camEnable = row.camEnable === '1' ? '0' : '1'
        })
    },
    // 摄像头告警状态修改
    handleCamAlarmStatusChange(row) {
      const text = row.camAlarmStatus === '1' ? '开启' : '关闭'
      this.$confirm(
        '确认要"' + text + '""' + row.camName + '"告警吗?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }
      )
        .then(function() {
          return changeCamAlarmStatus(row)
        })
        .then(() => {
          this.msgSuccess(text + '成功')
        })
        .catch(function() {
          row.camAlarmStatus = row.camAlarmStatus === '1' ? '0' : '1'
        })
    },
    // 摄像头算法状态修改
    handleCamAiStatusChange(row) {
      const text = row.camAiStatus === '1' ? '开启' : '关闭'
      this.$confirm(
        '确认要"' + text + '""' + row.camName + '"算法吗?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }
      )
        .then(function() {
          return changeCamAiStatus(row)
        })
        .then(() => {
          this.msgSuccess(text + '成功')
        })
        .catch(function() {
          row.camAiStatus = row.camAiStatus === '1' ? '0' : '1'
        })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      getSysCamera(row.camId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改摄像头'
        this.isEdit = true
        this.isEditSubmit = true
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.camId !== undefined) {
            this.isEditSubmit = true
            // console.info(JSON.stringify(this.form))
            updateSysCamera(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.isEditSubmit = false
                this.msgError(response.msg)
              }
            })
          } else {
            this.isEditSubmit = true
            addSysCamera(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.isEditSubmit = false
                this.msgError(response.msg)
              }
            })
          }
        }
      })
    }
  }
}

</script>
<style lang="scss" scoped>

.el-tag.el-tag--danger {
  background-color: #ffeded;
  border-color: #f44040;
  color: #f44040;
  border-radius: 4px 4px 4px 0px;
}
.el-tag.el-tag--success {
  background-color: #e7faf0;
  border-color: #32d47b;
  color: #32d47b;
  border-radius: 4px 4px 4px 0px;
}
.el-button--primary {
  background: linear-gradient(to bottom, #a388ff, #654ef4) !important;
}
.editDialog {
  .el-dialog__header {
    text-align: center;
    line-height: 110px;
    .el-dialog__title {
      color: #7558f4;
      font-size: 24px;
      font-weight: 700;
    }
  }
  .el-form-item {
    margin-left: 150px;
    margin-right: 150px;
  }
}
</style>
