<template>
  <BasicLayout>
    <template #wrapper>
      <div class="main-box">
        <el-card class="box-card">
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button
                v-if="showCol"
                v-permisaction="['admin:sysboxnpu:add']"
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="handleAdd"
              >新增
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                v-if="showCol"
                v-permisaction="['admin:sysboxnpu:remove']"
                type="danger"
                icon="el-icon-delete"
                size="mini"
                :disabled="multiple"
                @click="handleDelete"
              >删除
              </el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :span="1.5"
            ><span> 算力使用：{{ boxWeight }}</span>
            </el-col>
          </el-row>
          <el-table
            v-loading="loading"
            :data="sysboxnpuList"
            style="margin: 10px 0 0 0"
            @selection-change="handleSelectionChange"
            @sort-change="handleSortChang"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column
              label="编号"
              align="center"
              prop="npuId"
              sortable="custom"
              width="100px"
            />
            <el-table-column
              label="集合包名称"
              align="center"
              prop="npuId"
              sortable="custom"
              width="100px"
            />
            <el-table-column
              label="排序"
              align="center"
              prop="npuSort"
              sortable="custom"
            />
            <el-table-column
              label="权重"
              align="center"
              prop="npuWeight"
              sortable="custom"
              width="100px"
            />
            <el-table-column label="算法" prop="a">
              <template slot-scope="scope">
                <!-- <p v-html="getNPUInfo(scope.row, scope.row.box.sysAis)" /> -->
                <div v-for="(uCAI, iCAI) in scope.row.npuCamAis" :key="iCAI">
                  <span
                    :style="{
                      color: uCAI.boxNpu.npuStatus === '0' ? 'red' : 'green'
                    }"
                  >
                    ●{{ uCAI.ai.aiName }}
                  </span>
                  <el-button
                    type="text"
                    icon="el-icon-edit"
                    size="mini"
                    @click="handleDraw1(scope.row.npuId, uCAI.aId, uCAI.cId)"
                  >屏蔽区绘制</el-button>
                  <el-button
                    v-if="uCAI.aId === 5"
                    type="text"
                    icon="el-icon-edit"
                    size="mini"
                    @click="handleDraw2(scope.row.npuId, uCAI.aId, uCAI.cId)"
                  >围界绘制</el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="在线状态"
              align="center"
              sortable="custom"
              width="100px"
            >
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.npuStatus === '0' ? 'danger' : 'success'"
                  disable-transitions
                >{{ npuStatusFormat(scope.row) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="创建时间"
              align="center"
              prop="createdAt"
              sortable="custom"
              width="200px"
            >
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.createdAt) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              class-name="small-padding fixed-width"
              width="200px"
            >
              <template slot-scope="scope">
                <el-button
                  v-permisaction="['admin:sysboxnpu:edit']"
                  type="text"
                  icon="el-icon-edit"
                  size="mini"
                  @click="handleSet(scope.row)"
                >配置
                </el-button>
                <el-button
                  v-if="showCol"
                  v-permisaction="['admin:sysboxnpu:remove']"
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                >删除
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
          <edit-dialog
            :show="editDialog.show"
            :b-id="editDialog.boxId"
            :npu-id="editDialog.npuId"
            :box-weight="boxWeight"
            :prod-id="editDialog.prodId"
            @showChange="editDialogToggle"
            @ok="getList"
          />
          <draw-config
            :show="createDialog.show"
            :npu-id="createDialog.npuId"
            :config-data="createDialog.configData"
            @showChange="createDialogToggle"
            @ok="getList"
          />
          <drawborder-config
            :show="createBorderDialog.show"
            :npu-id="createBorderDialog.npuId"
            :config-data="createBorderDialog.configData"
            @showChange="createBorderDialogToggle"
            @ok="getList"
          />
        </el-card>
      </div>
    </template>
  </BasicLayout>
</template>

<script>
import {
  addSysBoxNpu,
  delSysBoxNpu,
  getSysBoxNpu,
  listSysBoxNpu,
  updateSysBoxNpu
} from "@/api/box/sys-box-npu";
import editDialog from "./editDialog";
import drawConfig from "./components/drawConfig";
import drawborderConfig from "./components/drawBorderConfig";
import { getNpuConfig } from "@/api/box/sys-box-npu";
import { unWsLogout } from "@/api/ws";
export default {
  name: "SysBoxNpu",
  components: {
    editDialog,
    drawConfig,
    drawborderConfig
  },
  data() {
    return {
      // 用户权限控制列显示
      showCol: true,

      boxWeight: 0,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 类型数据字典
      sysboxnpuList: [],
      npuStatusOptions: [],
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        // boxId: undefined,
        bId: this.$route.query.boxId,
        npuStatus: undefined
      },
      editDialog: {
        show: false,
        boxId: undefined,
        npuId: undefined
      },
      createDialog: {
        show: false,
        upuId: 0,
        configData: undefined
      },
      createBorderDialog: {
        show: false,
        upuId: 0,
        configData: undefined
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_box_status").then((response) => {
      this.npuStatusOptions = response.data;
    });
    // 权限控制
    // console.info("user", this.$store.state.user);
    const roles = this.$store.state.user.roles;
    if (roles.indexOf("normal") !== -1) {
      // 修改对应角色名，控制权限
      this.showCol = false;
    }
    this.id = this.guid();
    this.group = "boxNpu";
    this.initWebSocket();
  },
  destroyed() {
    console.log("断开boxWebsocket连接");
    // 离开路由之后断开websocket连接
    this.websock.close();
    unWsLogout(this.id, this.group).then((response) => {
      console.log(response.data);
    });
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true;
      listSysBoxNpu(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.sysboxnpuList = response.data.list;
          this.total = response.data.count;
          this.loading = false;
          this.boxWeight = 0;
          this.sysboxnpuList.forEach((item, index) => {
            this.boxWeight += item.npuWeight;
          });
        }
      );
    },

    npuStatusFormat(row) {
      return this.selectDictLabel(this.npuStatusOptions, row.npuStatus);
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.npuId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const npuId = row.npuId || this.ids;
      getSysBoxNpu(npuId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改盒子NPU配置表";
        this.isEdit = true;
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.npuId !== undefined) {
            updateSysBoxNpu(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess(response.msg);
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addSysBoxNpu(this.form).then((response) => {
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
      var Ids = (row.npuId && [row.npuId]) || this.ids;

      this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(function() {
          return delSysBoxNpu({ ids: Ids });
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
    /** 排序回调函数 */
    handleSortChang(column, prop, order) {
      prop = column.prop;
      order = column.order;
      if (this.order !== "" && this.order !== prop + "Order") {
        this.queryParams[this.order] = undefined;
      }
      if (order === "descending") {
        this.queryParams[prop + "Order"] = "desc";
        this.order = prop + "Order";
      } else if (order === "ascending") {
        this.queryParams[prop + "Order"] = "asc";
        this.order = prop + "Order";
      } else {
        this.queryParams[prop + "Order"] = undefined;
      }
      this.getList();
    },
    handleSet(row) {
      this.editDialog.boxId = row.bId;
      this.editDialog.npuId = row.npuId;
      this.editDialog.show = true;
    },
    editDialogToggle(value) {
      this.editDialog.show = value;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.editDialog.boxId = Number(this.$route.query.boxId);
      // console.log("``````````" + this.editDialog.boxId)

      this.editDialog.show = true;
      this.editDialog.npuId = undefined;
    },
    handleDraw1(npuId, aId, cId) {
      this.createDialog.npuId = npuId;
      getNpuConfig(npuId).then((response) => {
        // console.info(response)
        this.createDialog.configData =
          response.data.npuConfig.filter((x) => x.aiId === aId).length > 0
            ? response.data.npuConfig.filter((x) => x.aiId === aId)[0].aiConfig
            : {};
        this.createDialog.show = true;
      });
    },
    handleDraw2(npuId, aId, cId) {
      this.createBorderDialog.npuId = npuId;
      getNpuConfig(npuId).then((response) => {
        // console.info(response)
        this.createBorderDialog.configData =
          response.data.npuConfig.filter((x) => x.aiId === aId).length > 0
            ? response.data.npuConfig.filter((x) => x.aiId === aId)[0].aiConfig
            : {};
        this.createBorderDialog.show = true;
      });
    },
    createDialogToggle(value) {
      this.createDialog.show = value;
    },
    createBorderDialogToggle(value) {
      this.createBorderDialog.show = value;
    },
    initWebSocket() {
      // 初始化weosocket
      // console.log(this.$store.state.user.token)
      const wsuri =
        "ws://" +
        this.$store.state.system.info.sys_app_ip +
        ":8880/ws/" +
        this.id +
        "/" +
        this.group +
        "?token=" +
        this.$store.state.user.token;
      this.websock = new WebSocket(wsuri);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    websocketonopen() {
      // 连接建立之后执行send方法发送数据
      console.log("boxNPUWebsocket连接打开");
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
      // console.log(jsonData.data)
      this.getList();
      // }
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
      console.log("boxNPUWebsocket断开连接", e);
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
    }
  }
};
</script>
<style lang="scss"></style>
