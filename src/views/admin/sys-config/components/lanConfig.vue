<template>
  <div class="lan-content">
    <el-row style="margin-bottom: 20px;">
      <el-button
        :type="actived === 'lan1' ? 'primary' : ''"
        @click="changeLan('lan1', 'eth0')"
      >LAN1</el-button>
      <el-button
        v-if="isShowLan2"
        :type="actived === 'lan2' ? 'primary' : ''"
        @click="changeLan('lan2', 'eth1')"
      >LAN2</el-button>
    </el-row>
    <el-row>
      <el-col :span="6">
        <el-form
          ref="form"
          :model="lanForm"
          :rules="rules"
          label-width="150px"
          label-position="left"
        >
          <el-form-item prop="address">
            <span slot="label">
              IP地址
              <el-tooltip
                class="item"
                effect="dark"
                content="请填写分配给BOX的IP地址"
                placement="top"
              >
                <i class="el-icon-warning-outline" />
              </el-tooltip>
            </span>
            <el-input v-model="lanForm.address" />
          </el-form-item>
          <el-form-item prop="netmask">
            <span slot="label">
              子网掩码
              <el-tooltip
                class="item"
                effect="dark"
                content="填写子网掩码"
                placement="top"
              >
                <i class="el-icon-warning-outline" />
              </el-tooltip>
            </span>
            <el-input v-model="lanForm.netmask" />
          </el-form-item>
          <el-form-item prop="gateway">
            <span slot="label">
              网关
              <el-tooltip
                class="item"
                effect="dark"
                content="填写网关地址"
                placement="top"
              >
                <i class="el-icon-warning-outline" />
              </el-tooltip>
            </span>
            <el-input v-model="lanForm.gateway" />
          </el-form-item>
          <el-form-item prop="dnsNameservers">
            <span slot="label">
              首选DNS服务器
              <el-tooltip
                class="item"
                effect="dark"
                content="可选，填写首选DNS服务器地址"
                placement="top"
              >
                <i class="el-icon-warning-outline" />
              </el-tooltip>
            </span>
            <el-input v-model="lanForm.dnsNameservers" />
          </el-form-item>
          <el-form-item>
            <div slot="label">
              次选DNS服务器
              <el-tooltip
                class="item"
                effect="dark"
                content="可选，填写次选DNS服务器地址"
                placement="top"
              >
                <i class="el-icon-warning-outline" />
              </el-tooltip>
            </div>
            <el-input v-model="lanForm.dnsNameserversSecChoice" />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row style="text-align: center;">
      <el-col :span="6">
        <el-button type="primary" @click="save">保存</el-button>
        <!--        <el-button @click="cancel">取消</el-button>-->
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getLanConfig, updateLanConfig } from '@/api/admin/sys-config'
export default {
  name: 'LanConfig',
  data() {
    const checkoutIP = (rule, value, callback) => {
      // console.info('checkoutIP' + value)
      const ipRules = /^((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9]))$/
      if (!ipRules.test(value)) {
        callback(new Error('请输入正确的格式'))
      } else {
        callback()
      }
    }

    return {
      actived: 'lan1',
      preForm: {},
      lanForm: {
        name: 'eth0',
        address: '',
        netmask: '',
        gateway: '',
        dnsNameservers: '',
        dnsNameserversSecChoice: ''
      },
      rules: {
        address: [
          {
            required: true,
            message: '输入分配给BOX的IP地址',
            trigger: 'blur'
          },
          { validator: checkoutIP, trigger: 'change' }
        ],
        netmask: [
          {
            required: true,
            message: '输入子网掩码',
            trigger: 'blur'
          },
          { validator: checkoutIP, trigger: 'change' }
        ],
        gateway: [
          {
            required: true,
            message: '输入网关地址',
            trigger: 'blur'
          },
          { validator: checkoutIP, trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    // 对于管理员用户，需要展示LAN2,否则不展示出来
    isShowLan2() {
      const roles = this.$store.state.user.roles || []
      if (roles.length) {
        return roles.includes('admin')
      }
      return false
    }
  },
  methods: {
    async getConfigData() {
      const res = await getLanConfig(this.lanForm.name)
      // console.log(11111, res)
      // this.preFormpreForm = {...res.data}
      this.lanForm = { ...res.data }
    },
    changeLan(mode, value) {
      this.actived = mode
      this.lanForm.name = value
      this.getConfigData()
    },
    save() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          // console.log('验证通过')
          this.$confirm('保存后，设备将重新启动', '提示', {
            confirmButtonText: '确定重启',
            cancelButtonText: '取消'
          })
            .then(async() => {
              const response = await updateLanConfig(this.lanForm)
              if (response.code === 200) {
                this.msgSuccess(response.msg)
              } else {
                this.msgError(response.msg)
              }
            })
        }
      })
    },
    cancel() {
      this.lanForm = { ...this.preForm }
      this.$refs.form.clearValidate()
    }
  }
}
</script>
<style lang="scss" scoped>
.lan-content {
  padding-left: 20px;
}
</style>
