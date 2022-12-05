<style scoped lang="scss">
.completeCount {
  margin-top: 20px;
  font-size: 30px;
}
.completebottom {
  float: right;
}
</style>
<template>
  <BasicLayout>
    <template #wrapper>
      <div class="main-box">
        <div v-if="showTag" ref="tableList">
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button
                v-permisaction="['admin:sysupgrade:add']"
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="handleAdd"
              >新增
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                v-permisaction="['admin:sysupgrade:remove']"
                type="danger"
                icon="el-icon-delete"
                size="mini"
                :disabled="multiple"
                @click="handleDelete"
              >删除
              </el-button>
            </el-col>
          </el-row>
          <el-table
            v-loading="loading"
            :data="sysupgradeList"
            @selection-change="handleSelectionChange"
            @sort-change="handleSortChang"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column
              label="编号"
              align="center"
              prop="upgradeId"
              sortable="custom"
            />
            <el-table-column
              label="固件"
              align="center"
              prop="firm.firmName"
              sortable="custom"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="升级任务名称"
              align="center"
              prop="upgradeName"
              sortable="custom"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="推送方式"
              align="center"
              prop="pushType"
              :formatter="pushTypeFormat"
              width="100"
            >
              <template slot-scope="scope">
                {{ pushTypeFormat(scope.row) }}
              </template>
            </el-table-column>
            <el-table-column
              label="创建时间"
              align="center"
              prop="createdAt"
              sortable="custom"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.createdAt) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-button
                  v-permisaction="['admin:sysupgrade:edit']"
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row)"
                >查看
                </el-button>
                <el-button
                  v-permisaction="['admin:sysupgrade:remove']"
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
        </div>
        <div v-else ref="taskForm">
          <el-steps :active="active" align-center finish-status="success">
            <el-step title="任务信息" />
            <el-step title="发布任务" />
            <el-step title="完成" />
          </el-steps>
          <div v-if="active == 1" style="width:50%;margin:25px 0 0 25%">
            <el-form
              ref="form1"
              :model="form"
              :rules="rules"
              label-width="80px"
            >
              <el-form-item label="任务名称" prop="upgradeName">
                <el-input
                  v-model="form.upgradeName"
                  placeholder="升级任务名称"
                />
              </el-form-item>
              <el-form-item label="超时时间" prop="timeout">
                <el-input-number
                  v-model="form.timeout"
                  :min="1"
                  :max="65535"
                  label="超时时间"
                />
              </el-form-item>
              <el-form-item label="推送方式" prop="pushType">
                <el-select v-model="form.pushType" placeholder="请选择">
                  <el-option
                    v-for="dict in pushTypeOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="升级说明" prop="upgradeDescribe">
                <el-input
                  v-model="form.upgradeDescribe"
                  placeholder="升级说明使用场景等"
                />
              </el-form-item>
              <el-form-item label="升级备注" prop="upgradeNote">
                <el-input v-model="form.upgradeNote" placeholder="升级备注" />
              </el-form-item>
            </el-form>
          </div>
          <div v-if="active == 2" style="margin:25px 0 0 25px">
            <el-form ref="queryForm" :model="queryParams2" :inline="true">
              <el-form-item label="盒子名称" prop="boxName">
                <el-input
                  v-model="queryParams2.boxName"
                  placeholder="请输入盒子名称"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery2"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  size="mini"
                  @click="handleQuery2"
                >搜索</el-button>
              </el-form-item>
            </el-form>
            <el-table
              v-loading="loading2"
              :data="sysboxList"
              border
              @selection-change="handleSelectionChange2"
            >
              <el-table-column type="selection" width="55" align="center" />
              <el-table-column
                label="编号"
                align="center"
                width="75"
                prop="boxId"
                sortable="custom"
              />
              <el-table-column
                label="盒子名称"
                align="center"
                prop="boxName"
                sortable="custom"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                label="产品"
                align="center"
                prop="prod.prodName"
                sortable="custom"
              />
              <el-table-column
                label="机构"
                align="center"
                prop="dept.deptName"
                sortable="custom"
              />
              <el-table-column
                label="IP"
                align="center"
                prop="boxIp"
                sortable="custom"
              />
              <el-table-column label="型号" align="center" prop="boxModel" />
              <el-table-column
                label="算法"
                align="center"
                prop="boxType"
                width="100"
              >
                <template slot-scope="scope">
                  {{ boxTypeFormat(scope.row) }}
                </template>
              </el-table-column>
              <el-table-column label="状态" align="center" sortable="custom">
                <template slot-scope="scope">
                  <el-tag
                    :type="scope.row.boxStatus === '0' ? 'danger' : 'success'"
                    disable-transitions
                  >{{ boxStatusFormat(scope.row) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                label="激活时间"
                align="center"
                prop="registryAt"
                sortable="custom"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.registryAt) }}</span>
                </template>
              </el-table-column>
            </el-table>

            <pagination
              v-show="total2 > 0"
              :total="total2"
              :page.sync="queryParams2.pageIndex"
              :limit.sync="queryParams2.pageSize"
              @pagination="getList2"
            />
          </div>
          <div v-if="active == 3" style="margin:25px 25px 25px 25px">
            <el-row :gutter="5">
              <el-col :span="6">
                <el-card>
                  <div style="color:rgb(214, 178, 79)">
                    ● 等待升级
                  </div>
                  <div class="completeCount">
                    {{ upBoxStatusCount.wait }}
                  </div>
                  <div class="completebottom">
                    <!-- <el-button @click="pushUpdate" type="text"
                    >推送升级</el-button
                  > -->
                    <el-button type="text">查看</el-button>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="6">
                <el-card>
                  <div style="color:rgb(104, 200, 238)">
                    ● 升级中
                  </div>
                  <div class="completeCount">
                    {{ upBoxStatusCount.updating }}
                  </div>
                  <div class="completebottom">
                    <el-button type="text">查看</el-button>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="6">
                <el-card>
                  <div style="color:rgb(47, 190, 66)">
                    ● 升级完成
                  </div>
                  <div class="completeCount">
                    {{ upBoxStatusCount.complete }}
                  </div>
                  <div class="completebottom">
                    <el-button type="text">查看</el-button>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="6">
                <el-card>
                  <div style="color:red">
                    ● 升级失败
                  </div>
                  <div class="completeCount">
                    {{ upBoxStatusCount.failed }}
                  </div>
                  <div class="completebottom">
                    <el-button type="text">查看</el-button>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
          <div>
            <div v-if="!check" style="float:left">
              <el-button
                size="mini"
                style="margin-top: 12px;"
                @click="back"
              >返回</el-button>
              <el-button
                v-if="active != 3"
                size="mini"
                type="primary"
                style="margin-top: 12px;"
                @click="next"
              >下一步</el-button>
              <el-button
                v-if="active == 3"
                size="mini"
                type="primary"
                style="margin-top: 12px;"
                @click="complete"
              >推送升级</el-button>
            </div>
            <div style="float:left;margin:0 0 0 10px">
              <el-button
                size="mini"
                type="primary"
                style="margin-top: 12px;"
                @click="backToList"
              >返回任务列表</el-button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </BasicLayout>
