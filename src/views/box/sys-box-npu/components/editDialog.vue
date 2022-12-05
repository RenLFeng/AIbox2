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
<template>
  <el-dialog
    width="70%"
    title="NPU配置"
    :fullscreen="false"
    :visible.sync="dialogShow"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form ref="form" :model="formData" size="small">
      <el-row>
        <el-col :span="10">
          <el-form-item label="选择摄像头">
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
        <el-col :span="10">
          <el-form-item label="排序">
            <el-input-number
              v-model="formData.npuSort"
              :min="1"
              placeholder="排序"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider
        content-position="left"
      ><i class="el-icon-mobile-phone" /> 算法信息配置</el-divider>
      <div
        v-for="(item, index) in formData.aiConfig"
        :key="index"
        class="item-list "
      >
        <el-row :gutter="5">
          <el-col :span="10">
            <el-form-item label="算法">
              <el-select
                v-model="formData.aiConfig[index].aiId"
                style="width:80%"
                placeholder="请选择"
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
                v-if="formData.aiConfig.length > 1"
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
            <el-collapse style="width:90%">
              <el-collapse-item title="算法配置参数">
                <div style="padding:0 10px 0 10px">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="isZoneSet">
                        <el-input
                          v-model="formData.aiConfig[index].aiConfig.isZoneSet"
                          size="mini"
                          style="width:60%"
                          placeholder="isZoneSet"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="detectionLine">
                        <el-input
                          v-model="
                            formData.aiConfig[index].aiConfig.detectionLine
                          "
                          size="mini"
                          style="width:60%"
                          placeholder="detectionLine"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="aiDistance">
                        <el-input
                          v-model="formData.aiConfig[index].aiConfig.aiDistance"
                          size="mini"
                          style="width:60%"
                          placeholder="aiDistance"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="shieldLine">
                        <el-input
                          v-model="formData.aiConfig[index].aiConfig.shieldLine"
                          placeholder="shieldLine"
                          style="width:60%"
                          size="mini"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="aiSensitivity">
                        <el-input
                          v-model="
                            formData.aiConfig[index].aiConfig.aiSensitivity
                          "
                          placeholder="aiSensitivity"
                          style="width:60%"
                          size="mini"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-col>
        </el-row>
      </div>
      <el-button
        v-permisaction="['admin:sysboxnpu:add']"
        size="mini"
        type="text"
        icon="el-icon-circle-plus-outline"
        @click="addItem()"
      >添加NPU配置
      </el-button>
      <el-form-item>
        <div class="dialog-footer" style="float: right">
          <el-button type="primary" @click="submitForm('form')">
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
import { getAiList } from '@/api/box/sys-ai'
export default {
  components: {},
  props: {
    show: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    prodId: {
      type: String,
      default: function() {
        return undefined
      }
    },
    npuId: {
      type: String,
      default: function() {
        return undefined
      }
    },
    bId: {
      type: String,
      default: function() {
        return undefined
      }
    }
  },
  data() {
    return {
      dialogShow: this.show,
      cameraList: [],
      aiList: [],
      // 表单数据
      formData: {
        npuId: undefined, // Id
        bId: undefined,
        cId: undefined,
        npuSort: 1,
        aiConfig: [{ aiId: undefined, aiConfig: {}}]
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
      }
    }
  },
  watch: {
    npuId: {
      handler(newValue, oldValue) {
        this.formData.npuId = newValue
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
    // 监听父组件传来的参数变化
    show: {
      handler(newValue, oldValue) {
        this.dialogShow = newValue
        if (newValue) {
          // this.algValues.length = 10;
          // this.cameraValues.length = 10;
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
    getAiList(this.addDateRange(this.queryParams, this.dateRange)).then(
      response => {
        this.aiList = response.data.list
      }
    )
  },
  methods: {
    // 加载数据
    initData() {
      // const _this = this
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 提交表单
    submitForm(formName) {
      const _this = this
      // 表单验证
      _this.$refs[formName].validate(valid => {
        if (valid) {
          // console.info(this.formData)
          //   api.client.assetsMgmt
          //     .postAssetTerminal(_this.formData)
          //     .then(res => {
          //       _this.$emit("ok");
          //       _this.$message({
          //         showClose: true,
          //         message: "数据保存成功",
          //         type: "success"
          //       });
          //       this.dialogShow = false;
          //     })
          //     .catch(err => {});
        }
      })
    },
    addItem() {
      this.formData.aiConfig.push({ aiId: undefined, aiConfig: {}})
    },
    delItem(index) {
      this.formData.aiConfig.splice(index, 1)
    }
  }
}
</script>
