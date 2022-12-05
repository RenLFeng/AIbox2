<template>
  <el-dialog
    width="80%"
    title="设备查看"
    :fullscreen="false"
    :visible.sync="dialogShow"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-tabs v-model="activeName">
      <el-tab-pane label="设备信息" name="info">
        <!-- 可以使用span 和 span-map对象来控制栅格的大小 -->
        <el-descriptions title="设备信息" :column="3">
          <!--          <template slot="extra">-->
          <!--            <el-button-->
          <!--              v-permisaction="['admin:sysbox:edit']"-->
          <!--              type="text"-->
          <!--              icon="el-icon-edit"-->
          <!--              :style="{ marginLeft: 20 }"-->
          <!--              @click="handleUpdate(form.boxId, 0)"-->
          <!--            >编辑-->
          <!--            </el-button>-->
          <!--          </template>-->
          <el-descriptions-item label="盒子ID">
            {{ form.boxId }}
          </el-descriptions-item>
          <el-descriptions-item label="盒子名称">
            {{ form.boxName }}
          </el-descriptions-item>
          <el-descriptions-item label="产品">
            {{ form.prod.prodName }}
          </el-descriptions-item>
          <el-descriptions-item label="机构">
            {{ form.dept.deptName }}
          </el-descriptions-item>
          <el-descriptions-item label="序列号">
            {{ form.boxSno }}
          </el-descriptions-item>
          <el-descriptions-item label="IP">
            {{ form.boxIp }}
          </el-descriptions-item>
          <el-descriptions-item label="型号">
            {{ form.boxModel }}
          </el-descriptions-item>
          <el-descriptions-item label="算法">
            {{ boxTypeFormat(form) }}
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <div>
              <span
                :style="{ color: form.boxStatus === '0' ? 'red' : 'green' }"
              >
                {{ boxStatusFormat(form) }}
              </span>
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="传输协议">
            {{ transportProtocolFormat(form) }}
          </el-descriptions-item>
          <el-descriptions-item label="说明">
            {{ form.boxDescribe }}
          </el-descriptions-item>
          <el-descriptions-item label="备注">
            {{ form.boxNote }}
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions
          style="margin: 50px 0 0 0"
          title="系统版本"
          :label-style="{ width: '150px' }"
          :column="2"
          border
        >
          <el-descriptions-item label="Linux版本">
            {{ form.sysVersion }}
          </el-descriptions-item>
          <el-descriptions-item label="系统版本">
            {{ form.goVersion }}
          </el-descriptions-item>
          <el-descriptions-item label="算法SDK版本">
            {{ form.aiSdkVersion }}
          </el-descriptions-item>
          <el-descriptions-item label="算法版本">
            {{ form.aiVersion }}
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions
          style="margin: 50px 0 0 0"
          title="MQTT认证配置"
          :label-style="{ width: '150px' }"
          :column="2"
          border
        >
          <!--          <template slot="extra">-->
          <!--            <el-button-->
          <!--              v-permisaction="['admin:sysproduct:edit']"-->
          <!--              type="text"-->
          <!--              icon="el-icon-edit"-->
          <!--              :style="{ marginLeft: 20 }"-->
          <!--              @click="handleUpdate(form.boxId, 1)"-->
          <!--            >编辑-->
          <!--            </el-button>-->
          <!--          </template>-->
          <el-descriptions-item label="mqt用户名">
            {{ form.mqttUsername }}
          </el-descriptions-item>
          <el-descriptions-item label="mqtt密码">
            {{ form.mqttPassword }}
          </el-descriptions-item>
        </el-descriptions>
      </el-tab-pane>
      <el-tab-pane label="运行状态" name="runningState">
        <ins-editor-status
          :status="form.boxStatus"
          :ais-npu="aisArry"
          :time-at="form.updatedAt"
          @ok="reloadData"
        />
      </el-tab-pane>
      <!--      <el-tab-pane label="算法关联" name="cameras">-->
      <!--        <algorithm-panel :box-id="form.boxId" />-->
      <!--      </el-tab-pane>-->
      <el-tab-pane label="关联摄像头" name="camera">
        <camera-panel :box-id="form.boxId" />
      </el-tab-pane>
      <!--      <el-tab-pane v-if="showTab" label="告警设置" name="alarmSetting">-->
      <!--        <warning-panel :box-id="form.boxId" />-->
      <!--      </el-tab-pane>-->
      <el-tab-pane v-if="showTab" label="设备影子" name="boxShadow">
        <shadow-panel :box-ip="form.boxIp" :show="dialogShow" />
      </el-tab-pane>
      <el-tab-pane v-if="showTab" label="MQTT消息管理" name="logManagementMQTT">
        <mqtt-panel :box-id="form.boxId" />
      </el-tab-pane>
      <!--            <el-tab-pane v-if="showTab" label="升级历史" name="boxShadowLog">-->
      <!--              <history-panel :box-id="form.boxId" />-->
      <!--            </el-tab-pane>-->
      <!--      <el-tab-pane v-if="showTab" label="日志管理" name="logManagement" />-->
    </el-tabs>

    <!-- 添加或修改菜单对话框 -->
    <el-drawer
      ref="drawer"
      :title="title"
      :visible.sync="open"
      direction="rtl"
      custom-class="demo-drawer"
      size="830px"
      append-to-body
    >
      <div class="demo-drawer__content">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <div v-if="showCol">
            <el-col :span="12">
              <el-form-item label="所属产品" prop="prodId">
                <el-select
                  v-model="form.pId"
                  placeholder="请选择所属产品"
                  @change="$forceUpdate()"
                >
                  <el-option
                    v-for="item in prodOptions"
                    :key="item.prodId"
                    :label="item.prodName"
                    :value="item.prodId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属机构" prop="deptId">
                <treeselect
                  v-model="form.deptId"
                  :options="deptOptions"
                  placeholder="请选择所属机构"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="序列号" prop="boxSno">
                <el-input v-model="form.boxSno" placeholder="盒子序列号" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="名称" prop="boxName">
                <el-input v-model="form.boxName" placeholder="盒子名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="IP" prop="boxIp">
                <el-input v-model="form.boxIp" placeholder="盒子IP" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="型号" prop="boxModel">
                <el-input
                  v-model="form.boxModel"
                  placeholder="盒子型号(旗舰版)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="类型" prop="boxType">
                <el-select v-model="form.boxType" placeholder="请选择">
                  <el-option
                    v-for="dict in boxTypeOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="传输协议" prop="transportProtocol">
                <el-select
                  v-model="form.transportProtocol"
                  placeholder="请选择传输协议"
                >
                  <el-option
                    v-for="dict in transportProtocolOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="入网方式" prop="networkWay">
                <el-select
                  v-model="form.networkWay"
                  placeholder="请选择入网方式"
                >
                  <el-option
                    v-for="dict in networkWayOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Linux版本" prop="sysVersion">
                <el-input v-model="form.sysVersion" placeholder="Linux版本" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="系统版本" prop="goVersion">
                <el-input v-model="form.goVersion" placeholder="后台系统版本" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="算法SDK版本" prop="aiSdkVersion">
                <el-input v-model="form.aiSdkVersion" placeholder="算法版本" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="算法版本" prop="aiVersion">
                <el-input v-model="form.aiVersion" placeholder="算法版本" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="说明" prop="boxDescribe">
                <el-input
                  v-model="form.boxDescribe"
                  placeholder="盒子说明使用场景等"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="boxNote">
                <el-input v-model="form.boxNote" placeholder="盒子备注" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="激活时间" prop="registryAt">
                <el-date-picker
                  v-model="form.registryAt"
                  type="datetime"
                  placeholder="选择日期"
                />
              </el-form-item>
            </el-col>
          </div>
          <div v-else>
            <el-col :span="12">
              <el-form-item label="mqt用户名" prop="mqttUsername">
                <el-input
                  v-model="form.mqttUsername"
                  placeholder="mqtt认证 用户名"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="mqtt密码" prop="mqttPassword">
                <el-input
                  v-model="form.mqttPassword"
                  placeholder="mqtt认证 密码"
                />
              </el-form-item>
            </el-col>
          </div>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </div>
    </el-drawer>
  </el-dialog>