</template>

<script>
import { delSysUpgrade, listSysUpgrade } from '@/api/box/sys-upgrade'
import { listSysBox } from '@/api/box/sys-box'
import { getAllFirmwareName } from '@/api/box/sys-firmware'
import { getBoxStatueCount, insertTask } from '@/api/box/sys-upgrade-history'
import { closeWebsocket, sendWebsocket } from '@/utils/websocket'
export default {
  name: 'SysUpgrade',
  components: {},
  props: {
    firmId: {
      type: String,
      default: '',
      required: true
    }
  },
  data() {
    return {
      active: 1,
      showTag: true,
      check: false,
      // 遮罩层
      loading: true,
      loading2: true,
      // 选中数组
      ids: [],
      ids2: [],
      // 非单个禁用
      single: true,
      single2: true,
      // 非多个禁用
      multiple: true,
      multiple2: true,
      // 总条数
      total: 0,
      total2: 0,
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      isEdit: false,
      // 类型数据字典
      typeOptions: [],
      sysupgradeList: [],
      pushTypeOptions: [],
      sysFirmwareNameList: [],
      sysboxList: [],
      networkWayOptions: [],
      boxStatusOptions: [],
      boxTypeOptions: [],
      // 关系表类型

      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        firmId: undefined,
        upgradeName: undefined,
        pushType: undefined
      },
      queryParams2: {
        pageIndex: 1,
        pageSize: 10,
        pId: undefined,
        deptId: undefined,
        parentId: undefined,
        boxName: undefined,
        boxStatus: undefined,
        text: undefined
        // queryType: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        firmId: [
          { required: true, message: '固件ID不能为空', trigger: 'blur' }
        ],
        upgradeName: [
          { required: true, message: '升级任务名称不能为空', trigger: 'blur' }
        ]
      },
      upBoxStatusCount: {
        wait: 0,
        updating: 0,
        complete: 0,
        failed: 0
      },
      upId: undefined
    }
  },
  watch: {
    firmId: {
      handler(newValue, oldValue) {
        this.queryParams.firmId = newValue
        if (newValue) this.form.fId = Number(newValue)
        if (this.queryParams.firmId) {
          this.getList()
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    // this.getList()
    this.getDicts('sys_upgrade_push').then(response => {
      this.pushTypeOptions = response.data
    })
    this.getDicts('sys_device_network').then(response => {
      this.networkWayOptions = response.data
    })

    this.getDicts('sys_box_status').then(response => {
      this.boxStatusOptions = response.data
    })
    this.getDicts('sys_prod_type').then(response => {
      this.boxTypeOptions = response.data
    })
    this.getAllFirmwareName()
  },
  beforeDestroy() {
    closeWebsocket()
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listSysUpgrade(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.sysupgradeList = response.data.list
          this.total = response.data.count
          this.loading = false
        }
      )
    },
    getList2() {
      this.loading2 = true
      listSysBox(this.addDateRange(this.queryParams2, this.dateRange)).then(
        response => {
          this.sysboxList = response.data.list
          this.total2 = response.data.count
          this.loading2 = false
        }
      )
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        upgradeId: undefined,
        fId: undefined,
        upgradeName: undefined,
        timeout: undefined,
        pushType: undefined,
        upgradeDescribe: undefined,
        upgradeNote: undefined
      }
      this.resetForm('form')
      this.ids2 = []
      this.check = false
      this.active = 1
    },
    pushTypeFormat(row) {
      return this.selectDictLabel(this.pushTypeOptions, row.pushType)
    },
    // 关系
    // 文件
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageIndex = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    handleQuery2() {
      this.queryParams2.pageIndex = 1
      this.getList2()
    },
    /** 新增按钮操作 */
    handleAdd() {
      // this.reset();
      this.showTag = false
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.upgradeId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    handleSelectionChange2(selection) {
      this.ids2 = selection.map(item => item.boxId)
      this.single2 = selection.length !== 1
      this.multiple2 = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const upgradeId = row.upgradeId || this.ids
      this.check = true
      this.ids2 = []
      this.showTag = false
      this.active = 3
      this.upId = upgradeId
      // websocket
      this.sendWss()
      this.setBoxStatusCount(upgradeId)
      // getSysUpgrade(upgradeId).then(response => {
      //   this.form = response.data;
      //   this.check = true;
      //   this.ids2 = [];
      //   this.active = 3;
      //   this.showTag = false;
      // });
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      var Ids = (row.upgradeId && [row.upgradeId]) || this.ids

      this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(function() {
          return delSysUpgrade({ ids: Ids })
        })
        .then(response => {
          if (response.code === 200) {
            this.msgSuccess(response.msg)
            this.open = false
            this.getList()
          } else {
            this.msgError(response.msg)
          }
        })
        .catch(function() {})
    },
    /** 排序回调函数 */
    handleSortChang(column, prop, order) {
      prop = column.prop
      order = column.order
      if (this.order !== '' && this.order !== prop + 'Order') {
        this.queryParams[this.order] = undefined
      }
      if (order === 'descending') {
        this.queryParams[prop + 'Order'] = 'desc'
        this.order = prop + 'Order'
      } else if (order === 'ascending') {
        this.queryParams[prop + 'Order'] = 'asc'
        this.order = prop + 'Order'
      } else {
        this.queryParams[prop + 'Order'] = undefined
      }
      this.getList()
    },
    /** 查询FirmwareName参数列表 */
    getAllFirmwareName() {
      getAllFirmwareName().then(response => {
        this.sysFirmwareNameList = response.data
        // console.log(this.sysBoxNameList)
      })
    },
    networkWayFormat(row) {
      return this.selectDictLabel(this.networkWayOptions, row.networkWay)
    },
    boxStatusFormat(row) {
      return this.selectDictLabel(this.boxStatusOptions, row.boxStatus)
    },
    boxTypeFormat(row) {
      return this.selectDictLabel(this.boxTypeOptions, row.boxType)
    },
    next() {
      if (this.active++ > 2) this.active = 0
      if (this.active === 2) {
        this.getList2()
      }
    },
    back() {
      if (this.active > 1) this.active--
      this.ids2 = []
    },
    complete() {
      const submitData = {
        formData: this.form,
        boxIds: this.ids2
      }
      submitData.formData.timeout = Number(this.form.timeout)
      insertTask(submitData).then(response => {
        this.msgSuccess(response.msg)
        this.check = true
        this.upId = response.data
        // websocket
        this.sendWss()
        this.setBoxStatusCount(response.data)
      })
    },
    setBoxStatusCount(upId) {
      getBoxStatueCount({ upId: upId }).then(response => {
        if (response.code === 200) {
          this.upBoxStatusCount.wait = response.data.upgradeState0
          this.upBoxStatusCount.updating = response.data.upgradeState1
          this.upBoxStatusCount.complete = response.data.upgradeState2
          this.upBoxStatusCount.failed = response.data.upgradeState3
        }
      })
    },
    pushUpdate() {
      this.msgSuccess('已推送升级！')
      this.check = true
    },
    backToList() {
      this.reset()
      this.showTag = true
      this.getList()
    },
    // 发起 websocker  请求数据
    sendWss() {
      // 防止用户多次连续点击发起请求，所以要先关闭上次的ws请求。

      closeWebsocket()
      const param = {}
      const wsUrl = 'ws://' + this.$store.state.system.info.sys_app_ip + +':8880/ws/upgrade'
      // 发起ws请求
      sendWebsocket(wsUrl, param, this.wsMessage, this.wsError)
    },
    // ws连接失败，组件要执行的代码
    wsError() {
      // ws 连接失败的操作
      console.log('error!,ws 连接失败')
    },
    // ws连接成功，后台返回的ws数据，组件要拿数据渲染页面等操作
    wsMessage(data) {
      console.log('---------------Socket固件升级状态变更通知---------------')
      // console.log(data)
      const dataJson = JSON.parse(data)
      if (dataJson) {
        this.setBoxStatusCount(this.upId)
      }
    }
  }
}
</script>
