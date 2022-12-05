<template>
  <BasicLayout>
    <template #wrapper>
      <div class="main-box">
        <!-- 设备状态栏 -->
        <deviceStatus />
        <br>
        <el-card class="box-management">
          <div class="query">
            <el-form
              ref="queryForm"
              :model="queryParams"
              :inline="true"
              label-width="90px"
            >
              <el-form-item label="盒子名称" prop="boxName">
                <el-input
                  v-model="queryParams.boxName"
                  prefix-icon="el-icon-search"
                  placeholder="请输入盒子名称"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
              <el-form-item label="盒子状态" prop="boxStatus">
                <el-select
                  v-model="queryParams.boxStatus"
                  placeholder="请选择盒子在线状态"
                  clearable
                  size="small"
                >
                  <el-option
                    v-for="dict in boxStatusQueryOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>

              <el-form-item>
                <!-- <el-button type="primary" @click="handleQuery">查询 </el-button> -->
                <div class="right-box-message">
                  <div class="left">
                    <div class="seek-1" @click="handleQuery">
                      <svg-icon
                        icon-class="newSearch"
                        style="vertical-align:0
                      "
                      />
                      <span>查询</span>
                    </div>
                    <div class="reset-1" @click="resetQuery">重置</div>
                  </div>
                  <div class="right">
                    <div class="scanning" @click="handleIPAdd">
                      <svg-icon
                        icon-class="scanning"
                        style="vertical-align:0
                      "
                      />
                      <span>扫描添加盒子</span>
                    </div>
                  </div>
                </div>
                <!-- <el-button @click="resetQuery">重置 </el-button> -->
              </el-form-item>
            </el-form>
          </div>
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button
                v-permisaction="['admin:sysbox:add']"
                type="primary"
                icon="el-icon-plus"
                size="mini"
                style="background:linear-gradient(to bottom, #a388ff, #654ef4)"
                @click="handleAdd"
              >新增
              </el-button>
            </el-col>

            <!-- <el-col :span="1.5">
              <el-button
                v-permisaction="['admin:sysbox:add']"
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="handleIPAdd"
                >扫描添加盒子
              </el-button>
            </el-col> -->

            <el-col :span="1.5">
              <el-button
                v-permisaction="['admin:sysFederation:add']"
                type="primary"
                icon="el-icon-circle-plus"
                size="mini"
                style="background:linear-gradient(to bottom, #a388ff, #654ef4)"
                @click="handleFederation"
              >加入集群
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                v-permisaction="['admin:sysFederation:add']"
                type="danger"
                icon="el-icon-share"
                size="mini"
                @click="handleSyncBox"
              >集群数据同步
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <actionList />
            </el-col>
          </el-row>
          <!--        :row-class-name="rowClassName"-->
          <el-table
            v-loading="loading"
            :data="sysboxList"
            @selection-change="handleSelectionChange"
            @sort-change="handleSortChang"
          >
            <el-table-column
              v-if="showCol"
              label="编码"
              sortable="custom"
              width="auto"
              prop="boxId"
            />
            <el-table-column
              label="盒子名称"
              align="center"
              prop="boxName"
              sortable="custom"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              v-if="showCol"
              label="产品"
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
            <el-table-column v-if="showCol" label="序列号" align="center" prop="boxSno" />
            <el-table-column v-if="showCol" label="型号" align="center" prop="boxModel" />
            <el-table-column
              label="盒子IP"
              align="center"
              prop="boxIp"
              sortable="custom"
            />
            <el-table-column
              label="算法"
              align="center"
              prop="aiLastNameShow"
              sortable="custom"
            />
            <el-table-column
              label="盒子状态"
              align="center"
              sortable="custom"
            >
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.boxStatus === '1' ? '' : 'danger'"
                  disable-transitions
                >{{ boxStatusFormat(scope.row) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="集群状态"
              align="center"
              sortable="custom"
            >
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.fedStatus === '1' ? '' : 'danger'"
                  disable-transitions
                >{{ fedStatusFormat(scope.row) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="摄像头及算法" prop="boxNpus" align="left">
              <template slot-scope="scope">
                <div
                  v-for="(u, i) in scope.row.sysAiConfigCamGroupAiStatuses"
                  :key="i"
                >
                  <!-- <Link
                    to=""
                    v-for="(uAiConfig, iAiConfig) in u.aiConfigStatuses"
                    :key="iAiConfig"
                  > -->
                  <div
                    v-for="(uAiConfig, iAiConfig) in u.aiConfigStatuses"
                    :key="iAiConfig"
                  >
                    <!--   :to="{
                      class="link-type"
                      name: 'SysAiConfigManage',
                      params: { camId: scope.row.camId }
                    }" -->
                    <!--                                                      {{ uAiConfig }}-->
                    <span
                      :style="{
                        color:
                          u.camStatus === '1' && uAiConfig.aiStatus === '1'
                            ? 'green'
                            : 'red'
                      }"
                    >●
                    </span>
                    <router-link
                      class="link-type"
                      :to="{
                        name: 'SysAiConfigManage',
                        params: { camId: u.cId }
                      }"
                      :style="{ color: u.camStatus === '1' ? 'green' : 'red' }"
                    >{{ u.camName }} -
                    </router-link>
                    <router-link
                      class="link-type"
                      :to="{
                        name: 'SysAiConfigManage',
                        params: { camId: u.cId }
                      }"
                      :style="{
                        color: uAiConfig.aiStatus === '1' ? 'green' : 'red'
                      }"
                    >{{ uAiConfig.aiNames }}
                    </router-link>
                  </div>
                </div>
                <!--              <div v-if="scope.row.sysAiConfigCamGroupAiStatuses.length===0">暂无</div>-->
              </template>
            </el-table-column>

            <el-table-column
              v-if="showCol"
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
            <el-table-column
              label="操作"
              align="center"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-button
                  v-permisaction="['admin:sysbox:editByName']"
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleUpdateBoxName(scope.row)"
                >修改盒子名称
                </el-button>
                <el-button
                  v-permisaction="['admin:sysbox:details']"
                  size="mini"
                  type="text"
                  icon="el-icon-view"
                  @click="viewBox(scope.row)"
                >查看
                </el-button>
                <el-button
                  v-permisaction="['admin:sysbox:edit']"
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row)"
                >修改
                </el-button>
                <el-button
                  v-permisaction="['admin:sysbox:remove',]"
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                >删除
                </el-button>
                <el-button
                  v-permisaction="['admin:sysboxnpu:edit']"
                  type="text"
                  icon="el-icon-s-tools"
                  size="mini"
                  @click="npuSet(scope.row)"
                >算法配置
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
          <AddDialog
            ref="addDialog"
            :title="title"
            :network-way-options="networkWayOptions"
            :transport-protocol-options="transportProtocolOptions"
            :box-type-options="boxTypeOptions"
            :ai-options="aiOptions"
            :dept-options="deptOptions"
            :prod-options="prodOptions"
            @success="getList"
          />

          <!-- 修改盒子名称对话框 -->
          <UpdateBoxTitle ref="updateBoxTitle" @success="getList" />

          <!-- 自动搜索添加对话框 -->
          <AutoSearchBox
            ref="autoSearchBox"
            :box-type-options="boxTypeOptions"
            :box-status-options="boxStatusOptions"
            @success="getList"
          />
        </el-card>
        <!-- <boxState /> -->
        <edit-dialog
          :show="editDialog.show"
          :box-id="editDialog.boxId"
          :box-ip="editDialog.boxIp"
          @showChange="editDialogToggle"
          @ok="getList"
        />
      </div>
    </template>
  </BasicLayout>
