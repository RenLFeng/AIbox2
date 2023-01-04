<template>
  <BasicLayout>
    <template #wrapper>
      <div>
        <div class="main-box flow-ai">
          <el-card class="box-card">
            <el-row class="title-wrap">
              <el-col :span="24">
                <div style="display: flex; justify-content: space-between">
                  <div class="grid-content bg-purple input-wrap">
                    <label for="" class="">输入查询</label>
                    <el-input
                      v-model="seachName"
                      clearable
                      placeholder="联动组名称/告警类型名称"
                      prefix-icon="el-icon-search"
                    />
                    <el-button
                      style="margin-left: 15px"
                      type="primary"
                      icon="el-icon-search"
                      @click="seachFn('filter')"
                    >查询</el-button>
                    <el-button
                      icon="el-icon-refresh"
                      @click="seachFn('reset')"
                    >重置</el-button>
                  </div>
                  <div style="padding-right: 10px">
                    <el-button
                      type="primary"
                      @click="addFlow()"
                    >创建联动组</el-button>
                  </div>
                </div>
              </el-col>
            </el-row>
            <div class="table-wrap">
              <el-row style="padding: 15px 0">
                <el-col :span="12" style="color: #666">
                  <div class="grid-content bg-purple colord font20 fontb">
                    算法联动列表
                  </div>
                </el-col>
              </el-row>
              <el-table
                v-loading="loading"
                :data="tableDataList"
                style="width: 100%"
                center
              >
                <el-table-column label="联动组名称" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.plcName }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="联动规则" align="center">
                  <template slot-scope="scope">
                    <span
                      v-for="(v, i) in scope.row.sysPlcPorts"
                      :key="i"
                    >{{ v.port }}
                      {{
                        scope.row.sysPlcPorts.length > 1 &&
                          i != scope.row.sysPlcPorts.length - 1
                          ? "、"
                          : ""
                      }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="告警类型名称" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.inputType }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="告警摄像头" align="center">
                  <template slot-scope="scope">
                    <el-tag
                      :color="stateTagColor(scope.row.plcStatus)"
                      style="color: #fff"
                    >{{ plcStatusTansText(scope.row.plcStatus) }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="音响" align="center">
                  <!-- <template slot-scope="scope" /> -->
                </el-table-column>
                <el-table-column label="开关" align="center">
                  <template slot-scope="scope">
                    <el-switch
                      v-model="scope.row.plcSwitch"
                      :class="{ 'close-switch': scope.row.plcSwitch === '1' }"
                      active-color="#977dfd"
                      inactive-color="#fff"
                      active-value="0"
                      inactive-value="1"
                      @change="onChangeOpen(scope.row)"
                    />
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button
                      v-for="(v, i) in handles"
                      :key="i"
                      :style="`color:${v.type == 'del' ? '#f00' : ''}`"
                      type="text"
                      size="small"
                      @click="handleClick(v.type, scope.row)"
                    >{{ v.label }}
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <pagination
              v-show="total > 0"
              :total="total"
              :page.sync="queryParams.pageIndex"
              :limit.sync="queryParams.pageSize"
              @pagination="onPagination(queryParams)"
            />
          </el-card>
          <el-dialog
            :visible.sync="openDialog"
            :close-on-click-modal="false"
            center
            class="updata-dialog fulldialog"
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
              :model="curFormData"
              :rules="rules"
              label-width="auto"
            >
              <el-form-item label="联动组名称:" prop="plcName">
                <el-input
                  v-model="curFormData.plcName"
                  placeholder="请输入联动组名称"
                />
              </el-form-item>
              <el-form-item label="联动规则配置:" class="tree-group">
                <div class="item-wrap horizontal">
                  <div
                    v-for="(item, i) in curFormData.roleGroups"
                    :key="i"
                    class="role-item clearfix"
                  >
                    <div class="org-tree-node fl inner-role-wrap">
                      <div class="inner-role-select org-tree-node-label">
                        <el-select
                          v-model="item.innerRole"
                          placeholder="请选择"
                        >
                          <el-option
                            v-for="op in roleOptions"
                            :key="op.value"
                            :label="op.label"
                            :value="op.value"
                          />
                        </el-select>
                      </div>
                      <div class="org-tree-node-children">
                        <div
                          v-for="(itemNode, nodei) in item.innerListRole"
                          :key="nodei"
                          class="org-tree-node list-role-item is-leaf"
                        >
                          <el-select v-model="itemNode.id" placeholder="请选择">
                            <el-option
                              v-for="op in aiOptionSelect"
                              :key="op.id"
                              :label="op.label"
                              :value="op.id"
                            />
                          </el-select>
                        </div>
                        <div class="org-tree-node list-role-item is-leaf">
                          <span
                            class="colord pointer"
                            @click="listRoleItemAdd(i)"
                          >+添加</span>
                        </div>
                      </div>
                    </div>
                    <div class="out-role-select fl org-tree-node-label">
                      <el-select v-model="item.outRole" placeholder="请选择">
                        <el-option
                          v-for="op in roleOptions"
                          :key="op.value"
                          :label="op.label"
                          :value="op.value"
                        />
                      </el-select>
                    </div>
                  </div>
                  <div class="role-item clearfix" style="height: 80px">
                    <div
                      class="org-tree-node fl inner-role-wrap outadd"
                      style="height: 100%"
                    >
                      <div class="inner-role-select org-tree-node-label">
                        <span
                          class="colord pointer"
                          @click="RoleTtemAdd()"
                        >+添加</span>
                      </div>
                    </div>
                  </div>
                </div>
              </el-form-item>
              <!-- <el-form-item label="联动规则配置:">
              <vue2-org-tree
                name="test"
                :data="rolData2"
                :horizontal="horizontal"
                :collapsable="false"
                label-class-name="bg-blue"
                :render-content="renderContent"
                class="my-org-tree"
              />
            </el-form-item> -->
              <el-form-item label="告警类型名称:" prop="plcName">
                <el-input
                  v-model="curFormData.plcName"
                  placeholder="请输入告警类型名称"
                />
              </el-form-item>
              <el-form-item label="告警摄像头:" prop="plcName">
                <el-select v-model="curFormData.inputType" placeholder="请选择">
                  <el-option
                    v-for="item in plcOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="告警音响:" prop="plcName">
                <el-select v-model="curFormData.inputType" placeholder="请选择">
                  <el-option
                    v-for="item in plcOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="告警音频路径:" prop="plcName">
                <el-input
                  v-model="curFormData.plcName"
                  placeholder="请输入告警音频路径"
                />
              </el-form-item>
            </el-form>

            <div slot="footer" class="ALG">
              <el-button @click="submitForm('cance')">取 消</el-button>
              <el-button
                type="primary"
                @click="submitForm('sav')"
              >确 定</el-button>
            </div>
          </el-dialog>
        </div>
        <plcConfig
          :show="plcConfigVisible"
          :cur-item-data="curItemData"
          :config-list="curPlcConfigFormData"
          :plc-lists="plcLists"
          :plc-cmd-lists="plcCmdLists"
          :plc-config-type="plcConfigType"
          @hidePlcConfig="onHidePlcConfig"
        />
      </div>
    </template>
  </BasicLayout>
</template>

<script>
import { plcDictData, sysPlcRequest } from "@/api/box/sys-plc";
import { isIP, isPort } from "@/utils/validate";
const plcConfig = () => import("@/views/box/plc-config/plcConfig");
// const defaultFnData = () => {
//   return {
//     data: {
//       plcName: "",
//       plcIp: "",
//       inputType: "",
//       sysPlcPorts: [
//         {
//           port: ""
//         }
//       ]
//     }
//   };
// };
const defaultStepData = (index) => {
  return {
    port: ""
  };
};
const defaultRoleGroups = () => {
  return {
    plcName: "",
    roleGroups: [
      {
        outRole: 1,
        innerRole: 0,
        innerListRole: [{ id: 1000 }]
      }
      // {
      //   outRole: 1,
      //   innerRole: 0,
      //   innerListRole: [{ id: 1000 }]
      // }
      // {
      //   outRole: 1,
      //   innerRole: 0,
      //   innerListRole: [{ id: 1000 }]
      // }
    ]
  };
};
const plcConfigData = () => {
  return [
    {
      plcId: "",
      dictCode: ""
    }
  ];
};
const handles = [
  {
    type: "edit",
    label: "修改"
  },
  {
    type: "config",
    label: "PLC配置"
  },
  {
    type: "del",
    label: "删除"
  }
];
export default {
  name: "PlcList",
  components: { plcConfig },
  data() {
    var checkIp = (rule, value, callback) => {
      if (!isIP(value)) {
        return callback(new Error("请输入正确的IP"));
      }
      callback();
    };
    return {
      loading: true,
      total: 0,
      openDeiltDialog: false,
      handles,
      date_h: 0,
      date_s: 0,
      openDialog: false,
      curFormData: {},
      rules: {
        plcName: [
          // { validator: validateflowName, trigger: "blur" },
          { required: true, message: "请输入PLC名称", trigger: "blur" }
        ],
        plcIp: [
          { validator: checkIp, trigger: ["blur", "change"] },
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        inputType: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      seachName: "",
      // 查询参数
      queryParams: {
        plcName: "",
        createdAtOrder: "desc",
        pageIndex: 1,
        pageSize: 10
      },
      aiConfigpageIndex: 1,
      aiConfigpageSize: 10,
      tableDataList: [],
      sysAiConfigLists: [],
      aiConfigLoading: false,
      aiConfigLoadEnd: false,
      rolData: [],
      rolData2: {},
      horizontal: true, // 横版 竖版
      collapsable: false,
      expandAll: true, // 是否全部展开
      labelClassName: "白色", // 默认颜色
      scrollTreeStyle: "width:100%;",
      plcOptions: [
        {
          label: "发生的",
          id: 1
        },
        {
          label: "方法",
          id: 2
        }
      ],
      roleOptions: [
        {
          label: "且",
          value: 1
        },
        {
          label: "或",
          value: 0
        }
      ],
      aiOptionSelect: [
        {
          id: 1000,
          label: "摄像头1"
        },
        {
          id: 1001,
          label: "摄像头2"
        },
        {
          id: 1002,
          label: "摄像头3"
        }
      ],
      curItemData: {},
      plcConfigVisible: false,
      curPlcConfigFormData: [],
      plcLists: [],
      plcCmdLists: [],
      plcConfigType: "edit"
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
        name: "创建联动组",
        state: ""
      };
      if (this.curFormData.plcId) {
        obj.name = "修改联动组";
      }
      return obj;
    }
  },
  watch: {},
  activated() {
    this.querySysPlcList(this.queryParams);
    this.initGetInputOption();
    this.loading = false;
  },
  created() {},
  methods: {
    RoleTtemAdd() {
      this.curFormData.roleGroups.push({
        outRole: 1,
        innerRole: 0,
        innerListRole: [{ id: "" }]
      });
    },
    listRoleItemAdd(index) {
      this.curFormData.roleGroups[index].innerListRole.push({ id: "" });
    },
    onHidePlcConfig(value) {
      this.plcConfigVisible = value;
    },
    renderContent(h, data) {
      return (
        <div class={!data.id ? "parent0" : ""}>
          <div slot='reference' class='bbbb'>
            <div class='treeItem aaaa'>
              <div class='controlIcon'></div>
              <span class='item_name'>{data.label}</span>
              <el-select v-model={data.id} placeholder='请选择'>
                {this.plcOptions.map((item) => {
                  return <el-option label={item.label} value={item.value} />;
                })}
              </el-select>
            </div>
          </div>
        </div>
      );
    },
    // 获取plc输入方式下拉
    initGetInputOption() {
      let temp = [];
      plcDictData({ dictType: "sys_plc_input" }).then((res) => {
        const { data } = res;
        if (data && Array.isArray(data) && data.length) {
          temp = data;
        }
        this.plcOptions = temp;
      });
    },
    onChangeOpen(row) {
      console.log(row);
      const opt = {
        data: row,
        plcId: row.plcId,
        method: "put"
      };
      sysPlcRequest(opt).then((res) => {
        this.$message.success("成功");
        this.querySysPlcList(row);
      });
    },
    // 查询检索
    seachFn(t) {
      if (t == "filter") {
        let seachKey = "plcName";
        const queryParams = {
          createdAtOrder: "desc"
        };
        if (isIP(this.seachName)) {
          seachKey = "plcIp";
        }
        queryParams[seachKey] = this.seachName;
        this.querySysPlcList(queryParams);
      } else {
        this.seachName = "";
        this.querySysPlcList(this.queryParams);
      }
    },
    // 操作
    async handleClick(type, row) {
      console.log("操作", row);
      switch (type) {
        case "config": {
          this.curItemData = row;
          const conFigData = plcConfigData();
          // const { data } = await sysPlcConfigRequest({ query: { acId: row.id }});
          // if (data && data.list && data.list.length) {
          //   conFigData = data.list;
          // }
          this.curPlcConfigFormData = conFigData;
          this.plcConfigVisible = true;
          break;
        }
        case "edit":
          if (row.plcSwitch === "0") {
            this.$alert("请先关闭此联动组再修改", "提示", {
              center: true
            });
            return;
          }
          this.addFlow(row);
          break;
        case "del":
          this.$confirm("删除后将不可恢复", "提示", {
            center: true
          }).then((res) => {
            sysPlcRequest({
              method: "delete",
              data: {
                plcId: row.plcId
              }
            }).then((res) => {
              this.$message.success("删除成功");
              this.querySysPlcList(this.queryParams);
            });
          });
          break;
      }
    },
    // 创建流程
    async addFlow(v = null) {
      // const { data } = v
      //   ? { data: JSON.parse(JSON.stringify(v)) }
      //   : defaultFnData();
      this.curFormData = defaultRoleGroups();
      this.openDialog = true;
      // const { data } = v
      //   ? await sysPlcRequest({ plcId: v.plcId })
      //   : defaultFnData();
      // this.curFormData = data;
      // this.openDialog = true;
    },
    resetFieldsFn() {
      this.$refs["formref"] && this.$refs["formref"].resetFields();
    },
    // 创建，修改 ，流程
    submitForm(type) {
      if (type == "sav") {
        this.$refs["formref"].validate((valid) => {
          if (valid) {
            this.initAddData();
            this.updateSysPlcFn();
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
    updateSysPlcFn() {
      let type = "add";
      const opt = {
        data: this.curFormData
      };
      if (this.curFormData.plcId) {
        type = "edit";
        opt.plcId = this.curFormData.plcId;
        opt.method = "put";
      } else {
        opt.method = "post";
      }
      const subFn = () => {
        sysPlcRequest(opt).then((res) => {
          this.$message.success("成功");
          this.querySysPlcList(this.queryParams);
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
      for (let i = 0; i < this.curFormData.sysPlcPorts.length; i++) {
        const item = this.curFormData.sysPlcPorts[i];
        item.port = parseInt(item.port);
      }
    },
    // 步骤 add remove  change
    stepChange(index, type) {
      if (type == "add") {
        if (this.curFormData.sysPlcPorts.length >= 10) {
          return this.$message.info("最多有10个步骤");
        }
        index++;
        this.curFormData.sysPlcPorts.splice(index, 0, defaultStepData(index));
        console.log(this.curFormData.sysPlcPorts);
      } else {
        if (this.curFormData.sysPlcPorts.length == 1) {
          return this.$message.info("最少1个步骤");
        }
        if (this.curFormData.sysPlcPorts[index].acId) {
          this.$confirm("确定删除吗?", "提示", {
            center: true
          }).then((res) => {
            this.curFormData.sysPlcPorts.splice(index, 1);
          });
          return;
        }
        this.curFormData.sysPlcPorts.splice(index, 1);
      }
    },
    onPagination(queryParams) {
      this.querySysPlcList(queryParams);
    },
    /** 查询参数列表 */
    querySysPlcList(queryData = "") {
      this.loading = true;
      let temp = [];
      queryData = queryData || this.queryParams;
      sysPlcRequest({
        query: queryData
      })
        .then((res) => {
          if (res.code == 200) {
            const { data } = res;
            this.total = data.count;
            if (data && data.list && Array.isArray(data.list)) {
              temp = data.list;
              this.initDataProps(temp);
            }
            this.tableDataList = temp;
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 初始化自定义数据
    initDataProps(lists = []) {
      for (const v of lists) {
        if (v.sysPlcPorts === null) {
          v.sysPlcPorts = [];
        }
      }
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
    },
    stateTagColor(state) {
      if (this.onLine(state) === true) {
        return "#977dfd";
      }
      if (this.onLine(state) === false) {
        return "#e6a23c";
      }
      return "#f4f4f5";
    },
    onLine(state) {
      if (state === "0") {
        return true;
      }
      if (state === "1") {
        return false;
      }
      return "";
    },
    plcStatusTansText(state) {
      if (state === "0") {
        return "在线";
      }
      if (state === "1") {
        return "离线";
      }
      return "未知状态";
    },
    checkPort(rule, value, callback) {
      if (!isPort(value)) {
        return callback(new Error("请输入正确的格式"));
      }
      callback();
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/styles/org-tree.scss";
.flow-ai {
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
    padding: 15px 35px;
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
        opacity: 1;
        cursor: pointer;
        transition: all 0.3s;
      }
    }
    .tree-group {
      .item-wrap {
        border: 1px solid #ccc;
        padding: 0 20px;
        border-radius: 3px;
        .org-tree-node-children {
          display: block;
        }
        .role-item {
          display: flex;
          align-items: center;
          position: relative;
          padding-left: 40px;
          margin-top: 20px;
          .out-role-select {
            width: 80px;
            position: absolute;
            bottom: -36px;
            left: 0;
            z-index: 9999;
          }
          .inner-role-wrap {
            padding-left: 40px;
            width: 80%;
            .inner-role-select {
              width: 60px;
              position: absolute;
              left: 12px;
              top: 50%;
              transform: translate(0, -50%);
              z-index: 999;
            }
            &::before,
            &::after {
              border-width: 2px;
              border-color: #000;
            }
            &.outadd {
              .org-tree-node-label {
                text-align: right;
              }
              &::before {
                width: 33px;
              }
            }
            .list-role-item {
              padding-left: 40px;
              &::before,
              &::after {
                width: 40px;
              }
            }
          }
          &:not(:first-child) {
            .inner-role-wrap {
              &::before {
                border-top: 0;
                border-left: 2px solid #000;
              }
            }
          }
        }
        .org-tree-node.add {
          padding-left: 80px;
        }
        // .org-tree-node.add::before,
        // .org-tree-node.add::after {
        //   width: 40px;
        //   height: 50%;
        //   left: 40px;
        // }
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
    .item {
      width: 30%;
    }
    .index {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 1px solid #7558f4;
      border-radius: 50%;
      text-align: center;
      line-height: 20px;
      font-size: 12px;
      background: #7558f4;
      color: #fff;
      margin-right: 6px;
    }
    &.tlabel {
      border-bottom: 1px dashed #ccc;
      padding-bottom: 10px;
    }
  }
}
</style>
<style>
.flow-ai .formdata-wrap .el-form-item__content {
  display: flex;
  flex-direction: column;
  /* padding-right: 80px; */
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
.end-time-wrap label {
  position: relative;
  padding-left: 10px;
}
.end-time-wrap label::before {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translate(0, -50%);
  display: block;
  content: "*";
  color: #f00;
}
.close-switch .el-switch__core {
  border: 2px solid #977dfd !important;
}
.close-switch .el-switch__core:after {
  width: 20px;
  height: 20px;
  top: -2px;
  left: -1px;
  border: 2px solid #977dfd !important;
}
.inner-role-select .el-input__inner {
  height: 28px;
}
.out-role-select input {
  border: 2px solid #000;
  color: #000;
  font-weight: bold;
}
.list-role-item .el-select {
  width: 100%;
}
</style>
