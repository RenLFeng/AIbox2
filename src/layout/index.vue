<template>
  <div
    id="main-box"
    :class="classObj"
    class="app-wrapper"
    :style="{ '--current-color': $store.state.settings.theme }"
  >
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <sidebar
      class="sidebar-container"
      :style="{
        backgroundColor:
          $store.state.settings.themeStyle === 'dark'
            ? variables.menuBg
            : variables.menuLightBg
      }"
    />
    <div :class="{ hasTagsView: needTagsView }" class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <right-panel v-if="showSettings && showCol">
        <settings />
      </right-panel>
    </div>

    <!-- 报警弹窗 -->
    <el-dialog
      class="emergency"
      :title="alarmBriefTitle"
      :visible.sync="alarmBriefOuterVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      width="500px"
      :show-close="true"
      center
      @close="closeBriefDialog"
    >
      <el-row>
        <el-col>
          <el-form
            ref="briefForm"
            :model="briefForm"
            label-width="120px"
            label-position="left"
          >
            <el-divider
              content-position="left"
            ><i class="el-icon-picture" />抓拍图片</el-divider>
            <my-image height="300px" :src="briefForm.imgFilePath" />
            <el-divider
              content-position="left"
            ><i class="el-icon-warning" />告警信息</el-divider>
            <el-form-item>
              <span
                slot="label"
                class="formLabel"
              ><span style="color: #f56c6c; font-size: 14px"> * </span>告警类型:</span>
              <span>{{ briefForm.alarmName }}</span>
            </el-form-item>
            <el-form-item>
              <span
                slot="label"
                class="formLabel"
              ><span style="color: #f56c6c; font-size: 14px"> * </span>告警摄像头：</span>
              <span>{{ briefForm.camName }}</span>
            </el-form-item>
            <el-form-item>
              <span
                slot="label"
                class="formLabel"
              ><span style="color: #f56c6c; font-size: 14px"> * </span>告警时间：</span>
              <span>{{ parseTime(briefForm.createdAt, "{y}-{m}-{d}") }}
                {{ parseTime(briefForm.createdAt, "{h}:{i}:{s}") }}</span>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <!-- 详情弹窗 -->
      <el-dialog
        class="globalWarning"
        :title="alarmDetailsTitle"
        :close-on-click-modal="false"
        :visible.sync="alarmDetailsInnerVisible"
        width="70%"
        append-to-body
        :close="closeDetailsInnerVisible"
      >
        <el-row :gutter="24">
          <el-col :span="18">
            <div v-if="detailForm.videoFilePath">
              <el-divider
                content-position="left"
              ><i class="el-icon-video-camera-solid" />告警视频</el-divider>
              <video
                width="100%"
                height="100%"
                :src="detailForm.videoFilePath"
                controls
                loop
                autoplay
              />
              <!-- <vue-core-video-player
                :src="detailForm.videoFilePath"
                :muted="true"
                :autoplay="false"
                :title="detailForm.alarmName"
                :loop="true"
                controls="auto"
              /> -->
            </div>
            <div v-else>
              <el-divider
                content-position="left"
              ><i class="el-icon-picture" />抓拍图片</el-divider>
              <my-image height="500px" :src="detailForm.imgFilePath" />
            </div>
          </el-col>
          <el-col :span="6">
            <el-form
              ref="detailForm"
              :model="detailForm"
              label-width="120px"
              label-position="left"
            >
              <el-divider
                content-position="left"
              ><i class="el-icon-picture" />抓拍图片</el-divider>
              <my-image height="170px" :src="detailForm.imgFilePath" />
              <el-divider
                content-position="left"
              ><i class="el-icon-info" />告警详情</el-divider>
              <el-form-item>
                <span
                  slot="label"
                  class="formLabel"
                ><span style="color: #f56c6c; font-size: 14px"> * </span>告警日期：</span>
                <span>{{
                  parseTime(detailForm.createdAt, "{y}-{m}-{d}")
                }}</span>
              </el-form-item>
              <el-form-item>
                <span
                  slot="label"
                  class="formLabel"
                ><span style="color: #f56c6c; font-size: 14px"> * </span>告警时间：</span>
                <span>{{
                  parseTime(detailForm.createdAt, "{h}:{i}:{s}")
                }}</span>
              </el-form-item>
              <el-form-item>
                <span
                  slot="label"
                  class="formLabel"
                ><span style="color: #f56c6c; font-size: 14px"> * </span>告警摄像头：</span>
                <span>{{ detailForm.camName }}</span>
              </el-form-item>
              <el-form-item>
                <span
                  slot="label"
                  class="formLabel"
                ><span style="color: #f56c6c; font-size: 14px"> * </span>告警盒子：</span>
                <span>{{ detailForm.boxName }}</span>
              </el-form-item>
              <el-form-item>
                <span
                  slot="label"
                  class="formLabel"
                ><span style="color: #f56c6c; font-size: 14px"> * </span>告警类型：</span>
                <span>{{ detailForm.alarmName }}</span>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button
            type="danger"
            plain
            @click="closeDetailsInnerVisible"
          >关 闭</el-button>
        </div>
      </el-dialog>
      <div slot="footer" class="emergencyDetails">
        <el-button type="primary" @click="lookDetail">查看详情</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import RightPanel from "@/components/RightPanel";