</template>

<style lang="scss">
.box-management {
  border-radius: 16px;
}

.right-box-message[data-v-f14d98c0] {
  position: absolute;
  top: 0;
  left: 0;
}

.refresh {
  position: absolute;
  top: 0;
  right: 0;
}

.right-box-message {
  display: flex;
  justify-content: space-around;

  .left {
    display: flex;
  }
}

.reset-1 {
  cursor: pointer;
  margin-left: 10px;
  width: 85px;
  height: 37px;
  line-height: 37px;
  border: #c3c1c7 1px solid;
  border-radius: 4px;
  text-align: center;
  color: #c3c1c7;
}

.seek-1 {
  cursor: pointer;
  margin-left: 30px;

  span {
    vertical-align: 3px;
    margin-left: 10px;
  }

  width: 85px;
  height: 36px;
  line-height: 36px;
  background: linear-gradient(to bottom, #a388ff, #654ef4);
  text-align: center;
  vertical-align: middle;
  color: #fff;
  font-size: 16px;
  border-radius: 4px;
}

.scanning {
  margin-left: 370px;
  cursor: pointer;

  span {
    vertical-align: 3px;
    margin-left: 10px;
  }

  width: 146px;
  height: 38px;
  line-height: 38px;
  background: linear-gradient(to bottom, #a388ff, #654ef4);
  text-align: center;
  vertical-align: middle;
  color: #fff;
  font-size: 16px;
  border-radius: 8px;
}

.main-box-state {
  padding: 0 100px;

  .pipe-1 {
    position: absolute;
    top: 33px;
    right: -204px;
    width: 1px;
    height: 36px;
    background-color: #d8d8d8;
  }

  display: flex;
  justify-content: space-between;

  .state-count {
    position: absolute;
    top: 355%;
    left: 50%;
    font-size: 30px;
    font-weight: 700;
  }

  .state-text {
    font-size: 14px;
    color: #c3c1c7;
  }

  .online {
    display: flex;
    vertical-align: bottom;
    position: relative;
  }

  .offline {
    display: flex;
    vertical-align: bottom;
    position: relative;
  }

  .enabled {
    display: flex;
    vertical-align: bottom;
    position: relative;
  }
}

.page-wrapper {
  width: 298px;
  height: 152px;
  background-image: url(../../../assets/logo/total-bg.jpg);
  background-size: cover;
  border-radius: 10px;
  margin-right: 10px;

  .text {
    color: #fff;
    font-size: 14px;
    line-height: 16px;
    margin-top: 22px;
    margin-left: 25px;
  }

  .text-strong {
    margin-top: 40px;
    margin-left: 25px;
    color: #fff;
    font-size: 30px;
  }
}

.top {
  display: flex;

  .standardList {
    flex: 1;
    border-radius: 10px;
  }
}

.el-tag {
  display: inline-block;
  font-size: 12px;
  padding: 0 10px;
  border-radius: 4px 4px 4px 0;
}

.el-tag.el-tag--danger {

  border-color: #ff4949;
}

.el-tag--medium {
  color: #32d47b;
  border: 1px solid #d0f5e0;
  background-color: #e7faf0;
}

> > > .el-tag.el-tag--danger[data-v-f14d98c0] {
  border-color: #ff4949;
  color: #ff4949;

}

.el-message-box__btns {
  .el-button--default {
    padding: 10px 30px;
    margin: 30px;
    color: #c3c1c7;
  }

  .el-button--primary {
    background: linear-gradient(to bottom, #a388ff, #654ef4);
    color: #fff;
  }
}
</style>
<script>
import {
  delSysBox,
  getBoxStatueCount,
  getSysBox,
  getSysBoxName,
  listSysBox,
  syncAllBox
} from '@/api/box/sys-box'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getAllProductNameDict, getAllProductNamePid } from '@/api/box/sys-product'
import editDialog from './view/index'
import { unWsLogout } from '@/api/ws'
import { roleAiTreeSelect } from '@/api/box/sys-ai'
import { joinSysFederation } from '@/api/box/sys-federation'
import { getAllDeptNameDict, treeselect } from '@/api/admin/sys-dept'
import AddDialog from './components/addDialog.vue'
import UpdateBoxTitle from './components/updateBoxTitle.vue'
import AutoSearchBox from './components/autoSearchBox.vue'
import actionList from './components/actionList.vue'
import deviceStatus from './components/deviceStatus.vue'

export default {
  name: 'SysBox',
  components: {
    editDialog,
    AddDialog,
    UpdateBoxTitle,
    AutoSearchBox,
    actionList,
    deviceStatus
  },
  data() {
    return {
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
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 类型数据字典
      typeOptions: [],
      sysboxList: [],
      sysboxListByIP: [],
      boxTypeOptions: [],
      transportProtocolOptions: [],
      networkWayOptions: [],
      boxStatusOptions: [],
      boxStatusQueryOptions: [],
      fedStatusOptions: [],
      sysProductNameOptions: [],
      sysDeptNameOptions: [],
      deptOptions: undefined,
      // 关系表类型
      // 产品
      prodOptions: [],
      // 算法权限关联开始
      aiOptions: [],
      aiOptionsAlert: '加载中，请稍后',
      aiIdsChecked: [],
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        pId: undefined,
        deptId: undefined,
        parentId: undefined,
        // boxName: this.$route.query.boxName,
        boxName: undefined,
        boxStatus: undefined,
        text: undefined,
        createdAtOrder: 'desc'
      },
      // 表单参数
      queryBoxStatusParams: {},
      selectProduct: {},
      deviceStatus: {},
      editDialog: {
        show: false,
        boxId: undefined,
        boxIp: undefined
      },
      addDialog: {
        show: false
      }
    }
  },
  created() {
    // 权限控制
    // console.info("user", this.$store.state.user);
    const roles = this.$store.state.user.roles
    if (roles.indexOf('normal') !== -1) {
      // 修改对应角色名，控制权限
      this.showCol = false
    }
  },
  activated() {
    this.getList()
    this.getDeviceData()
    this.getTreeselect()
    this.getAiTreeSelect()
    this.getAllProductName()
    this.getAllProductNameDict()
    this.getAllDeptNameDict()
    this.getDicts('sys_prod_type').then(response => {
      this.boxTypeOptions = response.data
    })
    this.getDicts('sys_device_transport').then(response => {
      this.transportProtocolOptions = response.data
    })
    this.getDicts('sys_device_network').then(response => {
      this.networkWayOptions = response.data
    })
    this.getDicts('sys_box_status').then(response => {
      this.boxStatusOptions = response.data
    })
    this.getDicts('sys_box_query').then(response => {
      // 前端盒子状态只显示在线离线
      this.boxStatusQueryOptions = response.data
    })
    this.getDicts('sys_federation_statue').then(response => {
      this.fedStatusOptions = response.data
    })
    this.id = this.guid()
    this.group = 'box'
    this.initWebSocket()
  },
  deactivated() {
    // console.log('断开boxWebsocket连接')
    // 离开路由之后断开websocket连接
    this.websock.close()
    unWsLogout(this.id, this.group).then(response => {
      console.log(response.data)
    })
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listSysBox(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.sysboxList = response.data.list
          // console.info(JSON.stringify(this.sysboxList))
          this.total = response.data.count
          this.loading = false
        }
      )
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.deptOptions = response.data
        // console.info('222222' + (JSON.stringify(this.deptOptions)))
      })
    },
    boxStatusFormat(row) {
      return this.selectDictLabel(this.boxStatusOptions, row.boxStatus)
    },
    fedStatusFormat(row) {
      return this.selectDictLabel(this.fedStatusOptions, row.fedStatus)
    },
    productNameFormat(row) {
      return this.selectDictLabel(this.sysProductNameOptions, row.pId)
    },
    deptNameFormat(row) {
      return this.selectDictLabel(this.sysDeptNameOptions, row.deptId)
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
      this.queryParams['createdAtOrder'] = 'desc'
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.title = '添加盒子'
      this.$refs.addDialog.open('add')
    },

    /** 局域网添加盒子按钮操作 */
    handleIPAdd() {
      this.$refs.autoSearchBox.open()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.boxId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
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
    /** 修改按钮操作 */
    handleUpdate(row) {
      getSysBox(row.boxId).then(response => {
        this.title = '修改盒子配置'
        this.$refs.addDialog.open('update', response.data, row)
      })
    },
    /** 修改按钮操作 */
    handleUpdateBoxName(row) {
      getSysBoxName(row.boxId).then(response => {
        this.$refs.updateBoxTitle.open(response.data)
      })
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除名称为"' + row.boxName + '"的盒子?删除后重新添加本盒子需"重启！！！"', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(function() {
          return delSysBox({ id: row.boxId })
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
        .catch(function() {
        })
    },
    /** 集群联动操作 */
    handleFederation: function() {
      joinSysFederation().then(response => {
        if (response.code === 200) {
          this.msgSuccess(response.msg)
          this.getList()
        } else {
          this.msgError(response.msg)
        }
      })
    },
    /** 集群数据同步操作 */
    handleSyncBox: function() {
      this.$confirm(
        '同步后集群所有盒子数据会被重置成本盒子当前数据！请谨慎操作！是否确认同步?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }
      )
        .then(function() {
          return syncAllBox()
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
        .catch(function() {
        })
    },
    /** 设备状态 根据产品查询 */
    setProduct(value) {
      // console.info('11111' + this.selectProduct)
      this.$set(this.selectProduct, 'prodId', value)
      // console.info('2222' + value)
      this.getDeviceData(this.selectProduct)
      this.queryParams.pId = value
      this.getList()
    },
    getDeviceData: function() {
      getBoxStatueCount(
        this.addDateRange(this.queryBoxStatusParams, this.dateRange)
      ).then(response => {
        if (response.code === 200) {
          // eslint-disable-next-line no-unused-vars
          for (const key in response.data) {
            // console.log('key名称是：' + key + ',key的值是：' + response.data[key])
            this.deviceStatus['total'] = response.data[3] || 0
            this.$set(this.deviceStatus, 'notActive', response.data[2] || 0)
            this.$set(this.deviceStatus, 'offline', response.data[0] || 0)
            this.$set(this.deviceStatus, 'online', response.data[1] || 0)
          }
        }
      })
    },
    /** 查看按钮操作 */
    viewBox(row) {
      this.editDialog.boxId = row.boxId
      this.editDialog.boxIp = row.boxIp
      this.editDialog.show = true
    },
    editDialogToggle(value) {
      const _this = this
      _this.editDialog.show = value
    },
    addDialogToggle(value) {
      const _this = this
      _this.addDialog.show = value
    },
    npuSet(row) {
      this.$router.push({
        path: '/sys-box/npuList',
        query: { boxId: row.boxId, pId: row.pId }
      })
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
      console.log('boxWebsocket连接打开')
      //   const actions = { 'test': '12345' }
      //   this.websocketsend(JSON.stringify(actions))
    },
    websocketonerror() {
      // 连接建立失败重连
      this.initWebSocket()
    },
    // 数据接收
    websocketonmessage(e) {
      // console.log(e)
      // console.log(e.data)
      const jsonData = JSON.parse(e.data)
      // console.log(jsonData)
      for (let i = 0; i < this.sysboxList.length; i++) {
        if (this.sysboxList[i].boxId === jsonData.boxId) {
          // console.log(this.sysboxList[i])
          if ('boxStatus' in jsonData) {
            this.sysboxList[i].boxStatus = jsonData.boxStatus
          }
          if ('fedStatus' in jsonData) {
            this.sysboxList[i].fedStatus = jsonData.fedStatus
          }
          if ('aiLastNameShow' in jsonData) {
            this.sysboxList[i].aiLastNameShow = jsonData.aiLastNameShow
          }
          if ('sysAiConfigCamGroupAiStatuses' in jsonData) {
            this.sysboxList[i].sysAiConfigCamGroupAiStatuses =
              jsonData.sysAiConfigCamGroupAiStatuses
          }
          this.$set(this.sysboxList, i, this.sysboxList[i])
          break
        }
      }
    },
    update(row, index) {
      console.info(
        index + 1 + (this.queryParams.pageIndex - 1) * this.queryParams.pageSize
      )
      var id = '1541306220424466432'
      for (let i = 0; i < this.sysboxList.length; i++) {
        if (this.sysboxList[i].boxId === id) {
          // console.info(this.sysboxList[i])
          this.sysboxList[i].boxStatus = 0
          this.$set(this.sysboxList, i, this.sysboxList[i])
          break
        }
      }
    },

    websocketsend(Data) {
      // 数据发送
      //   this.websock.send(Data)
    },
    websocketclose(e) {
      // 关闭
      unWsLogout(this.id, this.group).then(response => {
        // console.log(response.data)
        console.log('boxWebsocket断开连接')
      })
      console.log('boxWebsocket断开连接', e)
    },
    guid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(
        c
      ) {
        var r = (Math.random() * 16) | 0
        var v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    },
    /** 查询菜单树结构 */
    getAiTreeSelect() {
      roleAiTreeSelect(0).then(response => {
        this.aiOptions = response.data.ais
      })
    },
    /** 查询ProductName参数列表 */
    getAllProductName() {
      getAllProductNamePid().then(response => {
        this.prodOptions = response.data
        // console.info(JSON.stringify(this.prodOptions))
      })
    },
    /** 查询ProductName参数列表 */
    getAllProductNameDict() {
      getAllProductNameDict().then(response => {
        this.sysProductNameOptions = response.data
      })
    },
    /** 查询DeptName参数列表 */
    getAllDeptNameDict() {
      getAllDeptNameDict().then(response => {
        this.sysDeptNameOptions = response.data
      })
    }
  }
}
</script>
<style></style>
