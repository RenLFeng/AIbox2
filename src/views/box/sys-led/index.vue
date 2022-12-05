<template>
  <BasicLayout>
    <template #wrapper>
      <div class="main-box">
        <el-card class="box-card">
          <el-form ref="queryForm" :model="queryParams" :inline="true">
            <div class="LEDcontent">
              <div class="left-2">
                <el-form-item label="输入查询" prop="ledName">
                  <el-input
                    v-model="queryParams.ledName"
                    prefix-icon="el-icon-search"
                    placeholder="请输入IED名称/IP"
                    clearable
                    size="medium"
                    @keyup.enter.native="handleQuery"
                  />
                </el-form-item>

                <el-button
                  type="primary"
                  size="mini"
                  style="background:linear-gradient(to bottom, #a388ff, #654ef4);padding: 9px 20px; font-size: 14px;"
                  @click="handleQuery"
                > <svg-icon
                  icon-class="newSearch"
                  style="vertical-align:-1px;margin-right: 3px;
                      "
                /> 查询</el-button>
                <!-- <div class="LEDseek" @click="handleQuery">
                  <svg-icon
                    icon-class="newSearch"
                    style="vertical-align:1px;
                      "
                  />
                  <span>查询</span>
                </div> -->

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
                    style="background:linear-gradient(to bottom, #a388ff, #654ef4)"
                    @click="handleAdd"
                  >
                    十 添 加 L E D
                  </el-button>
                </el-form-item>
              </div>
            </div>
          </el-form>

          <el-table
            v-loading="loading"
            :data="sysLedList"
            @selection-change="handleSelectionChange"
            @sort-change="handleSortChang"
          >
            <el-table-column
              v-if="showCol"
              label="编号"
              align="center"
              prop="ledId"
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
              label="LED名称"
              align="center"
              prop="ledName"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="LED IP"
              align="center"
              prop="ledIp"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="字符卡分区ID"
              align="center"
              prop="sysLedZoneIdShow"
              :show-overflow-tooltip="true"
            />

            <el-table-column
              label="LED状态"
              align="center"
              sortable="custom"
              width="100"
            >
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.ledStatus === '1' ? 'success' : 'danger'"
                  disable-transitions
                >{{ ledStatusFormat(scope.row) }}
                </el-tag>
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
                    name: 'SysLEDManage',
                    params: { ledId: scope.row.ledId }
                  }"
                  class="link-type"
                ><span
                  style="font-size:12px;color: #7558F4;margin:0 5px ;"
                ><svg-icon icon-class="character" /> 字符卡分区管理</span>
                </router-link>
                <el-button
                  slot="reference"
                  v-permisaction="['admin:sysLed:edit']"
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row)"
                >修改名称
                </el-button>
                <span id="LEDdel">
                  <el-button
                    slot="reference"
                    v-permisaction="['admin:sysLed:remove']"
                    size="mini"
                    type="text"
                    icon="el-icon-delete"
                    @click="handleDelete(scope.row)"
                  >删除
                  </el-button>
                </span>
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
          <!-- 修改LED名称对话框 -->
          <span class="editLED">
            <el-dialog
              :title="editTitle"
              :visible.sync="editOpen"
              width="500px"
            >
              <el-form
                ref="editForm"
                :model="editForm"
                :rules="editRules"
                label-width="auto"
              >
                <el-form-item prop="ledName">
                  <el-input
                    v-model="editForm.ledName"
                    placeholder="请输入LED名称"
                    type="text"
                    maxlength="40"
                    show-word-limit
                    @input="changeLedName"
                  />
                </el-form-item>

              </el-form>
              <div slot="footer" class="addLED-save">
                <el-button @click="changeLedNameCancel">取 消</el-button>
                <el-button
                  type="primary"
                  :disabled="isEditChangeLedName"
                  @click="changeLedNameSubmitForm"
                >确 定</el-button>
              </div>
            </el-dialog>
          </span>

          <!-- 添加LED对话框 -->
          <el-dialog :title="title" :visible.sync="open" width="500px">
            <el-form
              ref="form"
              :model="form"
              :rules="rules"
              label-width="auto"
            >
              <el-col :span="24">
                <el-form-item label="LED名称" prop="ledName">
                  <el-input
                    v-model="form.ledName"
                    placeholder="请输入LED名称"
                    type="text"
                    maxlength="40"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="LED IP" prop="ledIp">
                  <el-input
                    v-model="form.ledIp"
                    placeholder="请输入LED IP地址"
                    :disabled="isEdit"
                    type="text"
                    maxlength="15"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <div
                  v-for="(item, index) in form.sysLedZones"
                  :key="index"
                >
                  <el-row :gutter="20">
                    <span>
                      <el-col :span="12">
                        <!--<el-form-item label="字符卡分区ID" prop="sysLedZones">-->
                        <el-form-item
                          label="字符卡分区ID"
                          :prop="`sysLedZones.${index}.zoneId`"
                          :rules="{
                            required: true,
                            message: '请输入字符卡分区ID',
                            trigger: 'change'
                          }"
                        >
                          <el-input
                            v-model="form.sysLedZones[index].zoneId"
                            :max="65535"
                            :min="1"
                            size="large"
                            controls-position="right"
                            placeholder="请输入字符卡分区ID"
                          />
                          <span>
                            <el-button
                              v-permisaction="['admin:sysLed:add']"
                              size="mini"
                              type="text"
                              style="vertical-align: 0px;position: absolute; top:-5px;left:100px; font-size: 35px;"
                              @click="addItem()"
                            ><svg-icon icon-class="addNew" />
                            </el-button>
                            <el-col :span="6" pull="1">
                              <el-form-item label="">
                                <el-button
                                  v-if="form.sysLedZones.length > 1"
                                  v-permisaction="['admin:sysLed:remove']"
                                  size="mini"
                                  type="text"
                                  style="vertical-align: 0px;position: absolute; top:-47px;left:140px; font-size: 38px;"
                                  @click="delItem(index)"
                                ><svg-icon icon-class="subtract" />
                                </el-button>
                              </el-form-item>
                            </el-col>
                          </span>
                        </el-form-item>
                      </el-col>
                    </span>

                  </el-row>
                </div></el-col>
            </el-form>
            <div slot="footer" class="addLED-save">
              <el-button @click="cancel">取 消</el-button>
              <el-button type="primary" @click="submitForm()">确 定</el-button>
            </div>
          </el-dialog>

          <!-- 删除字符卡分区ID没取消关联提示框 -->
          <div class="removeCamera">
            <el-dialog :visible.sync="dialogVisible" width="20%" center>
              <img src="../../../assets/logo/error.png" alt="">
              <div style="padding-top:20px">
                该分区需解除与摄像头组的关联，才可删除！
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button
                  type="primary"
                  @click="dialogVisible = false"
                >好 的</el-button>
              </span>
            </el-dialog>
          </div>
        </el-card>
      </div>
    </template>
  </BasicLayout>
