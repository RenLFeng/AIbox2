<template>
  <BasicLayout>
    <template #wrapper>
      <div class="main-box">
        <el-card class="box-card">
          <el-row :gutter="10" class="mb8">
            <el-col :span="6">
              <span style="font-weight: bold"> 摄像头名称：</span>
              <el-popover placement="bottom-end" width="280" trigger="hover">
                <el-button
                  v-if="cameraForm.camOnlineStatus === '1'"
                  slot="reference"
                  type="success"
                  round
                >{{ cameraForm.camName }}</el-button>
                <el-button v-else slot="reference" type="danger">{{
                  cameraForm.camName
                }}</el-button>
                <p>
                  摄像头名称:
                  <el-tag
                    v-if="cameraForm.camOnlineStatus === '0'"
                    type="danger"
                    effect="dark"
                  >{{ cameraForm.camName }}</el-tag>
                  <el-tag
                    v-if="cameraForm.camOnlineStatus === '1'"
                    type="success"
                    effect="dark"
                  >{{ cameraForm.camName }}</el-tag>
                </p>
                <p>
                  厂商:
                  <el-tag
                    v-if="cameraForm.camManufacturer === '0'"
                    type="info"
                    effect="plain"
                  >海康</el-tag>
                  <el-tag
                    v-if="cameraForm.camManufacturer === '1'"
                    type="info"
                    effect="plain"
                  >大华</el-tag>
                </p>
                <p>
                  型号:
                  <el-tag v-if="cameraForm.camModel !== ''" type="info">{{
                    cameraForm.camModel
                  }}</el-tag>
                  <el-tag v-else type="info">暂无</el-tag>
                </p>
                <p>
                  外观类型:
                  <el-tag
                    v-if="cameraForm.camType === '0'"
                    type="info"
                    effect="plain"
                  >枪机</el-tag>
                  <el-tag
                    v-if="cameraForm.camType === '1'"
                    type="info"
                  >球机</el-tag>
                  <el-tag
                    v-if="cameraForm.camType === '2'"
                    type="info"
                  >半球机</el-tag>
                </p>
                <p>
                  传输类型:
                  <el-tag
                    v-if="cameraForm.camForm === '0'"
                    type="info"
                  >网络摄像头</el-tag>
                  <el-tag
                    v-if="cameraForm.camForm === '1'"
                    type="info"
                  >有线摄像头</el-tag>
                </p>
                <p>
                  IP状态:
                  <el-tag
                    v-if="cameraForm.camOnlineStatus === '0'"
                    type="danger"
                  >离线</el-tag>
                  <el-tag
                    v-if="cameraForm.camOnlineStatus === '1'"
                    type="success"
                  >在线</el-tag>
                </p>
              </el-popover>
            </el-col>
            <el-col :span="6" :offset="12">
              <!-- <el-button
              v-permisaction="['admin:sysAudio:add']"
              type="primary"
              icon="el-icon-circle-plus"
              size="small"
              @click="handleRelateAudio"
              >关联音响
            </el-button> -->

              <div
                v-permisaction="['admin:sysAudio:add']"
                class="associated"
                @click="handleRelateAudio"
              >
                <svg-icon icon-class="newfolding" style="vertical-align: 0px" />
                <span> 关联音响</span>
              </div>
            </el-col>
          </el-row>
          <el-table
            v-loading="loading"
            :data="sysAudioList"
            @selection-change="handleSelectionChange"
          >
            <!--          <el-table-column-->
            <!--            v-if="showCol"-->
            <!--            label="编号"-->
            <!--            align="center"-->
            <!--            prop="audioId"-->
            <!--            sortable="custom"-->
            <!--            width="80"-->
            <!--          />-->
            <el-table-column
              label="音响名称"
              align="center"
              prop="audioName"
              :show-overflow-tooltip="true"
            />
            <!-- <el-table-column -->
            <!-- v-if="showCol"-->
            <!--            label="终端号"-->
            <!--            align="center"-->
            <!--            prop="terminal"-->
            <!--            sortable="custom"-->
            <!--            width="100"-->
            <!--          />-->
            <!--          <el-table-column-->
            <!--            v-if="showCol"-->
            <!--            label="音响IP"-->
            <!--            align="center"-->
            <!--            prop="audioIp"-->
            <!--            width="200"-->
            <!--          />-->
            <!--          <el-table-column-->
            <!--            v-if="showCol"-->
            <!--            label="音量"-->
            <!--            align="center"-->
            <!--            prop="volume"-->
            <!--            width="80"-->
            <!--          /> -->
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
              label="操作"
              align="center"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <div class="remove">
                  <el-button
                    v-permisaction="['admin:sysAudio:remove']"
                    size="mini"
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

          <!-- 关联音响对话框 -->
          <el-dialog
            :title="relateAudioTitle"
            :visible.sync="relateAudioOpen"
            width="400px"
          >
            <div style="margin: 15px 0" />
            <el-form
              ref="relateAudioForm"
              :model="relateAudioForm"
              :rules="relateAudioRules"
              label-width="110px"
            >
              <el-checkbox-group
                v-model="relateAudioForm.sysAudioIds"
                @change="handleCheckedAudioDatesChange"
              >
                <el-checkbox
                  v-for="(item, index) in audioOptions"
                  :key="index"
                  class="el-checkbox-width-audio"
                  :label="item.audioId"
                  :disabled="sysAudioIdsOldU.includes(item.audioId)"
                >
                  {{ item.audioName }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form>
            <div slot="footer" class="speakersDialog-footer">
              <el-button @click="cancelRelateAudio">取 消</el-button>
              <el-button
                type="primary"
                style="background: linear-gradient(to bottom, #a388ff, #654ef4)"
                @click="submitFormRelateAudio"
              >确 定</el-button>
            </div>
          </el-dialog>
        </el-card>
      </div>
    </template>
  </BasicLayout>
</template>

<script>
import { getSysCamera } from "@/api/box/sys-camera";
import {
  delRelateAudio,
  getAllAudioIdName,
  listRelateCamAudio,
  updateRelateAudio
} from "@/api/box/sys-audio";

export default {
  name: "SysAudioConfigManage",
  components: {},
  data() {
    return {
      // 用户权限控制列显示
      showCol: true,
      submitFormRelateAudioSwitch: false,
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
      title: "",
      relateAudioTitle: "",
      // 是否显示弹出层
      relateAudioOpen: false,
      isEdit: false,
      isEditSubmitForm: false,
      // 类型数据字典
      typeOptions: [],
      sysAudioList: [],

      // 关系表类型
      audioStatusOptions: [],
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        cId: this.$route.params.camId
      },
      // 表单参数
      form: {},
      // 表单参数
      relateAudioForm: {
        sysAudioIds: []
      },
      relateAudioFormAudioLength: 0,
      sysAudioIdsOldU: [],
      audioOptions: [],
      aiOptionIds: [],
      // 表单参数
      cameraForm: {},
      // 表单参数
      aiForm: {},
      // 表单校验
      rules: {},
      // 关联算法对话框表单校验
      relateAudioRules: {},
      checkAll: false
    };
  },
  created() {
    const camIdParam = this.$route.params && this.$route.params.camId;
    this.getList();
    this.getCamInfo(camIdParam);
    this.getAudioTreeSelect();
    // 权限控制
    const roles = this.$store.state.user.roles;
    if (roles.indexOf("normal") !== -1) {
      // 修改对应角色名，控制权限
      this.showCol = false;
    }
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true;
      listRelateCamAudio(
        this.addDateRange(this.queryParams, this.dateRange)
      ).then((response) => {
        // console.info(response.data)
        this.sysAudioList = response.data.list;
        this.total = response.data.count;
        this.loading = false;
      });
    },
    relateAudioReset() {
      this.relateAudioForm = {
        camId: undefined,
        sysAudioIds: []
      };
      this.resetForm("relateAudioForm");
    },
    getImgList: function () {
      this.form[this.fileIndex] =
        this.$refs["fileChoose"].resultList[0].fullUrl;
    },
    fileClose: function () {
      this.fileOpen = false;
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 移除按钮操作 */
    handleDelete(row) {
      const camId = this.$route.params && this.$route.params.camId;
      var audioName = row.audioName;
      this.$confirm('是否确认移除"' + audioName + '"音响?', "移除音响？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(function () {
          return delRelateAudio(camId, row.audioId);
        })
        .then((response) => {
          if (response.code === 200) {
            this.msgSuccess(response.msg);
            this.getList();
          } else {
            this.msgError(response.msg);
          }
        })
        .catch(function () {});
    },
    /** 修改按钮操作 */
    getCamInfo(camIdParam) {
      // const camId = this.$route.params.camId
      // console.info("ID值"+camIdParam)
      getSysCamera(camIdParam).then((response) => {
        this.cameraForm = response.data;
      });
    },
    audioStatusFormat(row) {
      return this.selectDictLabel(this.audioStatusOptions, row.audioStatus);
    },

    /** 关联按钮操作 查询 */
    handleRelateAudio() {
      const camId = this.$route.params && this.$route.params.camId;
      getSysCamera(camId).then((response) => {
        // console.info('1111' + JSON.stringify(response.data))
        this.relateAudioForm = response.data;
        this.sysAudioIdsOldU = response.data.sysAudioIds;
        this.relateAudioFormAudioLength = response.data.sysAudioIds.length;
        this.relateAudioOpen = true;
        this.relateAudioTitle = "关联音响";
        this.submitFormRelateAudioSwitch = true;
      });
    },
    // 取消按钮
    cancelRelateAudio() {
      this.relateAudioOpen = false;
      this.getList();
      // this.relateAiReset()
    },
    /** 关联音响提交按钮 */
    submitFormRelateAudio: function () {
      if (this.submitFormRelateAudioSwitch) {
        this.$refs["relateAudioForm"].validate((valid) => {
          if (valid) {
            updateRelateAudio(this.relateAudioForm).then((response) => {
              if (response.code === 200) {
                this.msgSuccess(response.msg);
                this.relateAudioOpen = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        });
      } else {
        this.msgSuccess("关联音响未发生改变");
        this.relateAudioOpen = false;
      }
    },
    handleCheckedAudioDatesChange(value) {
      // console.log('handleCheckedAudioDatesChange', value)
      // console.log('this.relateAudioFormAudioLength', this.relateAudioFormAudioLength)
      const checkedCount = value.length;
      this.submitFormRelateAudioSwitch =
        checkedCount !== this.relateAudioFormAudioLength;
    },
    /** 查询算法树结构 */
    getAudioTreeSelect() {
      const deptId = this.$store.state.user.deptId;
      getAllAudioIdName(deptId).then((response) => {
        this.audioOptions = response.data;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-dialog {
  border-radius: 8px;

  .el-dialog__header {
    text-align: center;
    .el-dialog__title {
      text-align: center;
      color: #7558f4;
      font-size: 24px;
      font-weight: 700;
    }
  }
}
.speakersDialog-footer {
  text-align: center;
  .el-button--medium {
    padding: 10px 30px;
    margin: 0 30px;
  }
}
.el-checkbox-width-audio {
  width: 100px;
  height: 25px;
}
//摄像头名称右边按钮样式
.el-button--success {
  color: #7558f4;
  background-color: #fff;
  border: none;
  font-weight: 700;
}
.el-button--success:hover,
.el-button--success:focus {
  color: #7558f4;
  background-color: transparent;
}
.el-button--danger {
  color: #7558f4;
  background-color: #fff;
  border: none;
  font-weight: 700;
}
.el-col-6 {
  color: #7558f4;
}
.el-button--danger:hover,
.el-button--danger:focus {
  color: #7558f4;
  background-color: transparent;
}
.el-tag--dark.el-tag--danger {
  color: #7558f4;
  background-color: transparent;
  border: none;
}
.el-tag.el-tag--danger {
  background-color: #ffeded;
  border: none;
}

.el-tag.el-tag--success {
  background-color: transparent;
  border: none;
  color: #000;
}
.remove {
  .el-table,
  .el-button--mini {
    color: #fff;
    padding: 10px 20px !important;
    background-color: #f44040;
  }
}
.associated {
  cursor: pointer;
  margin-left: 20px;
  span {
    vertical-align: 3px;
    margin-left: 10px;
  }
  width: 165px;
  height: 40px;
  line-height: 40px;
  background: linear-gradient(to bottom, #a388ff, #654ef4);
  text-align: center;
  vertical-align: middle;
  color: #fff;
  font-size: 16px;
  border-radius: 4px;
}
</style>
