<template>
  <BasicLayout>
    <template #wrapper>
      <div class="main-box">
        <el-card class="LEDpartition">
          <el-row :gutter="10" class="mb8">
            <el-col :span="6">
              <span style="font-weight: bold;color: #7558F4;">
                摄像头组名称：{{ groupForm.groupName }}</span>
            </el-col>
            <el-col :span="6" :offset="12">
              <div
                class="addPartition"
              >
                <el-button
                  v-permisaction="['admin:sysAttendanceZone:add']"
                  style="background:linear-gradient(to bottom, #a388ff, #654ef4)"
                  type="primary"
                  size="small"
                  @click="handleAdd"
                >
                  十 添 加 分 区
                </el-button>
              </div>
            </el-col>
          </el-row>

          <el-table v-loading="loading" :data="sysAttendanceZoneList">
            <el-table-column
              label="LED名称"
              align="center"
              prop="ledZone.led.ledName"
            />
            <el-table-column
              label="LED IP"
              align="center"
              prop="ledZone.led.ledIp"
            />
            <el-table-column
              label="字符卡分区ID"
              align="center"
              prop="ledZone.zoneId"
            />
            <el-table-column
              label="操作"
              align="center"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <div class="removeLED">
                  <el-button
                    slot="reference"
                    v-permisaction="['admin:sysAttendanceZone:remove']"
                    size="medium"
                    type="text"
                    icon="el-icon-delete"
                    @click="handleDelete(scope.row)"
                  >移除
                  </el-button>
                </div>
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

          <!-- 添加对话框 -->
          <div class="addLED">
            <el-dialog :title="title" :visible.sync="open" width="500px">
              <el-form
                ref="form"
                :model="form"
                :rules="rules"
                label-width="auto"
              >
                <el-form-item label="LED名称-分区ID" prop="ledZoneOptions">
                  <el-cascader
                    v-model="form.ledZoneOptions"
                    placeholder="请选择添加LED分区ID"
                    :options="ledZoneOptions"
                    :props="{ multiple: true, checkStrictly: false }"
                    clearable
                    size="medium"
                    style="width: 300px;"
                  />
                </el-form-item>
              </el-form>
              <div slot="footer" class="addPartition">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="submitForm">确 定</el-button>
              </div>
            </el-dialog>
          </div>
        </el-card>
      </div>
    </template>
  </BasicLayout>
</template>

<script>
import { getSysAttendanceName } from '@/api/box/sys-attendance'
import {
  batchAddSysAttendanceZone,
  delSysAttendanceZone,
  getAttendanceZoneTree,
  listSysAttendanceZone
} from '@/api/box/sys-attendance-zone'

export default {
  name: 'SysAttendanceManage',
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
      // 是否显示弹出层
      open: false,
      isEdit: false,
      dialogVisible: false,
      // 类型数据字典
      sysAttendanceZoneList: [],
      ledZoneOptions: [],
      // 表单参数
      groupForm: {},
      // 关系表类型
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        groupId: parseInt(this.$route.params.groupId)
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        ledZoneOptions: [
          { required: true, message: '请选择字符卡分区ID', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    // console.info('created', this.$route.params.groupId)
    const groupIdParam = this.$route.params && parseInt(this.$route.params.groupId)
    this.getList()
    this.getGroupInfo(groupIdParam)
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
      listSysAttendanceZone(
        this.addDateRange(this.queryParams, this.dateRange)
      ).then(response => {
        this.sysAttendanceZoneList = response.data.list
        this.total = response.data.count
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      // console.info('reset', this.$route.params.groupId)
      this.form = {
        groupId: parseInt(this.$route.params.groupId),
        ledZoneOptions: []
      }
      this.resetForm('form')
    },

    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          batchAddSysAttendanceZone(this.form).then(response => {
            if (response.code === 200) {
              this.msgSuccess(response.msg)
              this.open = false
              this.getList()
            } else {
              this.msgError(response.msg)
            }
          })
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm(
        '确认移除该字符卡分区吗？移除后将不可恢复',
        '移除字符卡分区',
        {
          confirmButtonText: '移除',
          cancelButtonText: '取消'
        }
      )
        .then(function() {
          return delSysAttendanceZone({
            groupId: row.groupId,
            zId: row.zId
          })
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
    /** 测试按钮操作 */
    handleTest(row) {
      this.resetTest(row)
      this.testOpen = true
      this.testTitle = '调试LED'
      this.testIsEdit = false
    },
    /** LED查询 */
    getGroupInfo(groupIdParam) {
      getSysAttendanceName(groupIdParam).then(response => {
        this.groupForm = response.data
      })
    },
    /** 添加分区 查询 */
    handleAdd() {
      this.reset()
      this.getLedZoneTree()
      this.open = true
      this.title = '添加LED'
      this.isEdit = false
    },
    getLedZoneTree() {
      // console.info(this.$route.params.groupId)
      getAttendanceZoneTree(parseInt(this.$route.params.groupId)).then(response => {
        this.ledZoneOptions = response.data
      })
    }
  }
}
</script>
<style lang="scss">
.addPartition {
  text-align: center;
  .el-button--primary {
    padding: 10px 30px;
    margin: 0 20px;
    color: #ffffff;
    border-radius: 4px;
    border: 1px solid #a388ff;
    background: linear-gradient(to bottom, #a388ff, #654ef4);
  }
  .el-button--default {
    padding: 10px 30px;
    margin: 0 20px;
    color: #c3c1c7;
    border: 1px solid #c3c1c7;
    border-radius: 4px;
  }
}
.addLED {
  .el-dialog {
    border-radius: 8px;
    .el-dialog__header {
      text-align: center;
      .el-dialog__title {
        font-weight: 700;
        font-size: 24px;
        color: #654ef4;
      }
    }
    .el-dialog__footer {
      height: 90px;
    }
  }
}
//移除字符卡分区弹窗样式
.el-message-box {
  .el-message-box__message {
    padding: 20px 0;
  }
  .el-message-box__title {
    text-align: center;
    font-weight: 700;
    font-size: 24px;
    color: #654ef4;
  }
  .el-message-box__btns {
    text-align: center;
    .el-button--default {
      padding: 10px 30px;
      margin: 0 20px;
      color: #c3c1c7;
      border: 1px solid #c3c1c7;
      border-radius: 4px;
    }
    .el-button--primary {
      padding: 10px 30px;
      margin: 0 20px;
      color: #ffffff;
      border-radius: 4px;
      border: 1px solid #a388ff;
      background: linear-gradient(to bottom, #a388ff, #654ef4);
    }
  }
}
//移除LED
.removeLED {
  .el-button--text {
    padding: 10px 30px;
    color: #ffffff;
    background-color: #f44040;
  }
}
</style>
