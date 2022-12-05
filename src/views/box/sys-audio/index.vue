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
            <el-form-item label="输入查询" prop="audioName">
              <el-input
                v-model="queryParams.audioName"
                prefix-icon="el-icon-search"
                placeholder="请输入音响名称/终端号"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                size="small"
                style="background:linear-gradient(to bottom, #a388ff, #654ef4)"
                @click="handleQuery"
              ><svg-icon
                icon-class="newSearch"
                style="vertical-align:-2px;margin-right: 3px;
                      "
              />查询</el-button>
              <!-- <span class="seek-14" @click="handleQuery">
                <svg-icon
                  icon-class="newSearch"
                  style="vertical-align:0
                      "
                />
                <span>查询</span>
              </span> -->
              <el-button icon="el-icon-refresh" style="padding:11px 30px" size="small" @click="resetQuery">重置</el-button>

              <!-- <el-col :span="1.5">
            <span class="tableTitle">音响列表</span>
          </el-col> -->
              <div
                style="margin-left:700px;margin-top:-35px ;font-size:16px;line-height:40px;
              "
              >
                音响总开关
              </div>
              <!--  -->
              <span class="my-switch">
                <!-- <el-switch
                  width="50"
                  v-model="audioAllSwitch"
                  inactive-text="音响总开关"
                  active-value="1"
                  inactive-value="0"
                  @change="handelSwitchAllChange(audioAllSwitch)"
                /> -->
                <!-- <div
                  v-for="(item, index) in btnList"
                  ref="mySwitch"
                  :key="index"
                >
                  {{ item }}
                </div> -->
                <div :class=" audioAllSwitch ? 'item ' : 'item bc1'" @click="handelSwitchAllChange(1)">开</div>
                <div :class=" audioAllSwitch ? 'item bc2' : 'item '" @click="handelSwitchAllChange(0)">关</div>
                <!-- <mySwitch v-model="audioAllSwitch" text="on|off" />
                 -->

              </span>
              <!-- <SwitchComponent v-model="audioAllSwitch" text="开|关" /> -->
              <span class="allSpeakers">
                <el-button
                  type="primary"
                  size="mini"
                  plain
                  @click="handleSync"
                >一键同步音响</el-button>
              </span>
            </el-form-item>
          </el-form>

          <el-table
            v-loading="loading"
            :data="sysAudioList"
            @sort-change="handleSortChang"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              label="音响名称"
              align="center"
              prop="audioName"
              :show-overflow-tooltip="true"
            /><el-table-column
              label="终端号"
              align="center"
              prop="terminal"
              sortable="custom"
              width="100"
            /><el-table-column
              v-if="showCol"
              label="音响IP"
              align="center"
              prop="audioIp"
              width="200"
            /><el-table-column
              label="音量"
              align="center"
              prop="volume"
              width="80"
            />
            <el-table-column label="设备状态" align="center" prop="audioStatus">
              <template slot-scope="scope">
                <el-tag
                  v-if="scope.row.audioStatus === '1'"
                  type="success"
                >在线</el-tag>
                <el-tag v-else type="danger">离线</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="设备开关"
              align="center"
              prop="audioSwitch"
              :formatter="audioSwitchFormat"
              width="100"
            >
              <template slot-scope="scope">
                <!-- <el-switch
                  v-model="scope.row.audioSwitch"
                  width="50"
                  active-value="1"
                  inactive-value="0"
                  @change="handleSwitchChange(scope.row)"
                /> -->
                <!-- flag === index  -->
                <div class="my-switch-1">
                  <!-- <div
                    v-for="(item, index) in btnList"
                    ref="itemSwitch"
                    :key="index"
                    :class=" scope.row .audioSwitch ? 'item' : 'bc'"
                    @click="handleSwitchChange(scope.row, index)"
                  >
                    {{ item }}
                  </div> -->
                  <!-- <p>{{ scope.row.audioSwitch }}</p> -->
                  <div :class=" scope.row.audioSwitch==='1' ? 'item bc1' : 'item '" @click="handleSwitchChange(scope.row,1)">开</div>
                  <div :class=" scope.row.audioSwitch==='0' ? 'item bc2' : 'item '" @click="handleSwitchChange(scope.row,0)">关</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope" style="">
                <span class="edit1">
                  <el-button
                    v-permisaction="['admin:sysAudio:edit']"
                    size="mini"
                    type="text"
                    icon="el-icon-edit"
                    @click="handleUpdate(scope.row)"
                  >修改
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
          <el-dialog
            :title="title"
            :visible.sync="open"
            width="500px"
            class="editSpeaker"
          >
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
              <el-form-item label="名称" prop="audioName">
                <el-input
                  v-model="form.audioName"
                  type="text"
                  maxlength="40"
                  show-word-limit
                  placeholder="请输入音响名称"
                  @input="change"
                />
              </el-form-item>
              <el-form-item label="终端号" prop="terminal" class="Terminal">
                <el-input
                  v-model="form.terminal"
                  type="text"
                  :disabled="true"
                />
              </el-form-item>

              <el-form-item label="音量" prop="volume">
                <!-- <el-input-number
                v-model="form.volume"
                controls-position="right"
                :min="1"
                :max="100"
                @input="change"
              /> -->

                <el-slider v-model="form.volume" @input="change" />

              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer-2">
              <el-button @click="cancel">取 消</el-button>
              <el-button
                type="primary"
                :disabled="isEditSubmit"
                @click="submitForm"
              >确 定</el-button>
            </div>
          </el-dialog>
        </el-card>
      </div>
    </template>
  </BasicLayout>
