<template>
  <BasicLayout>
    <template #wrapper>
      <div class="main-box">
        <el-card class="box-card">
          <el-form
            ref="queryForm"
            :model="queryParams"
            :inline="true"
            label-width="68px"
          >
            <div class="P-counting">
              <div class="left-2">
                <el-form-item label="输入查询" prop="groupName">
                  <el-input
                    v-model="queryParams.groupName"
                    prefix-icon="el-icon-search"
                    placeholder="组名称"
                    clearable
                    size="medium"
                    @keyup.enter.native="handleQuery"
                  />
                </el-form-item>

                <div class="LEDseek" @click="handleQuery">
                  <svg-icon
                    icon-class="newSearch"
                    style="vertical-align: 1px"
                  />
                  <span>查询</span>
                </div>

                <span class="reset">
                  <el-button size="mini" @click="resetQuery">重置</el-button>
                </span>
              </div>
              <div class="right-2">
                <el-form-item>
                  <el-button
                    v-permisaction="['admin:sysLed:add']"
                    type="primary"
                    size="medium"
                    style="
                      background: linear-gradient(to bottom, #a388ff, #654ef4);
                    "
                    @click="handleAdd"
                  >
                    十 添 加 组
                  </el-button>
                </el-form-item>
              </div>
            </div>
          </el-form>

          <!-- <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:sysAttendance:add']"
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              >新增组
            </el-button>
          </el-col>
        </el-row> -->

          <el-table v-loading="loading" :data="sysAttendanceList">
            <el-table-column
              v-if="showCol"
              label="编码"
              align="center"
              prop="groupId"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              v-if="showCol"
              label="机构"
              align="center"
              prop="deptName"
              :formatter="deptNameFormat"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{ deptNameFormat(scope.row) }}
              </template>
            </el-table-column>
            <el-table-column
              label="组名称"
              align="center"
              prop="groupName"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="成组摄像头"
              align="center"
              prop="sysAttendanceCamsShow"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="摄像头数量"
              align="center"
              prop="sysAttendanceCamCountShow"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="超员阈值"
              align="center"
              prop="threshold"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.threshold }} 人</span>
              </template>
            </el-table-column>
            <el-table-column
              label="当前人数"
              align="center"
              prop="amount"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <p
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  "
                >
                  <span
                    v-if="scope.row.amount > scope.row.threshold"
                    style="color: red"
                  >{{ scope.row.amount }} 人</span>
                  <span
                    v-else
                    style="color: green"
                  >{{ scope.row.amount }} 人</span>
                  <span
                    class="el-icon-edit-outline cpointer"
                    style="font-size: 25px; color: #999"
                    @click="updateAmount(scope.row)"
                  />
                </p>
              </template>
            </el-table-column>
            <el-table-column
              label="定时归零"
              align="center"
              prop="resetAt"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.resetAt, "{h}:{i}:{s}") }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="关联LED"
              align="left"
              prop="ledZone"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <div v-if="scope.row.sysLedStatuses === 0">暂无</div>
                <!--              <div v-for="item in scope.row.sysAudios" v-else>{{ item.audioName+" " }}</div>-->
                <div
                  v-for="(u, i) in scope.row.sysLedStatuses"
                  :key="i"
                  style="display: inline"
                >
                  <div>
                    <span
                      :style="{ color: u.ledStatus === '1' ? 'green' : 'red' }"
                    >●
                    </span>
                    <span
                      :style="{ color: u.ledStatus === '1' ? 'green' : 'red' }"
                    >
                      <!--                  {{ u.length > 0 ? "1" : "2" }}-->
                      {{ u.length > 0 ? "暂无" : u.ledName }} -
                      {{ u.length > 0 ? "暂无" : u.ledZoneIdsShow }}
                    </span>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <router-link
                  :to="{
                    name: 'SysAttendanceManage',
                    params: { groupId: scope.row.groupId }
                  }"
                  class="link-type"
                >
                  <!-- <i
                  class="el-icon-s-tools"
                  style="color: #1890ff;font-size: 12px"
                /> -->
                  <svg-icon
                    icon-class="configurine"
                    style="vertical-align: -2px; margin-right: 2px"
                  />
                  <span
                    style="font-size: 12px; color: #7558f4; margin-right: 10px"
                  >配置LED</span>
                </router-link>
                <!-- <el-button
                slot="reference"
                v-permisaction="['admin:sysAttendance:edit']"
                size="mini"
                type="text"
                icon="el-icon-refresh-left"
                @click="handleResetZero(scope.row)"
                >归零
              </el-button> -->
                <!-- <svg-icon icon-class="clear" />
                <span
                  style="font-size:12px;color: #7558F4;margin-right: 10px; cursor: pointer;"
                  @click="handleResetZero(scope.row)"
                >归零</span> -->
                <el-button
                  slot="reference"
                  v-permisaction="['admin:sysAttendance:remove']"
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                >解散组
                </el-button>
                <el-button
                  slot="reference"
                  v-permisaction="['admin:sysAttendance:edit']"
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row)"
                >修改
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="queryParams.pageIndex"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
          />

          <!-- 添加或修改对话框 -->
          <div class="personnel-group">
            <el-dialog :title="title" :visible.sync="open" width="500px">
              <el-form
                ref="form"
                :model="form"
                :rules="rules"
                label-width="auto"
              >
                <el-col :span="24">
                  <el-form-item prop="groupName">
                    <span slot="label">
                      组名称
                      <el-tooltip content="自定义分组名称" placement="top" />
                    </span>
                    <el-input
                      v-model="form.groupName"
                      placeholder="请输入组名称"
                      type="text"
                      maxlength="40"
                      show-word-limit
                      style="text-align: left"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item prop="camIds">
                    <span slot="label">
                      成组摄像头
                      <el-tooltip
                        content="只能选择已配置人员计数算法的摄像头"
                        placement="top"
                      />
                    </span>
                    <el-select
                      v-model="form.camIds"
                      style="text-align: left"
                      multiple
                      clearable
                      filterable
                      placeholder="请选择摄像头"
                    >
                      <el-option
                        v-for="item in camNameOptions"
                        :key="item.camId"
                        :label="item.camName"
                        :value="item.camId"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item prop="threshold">
                    <span slot="label">
                      超员阈值
                      <el-tooltip
                        content="当前人数大于该数值，则触
                  发告警"
                        placement="top"
                      />
                    </span>
                    <el-input-number
                      v-model="form.threshold"
                      placeholder="请输入人数"
                      :min="1"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item prop="resetAt">
                    <span slot="label">
                      定时归零
                      <el-tooltip
                        content="每天定时对组内人数归零"
                        placement="top"
                      />
                    </span>
                    <el-time-picker
                      v-model="form.resetAt"
                      placeholder="选择归零时间"
                      format="HH:mm:ss"
                    />
                  </el-form-item>
                </el-col>
              </el-form>
              <div slot="footer" class="addGroup">
                <el-button @click="cancel">取 消</el-button>
                <el-button
                  type="primary"
                  style="
                    background: linear-gradient(to bottom, #a388ff, #654ef4);
                  "
                  @click="submitForm"
                >添 加</el-button>
              </div>
            </el-dialog>
          </div>
        </el-card>
      </div>
    </template>
  </BasicLayout>
</template>

<script>
import {
  addSysAttendance,
  attendanceResetZero,
  delSysAttendance,
  getSysAttendance,
  listSysAttendance,
  updateSysAttendance,
  attendancesetAmount
} from "@/api/box/sys-attendance";
import { getAllDeptNameDict } from "@/api/admin/sys-dept";
import { getRelateCam } from "@/api/box/sys-ai";
import { unWsLogout } from "@/api/ws";

export default {
  name: "SysAttendance",
  components: {},
  data() {
    return {
      // 用户权限控制列显示
      showCol: true,
      // 遮罩层
      loading: true,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      isEdit: false,
      // 类型数据字典
      typeOptions: [],
      sysAttendanceList: [],
      sysDeptNameOptions: [],
      camNameOptions: [],
      // 关系表类型

      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        groupName: undefined,
        createdAtOrder: "desc"
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        groupName: [
          { required: true, message: "组名称不能为空", trigger: "blur" }
        ],
        camIds: [
          { required: true, message: "成组摄像头不能为空", trigger: "blur" }
        ],
        threshold: [
          { required: true, message: "超员阈值不能为空", trigger: "blur" }
        ]
      }
    };
  },
  activated() {
    this.getList();
    // 权限控制
    // console.info("user", this.$store.state.user);
    const roles = this.$store.state.user.roles;
    if (roles.indexOf("normal") !== -1) {
      // 修改对应角色名，控制权限
      this.showCol = false;
    }
    this.getAllDeptNameDict();
    this.getAllCamNameDict();

    this.id = this.guid();
    this.group = "attendance";
    this.initWebSocket();
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true;
      listSysAttendance(
        this.addDateRange(this.queryParams, this.dateRange)
      ).then((response) => {
        this.sysAttendanceList = response.data.list;
        this.total = response.data.count;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        groupId: undefined,
        deptId: this.$store.state.user.deptId,
        groupName: undefined,
        threshold: undefined,
        resetAt: undefined,
        ledZone: undefined
      };
      this.resetForm("form");
    },
    getImgList: function() {
      this.form[this.fileIndex] =
        this.$refs["fileChoose"].resultList[0].fullUrl;
    },
    fileClose: function() {
      this.fileOpen = false;
    },
    // 关系
    // 文件
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageIndex = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增组";
      this.isEdit = false;
    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      getSysAttendance(row.groupId).then((response) => {
        this.form = response.data;
        // console.info(this.form)
        this.open = true;
        this.title = "修改组";
        this.isEdit = true;
      });
    },
    /** 归零按钮操作 */
    handleResetZero(row) {
      this.$confirm("确认该摄像头组归零吗？归零后组内人数将为0人", "警告", {
        confirmButtonText: "归零",
        cancelButtonText: "取消"
      })
        .then(function() {
          return attendanceResetZero(row.groupId);
        })
        .then((response) => {
          if (response.code === 200) {
            this.msgSuccess(response.msg);
            this.getList();
          } else {
            this.msgError(response.msg);
          }
        })
        .catch(function() {});
    },
    /** 提交按钮 */
    submitForm: function() {
      // console.log(this.$route)
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.groupId !== undefined) {
            updateSysAttendance(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess(response.msg);
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addSysAttendance(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess(response.msg);
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm(
        '是否确认解散组名称为"' + row.groupName + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }
      )
        .then(function() {
          return delSysAttendance({ id: row.groupId })
        })
        .then((response) => {
          if (response.code === 200) {
            this.msgSuccess(response.msg);
            this.open = false;
            this.getList();
          } else {
            this.msgError(response.msg);
          }
        })
        .catch(function() {});
    },
    deptNameFormat(row) {
      return this.selectDictLabel(
        this.sysDeptNameOptions,
        row.deptId.toString()
      );
    },
    /** 查询DeptName参数列表 */
    getAllDeptNameDict() {
      getAllDeptNameDict().then((response) => {
        this.sysDeptNameOptions = response.data;
      });
    },
    /** 查询DeptName参数列表 */
    getAllCamNameDict() {
      getRelateCam(54).then((response) => {
        // console.info(response.data, '111111111111111')
        this.camNameOptions = response.data;
      });
    },
    initWebSocket() {
      // 初始化weosocket
      // console.log(this.$store.state.user.token)
      const wsuri =
        'ws://' +
        this.$store.state.system.info.sys_app_ip +
        ':8880/ws/' +
        this.id +
        '/' +
        this.group +
        '?token=' +
        this.$store.state.user.token
      this.websock = new WebSocket(wsuri)
      this.websock.onmessage = this.websocketonmessage
      this.websock.onopen = this.websocketonopen
      this.websock.onerror = this.websocketonerror
      this.websock.onclose = this.websocketclose
    },
    websocketonopen() {
      // 连接建立之后执行send方法发送数据
      console.log("attendanceWebsocket连接打开");
      //   const actions = { 'test': '12345' }
      //   this.websocketsend(JSON.stringify(actions))
    },
    websocketonerror() {
      // 连接建立失败重连
      this.initWebSocket();
    },
    // 数据接收
    websocketonmessage(e) {
      // console.log(e.data)
      // const jsonData = JSON.parse(e.data)
      // console.log(jsonData)
      // if (jsonData.code === 200) {
      //   console.log(jsonData.data)
      // this.getList()
      // }
      const jsonData = JSON.parse(e.data);
      // console.log(jsonData)
      for (let i = 0; i < this.sysAttendanceList.length; i++) {
        if (this.sysAttendanceList[i].groupId === jsonData.groupId) {
          // console.log(this.sysLedList[i])
          if ("amount" in jsonData) {
            this.sysAttendanceList[i].amount = jsonData.amount;
          }
          this.$set(this.sysAttendanceList, i, this.sysAttendanceList[i]);
          break;
        }
      }
    },
    websocketsend(Data) {
      // 数据发送
      //   this.websock.send(Data)
    },
    websocketclose(e) {
      // 关闭
      unWsLogout(this.id, this.group).then((response) => {
        console.log(response.data);
      });
      console.log("ledWebsocket断开连接", e);
    },
    guid() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function(c) {
          var r = (Math.random() * 16) | 0;
          var v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    },
    // 修改当前人数
    updateAmount(row) {
      const inputValidator = (v) => {
        if (parseInt(v) > -1 && parseInt(v) < 1000) {
          return true;
        }
        return "请输入0-999";
      };
      this.$prompt(`组名称:${row.groupName}`, "请设置当前人数", {
        inputType: "number",
        inputValue: row.amount,
        inputValidator: inputValidator
      }).then(({ value }) => {
        attendancesetAmount({ amount: value }, { groupId: row.groupId }).then(
          (res) => {
            row.amount = value;
            this.$message.success("设置成功");
          }
        );
        // doing....
      });
    }
  }
};
</script>
<style lang="scss">
//input 样式更改
.el-input-number.is-controls-right .el-input-number__decrease {
  display: none;
}