import { AppMain, Navbar, Settings, Sidebar, TagsView } from "./components";
import ResizeMixin from "./mixin/ResizeHandler";
import { mapState } from "vuex";
import variables from "@/styles/variables.scss";
import { unWsLogout } from "@/api/ws";
export default {
  name: "Layout",
  components: {
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView
  },
  mixins: [ResizeMixin],
  data() {
    return {
      // 用户权限控制列显示
      showCol: true,
      id: undefined,
      group: undefined,
      alarmDialog: {},
      // 弹出层标题
      alarmBriefTitle: "告警",
      alarmDetailsTitle: "告警详情",
      alarmDetailsInnerVisible: false,
      alarmBriefOuterVisible: false,
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
        autoplay: true, // 如果true,浏览器准备好时开始回放。
        controls: true, // 控制条
        preload: "auto", // 视频预加载
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: "video/mp4",
            // src:
            //   'http://192.168.124.47:8880/static/alarm-video/359b033b5bb5c9ea5c0e3c23d139b6003bf3b374.mp4'
            src: ""
          }
        ],
        poster: "", // 你的封面地址
        // width: document.documentElement.clientWidth,
        notSupportedMessage: "抱歉，此视频暂无法播放，请稍后再试", // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true, // 当前时间和持续时间的分隔符
          durationDisplay: true, // 显示持续时间
          remainingTimeDisplay: false, // 是否显示剩余时间功能
          fullscreenToggle: true // 是否显示全屏按钮
        }
      },
      // 详情数据
      detailForm: {
        alarmId: undefined,
        prodId: undefined,
        boxId: undefined,
        camId: undefined,
        aiId: undefined,
        eventId: undefined,
        boxName: undefined,
        camName: undefined,
        alarmName: undefined,
        videoFilePath: undefined,
        imgFilePath: undefined,
        isConfirm: undefined,
        isPush: undefined,
        alarmDescribe: undefined,
        alarmData: undefined
      },

      // 简报数据
      briefForm: {
        alarmId: undefined,
        prodId: undefined,
        boxId: undefined,
        camId: undefined,
        aiId: undefined,
        eventId: undefined,
        boxName: undefined,
        camName: undefined,
        alarmName: undefined,
        videoFilePath: undefined,
        imgFilePath: undefined,
        isConfirm: undefined,
        isPush: undefined,
        alarmDescribe: undefined,
        alarmData: undefined
      }
    };
  },
  computed: {
    ...mapState({
      sidebar: (state) => state.app.sidebar,
      device: (state) => state.app.device,
      showSettings: (state) => state.settings.showSettings,
      needTagsView: (state) => state.settings.tagsView,
      fixedHeader: (state) => state.settings.fixedHeader
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile"
      };
    },
    variables() {
      return variables;
    }
  },
  created() {
    this.id = this.guid();
    this.group = "alarmDialog";
    this.initWebSocket();
    // 权限控制
    // console.info("user", this.$store.state.user);
    // const roles = this.$store.state.user.roles
    if (this.$store.state.user.roles.indexOf("normal") !== -1) {
      // 修改对应角色名，控制权限
      this.showCol = false;
    }
  },
  beforeDestroy() {
    console.log("layout断开websocket连接");
    this.websock.close(); // 离开路由之后断开websocket连接
    unWsLogout(this.id, this.group).then((response) => {
      // console.log(response.data)
    });
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    },
    closeBriefDialog() {
      // console.log('关闭告警了===========')
      this.alarmBriefOuterVisible = false;
      this.resetBriefForm();
    },
    closeDetailsInnerVisible() {
      this.alarmDetailsInnerVisible = false;
      this.alarmBriefOuterVisible = false;
      this.resetDetailForm();
    },
    // 表单重置
    resetBriefForm() {
      this.briefForm = {
        alarmId: undefined,
        prodId: undefined,
        boxId: undefined,
        camId: undefined,
        aiId: undefined,
        boxName: undefined,
        camName: undefined,
        alarmName: undefined,
        videoFilePath: undefined,
        imgFilePath: undefined,
        isConfirm: undefined,
        isPush: undefined,
        alarmDescribe: undefined,
        alarmData: undefined
      };
      this.resetForm("briefForm");
    },
    // 表单重置
    resetDetailForm() {
      this.detailForm = {
        alarmId: undefined,
        prodId: undefined,
        boxId: undefined,
        camId: undefined,
        aiId: undefined,
        boxName: undefined,
        camName: undefined,
        alarmName: undefined,
        videoFilePath: undefined,
        imgFilePath: undefined,
        isConfirm: undefined,
        isPush: undefined,
        alarmDescribe: undefined,
        alarmData: undefined
      };
      this.resetForm("detailForm");
    },
    lookDetail() {
      this.alarmDetailsInnerVisible = true;
    },
    initWebSocket() {
      // 初始化weosocket
      // console.log('全局AlarmWebsocket初始化websocket')
      // console.log(this.$store.state.system.info.sys_app_ip)
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
      console.log("全局AlarmWebsocket连接打开");
      //   const actions = { 'test': '12345' }
      //   this.websocketsend(JSON.stringify(actions))
    },
    websocketonerror() {
      // 连接建立失败重连
      this.initWebSocket();
    },
    websocketonmessage(e) {
      // 数据接收
      // console.log(e)
      console.log("---------------全局Socket消息通知---------------");
      // console.log('1111全局Socket消息通知' + JSON.stringify(e.data))

      // //发现消息进入    开始处理前端触发逻辑
      const jsonData = JSON.parse(e.data);
      console.log("Socket data", jsonData);
      this.alarmBriefOuterVisible = true;
      this.briefForm = jsonData;
      this.detailForm = jsonData;
      this.alarmBriefTitle = jsonData.alarmDescribe;
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
      console.log("断开连接", e);
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

<style lang="scss">
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}

.formLabel {
  font-size: 15px;
  color: #333333;
  font-family: "Microsoft YaHei", "微软雅黑 Light", "微软雅黑", sans-serif;
  font-weight: bold;
  line-height: 30px;
}
.globalWarning {
  .el-dialog {
    padding: 20px;
    border-radius: 8px;
  }
  .el-dialog__header {
    .el-dialog__title {
      font-size: 24px;
      font-weight: 700;
      color: #7558f4;
    }
  }
}
.emergency {
  .el-dialog {
    padding: 20px;
    border-radius: 8px;
  }
  .el-dialog__header {
    .el-dialog__title {
      font-size: 24px;
      font-weight: 700;
      color: #7558f4;
    }
  }
  .emergencyDetails {
    .el-button--primary {
      padding: 10px 30px;
      background: linear-gradient(to bottom, #a388ff, #654ef4);
    }
  }
}
.img-sl img {
  height: auto;
  max-height: 170px;
  object-fit: contain;
}

.img-big img {
  height: 300px;
  width: 100%;
}

.bg-img img {
  height: 530px;
  width: 100%;
}
</style>
