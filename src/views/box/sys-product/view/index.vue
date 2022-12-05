<template>
  <el-dialog
    width="80%"
    title="产品查看"
    :fullscreen="false"
    :visible.sync="dialogShow"
  >
    <el-tabs v-model="activeName">
      <el-tab-pane label="产品信息" name="info">
        <!-- 可以使用span 和 span-map对象来控制栅格的大小 -->
        <el-descriptions
          title="产品信息"
          :label-style="{ width: '150px' }"
          :column="3"
          border
        >
          <el-descriptions-item label="产品ID">
            {{ form.prodId }}
          </el-descriptions-item>
          <el-descriptions-item label="产品名称">
            {{ form.prodName }}
          </el-descriptions-item>
          <el-descriptions-item label="归属部门">
            <el-tag size="small">{{ deptNameFormat(form.deptId) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="发布状态">
            <el-tag size="small" type="success"> {{ isPublishFormat(form.isPublish) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="产品型号">
            {{ form.prodModel }}
          </el-descriptions-item>
          <el-descriptions-item label="主控">
            {{ form.master }}
          </el-descriptions-item>
          <el-descriptions-item label="摄像头限制">
            <el-tag size="small" type="danger">{{ form.camLimit }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="算力">
            <el-tag size="small" type="danger"> {{ form.apeLimit }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="传输协议">
            {{ transportProtocolFormat(form.transportProtocol) }}
          </el-descriptions-item>
          <el-descriptions-item label="入网方式">
            {{ networkWayFormat(form.networkWay) }}
          </el-descriptions-item>
          <el-descriptions-item label="设备类型">
            {{ deviceTypeFormat(form.deviceType) }}
          </el-descriptions-item>
          <el-descriptions-item label="存储策略">
            {{ storePolicyFormat(form.storePolicy) }}
          </el-descriptions-item>
          <el-descriptions-item label="图片地址">
            {{ form.photoUrl }}
          </el-descriptions-item>
          <el-descriptions-item label="产品说明">
            {{ form.prodDescribe }}
          </el-descriptions-item>
          <el-descriptions-item label="备注">
            {{ form.prodNote }}
          </el-descriptions-item>
        </el-descriptions>
      </el-tab-pane>

      <el-tab-pane label="关联设备" name="box">
        <pro-device :prod-id="prodId" />
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script>
import { getSysProduct } from '@/api/box/sys-product'
import { getAllDeptNameDict, treeselect } from '@/api/admin/sys-dept'
import ProDevice from '../components/ProDevice'
export default {
  name: 'ViewProduct',
  components: {
    ProDevice
  },
  props: {
    show: {
      type: Boolean,
      default: function() {
        return false
      },
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
      activeName: 'info',
      // 表详细信息
      form: {},
      dialogShow: this.show,
      prodId: 0,
      // 表详细信息
      // 关系表类型
      isPublishOptions: [],
      prodTypeOptions: [],
      transportProtocolOptions: [],
      networkWayOptions: [],
      deviceTypeOptions: [],
      storePolicyOptions: [],
      projectIdOptions: [],
      // 部门树选项
      sysDeptNameOptions: [],
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
    this.getAllDeptNameDict()
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
      getSysProduct(this.prodId).then(response => {
        this.form = response.data
      })
    },
    isPublishFormat(isPublish) {
      // console.log(this.isPublishOptions)
      return this.selectDictLabel(this.isPublishOptions, isPublish)
    },
    deptNameFormat(deptId) {
      return this.selectDictLabel(this.sysDeptNameOptions, deptId)
    },
    /** 查询DeptName参数列表 */
    getAllDeptNameDict() {
      getAllDeptNameDict().then(response => {
        this.sysDeptNameOptions = response.data
      })
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
    }
  }
}
</script>
