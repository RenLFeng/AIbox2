<template>
  <BasicLayout>
    <template #wrapper>
      <div class="main-box flow-ai">
        <el-card class="box-card">
          <el-row class="title-wrap">
            <el-col :span="20">
              <div class="grid-content bg-purple input-wrap">
                <label for="">输入查询</label>
                <el-input
                  v-model="seachName"
                  clearable
                  placeholder="流程名称"
                  prefix-icon="el-icon-search"
                />
              </div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content bg-purple-light">
                <el-button type="primary" @click="seachFn">查询</el-button>
              </div>
            </el-col>
          </el-row>
          <div class="table-wrap">
            <el-row style="padding: 15px 0">
              <el-col :span="12" style="color: #666">
                <div class="grid-content bg-purple">流程算法列表</div>
              </el-col>
              <el-col :span="12" style="text-align: right">
                <el-button
                  type="primary"
                  @click="addFlow()"
                >创建流程</el-button>
              </el-col>
            </el-row>
            <el-table :data="tableDataList" style="width: 100%">
              <el-table-column label="流程名称">
                <template slot-scope="scope">
                  <span>{{ scope.row.flowName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="步骤数">
                <template slot-scope="scope">
                  <span>{{ scope.row.stepSize }}</span>
                </template>
              </el-table-column>
              <el-table-column label="流程结束判定">
                <template slot-scope="scope">
                  <span>{{ showFlowTime(scope.row.flowTime).date_h }}</span>
                  小时
                  <span>{{ showFlowTime(scope.row.flowTime).date_s }}</span>
                  分钟
                </template>
              </el-table-column>
              <el-table-column label="步骤">
                <template slot-scope="scope">
                  <span>{{ scope.row.stepNames }}</span>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                  <!-- <router-link
                    :to="{
                      name: 'SysFlowHistory',
                      params: { groupId: 8778 }
                    }"
                    class="link-type"
                  >
                    <svg-icon
                      icon-class="configurine"
                      style="vertical-align: -2px; margin-right: 2px"
                    />
                    <span>配置LED</span>
                  </router-link> -->
                  <el-button
                    v-for="(v, i) in handles"
                    :key="i"
                    type="text"
                    size="small"
                    @click="handleClick(v.type, scope.row)"
                  >{{ v.label }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- :pageSizes="[1, 2, 3, 5]" -->
          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="queryParams.pageIndex"
            :limit.sync="queryParams.pageSize"
            @pagination="onPagination"
          />
        </el-card>
        <el-dialog
          :visible.sync="openDialog"
          :close-on-click-modal="false"
          center
          class="updata-dialog fulldialog"
          :class="curFormData.flowStatus !== '' ? 'disabled' : ''"
          :destroy-on-close="true"
          @open="resetFieldsFn"
        >
          <div slot="title">
            <p>
              <span class="slot-title">{{ updataTitle.name }}</span>&nbsp;
              <span
                v-if="updataTitle.state"
                class="color9 font14 slot-subtitle"
              >({{ updataTitle.state }})</span>
            </p>
          </div>
          <el-form
            ref="formref"
            class="formdata-wrap h100 auto-overflow"
            :class="curFormData.flowStatus !== '' ? 'disabled' : ''"
            :model="curFormData"
            :rules="rules"
            label-width="auto"
          >
            <el-form-item label="流程名称:" prop="flowName">
              <el-input
                v-model="curFormData.flowName"
                placeholder="请输入流程名称"
                :disabled="curFormData.flowStatus !== ''"
              />
            </el-form-item>
            <el-form-item
              v-for="(item, index) in curFormData.sysFlowNodes"
              :key="index"
              class="steps"
              :class="{
                'can-show-handle':
                  curFormData.flowStatus === '' &&
                  index < curFormData.sysFlowNodes.length - 1
              }"
              :label="`步骤${index + 1}:`"
              :prop="'sysFlowNodes.' + index + '.nodeName'"
              :rules="[
                // { validator: validateNodeName, trigger: ['blur', 'change'] }
                {
                  required: true,
                  message: '不能为空',
                  trigger: ['blur']
                },
                {
                  min: 1,
                  max: 40,
                  message: '长度在 3 到 40 个字符',
                  trigger: ['blur', 'change']
                }
              ]"
            >
              <el-select
                v-model="curFormData.sysFlowNodes[index].acId"
                placeholder="请选择摄像头及算法"
                :disabled="curFormData.flowStatus !== ''"
                @change="onNodesChange(index, $event)"
              >
                <!-- <div
                  v-infinite-scroll="aiConfigLoad"
                  :infinite-scroll-disabled="aiConfigLoadDisabled"
                  class="optscorll-wrap"
                  style="overflow: auto"
                > -->
                <el-option
                  v-for="(v, i) in sysAiConfigLists"
                  :key="i"
                  :label="v.label"
                  :value="v.id"
                />
                <!-- <p style="font-size: 12px" class="color9 tc">
                  {{ noMore ? "没有更多了..." : "" }}
                </p> -->
                <!-- </div> -->
              </el-select>
              <el-input
                v-model="curFormData.sysFlowNodes[index].nodeName"
                placeholder="请输入步骤名称"
                style="margin-top: 10px"
                :disabled="curFormData.flowStatus !== ''"
              />
              <div class="tips">
                <p v-if="index == curFormData.sysFlowNodes.length - 1">
                  识别到此步骤，即触发流程结束
                </p>
                <p v-else>{{ `识别到步骤${index + 1},即触发流程开始` }}</p>
              </div>
              <div class="icon-wrap">
                <i
                  class="el-icon-circle-plus-outline"
                  style="color: #654ef4"
                  @click="stepChange(index, 'add')"
                />
                <i
                  class="el-icon-remove-outline"
                  style="color: #eb6161"
                  @click="stepChange(index, 'remove')"
                />
              </div>
            </el-form-item>
            <el-form-item label="流程结束判定:">
              <div class="date-wrap">
                <span>距离流程开始&nbsp;</span>
                <el-input
                  v-model="date_h"
                  style="width: 95px"
                  type="number"
                  min="0"
                  max="168"
                  :disabled="curFormData.flowStatus !== ''"
                  @input="onInput(168, 'date_h')"
                />
                <span>&nbsp;小时&nbsp;</span>
                <el-input
                  v-model="date_s"
                  type="number"
                  style="width: 95px"
                  min="0"
                  max="60"
                  :disabled="curFormData.flowStatus !== ''"
                  @input="onInput(60, 'date_s')"
                />
                <span>&nbsp;分钟</span>
              </div>
            </el-form-item>
          </el-form>

          <div slot="footer" class="ALG">
            <el-button @click="submitForm('cance')">取 消</el-button>
            <el-button
              type="primary"
              :disabled="curFormData.flowStatus !== ''"
              @click="submitForm('sav')"
            >确 定</el-button>
          </div>
        </el-dialog>
        <el-dialog
          :visible.sync="openDeiltDialog"
          :close-on-click-modal="false"
          class="flow-dialog-wrap fulldialog"
        >
          <div slot="title" class="detil-title">
            <div class="slot-title">流程详情</div>
            <p class="flow-name">
              <span class="color-tit">流程名称:&nbsp;</span><span class="color9 color-subtit">{{
                curFormData.flowName
              }}</span>
            </p>
            <p class="flow-time">
              <span class="color-tit">结束判定:&nbsp;</span><span
                class="color9 color-subtit"
              >距离流程开始&nbsp;<b class="colord font16">{{
                showFlowTime(curFormData.flowTime).date_h
              }}</b>&nbsp;小时&nbsp;<b class="colord font16">{{
                showFlowTime(curFormData.flowTime).date_s
              }}</b>&nbsp;分
              </span>
            </p>
          </div>
          <div class="detil-lists h100 auto-overflow">
            <h3 class="divider">流程步骤：</h3>
            <p
              v-for="(v, index) in curFormData.sysFlowNodes"
              :key="index"
              class="item-detil"
            >
              <span class="">
                <span class="index">{{ index + 1 }}</span>
                {{ v.nodeName }}
              </span>
              <span class="color9"> {{ v.camName }}</span>
              <span class="color9"> {{ v.aiName }}</span>
            </p>
          </div>
        </el-dialog>
      </div>
    </template>
  </BasicLayout>