.el-input-number.is-controls-right .el-input-number__increase {
  display: none;
}

.P-counting {
  display: flex;
  justify-content: space-between;

  .LEDseek {
    // position: absolute;
    // top: 4px;
    // left: 300px;
    vertical-align: middle;
    display: inline-block;
    cursor: pointer;
    margin-left: 20px;

    span {
      vertical-align: 4px;
      margin-left: 10px;
    }

    width: 85px;
    height: 35px;
    line-height: 35px;
    background: linear-gradient(to bottom, #a388ff, #654ef4);
    text-align: center;
    vertical-align: middle;
    color: #fff;
    font-size: 14px;
    border-radius: 4px;
  }
}

.reset {
  .el-button {
    margin-left: 20px;
    border-radius: 4px;
    vertical-align: middle;
    width: 80px;
    height: 32px;
    font-size: 14px;
  }
}

.LEDcontent {
  display: flex;
  justify-content: space-between;
}

.LEDseek {
  // position: absolute;
  // top: 63px;
  // left: 410px;
  vertical-align: middle;
  display: inline-block;
  cursor: pointer;
  margin-left: 20px;

  span {
    vertical-align: 4px;
    margin-left: 10px;
  }

  width: 85px;
  height: 30px;
  line-height: 30px;
  background: linear-gradient(to bottom, #a388ff, #654ef4);
  text-align: center;
  vertical-align: middle;
  color: #fff;
  font-size: 14px;
  border-radius: 4px;
}

.reset {
  .el-button {
    margin-left: 20px;
    border-radius: 4px;
    vertical-align: middle;
    width: 80px;
    height: 32px;
    color: #c3c1c7;
    font-size: 14px;
  }
}

//人员组弹窗
.personnel-group {
  .el-dialog {
    padding: 40px;
    border-radius: 8px;

    .el-dialog__header {
      border-bottom: 1px solid #ededed;
      text-align: center;
    }

    .el-dialog__title {
      color: #7558f4;
      font-size: 24px;
      font-weight: 700;
      line-height: 24px;
    }
  }

  .addGroup {
    text-align: center;

    .el-button--default {
      padding: 10px 30px;
      margin: 0 20px;
      color: #c3c1c7;
    }

    .el-button--primary {
      padding: 10px 30px;
    }
  }
}

//解散组样式
.el-message-box {
  .el-message-box__title {
    line-height: 50px;
    text-align: center;
    color: #7558f4;
    font-size: 24px;
    font-weight: 700;
  }

  .el-message-box__btns {
    .el-button--default {
      color: #c3c1c7;
      border: 1px solid #c3c1c7;
      padding: 10px 30px;
      margin: 0 20px;
      border-radius: 4px;
    }

    .el-button--primary {
      border: 1px solid #7558f4;
      color: #fff;
      padding: 10px 30px;
      border-radius: 4px;
    }
  }
}
</style>