</template>
<script>
// import algorithmPanel from './Algorithm'
import cameraPanel from './Camera'
// import warningPanel from './Warning'
import mqttPanel from './Mqtt'
// import historyPanel from './UpdateHistory'
import shadowPanel from './Shadow'
import InsEditorStatus from '@/views/box/sys-box/status/DeviceState'
import { getSysBox, updateSysBox } from '@/api/box/sys-box'
import { treeselect } from '@/api/admin/sys-dept'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getAllProductName } from '@/api/box/sys-product'
const statusMap = new Map()
statusMap.set('在线', 'success')
statusMap.set('离线', 'error')
statusMap.set('未激活', 'processing')
statusMap.set('online', 'success')
statusMap.set('offline', 'error')
statusMap.set('notActive', 'processing')

export default {
  name: 'EditProduct',
  components: {
    Treeselect,
    // algorithmPanel,
    InsEditorStatus,
    cameraPanel,
    // warningPanel,
    mqttPanel,
    // historyPanel,
    shadowPanel
  },
  props: {
    show: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    boxId: {
      type: String,
      default: '',
      required: true
    },
    boxIp: {
      type: String,
      default: '',
      required: true
    }
  },
  data() {
    return {
      activeName: 'info',
      showCol: true,
      showTab: true,
      dialogShow: this.show,
      // boxId: 0,
      // 表详细信息
      form: {
        // dept: {
        //   deptName: '守行智能'
        // }
      },
      // 产品
      prodOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 关系表类型
      boxTypeOptions: [],
      transportProtocolOptions: [],
      networkWayOptions: [],
      boxStatusOptions: [],
      // 部门树选项
      deptOptions: [],
      // 表单校验
      rules: {
        pId: [{ required: true, message: '所属产品不能为空', trigger: 'blur' }],
        deptId: [
          { required: true, message: '所属机构不能为空', trigger: 'blur' }
        ],
        boxName: [
          { required: true, message: '盒子名称不能为空', trigger: 'blur' }
        ],
        boxSno: [
          { required: true, message: '盒子序列号不能为空', trigger: 'blur' }
        ],
        boxIp: [{ required: true, message: '盒子IP不能为空', trigger: 'blur' }],
        boxModel: [
          { required: true, message: '盒子型号不能为空', trigger: 'blur' }
        ],
        registryAt: [
          { required: true, message: '盒子激活时间不能为空', trigger: 'blur' }
        ]
      },
      aisArry: []
    }
  },
  watch: {
    boxId: {
      handler(newValue, oldValue) {
        // console.info('boxId watch' + newValue)
        this.boxId = newValue
      },
      deep: true
    },
    boxIp: {
      handler(newValue, oldValue) {
        this.boxIp = newValue
      },
      deep: true
    },
    // 监听父组件传来的参数变化
    show: {
      handler(newValue, oldValue) {
        this.dialogShow = newValue
        if (newValue) {
          if (this.boxId) {
            this.getData()
          }
        }
      },
      deep: true
    },
    // 子控件显示状态改变，执行父级showChange方法
    dialogShow: {
      handler(newValue, oldValue) {
        this.$emit('showChange', newValue)
      },
      deep: true
    }
  },

  beforeCreate() {
    // this.getData()
    // const { boxId } = this.$route.query;
    // if (boxId) {
    //   this.prodId = boxId;
    //   console.log(this.boxId)
    //   /** 修改按钮操作 */
    //   getSysBox(boxId).then(response => {
    //     this.form = response.data;
    //   });
    // }
  },
  created() {
    this.getTreeselect()
    // this.getData();
    this.reset()
    this.getDicts('sys_prod_type').then(response => {
      this.boxTypeOptions = response.data
    })

    this.getDicts('sys_device_transport').then(response => {
      this.transportProtocolOptions = response.data
    })

    this.getDicts('sys_device_network').then(response => {
      this.networkWayOptions = response.data
    })

    this.getDicts('sys_box_status').then(response => {
      this.boxStatusOptions = response.data
    })
    // listSysProduct({ pageSize: 1000 }).then(response => {
    //   this.prodOptions = response.data.list
    // })
    this.getAllProductName()
    // 用户角色
    const roles = this.$store.state.user.roles
    if (roles.indexOf('453') !== -1) {
      // 修改对应角色名，控制权限
      this.showTab = false
    }
  },
  methods: {
    getData() {
      getSysBox(this.boxId).then(response => {
        this.form = response.data
        this.aisArry = []
        this.getNpuAis()
      })
    },
    /** 查询ProductName参数列表 */
    getAllProductName() {
      getAllProductName().then(response => {
        this.prodOptions = response.data
      })
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
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.deptOptions = response.data
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
    },
    // 表单重置
    reset() {
      this.form = {
        prodId: undefined,
        isDelete: undefined,
        isPublish: undefined,
        prod: {
          prodName: undefined
        },
        dept: {
          deptName: undefined
        },
        deptId: undefined,
        prodModel: '0',
        prodType: '0',
        transportProtocol: '0',
        networkWay: '0',
        deviceType: '0',
        storePolicy: '0',
        projectId: undefined,
        photoUrl: undefined,
        prodDescribe: undefined,
        prodNote: undefined,
        registryAt: undefined
      }
      this.resetForm('form')
    },
    /** 修改按钮操作 */
    handleUpdate(boxId, type) {
      this.reset()
      getSysBox(boxId).then(response => {
        this.form = response.data
        if (type === 1) {
          this.showCol = false
        } else {
          this.showCol = true
        }
        this.open = true
        this.title = '修改产品'
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          updateSysBox(this.form).then(response => {
            if (response.code === 200) {
              this.msgSuccess(response.msg)
              this.open = false
              // this.getData()
            } else {
              this.msgError(response.msg)
            }
          })
        }
      })
    },
    reloadData() {
      this.getData()
      this.msgSuccess('设备状态已刷新')
    },
    getNpuAis() {
      this.form.sysBoxNPUs.forEach((item, index) => {
        this.aisArry.push({
          aiName: item.ai.aiName,
          status: item.npuStatus,
          updatedAt: item.updatedAt
        })
      })
    }
  }
}
</script>
