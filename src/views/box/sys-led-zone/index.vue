<template>
  <BasicLayout>
    <template #wrapper>
      <div class="main-box">
        <el-card class="LEDname">
          <el-row :gutter="10" class="mb8">
            <el-col :span="6">
              <span style="font-weight: bold; color: #7558F4;"> LED名称：</span>
              <el-popover placement="bottom-end" width="280" trigger="hover">
                <el-button
                  v-if="ledForm.ledStatus === '1'"
                  slot="reference"
                  type="success"
                  round
                >{{ ledForm.ledName }}</el-button>
                <el-button v-else slot="reference" type="danger" round>{{
                  ledForm.ledName
                }}</el-button>
                <p>
                  LED名称:
                  <el-tag
                    v-if="ledForm.ledStatus === '0'"
                    type="danger"
                    effect="dark"
                  >{{ ledForm.ledName }}</el-tag>
                  <el-tag
                    v-if="ledForm.ledStatus === '1'"
                    type="success"
                    effect="dark"
                  >{{ ledForm.ledName }}</el-tag>
                </p>
                <p>
                  LED状态:
                  <el-tag
                    v-if="ledForm.ledStatus === '0'"
                    type="danger"
                  >离线</el-tag>
                  <el-tag
                    v-if="ledForm.ledStatus === '1'"
                    type="success"
                  >在线</el-tag>
                </p>
              </el-popover>
            </el-col>
            <el-col :span="6" :offset="12">
              <el-button
                v-permisaction="['admin:sysLedZone:add']"
                style="background:linear-gradient(to bottom, #a388ff, #654ef4)"
                type="primary"
                size="small"
                @click="handleAdd"
              >十 添 加 分 区
              </el-button>
            </el-col>
          </el-row>

          <el-table v-loading="loading" :data="sysLedZoneList">
            <el-table-column
              v-if="showCol"
              label="编号"
              align="center"
              prop="zId"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="字符卡分区ID"
              align="center"
              prop="zoneId"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="操作"
              align="center"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <span class="testLEd">
                  <el-button
                    v-if="showCol"
                    slot="reference"
                    v-permisaction="['admin:sysLedZone:query']"
                    size="mini"
                    type="text"
                    icon="el-icon-s-flag"
                    @click="handleTest(scope.row)"
                  >测试
                  </el-button>
                </span>
                <span class="delLEd">
                  <el-button
                    slot="reference"
                    v-permisaction="['admin:sysLedZone:remove']"
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

          <!-- 添加或修改对话框 -->
          <el-dialog :title="title" :visible.sync="open" width="600px">
            <el-form ref="form" :model="form" :rules="rules" label-width="auto">
              <el-col :span="24">
                <div
                  v-for="(item, index) in form.zoneIds"
                  :key="index"
                >
                  <el-row :gutter="20">
                    <div>
                      <el-col :span="18">
                        <el-form-item label="LED字符卡分区ID" prop="zoneIds">
                          <el-input-number
                            v-model="form.zoneIds[index]"
                            :max="65535"
                            size="large"
                            controls-position="right"
                            placeholder="请输入字符卡分区ID"
                          />
                        </el-form-item>
                      </el-col>

                      <span>
                        <el-col :span="6">
                          <el-button
                            v-if="form.zoneIds.length>0"
                            v-permisaction="['admin:sysLed:add']"
                            size="mini"
                            type="text"
                            style="vertical-align: 0px;position: absolute; top:-5px; font-size: 30px;"
                            @click="addItem()"
                          ><svg-icon icon-class="addNew" />
                          </el-button>
                        </el-col>
                      </span>
                      <el-col :span="6" :offset="6">
                        <el-form-item label="">
                          <span class="remove">
                            <el-button
                              v-if="form.zoneIds.length>1"
                              v-permisaction="['admin:sysLed:remove']"
                              size="mini"
                              type="text"
                              style="vertical-align: 0px;position: absolute; top:-68px;left:195px; font-size: 32px;"
                              @click="delItem(index)"
                            ><svg-icon icon-class="subtract" />
                            </el-button>
                          </span>
                        </el-form-item>
                      </el-col>
                    </div></el-row>
                </div>
                <el-col :span="24">
                  <el-form-item label="" />
                </el-col>
              </el-col>
            </el-form>
            <div slot="footer" class="addID">
              <el-button @click="cancel">取 消</el-button>
              <el-button
                type="primary"
                :disabled="isEditSubmitForm"
                @click="submitForm"
              >确 定</el-button>
            </div>
          </el-dialog>

          <!-- 调试窗口对话框 -->
          <el-dialog :title="testTitle" :visible.sync="testOpen" width="500px">
            <el-form
              ref="testForm"
              :model="testForm"
              :rules="testRules"
              label-width="auto"
            >
              <el-form-item label="显示内容" prop="content">
                <el-input
                  v-model="testForm.content"
                  placeholder="请输入需要显示的内容"
                  type="text"
                />
              </el-form-item>
            </el-form>
            <div slot="footer" class="testLED">
              <el-button @click="cancelTest">取 消</el-button>
              <el-button
                type="primary"
                :disabled="testSubmitForm"
                @click="submitTestForm"
              >确 定</el-button>
            </div>
          </el-dialog>

          <!-- 删除字符卡分区ID没取消关联提示框 -->
          <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="20%"
            center
          >
            <span>该分区需解除与摄像头组的关联，才可删除！</span>
            <span slot="footer" class="dialog-footer">
              <el-button
                type="primary"
                @click="dialogVisible = false"
              >好 的</el-button>
            </span>
          </el-dialog>
        </el-card>
      </div>
    </template>
  </BasicLayout>