</template>

<script>
import { sysAiFlow, sysAiFlowList, sysAiConfig } from "@/api/box/sys-ai";
const defaultFnData = () => {
  return {
    flowName: "",
    stepSize: 2,
    stepNames: "",
    flowTime: 0,
    flowStatus: "",
    sysFlowNodes: [
      {
        acId: "", // 算法配置id
        aiId: 0, // 算法id
        boxId: 0, // 盒子id
        camId: 0, // 摄像头id
        nodeName: "", // 节点名称
        sort: 1
      },
      {
        acId: "",
        aiId: 0,
        boxId: 0,
        camId: 0,
        nodeName: "",
        sort: 2
      }
    ]
  };
};
const defaultStepData = (index) => {
  return {
    acId: "",
    aiId: 0,
    boxId: 0,
    camId: 0,
    nodeName: "",
    sort: index
  };
};
const handles = [
  {
    type: "detail",
    label: "详情"
  },
  {
    type: "edit",
    label: "修改"
  },
  {
    type: "del",
    label: "删除"
  }
];
export default {
  name: "SysAlFlowManage",
  components: {},
  data() {
    return {
      total: 0,
      openDeiltDialog: false,
      handles,
      date_h: 0,
      date_s: 0,
      openDialog: false,
      curFormData: {},
      rules: {
        flowName: [
          // { validator: validateflowName, trigger: "blur" },
          { required: true, message: "请输入流程名称", trigger: "blur" },
          {
            min: 1,
            max: 40,
            message: "长度在 3 到 40 个字符",
            trigger: "blur"
          }
        ]
      },
      seachName: "",
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10
      },
      aiConfigpageIndex: 1,
      aiConfigpageSize: 10,
      tableDataList: [],
      sysAiConfigLists: [],
      aiConfigLoading: false,
      aiConfigLoadEnd: false
    };
  },
  computed: {
    noMore() {
      return this.aiConfigLoadEnd;
    },
    aiConfigLoadDisabled() {
      return this.aiConfigLoading || this.noMore;
    },
    updataTitle() {
      const obj = {
        name: "创建流程",
        state: ""
      };
      if (this.curFormData.flowId) {
        obj.name = "修改流程";
        if (this.curFormData.flowStatus !== "") {
          obj.state = `${
            this.curFormData.flowStatus === "1" ? "进行中" : "已结束"
          },不可修改`;
        }
      }
      return obj;
    }
  },
  watch: {},
  activated() {
    this.querySysAiFlowList(this.queryParams, true);
    this.getSysAiConfig();
  },
  created() {},
  methods: {
    getSysAiConfig() {
      sysAiConfig().then((res) => {
        const { data } = res;
        let t = [];
        if (data.list && Array.isArray(data.list)) {
          t = data.list;
        }
        this.initAiConfigData(t);
        this.sysAiConfigLists = t;
      });
      // 分页
      // sysAiConfig({
      //   pageIndex: this.aiConfigpageIndex,
      //   pageSize: this.aiConfigpageSize
      // }).then((res) => {
      //   const { data } = res;
      //   let t = [];
      //   if (data.list && Array.isArray(data.list)) {
      //     t = data.list;
      //   }
      //   this.initAiConfigData(t);
      //   this.sysAiConfigLists = [...this.sysAiConfigLists, ...t];
      //   this.aiConfigpageIndex++;
      //   this.aiConfigLoading = false;
      //   if (t.length < this.aiConfigpageSize) {
      //     this.aiConfigLoadEnd = true;
      //   }
      // });
    },
    aiConfigLoad() {
      this.aiConfigLoading = true;
      this.getSysAiConfig();
    },
    initAiConfigData(lists) {
      for (const v of lists) {
        v.label = "";
        if (v.camera) {
          v.label += `${v.camera.camName}    `;
        }
        if (v.ai) {
          v.label += `${v.ai.aiName}`;
        }
      }
    },
    // 查询检索
    seachFn() {
      const queryParams = {
        flowName: this.seachName
      };
      this.querySysAiFlowList(queryParams);
    },
    // 操作
    handleClick(type, row) {
      console.log("操作", row);
      switch (type) {
        case "detail":
          this.curFormData = JSON.parse(JSON.stringify(row));
          for (const node_v of this.curFormData.sysFlowNodes) {
            node_v.camName = "";
            node_v.aiName = "";
            for (const v of this.sysAiConfigLists) {
              if (v.id == node_v.acId) {
                if (v.camera && v.camera.camName) {
                  node_v.camName = v.camera.camName;
                }
                if (v.ai && v.ai.aiName) {
                  node_v.aiName = v.ai.aiName;
                }
                break;
              }
            }
          }
          this.openDeiltDialog = true;
          break;
        case "edit":
          this.addFlow(row);
          break;
        case "del":
          if (row.flowStatus === "0") {
            this.$confirm("删除后将不可恢复", "删除流程算法?", {
              center: true
            }).then((res) => {
              sysAiFlow({
                method: "delete",
                data: {
                  flowId: row.flowId
                }
              }).then((res) => {
                this.$message.success("删除成功");
                this.querySysAiFlowList(this.queryParams, true);
              });
            });
            return;
          }
          this.$alert(
            "该流程在进行中，不可删除!</br>流程结束方可删除",
            "提示",
            {
              center: true,
              dangerouslyUseHTMLString: true
            }
          );
          break;
      }
    },
    // 创建流程
    addFlow(v = null) {
      this.curFormData = v ? JSON.parse(JSON.stringify(v)) : defaultFnData();
      if (this.curFormData.flowTime) {
        this.date_h = this.showFlowTime(this.curFormData.flowTime).date_h;
        this.date_s = this.showFlowTime(this.curFormData.flowTime).date_s;
      } else {
        this.date_h = 0;
        this.date_s = 0;
      }
      this.openDialog = true;
    },
    resetFieldsFn() {
      this.$refs["formref"] && this.$refs["formref"].resetFields();
    },
    // 创建，修改 ，流程
    submitForm(type) {
      if (type == "sav") {
        this.$refs.formref.validate((valid) => {
          if (valid) {
            if (this.date_h === 0 && this.date_s === 0) {
              this.$message.warning("请设置流程结束判定时间");
              return;
            }
            this.initAddData();
            this.updateSysAiFlowFn();
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      } else {
        this.openDialog = false;
      }
    },
    // 添加 or 修改 数据
    updateSysAiFlowFn() {
      let type = "add";
      const opt = {
        data: this.curFormData
      };
      if (this.curFormData.flowId) {
        type = "edit";
        opt.flowid = this.curFormData.flowId;
        opt.method = "put";
      } else {
        opt.method = "post";
      }
      const subFn = () => {
        sysAiFlow(opt).then((res) => {
          this.$message.success("成功");
          this.querySysAiFlowList(this.queryParams, true);
          this.openDialog = false;
        });
      };
      if (type == "edit") {
        this.$confirm("确定要修改吗?", "提示").then(() => {
          subFn();
        });
      } else {
        subFn();
      }
    },
    // 添加 or 修改 初始化数据
    initAddData() {
      let stepNames = "";
      const len = this.curFormData.sysFlowNodes.length;
      for (let i = 0; i < len; i++) {
        const item = this.curFormData.sysFlowNodes[i];
        const sort = i + 1;
        item.sort = sort;
        stepNames += `${item.nodeName}${i < len - 1 ? "、" : ""}`;
      }
      this.curFormData.stepSize = len;
      this.curFormData.stepNames = stepNames;
      this.curFormData.flowTime =
        Number(this.date_h * 60) + Number(this.date_s);
    },
    onInput(max, props) {
      const temp_value = Number(this[props]);
      this[props] = temp_value;
      if (temp_value >= max) {
        this.$message.info(
          `最大可输入${max}${props == "date_h" ? "小时" : "分钟"}`
        );
        this[props] = max;
        if (props == "date_h") {
          this["date_s"] = 0;
        }
      }
      if (temp_value) {
        if (!this.isInteger(temp_value)) {
          this.$message.info(`请输入整数`);
          this[props] = parseInt(temp_value);
        }
      }

      if (props == "date_s") {
        if (this["date_h"] == 168) {
          this[props] = 0;
          this.$message.info(`最大168小时`);
        }
      }
    },
    // 步骤 add remove  change
    stepChange(index, type) {
      if (type == "add") {
        if (this.curFormData.sysFlowNodes.length >= 10) {
          return this.$message.info("最多有10个步骤");
        }
        index++;
        this.curFormData.sysFlowNodes.splice(index, 0, defaultStepData(index));
        console.log(this.curFormData.sysFlowNodes);
      } else {
        if (this.curFormData.sysFlowNodes.length == 2) {
          return this.$message.info("最少2个步骤");
        }
        this.curFormData.sysFlowNodes.splice(index, 1);
      }
    },
    // 步骤节点change
    //     acId: '', //算法配置id
    //     aiId: 0, //算法id
    //     boxId: 0, //盒子id
    //     camId: 0, //摄像头id
    //     nodeName: "", //节点名称
    onNodesChange(index, id) {
      const cItem = this.getAiConfigItem(id);
      if (cItem) {
        this.curFormData.sysFlowNodes[index]["aiId"] = cItem["aId"];
        this.curFormData.sysFlowNodes[index]["boxId"] = cItem["bId"];
        this.curFormData.sysFlowNodes[index]["camId"] = cItem["cId"];
        this.curFormData.sysFlowNodes[index]["nodeName"] = cItem["ai"].aiName;
      }
    },
    getAiConfigItem(id) {
      for (const v of this.sysAiConfigLists) {
        if (v.id == id) {
          return v;
        }
      }
      return "";
    },
    onPagination(v) {
      this.querySysAiFlowList(this.queryParams);
    },
    /** 查询参数列表 */
    querySysAiFlowList(queryData = "", init = false) {
      let temp = [];
      queryData = queryData || this.queryParams;
      sysAiFlowList(queryData).then((res) => {
        if (res.code == 200) {
          const { data } = res;
          // if (init) {
          this.total = data.count;
          // }
          if (data && data.list && Array.isArray(data.list)) {
            temp = data.list;
            this.initDataProps(temp);
          }
          this.tableDataList = temp;
        }
      });
    },
    // 初始化自定义数据
    initDataProps(lists = []) {
      for (const v of lists) {
        if (v.sysFlowNodes === null) {
          v.sysFlowNodes = [];
        }
      }
    },
    showFlowTime(flowTime) {
      let date_h = 0;
      let date_s = 0;
      if (flowTime > 60) {
        date_h = parseInt(flowTime / 60);
        date_s = flowTime - date_h * 60;
      } else {
        date_h = 0;
        date_s = flowTime;
      }
      return {
        date_h: date_h,
        date_s: date_s
      };
    },
    validateNodeName(rule, value, callback) {
      if (value === "") {
        callback(new Error("不能为空"));
      } else {
        if (value.length > 40) {
          callback(new Error("限制40 个字符以内  "));
          return;
        }
        callback();
      }
    },
    isInteger(obj) {
      return Math.floor(obj) === obj;
    }
  }
};
</script>
<style lang="scss" scoped>
.flow-ai {
  .title-wrap {
    padding: 20px 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  .input-wrap {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    label {
      width: 80px;
      color: #999;
    }

    .el-input {
      width: 200px;
    }
  }

  .table-wrap {
    margin-top: 20px;
  }

  .formdata-wrap {
    .steps {
      position: relative;

      .icon-wrap {
        position: absolute;
        right: 0;
        top: 6px;
        font-size: 26px;
        width: 80px;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        opacity: 0;
        cursor: pointer;
        transition: all 0.3s;
      }

      &.can-show-handle:hover {
        .icon-wrap {
          opacity: 1;
        }
      }
    }
  }

  .tips {
    font-size: 12px;

    p {
      margin: 0;
    }
  }

  .detil-title {
    .flow-name {
      margin-top: 20px;
    }
    .tit {
      font-size: 20px;
      margin-bottom: 15px;
    }

    p {
      color: #666;
      font-size: 16px;
      margin: 5px 0;
    }
    .flow-time {
      margin-top: 10px;
    }
  }
}

.detil-lists {
  .item-detil {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 15px;
    border-bottom: 1px solid #f0f0f0;
    padding-right: 60px;

    .index {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 1px solid #409eff;
      border-radius: 50%;
      text-align: center;
      line-height: 20px;
      font-size: 12px;
      background: #409eff;
      color: #fff;
      margin-right: 6px;
    }
  }
}
</style>
<style>
.flow-ai .formdata-wrap .el-form-item__content {
  display: flex;
  flex-direction: column;
  padding-right: 80px;
}

.flow-ai .date-wrap input {
  padding: 0;
  text-align: center;
}

.flow-ai .date-wrap .el-input__prefix {
  left: 0;
}

.flow-ai .formdata-wrap.disabled * {
  color: #999;
}

.flow-dialog-wrap .el-dialog__body {
  padding-top: 0;
}

.updata-dialog.disabled .el-dialog__title {
  color: #999;
}
</style>
