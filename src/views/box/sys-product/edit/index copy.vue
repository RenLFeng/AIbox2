<template>
  <el-card style="width: 100%; padding: 10px">
    <el-tabs v-model="activeName">
      <el-tab-pane label="产品信息" name="info">
        <!-- 可以使用span 和 span-map对象来控制栅格的大小 -->
        <el-description title="产品信息" :column="5">
          <template slot="extra">
            <el-button
              v-permisaction="['admin:sysproduct:edit']"
              type="link"
              icon="el-icon-edit"
              :style="{ marginLeft: 20 }"
              @click="handleUpdate(form.prodId)"
            >编辑
            </el-button>
          </template>
          <el-description-item
            label="产品ID"
            :value="form.prodId"
            :span-map="{ xl: 8 }"
          />
          <el-description-item label="产品名称" :value="form.prodName" />
          <el-description-item label="归属部门">
            <template slot="content">
              <!-- {{ form.dept.deptName }} -->
            </template>
          </el-description-item>
          <!--          <el-description-item label="归属部门" >-->
          <!--            <template slot="content">-->
          <!--              {{ deptFormat(form.deptId) }}-->
          <!--            </template>-->
          <!--          </el-description-item>-->
          <el-description-item
            label="产品型号"
            :value="form.prodModel"
            :span="8"
            :span-map="{ md: 8 }"
          />
          <!--          <el-description-item label="发布状态" :value="form.isPublish" />-->
          <el-description-item label="发布状态">
            <template slot="content">
              {{ isPublishFormat(form.isPublish) }}
            </template>
          </el-description-item>
          <el-description-item label="产品类型">
            <template slot="content">
              {{ prodTypeFormat(form.prodType) }}
            </template>
          </el-description-item>
          <el-description-item label="传输协议">
            <template slot="content">
              {{ transportProtocolFormat(form.transportProtocol) }}
            </template>
          </el-description-item>
          <el-description-item label="入网方式">
            <template slot="content">
              {{ networkWayFormat(form.networkWay) }}
            </template>
          </el-description-item>
          <el-description-item label="设备类型">
            <template slot="content">
              {{ deviceTypeFormat(form.deviceType) }}
            </template>
          </el-description-item>
          <el-description-item label="存储策略">
            <template slot="content">
              {{ storePolicyFormat(form.storePolicy) }}
            </template>
          </el-description-item>
          <el-description-item label="所属项目">
            <template slot="content">
              {{ projectIdFormat(form.projectId) }}
            </template>
          </el-description-item>
          <el-description-item label="图片地址" :value="form.photoUrl" />
          <el-description-item label="产品说明" :value="form.prodDescribe" />
          <el-description-item label="备注" :value="form.prodNote" />
          <!--          <el-description-item label="定制">-->
          <!--            &lt;!&ndash;  使用名称为conent的slot来定制&ndash;&gt;-->
          <!--            <template slot="content">-->
          <!--              <div style="color: red;">-->
          <!--                我是定制内容-->
          <!--              </div>-->
          <!--            </template>-->
          <!--          </el-description-item>-->
        </el-description>
      </el-tab-pane>
      <!--      <el-tab-pane label="物模型" name="phyModel">-->
      <!--        <pro-pyh-model :prod-id="prodId" />-->
      <!--      </el-tab-pane>-->
      <el-tab-pane label="告警设置" name="warnSetting">
        <pro-warn-setting :prod-id="prodId" />
      </el-tab-pane>
      <el-tab-pane label="关联设备" name="box">
        <pro-warn-setting :prod-id="prodId" />
      </el-tab-pane>
    </el-tabs>

    <!-- 添加或修改菜单对话框 -->
    <el-drawer
      ref="drawer"
      :title="title"
      :visible.sync="open"
      direction="rtl"
      custom-class="demo-drawer"
      size="830px"
    >
      <div class="demo-drawer__content">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-col :span="12">
            <el-form-item label="产品名称" prop="prodName">
              <el-input v-model="form.prodName" placeholder="产品名称" />
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
          <el-col :span="8">
            <el-form-item label="产品型号" prop="prodModel">
              <el-input v-model="form.prodModel" placeholder="产品型号" />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="发布状态">
              <el-radio-group v-model="form.isPublish">
                <el-radio
                  v-for="dict in isPublishOptions"
                  :key="dict.value"
                  :label="dict.value"
                >{{ dict.label }}</el-radio>
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="产品类型" prop="prodType">
              <el-radio-group v-model="form.prodType">
                <el-radio
                  v-for="dict in prodTypeOptions"
                  :key="dict.value"
                  :label="dict.value"
                >{{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="传输协议" prop="transportProtocol">
              <el-radio-group v-model="form.transportProtocol">
                <el-radio
                  v-for="dict in transportProtocolOptions"
                  :key="dict.value"
                  :label="dict.value"
                >{{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="入网方式" prop="networkWay">
              <el-radio-group v-model="form.networkWay">
                <el-radio
                  v-for="dict in networkWayOptions"
                  :key="dict.value"
                  :label="dict.value"
                >{{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="设备类型" prop="deviceType">
              <el-radio-group v-model="form.deviceType">
                <el-radio
                  v-for="dict in deviceTypeOptions"
                  :key="dict.value"
                  :label="dict.value"
                >{{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="存储策略" prop="storePolicy">
              <el-radio-group v-model="form.storePolicy">
                <el-radio
                  v-for="dict in storePolicyOptions"
                  :key="dict.value"
                  :label="dict.value"
                >{{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="所属项目" prop="projectId">
              <el-radio-group v-model="form.projectId">
                <el-radio
                  v-for="dict in projectIdOptions"
                  :key="dict.value"
                  :label="dict.value"
                >{{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="图片地址" prop="photoUrl">
              <el-input
                v-model="form.photoUrl"
                placeholder="前端产品图片地址"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="产品说明" prop="prodDescribe">
              <el-input
                v-model="form.prodDescribe"
                placeholder="产品说明使用场景等"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="prodNote">
              <el-input v-model="form.prodNote" placeholder="产品备注" />
            </el-form-item>
          </el-col>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </div>
    </el-drawer>
  </el-card>
</template>
<script>
import ElDescription from '@/views/box/components/ElDescription'
import ElDescriptionItem from '@/views/box/components/ElDescriptionItem'
import { getSysProduct, updateSysProduct } from '@/api/box/sys-product'
import { treeselect } from '@/api/admin/sys-dept'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
// import ProPyhModel from './ProPyhModel'
import ProWarnSetting from './ProWarmSetting'
export default {
  name: 'EditProduct',
  components: {
    ElDescription,
    ElDescriptionItem,
    Treeselect,
    // ProPyhModel,
    ProWarnSetting
  },
  data() {
    return {
      activeName: 'info',

      prodId: '',
      // 表详细信息
      form: {
        // dept: {
        //   deptName: '守行智能'
        // }
      },
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 关系表类型
      isPublishOptions: [],
      prodTypeOptions: [],
      transportProtocolOptions: [],
      networkWayOptions: [],
      deviceTypeOptions: [],
      storePolicyOptions: [],
      projectIdOptions: [],
      // 部门树选项
      deptOptions: [],
      // 表单校验
      rules: {
        isPublish: [
          {
            required: true,
            message: '产品状态-是否发布(0未发布 1发布）不能为空',
            trigger: 'blur'
          }
        ],
        prodName: [
          { required: true, message: '产品名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    $route(to, from) {
      if (to.query.prodId !== from.query.prodId) {
        this.prodId = to.query.prodId
        // this.init();
      }
    }
  },

  beforeCreate() {
    // this.getData()
    const { prodId } = this.$route.query
    if (prodId) {
      this.prodId = prodId
      // console.log(this.prodId)
      /** 修改按钮操作 */
      getSysProduct(prodId).then(response => {
        this.form = response.data
      })
    }
  },
  created() {
    this.getTreeselect()
    this.getData()
    this.reset()
    this.getDicts('sys_device_publish').then(response => {
      this.isPublishOptions = response.data
    })
    this.getDicts('sys_prod_type').then(response => {
      this.prodTypeOptions = response.data
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
    this.getDicts('sys_product_project').then(response => {
      this.projectIdOptions = response.data
    })
  },
  methods: {
    getData() {
      const { prodId } = this.$route.query
      if (prodId) {
        console.log(prodId)
        this.prodId = prodId
        /** 修改按钮操作 */
        getSysProduct(prodId).then(response => {
          this.form = response.data
        })
      }
    },
    isPublishFormat(isPublish) {
      return this.selectDictLabel(this.isPublishOptions, isPublish)
    },
    prodTypeFormat(prodType) {
      return this.selectDictLabel(this.prodTypeOptions, prodType)
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
    projectIdFormat(projectId) {
      return this.selectDictLabel(this.projectIdOptions, projectId)
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
        prodName: undefined,
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
    handleUpdate(prodId) {
      this.reset()
      getSysProduct(prodId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改产品'
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          updateSysProduct(this.form).then(response => {
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
    }
  }
}
</script>
