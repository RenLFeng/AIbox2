<template>
  <div
    id="DubVideoWindow"
    class="dub-video-window"
    :style="{ height: height + 'px', width: width + 'px' }"
  >
    <div

      class="dub-video-window-screen"
      :style="{ height: screenHeight + 'px',width: width + 'px' }"
    >
      <dub-video-screen
        v-for="i in screenTotal"
        :id="i"
        ref="refVideoScreen"
        :key="i"
        :layout="currentLayout"
        :gutter="gutter"
        :class="{ is_active: currentIndex === i }"
        :base-url="baseUrl"
        @click="onSelect"
        @stop-preview="onStopPreview"
        @ptz="onPtz"
        @smoke-alarm="onSmokeAlarm"
        @playCidsDiff="playCidsDiff"
        @start-preview="onStartPreview"
      />
      <!-- :data-json="dataJson" -->
      <!-- @start-preview="_startPreview" -->
    </div>
    <div
      class="dub-video-window-toolbar"
      :style="{ height: toolbarHeight + 'px' }"
    >
      <span
        class="dub-video-window-toolbar-btn"
        title="全屏"
        style="float:left;margin-left:10px;"
        @click="fullScreen()"
      >
        <svg-icon icon-class="full-screen" class-name="full-screen" />
      </span>
      <span
        class="dub-video-window-toolbar-btn"
        :class="{ 'active-layout': currentLayout === '1' }"
        title="一分屏"
        @click="setLayout(1)"
      >
        <svg-icon icon-class="one-split" class-name="one-split" />
      </span>
      <span
        class="dub-video-window-toolbar-btn"
        :class="{ 'active-layout': currentLayout === '2' }"
        title="四分屏"
        @click="setLayout(2)"
      >
        <svg-icon icon-class="four-split" class-name="four-split" />
      </span>
      <!-- <span
        class="dub-video-window-toolbar-btn"
        :class="{ 'active-layout': currentLayout === '3' }"
        title="九分屏"
        @click="setLayout(3)"
      >
        <svg-icon icon-class="nine-split" class-name="nine-split" />
      </span> -->
      <!-- <span
        class="dub-video-window-toolbar-btn"
        :class="{ 'active-layout': currentLayout === '4' }"
        title="十六分屏"
        @click="setLayout(4)"
      >
        <svg-icon icon-class="sixteen-split" class-name="sixteen-split" />
      </span> -->
    </div>
  </div>
</template>