</template>

<script>
import {
  addSysLed,
  delSysLed,
  getSysLed,
  getSysLedRelation,
  listSysLed,
  updateSysLed,
  updateSysLedName
} from '@/api/box/sys-led'
import { getAllDeptNameDict } from '@/api/admin/sys-dept'
import { unWsLogout } from '@/api/ws'

export default {
  name: 'SysLED',
  components: {},
  data() {
    const checkoutIP = (rule, value, callback) => {
      const ipRules = /^((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9]))$/
      if (!ipRules.test(value)) {
        callback(new Error('请输入正确的IP格式'))
      } else {
        callback()
      }
    }
    return {
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
      // 弹出层标题
      editTitle: '',
      title: '',
      // 是否显示弹出层
      open: false,
      editOpen: false,
      isEdit: false,
      isEditChangeLedName: false,
      editIsEdit: false,
      dialogVisible: false,
      // 类型数据字典
      typeOptions: [],
      sysLedList: [],
      ledStatusOptions: [],
      sysDeptNameOptions: [],
      // 关系表类型

      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        ledName: undefined,
        ledIp: undefined,
        createdAtOrder: 'desc'
      },
      // 表单参数
      form: {
        // sysLedZoneIds: []
      },
      editForm: {},
      // 表单校验
      editRules: {
        ledName: [
          { required: true, message: '请输入LED名称', trigger: 'change' }
        ]
      },
      // 表单校验
      rules: {
        ledName: [
          { required: true, message: '请输入LED名称', trigger: 'change' }
        ],
        ledIp: [
          { required: true, message: '请输入LED IP', trigger: 'change' },
          { validator: checkoutIP, trigger: 'blur' }
        ]
        // sysLedZones: [{ required: true, message: '请输入字符卡分区ID', trigger: 'change' }]
      }
    }
  },
  activated() {
    this.getList()
    // 权限控制
    // console.info('user', this.$store.state.user)
    const roles = this.$store.state.user.roles
    if (roles.indexOf('normal') !== -1) {
      // 修改对应角色名，控制权限
      this.showCol = false
    }
    this.getDicts('sys_led_status').then(response => {
      // 前端盒子状态只显示在线离线
      this.ledStatusOptions = response.data
    })
    this.getAllDeptNameDict()

    this.id = this.guid()
    this.group = 'led'
    this.initWebSocket()
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listSysLed(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.sysLedList = response.data.list
          // console.info(JSON.stringify(this.sysLedList))
          this.total = response.data.count
          this.loading = false
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
        ledId: undefined,
        deptId: this.$store.state.user.deptId,
        ledName: undefined,
        ledIp: undefined,
        ledStatus: '0',
        sysLedZones: [{ id: 0, ledId: 0, zoneId: 1 }]
      }
      this.resetForm('form')
    },
    getImgList: function() {
      this.form[this.fileIndex] = this.$refs['fileChoose'].resultList[0].fullUrl
    },
    fileClose: function() {
      this.fileOpen = false
    },
    // 关系
    // 文件
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.ledIp = this.queryParams.ledName
      this.queryParams.pageIndex = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加LED'
      this.isEdit = false
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.ledId)
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
      this.reset()
      getSysLed(row.ledId).then(response => {
        this.editForm = response.data
        this.editOpen = true
        this.editTitle = '修改LED名称'
        this.isEditChangeLedName = true
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.form.sysLedZones.forEach(item => {
            item.zoneId = Number(item.zoneId)
          })
          if (this.form.ledId !== undefined) {
            updateSysLed(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addSysLed(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      // if (row.sysLedZones.length > 0) {
      // row.sysLedZones.forEach((item) => {
      //   if (item.sysAttendancesIds.length > 0) {
      //     this.dialogVisible = true
      //   }
      // })
      // this.dialogVisible = true

      getSysLedRelation(row.ledId)
        .then(response => {
          // console.info(JSON.stringify(response.data))
          if (response.code === 200 && response.data === true) {
            // console.info(response)
            this.dialogVisible = true
          } else {
            this.$confirm('确认删除该LED吗？删除后将不可恢复', '删除LED', {
              confirmButtonText: '删除',
              cancelButtonText: '取消'
            })
              .then(function() {
                return delSysLed({ ledId: row.ledId })
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
          }
        })
        .catch(error => {
          // 加上catch即可
          console.info(error)
        })
    },
    ledStatusFormat(row) {
      return this.selectDictLabel(this.ledStatusOptions, row.ledStatus)
    },
    deptNameFormat(row) {
      return this.selectDictLabel(
        this.sysDeptNameOptions,
        row.deptId.toString()
      )
    },
    /** 修改LED子名称 */
    changeLedName() {
      this.isEditChangeLedName = false
    },
    /** 修改LED名称对话框提交按钮 */
    changeLedNameSubmitForm: function() {
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          if (this.editForm.ledId !== undefined) {
            updateSysLedName(this.editForm).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改LED名称成功')
                this.editOpen = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          }
        }
      })
    },
    // 取消按钮
    changeLedNameCancel() {
      this.editOpen = false
      this.changeLedNameReset()
    },
    // 表单重置
    changeLedNameReset() {
      this.editForm = {
        ledId: undefined,
        ledName: undefined
      }
      this.resetForm('editForm')
    },
    delItem(index) {
      console.log(index, '序')
      this.form.sysLedZones.splice(index, 1)
      console.info('222delItem' + this.form.sysLedZones.length)
    },
    addItem() {
      // console.info('addItem sum' + sum)
      if (this.form.sysLedZones.length > 19) {
        this.$alert('最多可设置20个字符分区ID', '提示', {})
        return
      }

      this.form.sysLedZones.push({ id: 0, ledId: 0, zoneId: 1 })
    },

    /** 查询DeptName参数列表 */
    getAllDeptNameDict() {
      getAllDeptNameDict().then(response => {
        this.sysDeptNameOptions = response.data
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
      console.log('ledWebsocket连接打开')
      //   const actions = { 'test': '12345' }
      //   this.websocketsend(JSON.stringify(actions))
    },
    websocketonerror() {
      // 连接建立失败重连
      this.initWebSocket()
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

      const jsonData = JSON.parse(e.data)
      // console.log(jsonData)
      for (let i = 0; i < this.sysLedList.length; i++) {
        if (this.sysLedList[i].ledId === jsonData.ledId) {
          // console.log(this.sysLedList[i])
          if ('ledStatus' in jsonData) {
            this.sysLedList[i].ledStatus = jsonData.ledStatus
          }
          this.$set(this.sysLedList, i, this.sysLedList[i])
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
        console.log('ledWebsocket断开连接')
      })
      console.log('ledWebsocket断开连接', e)
    },
    guid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(
        c
      ) {
        var r = (Math.random() * 16) | 0
        var v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    }
  }
}
</script>
<style lang="scss">
.LEDcontent {
  display: flex;
  justify-content: space-between;

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
    height: 35px;
    line-height: 35px;
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
      height: 37px;
      color: #c3c1c7;
      font-size: 14px;
      // border: 1px solid #c3c1c7;
    }
  }
}
//LED状态样式

.el-tag.el-tag--danger {
  color: #f44040;
  border: 1px solid #f44040;
  background-color: #ffeded;
  border-radius: 4px 4px 4px 0px;
}
.el-tag.el-tag--success {
  color: #32d47b;
  border: 1px solid #32d47b;
  background-color: #e7faf0;
  border-radius: 4px 4px 4px 0px;
}
//删除样式
.el-table .fixed-width .el-button--mini {
  background-color: none !important;
  padding: none !important;
}

#LEDdel {
  .el-table .fixed-width .el-button--mini {
    padding: none !important;
  }
  display: inline-block;

  .el-button--text {
    color: #f44040;
  }
}
//添加弹窗样式
.addLED {
  .el-dialog {
    padding: 20px;
    border-radius: 8px;
  }
  .el-dialog__header {
    text-align: center;
    font-weight: 700;
    font-size: 24px;
    .el-dialog__title {
      color: #7558f4;
    }
  }
}
//添加按钮弹框确认样式
.addLED-save {
  text-align: center;
  .el-button--primary {
    padding: 10px 30px;
    background: linear-gradient(to bottom, #a388ff, #654ef4);
  }
  .el-button--default {
    margin: 0 20px;
    padding: 10px 30px;
    color: #c3c1c7;
    border: 1px solid #c3c1c7;
    background-color: transparent;
  }
}
//修改编辑LED名称样式
.editLED {
  .el-dialog {
    border-radius: 8px;
    padding: 20px;
  }
  .el-dialog__header {
    text-align: center;
    .el-dialog__title {
      color: #7558f4;
      font-size: 24px;
      line-height: 24px;
    }
  }
}
//删除盒子样式
.el-message-box {
  padding: 20px;
}
.el-message-box__btns {
  text-align: center;
  .el-button--default {
    margin: 20px 40px;
    padding: 10px 30px;
    color: #c3c1c7;
    border: 1px solid #c3c1c7;
    background-color: transparent;
  }
  .el-button--primary {
    padding: 10px 30px;
    color: #fff;
    background: linear-gradient(to bottom, #a388ff, #654ef4);
  }
}
.el-message-box__message {
  text-align: center;
}
.el-message-box {
  padding: 20px;
  .el-message-box__header {
    text-align: center;

    .el-message-box__title {
      color: #7558f4;
      font-size: 24px;
      line-height: 70px;
    }
  }
}
//移除摄像头弹窗样式
.removeCamera {
  .el-dialog {
    border-radius: 8px;
  }
  .el-dialog--center .el-dialog__body {
    text-align: center;
  }
  .el-dialog__footer {
    height: 90px;
  }
  .el-button--primary {
    padding: 10px 30px;
  }
}
</style>
