<template>
  <div class="plc-config-main">
    <el-dialog
      :title="`PLC配置`"
      :visible.sync="plcConfigVisible"
      class="max600"
    >
      <el-form
        ref="formref"
        class="formdata-wrap h100 auto-overflow"
        :model="formData"
        :rules="plcConfigRules"
        label-width="auto"
      >
        <div
          v-for="(item, index) in formData.sysPlcConfigInserts"
          :key="index"
          class="plc-config-box border-r10"
        >
          <el-form-item
            class="steps"
            :label="`请选择PLC:`"
            :prop="'sysPlcConfigInserts.' + index + '.plcId'"
            :rules="[
              {
                required: true,
                message: '不能为空',
                trigger: ['blur', 'change']
              }
            ]"
          >
            <div class="select-box" style="width: 280px">
              <el-select
                v-model="formData.sysPlcConfigInserts[index].plcId"
                placeholder="请选择"
                filterable
                style="width: 280px"
              >
                <el-option
                  v-for="(v, i) in plcLists"
                  :key="i"
                  :label="v.plcName"
                  :value="v.plcId"
                />
              </el-select>
              <p v-if="plcitem(item.plcId)" class="plc-tips-box">
                <span>IP:&nbsp;{{ plcitem(item.plcId).ip }}</span>
                <el-tooltip placement="top">
                  <div slot="content" class="port-box">
                    <p v-for="(p, i) in plcitem(item.plcId).port" :key="i">
                      端口{{ i + 1 }}:&nbsp;{{ p.port }}
                    </p>
                  </div>
                  <span>端口:{{ plcitem(item.plcId).port[0].port }}</span>
                </el-tooltip>

                <span>写入方式:&nbsp;{{ plcitem(item.plcId).inputType }}</span>
              </p>
            </div>

            <div class="icon-wrap">
              <i
                class="el-icon-circle-plus-outline fontb"
                style="color: #654ef4"
                @click="stepChange(index, 'add')"
              />
              <i
                class="el-icon-remove-outline fontb"
                style="color: #eb6161"
                @click="stepChange(index, 'remove')"
              />
            </div>
          </el-form-item>
          <el-form-item
            label="请选择输出指令:"
            :prop="'sysPlcConfigInserts.' + index + '.dictCode'"
            :rules="[
              {
                required: true,
                message: '不能为空',
                trigger: ['blur']
              }
            ]"
          >
            <el-select
              v-model="formData.sysPlcConfigInserts[index].dictCode"
              placeholder="请选择"
              style="width: 280px"
            >
              <el-option
                v-for="item in plcCmdLists"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="ALG">
        <el-button @click="submitForm('cance')">取 消</el-button>
        <el-button type="primary" @click="submitForm('sav')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { sysPlcConfigRequest } from "@/api/box/sys-plc";
const defaultStepData = (index) => {
  return {
    plcId: "",
    dictCode: ""
  };
};
export default {
  name: "",
  components: {},
  props: {
    show: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    curItemData: {
      type: Object,
      default() {
        return {};
      }
    },
    configList: {
      type: Array,
      default() {
        return [];
      }
    },
    plcLists: {
      type: Array,
      default() {
        return [];
      }
    },
    plcCmdLists: {
      type: Array,
      default() {
        return [];
      }
    },
    plcConfigType: {
      type: String,
      default: "add"
    }
  },
  data() {
    return {
      plcConfigVisible: false,
      plcConfigRules: {},
      formData: {
        sysPlcConfigInserts: []
      }
    };
  },
  watch: {
    show: function(newv, oldv) {
      this.plcConfigVisible = newv;
      this.$emit("", false);
    },
    plcConfigVisible: function(newv, oldv) {
      if (!newv) {
        this.$emit("hidePlcConfig", false);
      } else {
        Object.assign(this.formData, this.curItemData);
        this.formData.sysPlcConfigInserts = this.configList;
      }
    }
  },
  created() {},
  activated() {},
  mounted() {},
  deactivated() {},
  beforeDestroy() {},
  methods: {
    submitForm(type) {
      if (type == "sav") {
        this.$refs.formref.validate((valid) => {
          if (valid) {
            const opt = {
              data: { sysPlcConfigInserts: [] },
              method: "post"
            };
            if (this.plcConfigType == "edit") {
              opt.method = "put";
              opt.acId = this.formData.id;
              opt.query = { acId: this.formData.id };
            }
            for (const v of this.formData.sysPlcConfigInserts) {
              Object.assign(v, {
                boxId: this.formData.bId,
                cId: this.formData.cId,
                aId: this.formData.aId,
                acId: this.formData.id,
                dictCode: 11
              });
            }
            opt.data.sysPlcConfigInserts = this.formData.sysPlcConfigInserts;
            sysPlcConfigRequest(opt);
          } else {
            console.log("error submit!!");
            return false;
          }
          this.plcConfigVisible = false;
        });
      } else {
        this.plcConfigVisible = false;
      }
    },
    stepChange(index, type) {
      if (type == "add") {
        if (this.formData.sysPlcConfigInserts.length >= 10) {
          return this.$message.info("最多有10个步骤");
        }
        index++;
        this.formData.sysPlcConfigInserts.splice(
          index,
          0,
          defaultStepData(index)
        );
      } else {
        if (this.formData.sysPlcConfigInserts.length == 1) {
          return this.$message.info("最少1个步骤");
        }
        if (this.formData.sysPlcConfigInserts[index].acId) {
          this.$confirm("确定删除吗?", "提示", {
            center: true
          }).then((res) => {
            this.formData.sysPlcConfigInserts.splice(index, 1);
          });
          return;
        }
        this.formData.sysPlcConfigInserts.splice(index, 1);
      }
    },

    plcitem(plcId) {
      for (const v of this.plcLists) {
        if (v.plcId == plcId) {
          return {
            ip: v.plcIp,
            port: v.sysPlcPorts,
            inputType: v.inputType
          };
        }
      }
      return "";
    }
  }
};
</script>
<style scoped lang="scss">
.plc-config-box {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  .icon-wrap {
    font-size: 26px;
    i {
      margin: 0 5px;
      cursor: pointer;
    }
  }
}
.plc-tips-box {
  margin: 0px;
  font-size: 12px;
  color: #999;
  line-height: 16px;
  padding: 5px;
  span {
    margin-right: 10px;
  }
  .port-box {
    p {
      margin: 0px;
      font-size: 12px;
    }
  }
}
</style>
<style>
.plc-config-box .el-form-item__content {
  display: flex;
}
.select-box .el-select {
  width: 100% !important;
}
</style>