<script>
import screenfull from 'screenfull'
import DubVideoScreen from '@/views/box/sys-screen/components/dubVideoScreen.vue'
// import { closeWebsocket, sendWebsocket } from '@/utils/websocket'
export default {
  name: 'DubVideoWindow',
  components: {
    DubVideoScreen
  },
  props: {
    baseUrl: {
      type: String,
      default: ''
    },
    layout: {
      type: Number,
      default: 2
    },
    gutter: {
      type: Number,
      default: 4
    },
    id: {
      type: Number,
      default: 1

    },
    url: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      width: 500,
      height: 400,
      screenHeight: 355,
      toolbarHeight: 45,
      screenTotal: 1,
      screenSize: [0, 0],
      currentIndex: 0, // 当前选中窗口
      currentLayout: 0,
      playCids: [],
      dataJson: null // 算法数据
    }
  },
  created() {
    // console.log(this.baseUrl, ' this.baseUrl window')

    // 发起 wss
    // this.sendWss()
  },
  // 离开组件关闭 wss
  beforeDestroy() {
    // closeWebsocket()
  },
  mounted() {
    // console.log('7777777777777777777')
    this.currentLayout = this.layout
    this.setLayout(1, true)
    // this.onSelect(1);
  },
  methods: {
    // 设置播放区域宽高
    resize(size) {
      this.width = size[0]
      this.height = size[1]
      this.screenHeight = this.height - this.toolbarHeight

      var offset = (this.currentLayout + 1) * this.gutter
      var itemWidth = (this.width - offset) / this.currentLayout
      var itemHeight = (this.screenHeight - offset) / this.currentLayout

      var y = this.gutter
      var x = this.gutter
      for (var i = 0; i < this.screenTotal; i++) {
        this.$refs.refVideoScreen[i].setRect([x, y, itemWidth, itemHeight])
        x = x + itemWidth + this.gutter
        if ((i + 1) % this.currentLayout === 0) {
          x = this.gutter
          y = y + itemHeight + this.gutter
        }
      }
    },
    // 点击全屏
    fullScreen() {
      const el = document.getElementById('previewWindow')
      if (!screenfull.enabled) {
        this.$message({
          message: 'you browser can not work',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle(el)
    },
    // 设置分屏
    setLayout(layout, bol) {
      // 切换分屏的时候全部stop
      let isChangeBol = false // 是否需要关闭在播放的窗口
      if (this.currentLayout === 1 && layout === 2) {
        // console.log('1-2')
        isChangeBol = false
      } else if (this.currentLayout === 2 && layout === 1) {
        // console.log('2-1')
        isChangeBol = false
      } else if (this.currentLayout === 3 && layout === 4) {
        // console.log('3-4')
        isChangeBol = false
      } else if (this.currentLayout === 4 && layout === 3) {
        // console.log('4-3')
        isChangeBol = false
      } else {
        isChangeBol = true
      }
      if (isChangeBol && !bol) {
        this.stopWindowId()
        this.onSelect(1)
      }
      if (layout > 0) {
        var that = this
        this.currentIndex = 1
        this.currentLayout = layout
        this.screenTotal = layout * layout
        this.$nextTick(function() {
          that.resize([that.width, that.height])
        })
        this.$emit('layout', layout)
      }
    },
    // 选择播放窗口
    onSelect(index) {
      this.currentIndex = index
      // console.log('选中', index)
      this.$emit('select', index)
    },

    getScreen(index) {
      return this.$refs.refVideoScreen[index - 1]
    },
    // 云台控制
    onPtz(id, command) {
      this.$emit('ptz', id, command)
    },
    stopWindowId() {
      for (var i = 0; i < this.screenTotal; i++) {
        const it = this.$refs.refVideoScreen[i]
        it.stopWindowId()
      }
      this.$nextTick(() => {
        // 重新播放
        for (let i = 0; i < this.screenTotal; i++) {
          const it = this.$refs.refVideoScreen[i]
          setTimeout(() => {
            if (it.nowPlayData) {
              it.startPreview()
            }
          }, 200 * i)
        }
      })
    },
    // 选中窗口预览
    _startPreview(index, data) {
      // console.log(233333)
      var screen = this.getScreen(index)
      if (screen) {
        screen.startPreview(data)
      }
    },
    // 未选中自动预览
    _autoStartPreview(src) {
      var index = this.currentIndex
      var current = this.$refs.refVideoScreen[index - 1]
      if (current.hasPreview()) {
        for (var i = 0; i < this.screenTotal; i++) {
          var it = this.$refs.refVideoScreen[i]
          if (!it.hasPreview()) {
            index = i + 1
            break
          }
        }
      }
      this._startPreview(index, src)
    },
    // 关闭播放窗口时的回调函数 从plauCids里面去除被关闭的cid
    playCidsDiff(cid) {
      const diffCids = this.playCids.filter(item => {
        return item !== cid
      })
      // console.log(cid, 'cid')
      // let diffCids = this.playCids.filter(function(item){
      //     console.log(item);
      //     return item!=cid;
      //   }
      // )
      this.playCids = diffCids
      this.$emit('setColor', { id: cid, colorStr: '#606266' })
    },
    // 预览
    startPreview(index, data) {
      // console.log('222222222222222')
      // 如果已经有正在播放的Cid  中断
      if (
        this.playCids.some(item => {
          return item === data.cid
        })
      ) { return }

      // console.log('push : ' + data.cid)
      this.playCids.push(data.cid)
      this._startPreview(index, data)

      // 播放后自动选中下一个窗口
      let afterIndex = index
      for (var i = 0; i < this.screenTotal; i++) {
        var it = this.$refs.refVideoScreen[i]
        if (!it.hasPreview()) {
          afterIndex = i + 1
          break
        }
      }
      this.onSelect(afterIndex)
      // console.log(afterIndex, 'afterIndex')
      // if (src == undefined) {
      //   this._autoStartPreview(index)
      // } else {
      //   this._startPreview(index, src)
      // }
    },
    // 开始预览
    onStartPreview(index) {
      // console.log('onStartPreview : ' + index)
      this.$emit('start-preview', index)
    },
    // 停止预览
    onStopPreview(index) {
      this.$emit('stop-preview', index)
    },
    //
    onSmokeAlarm(id, params) {
      this.$emit('smoke-alarm', id, params)
    },
    // 开始烟火报警
    startSmokeAlarm(index) {
      if (index > 0) {
        var screen = this.getScreen(index)
        if (screen) {
          screen.startSmokeAlarm()
        }
      }
    },
    // 停止烟火报警
    stopSmokeAlarm(index) {
      if (index > 0) {
        var screen = this.getScreen(index)
        if (screen) {
          screen.stopSmokeAlarm()
        }
      }
    }

    // +

    // 发起 websocker  请求数据
    // sendWss() {
    //   // 防止用户多次连续点击发起请求，所以要先关闭上次的ws请求。
    //   // closeWebsocket()
    //   // 跟后端协商，需要什么参数数据给后台
    //   // const obj = {
    //   //   // monitorUrl: 'xxxxxxxxxxxxx',
    //   //   // tyep: "detectBoxes"
    //   // }
    //   // 发起ws请求
    //   // sendWebsocket(
    //   //   'ws://192.168.124.17:9191/algorithmResult',
    //   //   obj,
    //   //   this.wsMessage,
    //   //   this.wsError
    //   // )
    // },

    // ws连接失败，组件要执行的代码
    // wsError() {
    //   // ws 连接失败的操作
    //   console.log('error!,ws 连接失败')
    // },
    // // ws连接成功，后台返回的ws数据，组件要拿数据渲染页面等操作
    // wsMessage(data) {
    //   const dataJson = JSON.parse(data)
    //   // 这里写拿到数据后的业务代码
    //   this.dataJson = dataJson
    // }
  }
}
</script>

<style>
.dub-video-window-screen {
  position: relative;
  background: #000;
  overflow: hidden;
}
.dub-video-window-toolbar {
  background: #333333;
  text-align: right;
}

.dub-video-window-toolbar-btn {
  display: inline-block;
  padding: 0px 10px;
  height: 35px;
  line-height: 35px;
  color: #747474;
  font-size: 20px;
  text-align: center;
  margin: 3px 10px 0px 0px;
  cursor: pointer;
  border: 1px dotted #747474;
}

.active-layout {
  color: yellow !important;
  border-color: yellow !important;
}

.dub-video-window-toolbar-btn:hover {
  color: #e72528;
  border-color: #e72528;
}
</style>
