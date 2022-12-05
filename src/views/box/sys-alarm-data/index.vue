<template>
  <BasicLayout>
    <template #wrapper>
      <div class="main-box">
        <el-card class="box-card">
          <el-form
            ref="queryForm"
            :model="queryParams"
            :inline="true"
            label-width="100px"
            :rules="rules"
          >
            <el-form-item v-if="showCol" label="所属产品" prop="prodId">
              <el-select
                v-model="queryParams.prodId"
                placeholder="请选择所属产品"
                clearable
              >
                <el-option
                  v-for="dict in sysProductNameList"
                  :key="dict.prodId"
                  :label="dict.prodName"
                  :value="dict.prodId"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-if="showCol" label="所属盒子" prop="boxId">
              <el-select
                v-model="queryParams.boxId"
                placeholder="请选择告警所属盒子"
                clearable
              >
                <el-option
                  v-for="dict in sysBoxNameList"
                  :key="dict.boxId"
                  :label="dict.boxName"
                  :value="dict.boxId"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-if="showCol" label="所属摄像头" prop="camId">
              <el-select
                v-model="queryParams.camId"
                placeholder="请选择告警所属摄像头"
                clearable
              >
                <el-option
                  v-for="dict in sysCameraNameList"
                  :key="dict.camId"
                  :label="dict.camName"
                  :value="dict.camId"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-if="showCol" label="所属算法" prop="aiId">
              <el-select
                v-model="queryParams.aiId"
                placeholder="请选择所属算法"
                clearable
              >
                <el-option
                  v-for="dict in sysAiNameList"
                  :key="dict.aiId"
                  :label="dict.aiName"
                  :value="dict.aiId"
                />
              </el-select>
            </el-form-item>

            <el-form-item
              v-if="showCol"
              label="处理状态"
              prop="isConfirm"
            ><el-select
              v-model="queryParams.isConfirm"
              placeholder="告警消息记录表处理"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in isConfirmOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
            </el-form-item>
            <el-form-item
              v-if="showCol"
              label="推送云"
              prop="isPush"
            ><el-select
              v-model="queryParams.isPush"
              placeholder="告警消息记录表推送云"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in isPushOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
            </el-form-item>
            <el-form-item
              label="摄像头名称"
              prop="camName"
            ><el-input
              v-model="queryParams.camName"
              placeholder="请输入设备名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
            </el-form-item>
            <el-form-item
              label="盒子名称"
              prop="boxName"
            ><el-input
              v-model="queryParams.boxName"
              placeholder="请输入盒子名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
            </el-form-item>
            <el-form-item
              label="告警类型"
              prop="alarmName"
            ><el-input
              v-model="queryParams.alarmName"
              placeholder="请输入告警类型"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
            </el-form-item>
            <el-form-item label="告警日期">
              <el-date-picker
                v-model="dateRange"
                size="small"
                type="daterange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
              />
            </el-form-item>
            <div>
              <el-button
                type="primary"
                size="small"
                style="background: linear-gradient(to bottom, #a388ff, #654ef4)"
                @click="handleQuery"
              >
                <svg-icon
                  icon-class="newSearch"
                  style="vertical-align: -2px; margin-right: 2px"
                />
                查询</el-button>
              <el-button
                icon="el-icon-refresh"
                size="small"
                style="padding: 11px 30px"
                @click="resetQuery"
              >重置</el-button>
            </div>
            <el-form-item />
          </el-form>

          <!-- 报警详情弹窗 -->
          <el-dialog
            class="alarmDetails"
            :title="title"
            :close-on-click-modal="false"
            :visible.sync="open"
            width="70%"
            append-to-body
            :before-close="cancel"
          >
            <el-row :gutter="24">
              <el-col :span="18">
                <div v-if="form.videoFilePath">
                  <el-divider content-position="left">告警视频</el-divider>
                  <video width="100%" height="100%" :src="form.videoFilePath" controls loop autoplay />
                  <!-- <vue-core-video-player
                    :src="form.videoFilePath"
                    :muted="true"
                    :autoplay="false"
                    :title="form.alarmName"
                    :loop="true"
                    controls="auto"
                  /> -->
                </div>
                <div v-else>
                  <div v-if="form.imgFilePath">
                    <el-divider content-position="left">抓拍图片</el-divider>
                    <my-image
                      :src="form.imgFilePath"
                      :preview-list="form.imgFilePathList"
                      height="530px"
                    />
                  </div>
                </div>
              </el-col>
              <el-col :span="6">
                <el-form
                  ref="form"
                  :model="form"
                  label-width="120px"
                  label-position="right"
                >
                  <el-divider content-position="left">抓拍图片</el-divider>
                  <my-image
                    height="170px"
                    :src="form.imgFilePath"
                    :preview-list="showCol ? form.imgFilePathList : []"
                  />
                  <el-divider content-position="left">告警详情</el-divider>
                  <el-form-item>
                    <span
                      slot="label"
                      class="formLabel"
                    ><span style="color: #f56c6c; font-size: 14px"> * </span>告警日期：</span>
                    <span>{{ parseTime(form.createdAt, "{y}-{m}-{d}") }}</span>
                  </el-form-item>
                  <el-form-item>
                    <span
                      slot="label"
                      class="formLabel"
                    ><span style="color: #f56c6c; font-size: 14px"> * </span>告警时间：</span>
                    <span>{{ parseTime(form.createdAt, "{h}:{i}:{s}") }}</span>
                  </el-form-item>
                  <el-form-item>
                    <span
                      slot="label"
                      class="formLabel"
                    ><span style="color: #f56c6c; font-size: 14px"> * </span>告警摄像头：</span>
                    <span>{{ form.camName }}</span>
                  </el-form-item>
                  <el-form-item>
                    <span
                      slot="label"
                      class="formLabel"
                    ><span style="color: #f56c6c; font-size: 14px"> * </span>告警盒子：</span>
                    <span>{{ form.boxName }}</span>
                  </el-form-item>
                  <el-form-item>
                    <span
                      slot="label"
                      class="formLabel"
                    ><span style="color: #f56c6c; font-size: 14px"> * </span>告警类型：</span>
                    <span>{{ form.alarmName }}</span>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <!-- 报警处理弹窗 -->
            <el-dialog
              width="30%"
              title="告警处理"
              :visible.sync="innerVisible"
              append-to-body
            >
              <el-form
                ref="isConfirmForm"
                :model="isConfirmForm"
                :rules="isConfirmRules"
                label-width="100px"
              >
                <el-form-item
                  label="处理状态"
                  prop="isConfirm"
                ><el-select
                  v-model="isConfirmForm.isConfirm"
                  clearable
                  size="small"
                >
                  <el-option
                    v-for="dict in isConfirmOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button
                  type="primary"
                  @click="isConfirmSubmitForm"
                >确 定</el-button>
                <el-button @click="isConfirmCancel">取 消</el-button>
              </div>
            </el-dialog>
            <div slot="footer" class="dialog-footer">
              <el-button
                v-if="showCol"
                type="primary"
                @click="confirm"
              >处 理</el-button>
              <el-button type="danger" plain @click="cancel">关 闭</el-button>
            </div>
          </el-dialog>
        </el-card>
        <el-card>
          <el-table
            v-loading="loading"
            :data="sysAlarmDataList"
            @selection-change="handleSelectionChange"
            @sort-change="handleSortChang"
          >
            <el-table-column
              v-if="showCol"
              width="100"
              label="编号"
              align="center"
              prop="alarmId"
              sortable="custom"
            />
            <el-table-column
              v-if="showCol"
              width="100"
              label="事件ID"
              align="center"
              prop="eventId"
              sortable="custom"
            />
            <el-table-column
              label="日期"
              align="center"
              prop="createdAt"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.createdAt, "{y}-{m}-{d}") }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="时间"
              align="center"
              prop="createdAt"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.createdAt, "{h}:{i}:{s}") }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="摄像头"
              align="center"
              prop="camName"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="盒子"
              align="center"
              prop="boxName"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="告警类型"
              align="center"
              prop="alarmName"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              v-if="showCol"
              label="所属产品"
              align="center"
              prop="prodName"
              :formatter="productNameFormat"
              sortable="custom"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{ productNameFormat(scope.row) }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="showCol"
              label="所属摄像头"
              align="center"
              prop="camName"
              :formatter="cameraNameFormat"
              sortable="custom"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{ cameraNameFormat(scope.row) }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="showCol"
              label="所属盒子"
              align="center"
              prop="boxName"
              :formatter="boxNameFormat"
              sortable="custom"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{ boxNameFormat(scope.row) }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="showCol"
              label="所属算法"
              align="center"
              prop="aiName"
              :formatter="aiNameFormat"
              sortable="custom"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{ aiNameFormat(scope.row) }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="showCol"
              label="处理状态"
              align="center"
              prop="isConfirm"
              :formatter="isConfirmFormat"
              width="100"
              sortable="custom"
            >
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.isConfirm === '1' ? 'success' : 'danger'"
                  disable-transitions
                >{{ isConfirmFormat(scope.row) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              v-if="showCol"
              label="推送状态"
              align="center"
              prop="isPush"
              :formatter="isPushFormat"
              width="100"
              sortable="custom"
            >
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.isPush === '1' ? 'success' : 'danger'"
                  disable-transitions
                >{{ isPushFormat(scope.row) }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column
              width="100"
              label="操作"
              align="center"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="lookDetail(scope.row)"
                ><svg-icon icon-class="View" style="vertical-align: -2px" />
                  查看详情</el-button>
                <el-button
                  v-if="showCol"
                  size="mini"
                  type="text"
                  icon="el-icon-upload"
                  @click="handlePush(scope.row)"
                >推送
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
        </el-card>
      </div>
    </template>
  </BasicLayout>
</template>

<script>
import {
  addSysAlarmData,
  delSysAlarmData,
  getSysAlarmData,
  listSysAlarmData,
  pushSysAlarmData,
  UpdateAlarmDataConfirm,
  updateSysAlarmData
} from "@/api/box/sys-alarm-data";
import {
  getAllProductName,
  getAllProductNameDict
} from "@/api/box/sys-product";
import { getAllBoxName, getAllBoxNameDict } from "@/api/box/sys-box";
import { getAllCameraName, getAllCameraNameDict } from "@/api/box/sys-camera";
import { getAllAiName, getAllAiNameDict } from "@/api/box/sys-ai";
import { unWsLogout } from "@/api/ws";
import { strObject } from "@/utils";
export default {
  name: "SysAlarmData",
  components: {},
  data() {
    return {
      imgPreviewSrcList: [],
      id: undefined,
      group: undefined,
      // 用户权限控制列显示
      showCol: true,
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
      // 排序字段
      order: "createdAtOrder",
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      innerVisible: false,
      isEdit: false,

      allAlarmFormDialog: false,
      // 类型数据字典
      typeOptions: [],
      sysAlarmDataList: [],
      isConfirmOptions: [],
      isPushOptions: [],
      sysBoxNameOptions: [],
      sysCameraNameOptions: [],
      sysAiNameOptions: [],
      sysProductNameOptions: [],
      // 关系表类型

      // 名称字典
      sysProductNameList: [],
      sysBoxNameList: [],
      sysCameraNameList: [],
      sysAiNameList: [],
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        alarmId: undefined,
        prodId: undefined,
        boxId: undefined,
        camId: undefined,
        aiId: undefined,
        isConfirm: undefined,
        isPush: undefined,
        boxName: undefined,
        camName: undefined,
        alarmName: undefined,
        createdAtOrder: "desc"
      },
      // 日期范围
      dateRange: [],
      // timeDefaultShow: '',
      // 表单参数
      form: {},
      isConfirmForm: {},
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              const end = new Date();
              end.setHours(23, 59, 59);
              const start = new Date(end);
              start.setHours(0, 0, 0);
              start.setTime(end.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              end.setHours(23, 59, 59);
              const start = new Date();
              start.setHours(0, 0, 0);
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              end.setHours(23, 59, 59);
              const start = new Date();
              start.setHours(0, 0, 0);
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              end.setHours(23, 59, 59);
              const start = new Date();
              start.setHours(0, 0, 0);
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      // 表单校验
      rules: {
        boxName: [
          {
            min: 0,
            max: 40,
            message: "长度在 0 到 40 个字符",
            trigger: "blur"
          }
        ],
        camName: [
          {
            min: 0,
            max: 40,
            message: "长度在 0 到 40 个字符",
            trigger: "blur"
          }
        ],
        alarmName: [
          {
            min: 0,
            max: 40,
            message: "长度在 0 到 40 个字符",
            trigger: "blur"
          }
        ]
      },
      isConfirmRules: {
        isConfirm: [
          { required: true, message: "处理状态不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.Date();
    this.getList();
    this.getDicts("sys_alarm_confirm").then((response) => {
      this.isConfirmOptions = response.data;
    });
    this.getDicts("sys_alarm_push").then((response) => {
      this.isPushOptions = response.data;
      // console.info('isPushOptions' + JSON.stringify(this.isPushOptions))
    });
    this.getAllProductNameDict();
    this.getAllBoxNameDict();
    this.getAllCameraNameDict();
    this.getAllAiNameDict();
    this.getAllProductName();
    this.getAllBoxName();
    this.getAllCameraName();
    this.getAllAiName();
    // 权限控制
    // console.info("user", this.$store.state.user);
    const roles = this.$store.state.user.roles;
    if (roles.indexOf("normal") !== -1) {
      // 修改对应角色名，控制权限
      this.showCol = false;
    }
    this.id = this.guid();
    this.group = "alarmList";
    this.initWebSocket();
  },
  destroyed() {
    // console.log('断开webImgWebsocket连接')
    // 离开路由之后断开websocket连接
    this.websock.close();
    unWsLogout(this.id, this.group).then((response) => {
      // console.log(response.data)
    });
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true;
      listSysAlarmData(
        this.addDateRange(this.queryParams, this.dateRange)
      ).then((response) => {
        this.sysAlarmDataList = response.data.list;
        this.total = response.data.count;
        this.loading = false;
        // console.info(this.sysAlarmDataList)
      });
    },
    // 告警详情取消按钮
    cancel() {
      this.open = false;
      this.innerVisible = false;
      setTimeout(() => {
        this.reset();
      }, 500);
    },
    // 处理窗口取消按钮
    isConfirmCancel() {
      this.innerVisible = false;
      this.isConfirmReset();
    },
    // 告警详情处理按钮
    confirm() {
      this.innerVisible = true;
      this.isConfirmForm.alarmId = this.form.alarmId;
      // this.isConfirmForm.isConfirm = this.form.isConfirm
    },
    // 表单重置
    reset() {
      this.form = {
        alarmId: undefined,
        prodId: undefined,
        boxId: undefined,
        camId: undefined,
        aiId: undefined,
        boxName: undefined,
        camBox: undefined,
        alarmName: undefined,
        videoFilePath: undefined,
        imgFilePath: undefined,
        imgFilePathList: undefined,
        isConfirm: undefined,
        isPush: undefined,
        alarmDescribe: undefined,
        alarmData: undefined
      };
      this.imgPreviewSrcList = [];
      this.resetForm("form");
    },
    isConfirmReset() {
      this.isConfirmForm = {
        alarmId: undefined,
        isConfirm: undefined
      };
      this.resetForm("isConfirmForm");
    },
    isConfirmFormat(row) {
      return this.selectDictLabel(this.isConfirmOptions, row.isConfirm);
    },
    isPushFormat(row) {
      return this.selectDictLabel(this.isPushOptions, row.isPush);
    },
    productNameFormat(row) {
      return this.selectDictLabel(
        this.sysProductNameOptions,
        row.prodId.toString()
      );
    },
    boxNameFormat(row) {
      return this.selectDictLabel(this.sysBoxNameOptions, row.boxId.toString());
    },
    cameraNameFormat(row) {
      return this.selectDictLabel(
        this.sysCameraNameOptions,
        row.camId.toString()
      );
    },
    aiNameFormat(row) {
      return this.selectDictLabel(this.sysAiNameOptions, row.aiId.toString());
    },
    // 关系
    // 文件
    /** 搜索按钮操作 */
    // handleQuery() {
    //   this.queryParams.pageIndex = 1
    //   this.getList()
    // },
    handleQuery: function() {
      this.$refs["queryForm"].validate((valid) => {
        if (valid) {
          this.queryParams.pageIndex = 1;
          this.getList();
        }
      });
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.Date();
      this.resetForm("queryForm");
      this.queryParams["createdAtOrder"] = "desc";
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加告警消息记录表";
      this.isEdit = false;
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.alarmId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const alarmId = row.alarmId || this.ids;
      getSysAlarmData(alarmId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改告警消息记录表";
        this.isEdit = true;
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.alarmId !== undefined) {
            updateSysAlarmData(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess(response.msg);
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addSysAlarmData(this.form).then((response) => {
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
    /** 提交按钮 */
    isConfirmSubmitForm: function() {
      this.$refs["isConfirmForm"].validate((valid) => {
        if (valid) {
          if (this.isConfirmForm.alarmId !== undefined) {
            UpdateAlarmDataConfirm(this.isConfirmForm).then((response) => {
              if (response.code === 200) {
                this.msgSuccess(response.msg);
                this.innerVisible = false;
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
      var Ids = (row.alarmId && [row.alarmId]) || this.ids;

      this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(function() {
          return delSysAlarmData({ ids: Ids });
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
    /** 修改按钮操作 */
    handlePush(row) {
      pushSysAlarmData(row.alarmId).then((response) => {
        if (response.code === 200) {
          this.msgSuccess(response.msg)
        } else {
          this.msgError(response.msg)
        }
      })
    },
    /** 查询ProductName参数列表 */
    getAllProductName() {
      getAllProductName().then((response) => {
        this.sysProductNameList = response.data;
      });
    },
    /** 查询ProductName参数列表 */
    getAllProductNameDict() {
      getAllProductNameDict().then((response) => {
        this.sysProductNameOptions = response.data;
      });
    },
    /** 查询BoxName参数列表 */
    getAllBoxName() {
      getAllBoxName().then((response) => {
        this.sysBoxNameList = response.data;
        // console.log(this.sysBoxNameList)
      });
    },
    /** 查询BoxName参数列表 */
    getAllBoxNameDict() {
      getAllBoxNameDict().then((response) => {
        this.sysBoxNameOptions = response.data;
      });
    },
    /** 查询CameraName参数列表 */
    getAllCameraName() {
      getAllCameraName().then((response) => {
        this.sysCameraNameList = response.data;
      });
    },
    /** 查询CameraName参数列表 */
    getAllCameraNameDict() {
      getAllCameraNameDict().then((response) => {
        this.sysCameraNameOptions = response.data;
      });
    },
    /** 查询BoxAi参数列表 */
    getAllAiName() {
      getAllAiName().then((response) => {
        this.sysAiNameList = response.data;
      });
    },
    /** 查询BoxAi参数列表 */
    getAllAiNameDict() {
      getAllAiNameDict().then((response) => {
        this.sysAiNameOptions = response.data;
      });
    },
    // 初始化 form.imgFilePath字段  (2.4版本为 Array)
    initImgFilePath(imgFilePath) {
      var tempPath = imgFilePath;
      imgFilePath = strObject(imgFilePath);
      if (imgFilePath && Array.isArray(imgFilePath) && imgFilePath.length) {
        // eslint-disable-next-line no-unused-vars
        tempPath = imgFilePath[0].imgUrl;
      }
      return tempPath;
    },
    // 详情
    lookDetail(row) {
      this.reset();
      const alarmId = row.alarmId;
      getSysAlarmData(alarmId).then((response) => {
        this.form = response.data;
        this.form.imgFilePath = this.initImgFilePath(this.form.imgFilePath); //! syh 2022-11-30
        this.open = true;
        this.title = "告警详情";
        this.isEdit = false;
        // this.playerOptions['sources'][0]['src'] = this.form.videoFilePath
      });
      // console.log(this.form)
      // 自动开始播放
      // this.$nextTick(() => {
      //   const infoVide = document.getElementById('infoVideo')
      //   if (!infoVide) infoVide.play()
      // })
    },
    initWebSocket() {
      // 初始化weosocke
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
      console.log("alarmListWebsocket连接打开");
      //   const actions = { 'test': '12345' }
      //   this.websocketsend(JSON.stringify(actions))
    },
    websocketonerror() {
      // 连接建立失败重连
      this.initWebSocket();
    },
    // 数据接收
    websocketonmessage(e) {
      // console.log('数据接收',e.data)
      const jsonData = JSON.parse(e.data);
      // console.log(jsonData)
      // console.log(jsonData.data)
      if (this.queryParams.pageIndex === 1) {
        let _temp = [];
        if (jsonData) {
          _temp = [jsonData];
        }
        if (_temp.length) {
          let sysAlarmDataList = JSON.parse(
            JSON.stringify(this.sysAlarmDataList)
          );
          sysAlarmDataList = [..._temp, ...sysAlarmDataList];
          // console.log(sysAlarmDataList)
          if (sysAlarmDataList.length > 10) {
            // console.log(sysAlarmDataList)
            sysAlarmDataList = sysAlarmDataList.slice(0, 10);
          }
          this.sysAlarmDataList = sysAlarmDataList;
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
        // console.log(response.data)
      });
      console.log("alarmListWebsocket断开连接", e);
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
    // 获取当前年月日
    Date() {
      // this.timeDefaultShow = new Date()
      // this.timeDefaultShow.setMonth(new Date().getMonth() - 1)
      // const nowDate = new Date()
      // const date = {
      //   year: nowDate.getFullYear(),
      //   month: nowDate.getMonth(),
      //   date: nowDate.getDate()
      // }
      // const newmonth = date.month > 10 ? date.month : '0' + date.month
      // const newday = date.date > 10 ? date.date : '0' + date.date
      // // this.defaultDateValue = date.year + '-' + newmonth + '-' + newday
      // this.dateRange = [new Date(date.year, newmonth, newday, 0, 0, 0), new Date(date.year, newmonth, newday, 23, 59, 59)]
      // this.$set(this.queryParams, 'dateRange', [new Date(date.year, newmonth, newday, 0, 0, 0), new Date(date.year, newmonth, newday, 23, 59, 59)])
      // console.info('Date ' + this.dateRange)
      // 获取新的时间(2019.4.12）
      // const date = new Date()
      // // 获取当前时间的年份转为字符串
      // const year = date.getFullYear().toString() // '2019'
      // // 获取月份，由于月份从0开始，此处要加1，判断是否小于10，如果是在字符串前面拼接'0'
      // const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString() // '04'
      // // 获取天，判断是否小于10，如果是在字符串前面拼接'0'
      // const da = date.getDate() < 10 ? '0' + date.getDate().toString() : date.getDate().toString() // '12'
      //
      // const da2 = date.getDate() < 10 ? '0' + (date.getDate() + 1).toString() : (date.getDate() + 1).toString() // '12'
      // // 字符串拼接，开始时间，结束时间
      // const beg = year + '-' + month + '-' + da // 当月第一天'2019-04-01'
      // const end = year + '-' + month + '-' + da2 // 当天'2019-04-12'
      // const end = new Date()
      // end.setHours(23, 59, 59 + 3600 * 1000 * 8)
      // // end.setTime(end.getTime() + 3600 * 1000 * 8)
      // const start = new Date(end)
      // start.setHours(0, 0, 0)
      // start.setTime(end.getTime() - 3600 * 1000 * 24)
      // this.dateRange = [start, end] // 将值设置给插件绑定的数据
      // const end = new Date()
      // end.setHours(23, 59, 59 + 3600 * 1000 * 8)
      // // end.setTime(end.getTime() + 3600 * 1000 * 8)
      // const start = new Date(end)
      // start.setHours(0, 0, 0)
      // start.setTime(end.getTime() - 3600 * 1000 * 24)
      const end = new Date(Date.now());
      end.setHours(31, 59, 59);
      // const end = new Date(Date.now() + 3600 * 1000 * 8)
      const start = new Date(Date.now());
      start.setHours(8, 0, 0);
      // this.dateRange = [new Date(new Date(Date.now()).setHours(0,0,0,0)), new Date(Date.now())] // 将值设置给插件绑定的数据
      // this.dateRange = [new Date(new Date(Date.now()+ 3600 * 1000 * 8).setHours(0,0,0,0)), new Date(Date.now()+ 3600 * 1000 * 8)] // 将值设置给插件绑定的数据
      this.dateRange = [start, end]; // 将值设置给插件绑定的数据
    }
  }
};
</script>

<style lang="scss">
.formStar {
  font-family: "PingFangSC-Semibold", "PingFang SC Semibold", "PingFang SC",
    sans-serif;
  font-weight: 200;
  font-style: normal;
  font-size: 12px;
  color: #fb0404;
  padding: 5px;
}

.formLabel {
  font-size: 15px;
  color: #333333;
  font-family: "Microsoft YaHei", "微软雅黑 Light", "微软雅黑", sans-serif;
  font-weight: bold;
  line-height: 30px;
}
.alarmQuery {
  margin-left: 35px;
  .el-button--primary {
    background: linear-gradient(to bottom, #a388ff, #654ef4);
  }
}
.alarmDetails {
  .el-dialog {
    padding: 20px;
    border-radius: 8px;
  }
  .el-dialog__header {
    .el-dialog__title {
      font-size: 24px;
      color: #7558f4;
    }
  }
}
.bg-img img {
  height: 530px;
  width: 100%;
}
.img-sl img {
  height: 170px;
  width: 100%;
}
</style>