</template>

<script>
import {
  addSysAudio,
  delSysAudio,
  getSysAudio,
  listSysAudioLatest,
  syncAudio,
  updateAudioSwitch,
  updateAudioSwitchAll,
  updateSysAudio
} from '@/api/box/sys-audio'
export default {
  name: 'SysAudio',
  components: {

  },
  data() {
    return {
      flag: 0,
      btnList: ['开', '关'],
      isSelect: true,
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
      isEditSubmit: false,
      // 类型数据字典
      typeOptions: [],
      sysAudioList: [],

      // 关系表类型
      audioStatusOptions: [],
      audioSwitchOptions: [],
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        audioName: undefined,
        terminal: undefined,
        createdAtOrder: 'desc'
      },
      audioAllSwitch: '0',
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        audioName: [{ required: true, message: '不能为空', trigger: 'blur' }],
        terminal: [{ required: true, message: '不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
    this.getDicts('sys_audio_status').then(response => {
      this.audioStatusOptions = response.data
    })
    this.getDicts('sys_audio_switch').then(response => {
      this.audioSwitchOptions = response.data
    })
    // 权限控制
    // console.info("user", this.$store.state.user);
    const roles = this.$store.state.user.roles
    if (roles.indexOf('normal') !== -1) {
      // 修改对应角色名，控制权限
      this.showCol = false
    }
  },
  methods: {
    // switch选中取反
    changeSwitch(scope, index) {
      this.flag = !this.value
      if (index === 0) {
        this.$confirm('确认要开启所有音响吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(function() {
            return updateAudioSwitchAll(JSON.stringify(index))
          })
          .then(() => {
            this.msgSuccess('开启成功')
            this.getList()
          })
          .catch(function() {
          })
      } else if (index === 1) {
        this.$confirm('确认要关闭所有音响吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(function() {
            return updateAudioSwitchAll(JSON.stringify(index))
          })
          .then(() => {
            this.msgSuccess('关闭成功')
            this.getList()
          })
          .catch(function() {
          })
      }
    },
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listSysAudioLatest(
        this.addDateRange(this.queryParams, this.dateRange)
      ).then(response => {
        this.sysAudioList = response.data.list
        this.total = response.data.count
        this.loading = false
        // console.log(response)
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        audioId: undefined,
        audioName: undefined,
        terminal: undefined,
        password: undefined,
        audioIp: undefined,
        areaCode: undefined,
        volume: undefined,
        priority: undefined,
        audioStatus: undefined,
        audioSwitch: undefined
      }
      this.resetForm('form')
    },
    audioStatusFormat(row) {
      return this.selectDictLabel(this.audioStatusOptions, row.audioStatus)
    },
    audioSwitchFormat(row) {
      return this.selectDictLabel(this.audioSwitchOptions, row.audioSwitch)
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
      this.queryParams.pageIndex = 1
      this.queryParams.terminal = this.queryParams.audioName
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
      this.title = '添加SysAudio'
      this.isEdit = false
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.audioId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const audioId = row.audioId || this.ids
      getSysAudio(audioId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改音响'
        this.isEditSubmit = true
      })
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
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.audioId !== undefined) {
            this.isEditSubmit = true
            updateSysAudio(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addSysAudio(this.form).then(response => {
              this.isEditSubmit = true
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
      var Ids = (row.audioId && [row.audioId]) || this.ids
      this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(function() {
          return delSysAudio({ ids: Ids })
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
    // 音响总开关
    handelSwitchAllChange(index) {
      this.audioAllSwitch = index ? 1 : 0
      if (index === 1) {
        const text = index === 1 ? '开启' : '关闭'
        this.$confirm('确认要' + text + '所有音响吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(function() {
            return updateAudioSwitchAll(JSON.stringify(index))
          })
          .then(() => {
            this.msgSuccess(text + '成功')
            this.getList()
          })
          .catch(function() {
            // console.log(index, '序')
            // this.audioAllSwitch = index === 1 ? '0' : '1' || '1'

            // console.log('关闭')
            this.getList()
          })
      } else if (index === 0) {
        this.$confirm('确认要关闭所有音响吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(function() {
            return updateAudioSwitchAll(JSON.stringify(index))
          })
          .then(() => {
            this.msgSuccess('关闭成功')
            this.getList()
          })
          .catch(function() {
            // console.log(index, '序2')
            // this.audioAllSwitch = index === 1 ? '0' : '1' || '1'
          })
      }
    },
    // 同步
    handleSync() {
      syncAudio().then(res => {
        // console.log(res, 123123)
        if (res.code === 200) {
          this.msgSuccess(res.msg)
          this.getList()
        }
      })
    },
    // 音响开关
    handleSwitchChange(row, index) {
      // console.log(row, index, '状态')
      const text = row.audioSwitch === '0' ? '开启' : '关闭'
      this.$confirm(
        '确认要' + text + '"' + row.audioName + '"音响吗?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }
      )
        .then(function() {
          row.audioSwitch = String(index)
          return updateAudioSwitch(row)
        })
        .then(() => {
          this.msgSuccess(text + '成功')
          this.getList()
        })
        .catch(function() {
          row.audioSwitch = row.audioSwitch === '1' ? '0' : '1'
          this.getList()
        })
    },
    change() {
      this.isEditSubmit = false
    }
  }
}
</script>
<style lang="scss" scoped>
  .bc1{
    color: #fff !important;
    background-color: #654EF4 !important;
  }
  .bc2{
    color: #654ef4 !important;
    background-color: #fff !important;
  }
.seek-14 {
  display: inline-block;
  position: absolute;
  top: 3px;
  left: 0px;
  cursor: pointer;
  margin-left: 30px;
  width: 85px;
  height: 32px;
  line-height: 32px;
  background: linear-gradient(to bottom, #a388ff, #654ef4);
  text-align: center;
  vertical-align: middle;
  color: #fff;
  font-size: 16px;
  border-radius: 4px;
  span {
    vertical-align: 3px;
    margin-left: 10px;
  }
}
.my-switch {
  position: absolute;
  top: 0;
  left: 800px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90px;
  height: 40px;
  border-radius: 4px;
  line-height: 40px;
  margin: 0 auto;
  cursor: pointer;
  margin: auto;
  background-color: #f6f4fb;
  color: #654ef4;
  .item {
    width: 40px;
    height: 30px;
    line-height: 30px;
    border-radius: 4px;
    color: #c3c1c7;
    // background: linear-gradient(to bottom, #a388ff, #654ef4);
    // background: linear-gradient(to bottom, #a388ff, #654ef4);
    // background-color: #c3c1c7;

    text-align: center;
  }
  .ac {
    width: 40px;
    height: 30px;
    line-height: 30px;
    border-radius: 4px;
    color: #654ef4;
    // background-color: #fff;
    text-align: center;
  }
  .bc {
    width: 40px;
    height: 30px;
    line-height: 30px;
    border-radius: 4px;
    color: #654ef4;
    // background-color: #fff;
    text-align: center;
  }
}
.my-switch-1 {
  position: absolute;
  top: 7px;
  left: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90px;
  height: 40px;
  border-radius: 4px;
  line-height: 40px;
  margin: 0 auto;
  cursor: pointer;
  margin: auto;
  background-color: #f6f4fb;
  color: #654ef4;
  .item {
    width: 40px;
    height: 30px;
    line-height: 30px;
    border-radius: 4px;
    color: #c3c1c7;
    // background: linear-gradient(to bottom, #a388ff, #654ef4);
    // background: linear-gradient(to bottom, #a388ff, #654ef4);
    // background-color: #c3c1c7;

    text-align: center;
  }
  .ac {
    width: 40px;
    height: 30px;
    line-height: 30px;
    border-radius: 4px;
    color: #654ef4;
    // background-color: #fff;
    text-align: center;
  }
  .bc {
    width: 40px;
    height: 30px;
    line-height: 30px;
    border-radius: 4px;
    color: #654ef4;
    // background-color: #fff;
    text-align: center;
  }
}
.edit1 {
  // width: 50px;
  // text-align: center;
  .el-button {
    padding: 10px 30px;
    color: #fff;
    background: linear-gradient(to bottom, #a388ff, #654ef4);
  }
}

//修改音箱样式
.editSpeaker {
  .el-dialog {
    border-radius: 8px;
  }
  .el-dialog__header {
    text-align: center;
    line-height: 40px;
    .el-dialog__title {
      font-size: 24px;
      color: #7558f4;
      font-weight: 700;
    }
  }
}
//终端号样式
.Terminal {
  .el-form-item__label {
    color: #c3c1c7;
  }
}
//修改音箱按钮样式
.dialog-footer-2 {
  display: flex;
  justify-content: center;
  // text-align: center;
  margin: 0 20px;
  .el-button {
    padding: 10px 40px;
    margin: 0 30px;
  }
}
//统一音箱样式
.allSpeakers {
  position: absolute;
  left: 1000px;
  top: 0;
  .el-button--primary.is-plain {
    border-radius: 4px;
    font-size: 12px;
    background: linear-gradient(to bottom, #a388ff, #654ef4);
    color: #fff;
  }
}

.el-message-box__status.el-icon-warning {
  color: transparent;
}

//警告弹窗样式
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

  .el-message-box__header {
    text-align: center;

    .el-message-box__title {
      color: #7558f4;
      font-size: 24px;
      line-height: 70px;
    }
  }
}

.el-table .fixed-width .el-button--mini {
  padding: none;
}
</style>
