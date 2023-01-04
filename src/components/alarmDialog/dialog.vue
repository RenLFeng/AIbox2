<template>
  <div>
    <!-- 报警弹窗 -->
    <el-dialog
      class="emergency"
      :title="title"
      :visible.sync="open"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      :width="`${globalDialog ? '500px' : '70%'}`"
      :show-close="true"
      :center="dialogCenter"
      :before-close="beforeClose"
      @close="close"
    >
      <el-row :gutter="24">
        <el-col
          v-if="!globalDialog"
          :xl="18"
          :lg="18"
          :md="18"
          :sm="24"
          :xs="24"
        >
          <div>
            <el-divider content-position="left">抓拍图片</el-divider>
            <my-image
              :src="dialogData.imgFilePath"
              :preview-list="dialogData.imgFilePathList"
              height="530px"
            />
          </div>
        </el-col>
        <el-col
          :xl="globalDialog ? 24 : 6"
          :lg="globalDialog ? 24 : 6"
          :md="globalDialog ? 24 : 6"
          :sm="24"
          :xs="24"
        >
          <el-form
            ref="briefForm"
            :model="dialogData"
            label-position="left"
            label-width="105px"
            :class="{ rightform: !globalDialog }"
          >
            <div v-if="globalDialog">
              <el-divider
                content-position="left"
              ><i class="el-icon-picture" />抓拍图片</el-divider>
              <my-image
                :height="`300px`"
                :src="dialogData.imgFilePath"
                :preview-list="!globalDialog ? dialogData.imgFilePathList : []"
              />
            </div>
            <el-divider
              content-position="left"
            ><i class="el-icon-warning" />告警详情</el-divider>
            <el-form-item>
              <span slot="label" class="formLabel">告警类型:</span>
              <span>{{ dialogData.alarmName }}</span>
            </el-form-item>
            <el-form-item v-if="!globalDialog">
              <span slot="label" class="formLabel">告警日期：</span>
              <span>{{ parseTime(dialogData.createdAt, "{y}-{m}-{d}") }}</span>
            </el-form-item>
            <el-form-item v-if="!globalDialog">
              <span slot="label" class="formLabel">告警盒子：</span>
              <span>{{ dialogData.boxName }}</span>
            </el-form-item>

            <el-form-item>
              <span slot="label" class="formLabel">告警摄像头：</span>
              <span>{{ dialogData.camName }}</span>
            </el-form-item>
            <el-form-item>
              <span slot="label" class="formLabel">告警时间：</span>
              <span>{{ parseTime(dialogData.createdAt, "{y}-{m}-{d}") }}
                {{ parseTime(dialogData.createdAt, "{h}:{i}:{s}") }}</span>
            </el-form-item>
            <el-form-item v-if="!globalDialog">
              <span slot="label" class="formLabel">告警视频：</span>
              <el-button
                type="text"
                size="small"
                @click="dialogVisibleVideo = true"
              >查看视频
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="emergencyDetails">
        <slot name="footer" />
      </div>
    </el-dialog>
    <el-dialog title="" :visible.sync="dialogVisibleVideo" width="90%">
      <video
        width="100%"
        height="100%"
        :src="dialogData.videoFilePath"
        controls
        loop
        autoplay
      />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  props: {
    globalDialog: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ""
    },
    open: {
      type: Boolean,
      default: false
    },
    showCol: {
      type: Boolean,
      default: false
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    beforeClose: {
      type: Function,
      default() {
        return () => {};
      }
    },
    close: {
      type: Function,
      default() {
        return () => {};
      }
    },
    form: {
      type: Object,
      default() {
        return {};
      }
    },
    dialogCenter: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisibleVideo: false,
      dialogData: {}
    };
  },
  watch: {
    form: {
      handler(newValue, oldValue) {
        this.dialogData = newValue;
      },
      deep: true
    }
  },
  created() {},
  activated() {},
  mounted() {},
  deactivated() {},
  beforeDestroy() {},
  methods: {}
};
</script>
<style>
@media only screen and (max-width: 1400px) {
  .emergency .rightform .el-form-item {
    display: flex;
    flex-direction: column;
  }
  .emergency .rightform .el-form-item .el-form-item__content {
    margin-left: 0 !important;
  }
}
@media only screen and (max-width: 992px) {
  .emergency .rightform .el-form-item {
    display: inherit;
  }
  .emergency .rightform .el-form-item .el-form-item__content {
    margin-left: 120px !important;
  }
}
</style>
