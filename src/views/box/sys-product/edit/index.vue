<template>
  <!-- 添加或修改菜单对话框 -->
  <el-drawer
    ref="drawer"
    title="产品修改"
    :fullscreen="false"
    :visible.sync="dialogShow"
    direction="rtl"
    custom-class="demo-drawer"
    size="900px"
    append-to-body
  >
    <div class="demo-drawer__content">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="产品图标" prop="photoUrl">
              <prodAvatar :product="form" @ok="setPhotoUrl" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称" prop="prodName">
              <el-input
                v-model="form.prodName"
                placeholder="产品名称"
                maxlength="40"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="归属部门" prop="deptId">
              <treeselect
                v-model="form.deptId"
                :options="deptOptions"
                placeholder="请选择归属部门"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品型号" prop="prodModel">
              <el-input
                v-model="form.prodModel"
                placeholder="产品型号"
                maxlength="40"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品主控" prop="master">
              <el-input
                v-model="form.master"
                placeholder="产品主控"
                maxlength="40"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="摄像头路数" prop="camLimit">
              <el-input-number
                v-model="form.camLimit"
                placeholder="摄像头路数"
                :step="1"
                :min="1"
                :max="9999"
                step-strictly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="算力等级" prop="apeLimit">
              <el-input-number
                v-model="form.apeLimit"
                placeholder="算力等级"
                :step="1"
                :min="1"
                :max="9999"
                step-strictly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发布状态">
              <el-radio-group v-model="form.isPublish">
                <el-radio-button
                  v-for="dict in isPublishOptions"
                  :key="dict.value"
                  :label="dict.value"
                >{{ dict.label }}</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="传输协议" prop="transportProtocol">
              <el-radio-group v-model="form.transportProtocol">
                <el-radio-button
                  v-for="dict in transportProtocolOptions"
                  :key="dict.value"
                  :label="dict.value"
                >{{ dict.label }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入网方式" prop="networkWay">
              <el-radio-group v-model="form.networkWay">
                <el-radio-button
                  v-for="dict in networkWayOptions"
                  :key="dict.value"
                  :label="dict.value"
                >{{ dict.label }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备类型" prop="deviceType">
              <el-radio-group v-model="form.deviceType">
                <el-radio-button
                  v-for="dict in deviceTypeOptions"
                  :key="dict.value"
                  :label="dict.value"
                >{{ dict.label }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="存储策略" prop="storePolicy">
              <el-radio-group v-model="form.storePolicy">
                <el-radio-button
                  v-for="dict in storePolicyOptions"
                  :key="dict.value"
                  :label="dict.value"
                >{{ dict.label }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="产品说明" prop="prodDescribe">
              <el-input
                v-model="form.prodDescribe"
                placeholder="产品说明使用场景等"
                type="textarea"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="prodNote">
              <el-input
                v-model="form.prodNote"
                type="textarea"
                placeholder="产品备注"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="demo-drawer__footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </div>
  </el-drawer>
<!--  </el-dialog>-->
</template>
<script>
import { getSysProduct, updateSysProduct } from '@/api/box/sys-product'
import { treeselect } from '@/api/admin/sys-dept'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import prodAvatar from '../components/prodAvatar'
export default {
  name: 'EditProduct',
  components: {
    Treeselect,
    prodAvatar
  },
  props: {
    show: {
      type: Boolean,
      default: false,
      required: true
    },
    pId: {
      type: Number,
      default: 0,
      required: true
    }
  },
  data() {
    return {
      dialogShow: this.show,
      prodId: 1,
      // 表详细信息
      form: {},

      // 关系表类型
      isPublishOptions: [],
      transportProtocolOptions: [],
      networkWayOptions: [],
      deviceTypeOptions: [],
      storePolicyOptions: [],
      // 部门树选项
      deptOptions: [],
      // 表单校验
      rules: {
        prodName: [
          { required: true, message: '产品名称不能为空', trigger: 'blur' }
        ],
        deptId: [{ required: true, message: '归属部门不能为空', trigger: 'blur' }],
        camLimit: [
          { required: true, message: '摄像头路数不能为空', trigger: 'blur' }
        ],
        apeLimit: [
          { required: true, message: '算力等级不能为空', trigger: 'blur' }
        ],
        isPublish: [
          { required: true, message: '产品状态-是否发布(0未发布 1发布）不能为空', trigger: 'blur' }
        ],
        transportProtocol: [
          { required: true, message: '传输协议不能为空', trigger: 'blur' }
        ],
        networkWay: [
          { required: true, message: '入网方式不能为空', trigger: 'blur' }
        ],
        deviceType: [
          { required: true, message: '设备类型不能为空', trigger: 'blur' }
        ],
        storePolicy: [
          { required: true, message: '存储策略不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    pId: {
      handler(newValue, oldValue) {
        // console.log(newValue)
        this.prodId = newValue
      },
      deep: true
    },
    // 监听父组件传来的参数变化
    show: {
      handler(newValue, oldValue) {
        this.dialogShow = newValue
        if (newValue) {
          if (this.prodId) {
            this.getData()
          }
        }
      },
      deep: true
    },
    // 子控件显示状态改变，执行父级showChange方法
    dialogShow: {
      handler(newValue, oldeValue) {
        this.$emit('showChange', newValue)
      },
      deep: true
    }
  },

  created() {
    this.getTreeselect()
    this.getDicts('sys_device_publish').then(response => {
      this.isPublishOptions = response.data
    })
    this.getDicts('sys_device_transport').then(response => {
      this.transportProtocolOptions = response.data
    })
    this.getDicts('sys_device_network').then(response => {
      this.networkWayOptions = response.data
    })
    this.getDicts('sys_device_type').then(response => {
      this.deviceTypeOptions = response.data
    })
    this.getDicts('sys_store_policy').then(response => {
      this.storePolicyOptions = response.data
    })
  },
  methods: {
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.deptOptions = response.data
      })
    },
    getData() {
      this.reset()
      /** 修改按钮操作 */
      getSysProduct(this.prodId).then(response => {
        this.form = response.data
      })
    },
    isPublishFormat(isPublish) {
      return this.selectDictLabel(this.isPublishOptions, isPublish)
    },
    transportProtocolFormat(transportProtocol) {
      return this.selectDictLabel(
        this.transportProtocolOptions,
        transportProtocol
      )
    },
    networkWayFormat(networkWay) {
      return this.selectDictLabel(this.networkWayOptions, networkWay)
    },
    deviceTypeFormat(deviceType) {
      return this.selectDictLabel(this.deviceTypeOptions, deviceType)
    },
    storePolicyFormat(storePolicy) {
      return this.selectDictLabel(this.storePolicyOptions, storePolicy)
    },
    // 取消按钮
    cancel() {
      this.dialogShow = false
    },
    // 表单重置
    reset() {
      this.form = {
        prodId: undefined,
        isDelete: undefined,
        isPublish: '1',
        prodName: undefined,
        deptId: '1',
        prodModel: undefined,
        master: undefined,
        transportProtocol: '0',
        networkWay: '0',
        deviceType: '0',
        storePolicy: '0',
        photoUrl: undefined,
        prodDescribe: undefined,
        prodNote: undefined,
        camLimit: 0,
        apeLimit: 0
      }
      this.resetForm('form')
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          updateSysProduct(this.form).then(response => {
            if (response.code === 200) {
              this.msgSuccess(response.msg)
              this.dialogShow = false
            } else {
              this.msgError(response.msg)
            }
          })
        }
      })
    },
    setPhotoUrl(url) {
      this.form.photoUrl = url
    }
  }
}
</script>