</template>

<script>
import {
  addSysLedZone,
  delSysLedZone,
  listSysLedZone,
  testLed,
  updateSysLedZone
} from '@/api/box/sys-led-zone'
import { getSysLed } from '@/api/box/sys-led'
export default {
  name: 'SysLEDManage',
  components: {},
  data() {
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
      title: '',
      testTitle: '',
      // 是否显示弹出层
      open: false,
      testOpen: false,
      isEdit: false,
      testIsEdit: false,
      dialogVisible: false,
      isEditSubmitForm: false,
      testSubmitForm: false,
      // 类型数据字典
      typeOptions: [],
      sysLedZoneList: [],
      // 表单参数
      ledForm: {},
      // 关系表类型

      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        lId: parseInt(this.$route.params.ledId),
        createdAtOrder: 'desc'
      },
      // 表单参数
      form: {},
      testForm: {},
      // 表单校验
      rules: {
        zoneIds: [
          { required: true, message: '请输入字符卡分区ID', trigger: 'change' }
        ]
      },
      testRules: {
        content: [
          { required: true, message: '请输入显示内容', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    const ledIdParam = this.$route.params && parseInt(this.$route.params.ledId)
    this.getList()
    this.getLedInfo(ledIdParam)
    // 权限控制
    // console.info("user", this.$store.state.user);
    const roles = this.$store.state.user.roles
    if (roles.indexOf('normal') !== -1) {
      // 修改对应角色名，控制权限
      this.showCol = false
    }
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listSysLedZone(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.sysLedZoneList = response.data.list
          this.total = response.data.count
          this.loading = false
        }
      )
    },
    // 取消按钮
    cancelTest() {
      this.testOpen = false
      this.resetTest()
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        lId: this.$route.params && parseInt(this.$route.params.ledId),
        zoneIds: [1]
      }
      this.resetForm('form')
    },
    // 表单重置
    resetTest(row) {
      this.testForm = {
        zoneId: row.zoneId,
        lId: this.$route.params && parseInt(this.$route.params.ledId),
        content: undefined
      }
      this.resetForm('testForm')
    },
    getImgList: function() {
      this.form[this.fileIndex] = this.$refs['fileChoose'].resultList[0].fullUrl
    },
    fileClose: function() {
      this.fileOpen = false
    },

    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateSysLedZone(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addSysLedZone(this.form).then(response => {
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
    /** 提交按钮 */
    submitTestForm: function() {
      this.$refs['testForm'].validate(valid => {
        if (valid) {
          testLed(this.testForm).then(response => {
            if (response.code === 200) {
              this.msgSuccess(response.msg)
              this.testOpen = false
            } else {
              this.msgError(response.msg)
            }
          })
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      if (row.sysAttendancesIds.length > 0) {
        this.dialogVisible = true
      } else {
        this.$confirm('确认删除该LED吗？删除后将不可恢复', '删除该LED', {
          confirmButtonText: '删除',
          cancelButtonText: '取消'
        })
          .then(function() {
            return delSysLedZone({ zid: row.zId })
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
    },
    /** 测试按钮操作 */
    handleTest(row) {
      this.resetTest(row)
      this.testOpen = true
      this.testTitle = '调试LED'
      this.testIsEdit = false
    },
    /** LED查询 */
    getLedInfo(ledIdParam) {
      // const camId = this.$route.params.camId
      // console.info("ID值"+camIdParam)
      getSysLed(ledIdParam).then(response => {
        this.ledForm = response.data
      })
    },
    /** 添加字符卡分区ID */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加字符卡分区ID'
      this.isEdit = false
    },
    delItem(index) {
      this.form.zoneIds.splice(index, 1)
      this.isEditSubmitForm = false
      // console.info('222delItem' + this.form.sysAiTimes.length)
    },
    addItem() {
      // console.log(this.form.zoneIds.length, '长度')
      if (this.form.zoneIds.length > 19) {
        this.$alert('一次性最多添加20个LED字符卡分区ID', '提示', {})
        return
      }
      this.form.zoneIds.push(1)
      this.isEditSubmitForm = false
      // console.info('111addItem' + this.form.sysAiTimes.length)
    }
  }
}
</script>
<style lang="scss" scoped>

  ::v-deep .el-input-number.is-controls-right .el-input-number__decrease{
    display: none;
  }
  ::v-deep .el-input-number.is-controls-right .el-input-number__increase{
    display: none;
  }
.LEDname {
  .el-button--danger {
    background-color: transparent;
    border: none;
    color: #7558f4;
  }
  .el-button--success {
    background-color: transparent;
    border: none;
    color: #7558f4;
  }
}
.el-table .fixed-width .el-button--mini {
  width: 70px;
}
.delLEd {
  .el-button--text {
    margin-left: 10px;
    background-color: #f44040;
    color: #fff;
    height: 40px;
    border-radius: 4px;
    font-size: 14px;
  }
}
.el-message-box {
  padding: 30px;
  .el-message-box__message {
    text-align: center;
    margin: 20px 0;
  }
  .el-message-box__title {
    text-align: center;
    color: #7558f4;
    font-size: 24px;
    font-weight: 700;
  }
  .el-message-box__btns {
    text-align: center;
    padding: 20px;
    .el-button--default {
      margin: 0 20px;
      color: #c3c1c7;
      border: 1px solid #c3c1c7;
      // background: linear-gradient(to bottom, #a388ff, #654ef4);
      padding: 10px 30px;
    }
    .el-button--primary {
      color: #ffffff;
      background: linear-gradient(to bottom, #a388ff, #654ef4);
      padding: 10px 30px;
    }
  }
}
.el-dialog {
  padding: 20px;
  border-radius: 8px;
}
.item-list {
  display: flex;
  .el-button--text {
    font-size: 50px;
    line-height: 30px;
    padding: 2px;
    border-radius: 8px;
    border: 2px solid #7558f4;
    vertical-align: -15px;
  }
  .remove {
    .el-button--text {
      background-color: #f44040;
      padding: 10px 10px;
      border-radius: 4px;
      color: #fff;
      font-size: 12px;
      line-height: 12px;
      border: none;
      vertical-align: -15px;
      position: absolute;
      top: -60px;
      right: -270px;
    }
  }
}
//添加LED样式
.el-dialog__header {
  text-align: center;
  .el-dialog__title {
    line-height: 70px;
    color: #7558f4;
    font-size: 24px;
  }
}
.addID {
  text-align: center;
  .el-button--primary {
    margin: 0 20px;
    color: #fff;
    background: linear-gradient(to bottom, #a388ff, #654ef4);
    border-radius: 4px;
    padding: 10px 30px;
  }
  .el-button--default {
    margin: 0 20px;
    color: #c3c1c7;
    border-radius: 4px;
    border: 1px solid #c3c1c7;
    padding: 10px 30px;
  }
}
//调试弹窗样式
.testLED {
  text-align: center;
  .el-button--primary {
    margin: 0 20px;
    color: #fff;
    background: linear-gradient(to bottom, #a388ff, #654ef4);
    border-radius: 4px;
    padding: 10px 30px;
  }
  .el-button--default {
    margin: 0 20px;
    color: #c3c1c7;
    border-radius: 4px;
    border: 1px solid #c3c1c7;
    padding: 10px 30px;
  }
}
</style>
