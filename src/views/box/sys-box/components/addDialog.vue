<template>
  <el-dialog :title="title" :visible.sync="dialogShow" width="800px" :close-on-click-modal="false">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-col :span="12">
        <el-form-item label="所属产品" prop="pId">
          <el-select
            v-model="form.pId"
            placeholder="请选择所属产品"
            style="width:240px;"
          >
            <el-option
              v-for="item in prodOptions"
              :key="item.pId"
              :label="item.prodName"
              :value="item.pId"
            />
          </el-select>
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
          <el-input v-model="form.boxModel" placeholder="盒子型号(旗舰版)" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="类型" prop="boxType">
          <el-select
            v-model="form.boxType"
            placeholder="请选择"
            style="width:240px;"
          >
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
        <el-form-item
          label="传输协议"
          prop="transportProtocol"
          style="width:280px;"
        >
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
          <el-select v-model="form.networkWay" placeholder="请选择入网方式">
            <el-option
              v-for="dict in networkWayOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="算法权限">
          <el-tree
            ref="aiTree"
            :data="aiOptions"
            show-checkbox
            node-key="id"
            :empty-text="aiOptionsAlert"
            style="height:171px;overflow-y:auto;overflow-x:hidden;"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="算法版本" prop="aiVersion">
          <el-input v-model="form.aiVersion" placeholder="算法版本" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="系统版本" prop="goVersion">
          <el-input v-model="form.goVersion" placeholder="后台系统版本" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
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

      <el-col :span="12">
        <el-form-item label="摄像头限制" prop="camLimit">
          <el-input-number
            v-model="form.camLimit"
            placeholder="摄像头限制"
            :min="1"
            :max="16"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="NPU限制" prop="npuLimit">
          <el-input-number
            v-model="form.npuLimit"
            placeholder="NPU限制"
            :min="1"
            :max="4"
          />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="mqtt用户名" prop="mqttUsername">
          <el-input v-model="form.mqttUsername" placeholder="mqtt认证 用户名" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="mqtt密码" prop="mqttPassword">
          <el-input v-model="form.mqttPassword" placeholder="mqtt认证 密码" />
        </el-form-item>
      </el-col>
    </el-form>
    <div slot="footer" class="boxConfig">
      <el-button v-if="title==='修改盒子配置'" type="primary" @click="submitForm">确 定</el-button>
      <el-button v-else type="primary" @click="submitForm">添 加</el-button>
      <el-button @click="dialogShow = false">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import Treeselect from '@riophae/vue-treeselect'
import { addSysBox, updateSysBox } from '@/api/box/sys-box'
export default {
  name: 'AddDialog',
  components: { Treeselect },
  props: {
    title: {
      type: String,
      default: ''
    },
    networkWayOptions: {
      type: Array,
      default: () => []
    },
    transportProtocolOptions: {
      type: Array,
      default: () => []
    },
    boxTypeOptions: {
      type: Array,
      default: () => []
    },
    aiOptions: {
      type: Array,
      default: () => []
    },
    deptOptions: {
      type: Array,
      default: () => []
    },
    prodOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogShow: false,
      form: {
        boxId: '',
        prodId: '',
        deptId: undefined,
        parentId: '',
        boxPath: '',
        boxSno: '',
        boxName: '',
        boxIp: '',
        boxModel: '',
        boxType: '',
        transportProtocol: '0',
        networkWay: '0',
        boxStatus: '0',
        fedStatus: '0',
        aiVersion: '',
        goVersion: '',
        boxDescribe: '',
        boxNote: '',
        mqttPassword: '',
        mqttUsername: '',
        registryAt: '',
        sysAiIds: [],
        sysAi: []
      },
      rules: {
        prodId: [
          { required: true, message: '所属产品不能为空', trigger: 'blur' }
        ],
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
      aiOptionsAlert: '加载中，请稍后'
    }
  },
  methods: {
    getAiAllCheckedKeys() {
      // 目前被选中的菜单节点
      const checkedKeys = this.$refs.aiTree.getHalfCheckedKeys()
      console.log('目前被选中的菜单节点', checkedKeys)
      // 半选中的菜单节点
      const halfCheckedKeys = this.$refs.aiTree.getCheckedKeys()
      console.log('半选中的菜单节点', halfCheckedKeys)
      return halfCheckedKeys
    },
    /** 根据角色ID查询菜单树结构 */
    getRoleAiTreeSelect(checkedKeys) {
      this.$nextTick(() => {
        this.$refs.aiTree && this.$refs.aiTree.setCheckedKeys(checkedKeys)
      })
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.sysAiIds = this.getAiAllCheckedKeys()
          if ((this.optionType === 'update')) {
            updateSysBox(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.$emit('success')
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addSysBox(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('新增成功')
                this.$emit('success')
              } else {
                this.msgError(response.msg)
              }
            })
          }
        }
      })
    },
    open(mode, data, row) {
      this.optionType = mode
      if (mode === 'add') {
        this.$data.form = this.$options.data.call(this).form
        this.getRoleAiTreeSelect([])
      }
      if (data && data.boxId) {
        this.getRoleAiTreeSelect(data.sysAiIds)
        this.form = { ...data }
      }
      this.dialogShow = true
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.boxConfig{
  text-align: center;
margin: 40px auto;
.el-button--default{
  color:#C3C1C7;
  padding: 10px 30px;
}
.el-button--primary{
  padding: 10px 30px;
  background: linear-gradient(to bottom, #A388FF, #654EF4);
}
}
</style>
