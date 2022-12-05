<template>
  <el-dialog
    width="70%"
    title="算法NPU配置"
    :fullscreen="false"
    :visible.sync="dialogShow"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form ref="form" :model="formData" :rules="rules" size="small">
      <el-row>
        <el-col :span="6">
          <el-form-item label="选择摄像头" prop="cId">
            <el-select v-model="formData.cId" placeholder="请选择">
              <el-option
                v-for="item in cameraList"
                :key="item.camId"
                :label="item.camName"
                :value="item.camId"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="排序">
            <el-input-number
              v-model="formData.npuSort"
              :min="1"
              placeholder="排序"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="当前配置算力">
            {{ formData.npuWeight }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="盒子总算力">
            {{ boxW }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider
        content-position="left"
      ><i class="el-icon-mobile-phone" /> 算法信息配置</el-divider>
      <div
        v-for="(item, index) in formData.npuConfig"
        :key="index"
        class="item-list "
      >
        <el-row :gutter="5">
          <el-col :span="10">
            <el-form-item label="算法">
              <el-select
                v-model="formData.npuConfig[index].aiId"
                size="small"
                style="width:80%"
                placeholder="请选择"
                @change="aiChange($event, index)"
              >
                <el-option
                  v-for="ai in aiList"
                  :key="ai.aiId"
                  :label="ai.aiName"
                  :value="ai.aiId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="">
              <el-button
                v-if="formData.npuConfig.length > 1 && showCol"
                v-permisaction="['admin:sysboxnpu:remove']"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="delItem(index)"
              >移除
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-collapse>
              <el-collapse-item title="算法配置参数">
                <div style="padding:0 10px 0 10px">
                  <!-- v-if="formData.npuConfig[index].aiId == 1" -->
                  <firework-config
                    :config="formData.npuConfig[index].aiConfig"
                    :ind="index"
                    @ok="setAiConfig"
                  />
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-col>
        </el-row>
      </div>
      <el-button
        v-if="showCol"
        v-permisaction="['admin:sysboxnpu:add']"
        size="mini"
        type="text"
        icon="el-icon-circle-plus-outline"
        @click="addItem()"
      >添加NPU配置
      </el-button>
      <el-form-item>
        <div class="dialog-footer" style="float: right">
          <el-button style="background:linear-gradient(to bottom, #a388ff, #654ef4)" type="primary" @click="submitForm('form')">
            保存
          </el-button>
          <el-button @click="dialogShow = false"> 取消 </el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { listSysCamera } from '@/api/box/sys-camera'
// import { getAiListTemp } from '@/api/box/sys-ai'
import { getAiList } from '@/api/box/sys-ai'
import { setNpuConfig, getNpuConfig } from '@/api/box/sys-box-npu'
import fireworkConfig from './components/fireworksConfig'
export default {
  components: {
    fireworkConfig
  },
  props: {
    show: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    prodId: {
      type: Number,
      default: function() {
        return 0
      }
    },
    npuId: {
      type: Number,
      default: function() {
        return 0
      }
    },
    bId: {
      type: Number,
      default: function() {
        return 0
      }
    },
    boxWeight: {
      type: Number,
      default: function() {
        return 0
      }
    }
  },
  data() {
    return {
      // 用户权限控制列显示
      showCol: true,

      dialogShow: this.show,
      cameraList: [],
      aiList: [],
      boxW: this.boxWeight,
      // 表单数据
      formData: {
        npuId: undefined, // Id
        bId: undefined,
        cId: undefined,
        npuSort: 1,
        npuWeight: 0,
        npuConfig: [{ aiId: undefined, id: 0, aiConfig: {}}]
      },
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
        boxId: undefined
      },
      // 表单校验
      rules: {
        cId: [
          {
            required: true,
            message: '摄像头不能为空',
            trigger: 'blur'
          }
        ]
        // aiId: [
        //   {
        //     required: true,
        //     message: '算法不能为空',
        //     trigger: 'blur'
        //   }
        // ]
      }
    }
  },
  watch: {
    npuId: {
      handler(newValue, oldValue) {
        this.formData.npuId = newValue
        // this.formData.npuConfig = [{ aiId: undefined, aiConfig: {} }];
      },
      deep: true
    },
    bId: {
      handler(newValue, oldValue) {
        this.formData.bId = newValue
        this.queryParams.boxId = newValue
      },
      deep: true
    },
    prodId: {
      handler(newValue, oldValue) {
        this.formData.prodId = newValue
      },
      deep: true
    },
    boxWeight: {
      handler(newValue, oldValue) {
        this.boxW = newValue
      },
      deep: true
    },
    // 监听父组件传来的参数变化
    show: {
      handler(newValue, oldValue) {
        this.dialogShow = newValue
        if (newValue && this.formData.npuId) {
          this.initData()
          // this.algValues.length = 10;
          // this.cameraValues.length = 10;
        } else {
          this.$nextTick(() => {
            this.resetForm()
          })
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
    listSysCamera(this.addDateRange(this.queryParams, this.dateRange)).then(
      response => {
        this.cameraList = response.data.list
        if (this.cameraList.length > 0) {
          this.formData.cId = this.cameraList[0].camId
        }
      }
    )
    // --------------
    // getAiListTemp(this.addDateRange(this.queryParams, this.dateRange)).then(
    getAiList(this.addDateRange(this.queryParams, this.dateRange)).then(
      response => {
        // console.info('response.data', response.data)
        // this.aiList = response.data
        this.aiList = response.data[0].children
      }
    )

    // 权限控制
    // console.info("user", this.$store.state.user);
    const roles = this.$store.state.user.roles
    if (roles.indexOf('normal') !== -1) {
      // 修改对应角色名，控制权限
      this.showCol = false
    }
  },
  methods: {
    // 加载数据
    initData() {
      getNpuConfig(this.formData.npuId).then(response => {
        // console.info(response)
        this.formData = response.data
      })
    },
    // 重置表单
    resetForm() {
      this.formData.npuId = undefined
      this.formData.cId = undefined
      this.formData.npuSort = 1
      this.formData.npuWeight = 0
      this.formData.npuConfig = [{ aiId: undefined, id: 0, aiConfig: {}}]
      // this.formData = {
      //   npuId: undefined, // Id
      //   bId: undefined,
      //   cId: undefined,
      //   npuSort: 1,
      //   npuWeight: 0,
      //   npuConfig: [{ aiId: undefined, id: 0, aiConfig: {}}]
      // }
    },
    // 提交表单
    submitForm(formName) {
      const _this = this
      // 表单验证
      _this.$refs[formName].validate(valid => {
        if (valid) {
          // console.info(this.formData)
          const postData = { data: [] }
          postData.data.push(this.formData)

          if (this.formData.npuConfig.length > 1) {
            for (var i = 1; i < this.formData.npuConfig.length; i++) {
              if (
                this.formData.npuConfig[i - 1].aiId ===
                this.formData.npuConfig[i].aiId
              ) {
                this.$message({
                  showClose: true,
                  message: '不能重复选择算法！',
                  type: 'error'
                })
                return false
              }
            }
          }
          setNpuConfig(postData).then(response => {
            if (response.code === 200) {
              _this.$emit('ok')
              this.msgSuccess(response.msg)
              _this.dialogShow = false
            } else {
              this.msgError(response.msg)
            }
          })
        }
      })
    },
    addItem() {
      this.formData.npuConfig.push({ aiId: undefined, id: 0, aiConfig: {}})
    },
    delItem(index) {
      this.formData.npuConfig.splice(index, 1)
    },
    setAiConfig(data) {
      this.formData.npuConfig[data.index].aiConfig.aiDistance =
        data.config.aiDistance
      this.formData.npuConfig[data.index].aiConfig.aiSensitivity =
        data.config.aiSensitivity
      this.$message({
        showClose: true,
        message: '数据算法配置成功',
        type: 'success'
      })
    },
    aiChange(value, ix) {
      let weight = 0
      // this.formData.npuWeight;
      try {
        this.formData.npuConfig.forEach((item, index) => {
          const aiItem = this.aiList.filter(x => x.aiId === item.aiId)[0]
          if (aiItem) {
            weight += Number(aiItem.aiWeight)
          }
          if (weight + this.boxW > 100) {
            this.$message({
              showClose: true,
              message: '盒子总算力超过100，请重新选择',
              type: 'error'
            })
            this.formData.npuConfig[ix].aiId = undefined
            throw Error()
          }
        })
      } catch (e) {
        console.warn(e)
      }
      this.formData.npuWeight = weight
      this.boxW += weight
    }
  }
}
</script>

<style scoped>
.item-list {
  margin: 0 0 20px 0;
  border: 1px solid;
  padding: 10px 0 10px 10px;
}
.item-title {
  font-weight: bold;
  font-size: 17px;
  margin: 0 0 5px 0;
}
</style>
