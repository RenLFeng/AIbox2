<template>
  <div
    :id="'dubVideoScreen' + id"
    v-loading="videoLoading"
    class="dub-video-screen"
    element-loading-text="加载中..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    :class="{ is_preview: isPreview, is_smoke_alarm: smokeAlarmActive }"
    v-bind="$attrs"
    :style="{
      top: top + 'px',
      left: left + 'px',
      width: width + 'px',
      height: height + 'px'
    }"
  >
    <!-- <el-input v-model="url" /> -->
    <div @click="onClick($event)">
      <video
        :id="'video' + id"
        class="dub-video-target"
        controls
        muted
        autoplay
        playsinline
        preload="none"
        style="width:100%; height:100%; object-fit: fill"
        @canplay="onPlayerCanplay($event)"
      />
      <!-- @canplay="startPlay($event)" -->

      <!-- <webRtc /> -->
      <canvas
        :id="'showCanvas' + id"
        class="show-canvas"
      >您的浏览器不支持canvas,请升级</canvas>
    </div>
    <dub-video-touch v-if="activeCursorPtz" @ptz="onPtz" />
    <div v-if="isPreview" class="dub-video-screen-close" @click="stopPreview">
      <!-- <div v-if="true" class="dub-video-screen-close" @click="stopPreview"> -->

      <span class="dub-video-screen-btn">
        <i class="el-icon-circle-close" />
      </span>
    </div>
    <!-- <div v-if="false" class="dub-video-screen-toolbar"> -->
    <!-- <div v-if="true" class="dub-video-screen-toolbar"> -->

    <!-- <span
        class="dub-video-screen-btn"
        :class="{'is_active': activeSmokeAlarm}"
        title="烟火报警开关"
        @click="onClickSmokeAlarm($event)"
      >
        <i class="el-icon-warning"></i>
      </span>-->
    <!-- <span class="dub-video-screen-btn" title="全屏" @click="fullScreen()">
        <i class="el-icon-full-screen" />
      </span> -->
    <!-- <span
        class="dub-video-screen-btn"
        :class="{ is_active: activeCursorPtz }"
        title="云台鼠标控制"
        @click="onClickCursorPtz($event)"
      >
        <i class="el-icon-thumb" />
      </span> -->
    <!-- <span
        class="dub-video-screen-btn"
        :class="{ is_active: activePanelPtz }"
        title="云台面板图标"
        @click="onClickPanelPtz($event)"
      >
        <i class="el-icon-rank" />
      </span> -->
    <!-- </div> -->

    <!-- <div v-if="activePanelPtz" class="dub-video-screen-panel-ptz"> -->
    <!-- <div v-if="true" class="dub-video-screen-panel-ptz"> -->

    <!-- <span
        class="dub-video-screen-btn"
        title="左上"
        @mousedown="onPtz($event, 'topLeft', true)"
        @mouseup="onPtz($event, 'topLeft', false)"
      >
        <i class="el-icon-top-left" />
      </span> -->
    <!-- <span
        class="dub-video-screen-btn"
        title="上"
        @mousedown="onPtz($event, 'top', true)"
        @mouseup="onPtz($event, 'top', false)"
      >
        <i class="el-icon-top" />
      </span> -->
    <!-- <span
        class="dub-video-screen-btn"
        title="右上"
        @mousedown="onPtz($event, 'topRight', true)"
        @mouseup="onPtz($event, 'topRight', false)"
      >
        <i class="el-icon-top-right" />
      </span> -->
    <!-- <span
        class="dub-video-screen-btn"
        title="左"
        @mousedown="onPtz($event, 'left', true)"
        @mouseup="onPtz($event, 'left', false)"
      >
        <i class="el-icon-back" />
      </span> -->
    <!-- <span
        class="dub-video-screen-btn"
        title="复位"
        @mousedown="onPtz($event, 'reset', true)"
        @mouseup="onPtz($event, 'reset', false)"
      >
        <i class="el-icon-refresh" />
      </span> -->
    <!-- <span
        title="右"
        class="dub-video-screen-btn"
        @mousedown="onPtz($event, 'right', true)"
        @mouseup="onPtz($event, 'right', false)"
      >
        <i class="el-icon-right" />
      </span> -->
    <!-- <span
        title="左下"
        class="dub-video-screen-btn"
        @mousedown="onPtz($event, 'bottomLeft', true)"
        @mouseup="onPtz($event, 'bottomLeft', false)"
      >
        <i class="el-icon-bottom-left" />
      </span> -->
    <!-- <span
        title="下"
        class="dub-video-screen-btn"
        @mousedown="onPtz($event, 'bottom', true)"
        @mouseup="onPtz($event, 'bottom', false)"
      >
        <i class="el-icon-bottom" />
      </span> -->
    <!-- <span
        title="右下"
        class="dub-video-screen-btn"
        @mousedown="onPtz($event, 'bottomRight', true)"
        @mouseup="onPtz($event, 'bottomRight', false)"
      >
        <i class="el-icon-bottom-right" />
      </span> -->
    <!-- <span
        title="放大"
        class="dub-video-screen-btn"
        @mousedown="onPtz($event, 'zoomIn', true)"
        @mouseup="onPtz($event, 'zoomIn', false)"
      >
        <i class="el-icon-zoom-in" />
      </span> -->
    <!-- <span
        title="缩小"
        class="dub-video-screen-btn"
        @mousedown="onPtz($event, 'zoomOut', true)"
        @mouseup="onPtz($event, 'zoomOut', false)"
      >
        <i class="el-icon-zoom-out" />
      </span> -->
  <!-- </div> -->
  </div>
</template>

<script>
import screenfull from 'screenfull'
import axios from 'axios'
// import webRtc from '../webRtc.vue'
// import { start, stop } from '@/utils/rtcUtils'
import DubVideoTouch from '@/views/box/sys-screen/components/dubVideoTouch.vue'
// key:分屏id   value:摄像头id
const map = new Map()
  .set(1, 1)
  .set(2, 2)
  .set(3, 3)
  .set(4, 4)
  .set(5, 5)
  .set(6, 6)
  .set(7, 7)
  .set(8, 8)
  .set(9, 9)
  .set(10, 10)
  .set(11, 11)
  .set(12, 12)
  .set(13, 13)
  .set(14, 14)
  .set(15, 15)
  .set(16, 16)
export default {
  name: 'DubVideoScreen',
  components: {
    DubVideoTouch
    // webRtc
  },
  props: {
    baseUrl: {
      type: String,
      default: ''
    },
    gutter: {
      type: Number,
      default: 0
    },
    id: {
      type: [String, Number],
      default: ''
    },
    layout: {
      type: [String, Number],
      default: 2
    }
    // dataJson: {
    //   type: String,
    //   // required: true,
    //   // default: {
    //   //   // list: [
    //   //   //   'http://10.20.10.134:8089/stream/1542334274458357760/channel/0/webrtc?uuid=1542334274458357760&channel=0'
    //   //   // ]
    //   // }
    //   default: ''
    // }
  },
  data() {
    return {
      src:
        '',
      show: true,
      // url: sessionStorage.getItem('baseUrl'),

      videoLoading: false,

      canvas: null,
      ctx: null,

      width: 0,
      height: 0,
      top: 0,
      left: 0,
      activeCursorPtz: false,
      activePanelPtz: false,
      isPreview: false,
      activeSmokeAlarm: true,
      smokeAlarmActive: false,

      gridTopLeft: [0, 0],
      gridTop: [0, 0],
      gridTopRight: [0, 0],
      gridLeft: [0, 0],
      gridRight: [0, 0],
      gridBottomLeft: [0, 0],
      gridBottom: [0, 0],
      gridBottomRight: [0, 0],

      windowId: null,

      nowPlayData: undefined,

      canDrawBol: true
    }
  },
  // +
  watch: {
    baseUrl: {
      handler(val, oldval) {
        // console.log('val数据变化', val)
        // console.log('oldval数据变化', oldval)
        this.startPlay()
      },
      deep: true,
      immediate: true
    }
    // 观察数据变化进行绘制
    // dataJson: {
    //   handler(val, oldval) {
    //     // console.log("watch数据变化"+val+oldval)
    //     this.canDrawBol && this.drawFun(this.dataJson)
    //   },
    //   deep: true,
    //   immediate: true
    // }
    // url: {
    //   handler(val, oldval) {
    //     // console.log("watch数据变化"+val+oldval)
    //     // this.canDrawBol && this.drawFun(this.dataJson)
    //     this.$nextTick(() => {
    //       this.startPlay()
    //     })
    //   },
    //   deep: true,
    //   immediate: true
    // }

  },
  created() {
    this.startPreview()
    this.startPlay()
    this.$nextTick(() => {
      this.initCanvas()
      const video = document.getElementById('video' + this.id)
      // const video = this.$refs.myVideo
      video.addEventListener('canplay', () => {
        this.videoLoading = false
      })
    })
  },
  beforeDestroy(to, from, next) {
    // console.log('销毁组件前...stop:', this.windowId)
    this.windowId && stop(this.id, this.windowId)
  },

  methods: {
    startPlay() {
      // console.info('startPlay！')
      this.clearStream()
      var that = this
      that.isLoading = true
      that.webRTC = new RTCPeerConnection({
        iceServers: [
          {
            urls: ['stun:stun.l.google.com:19302']
          }
        ]
        // sdpSemantics: 'unified-plan',
      })

      that.webRTC.onnegotiationneeded = this.handleNegotiationNeeded
      that.webRTC.ontrack = event => {
        that.isLoading = false
        // console.log(event.streams.length + ' track is delivered')
        const videoPlay = document.getElementById('video' + this.id)
        // videoPlay.srcObject = event.streams[0]
        videoPlay.srcObject = event.streams[0]
        videoPlay.play()
      }
      //
      that.webRTC.addTransceiver('video', {
        direction: 'sendrecv'
      })
      that.webRTCSendChannel = this.webRTC.createDataChannel('foo')

      that.webRTCSendChannel.onclose = () => {
        // startPlay();
        // console.info('sendChannel has closed')
      }
      that.webRTCSendChannel.onopen = () => {
        // console.log('sendChannel has opened')
        that.webRTCSendChannel.send('ping')
        that.webRTCSendChannelInterval = setInterval(() => {
          that.webRTCSendChannel.send('ping')
        }, 1000)
      }

      that.webRTCSendChannel.onmessage = e => console.info(e.data)
    },
    async handleNegotiationNeeded() {
      // const channel = 0
      const offer = await this.webRTC.createOffer()
      await this.webRTC.setLocalDescription(offer)

      const instance = axios.create({
        timeout: 8000,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      const param = 'data=' + btoa(this.webRTC.localDescription.sdp)
      // console.log(param, 'RTCparam')

      // const url = `http://10.20.10.134:18083/stream/37aec28e-6181-4753-9acd-0456a75f0289/channel/0//webrtc?uuid=37aec28e-6181-4753-9acd-0456a75f0289&channel=${channel}`
      // const url = sessionStorage.getItem('baseUrl')
      const url = this.baseUrl
      instance
        .post(url, param)
        .then(res => {
          try {
            // console.log('res', res)

            this.webRTC.setRemoteDescription(
              new RTCSessionDescription({
                type: 'answer',
                sdp: atob(res.data)
              })
            )
          } catch (e) {
            console.warn(e)
          }
        })
        .catch(err => {
          // this.isLoading.value = false
          // cameraId.value = ''
          // showTag.value = '视频流异常，请联系管理员'
          console.info('webrtcErr', err)
        })
    },

    clearStream() {
      this.webRTC = {}
      this.webRTCSendChannel = {}
      if (this.webRTCSendChannelInterval) {
        clearInterval(this.webRTCSendChannelInterval)
        console.info('视频流已断开！')
      }
    },
    // //////////////////////////
    onPlayerCanplay(e) {
      // console.log(e, 'src改变11111111111111111111111111111')
      // this.startPlay()
      // 这样会一直执行这个函数,导致后台崩溃
      // const flag = localStorage.getItem('show')
      // if (flag) {
      //   localStorage.setItem('show', false)
      //   console.log(111)
      //   this.startPlay()
      //   console.log(222)

      //   // this.$nextTick(() => {
      //   //   this.startPlay()
      //   // })
      // }
      // console.log(333)
      // this.startPlay()
      // this.$nextTick(() => {
      //   this.startPlay()
      // })
    },
    // 设置窗口样式
    setRect(rect) {
      this.left = rect[0]
      this.top = rect[1]
      this.width = rect[2]
      this.height = rect[3]
    },
    resize(size) {
      var gutter = this.gutter * 2
      this.width = size[0] - gutter
      this.height = size[1] - gutter
    },
    // 点击选中
    onClick(evt) {
      // console.log(this.id, evt, 'aaaa')
      this.$emit('click', this.id)
    },
    // 点击全屏
    fullScreen() {
      // console.log(screenfull.isFullscreen)
      // 如果全屏隐藏
      const el = document.getElementById('dubVideoScreen' + this.id)
      if (!screenfull.enabled) {
        this.$message({
          message: 'you browser can not work',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle(el)
    },
    // 点击云台面板
    onClickPanelPtz(evt) {
      evt.stopPropagation()
      this.activePanelPtz = !this.activePanelPtz
      this.activeCursorPtz = false
    },
    // 点击云台鼠标
    onClickCursorPtz(evt) {
      evt.stopPropagation()
      this.activeCursorPtz = !this.activeCursorPtz
      this.activePanelPtz = false
    },
    // 开启关闭烟火 报警
    onClickSmokeAlarm(evt) {
      evt.stopPropagation()
      this.activeSmokeAlarm = !this.activeSmokeAlarm
      // if (!this.activeSmokeAlarm) {
      //   this.smokeAlarmActive = false;
      // }

      this.$emit('smoke-alarm', this.id, {
        src: this.src,
        // flag: this.smokeAlarmActive
        flag: this.activeSmokeAlarm
      })
    },
    // 云台面板事件
    onPtz(evt, command, flag) {
      // debugger;
      evt.stopPropagation()
      evt.preventDefault()
      //
      this.$emit('ptz', this.id, {
        command: command,
        flag: flag
      })
    },

    startPreview(data) {
      // console.log('444', data, '重新播放')
      this.$emit('start-preview', this.id)
      // console.log(map, 'map', this.id)
      // 分屏id,摄像头id
      map.set(this.id, data.cid)

      this.videoLoading = true
      //   播放！！！！！
      // var video = document.getElementById('video' + this.id)
      // console.log('预览前先关闭上一个视频流')
      this.windowId && stop(this.id, this.windowId)
      // console.log(this.windowId, 'windowId')
      this.windowId = undefined
      if (this.nowPlayData) {
        this.$emit('playCidsDiff', this.nowPlayData.cid)
      }

      if (data) this.nowPlayData = data
      // console.log('33333333333333333', this.nowPlayData)
      this.src = this.nowPlayData.src
      this.isPreview = this.nowPlayData.src
      // +
      this.ctx.clearRect(0, 0, this.ctxW, this.ctxH)
      this.initCanvas()

      // eslint-disable-next-line no-undef
      // start(
      //   video,
      //   this.nowPlayData.src,
      //   this.id,
      //   this.layout * this.layout,
      //   val => {
      //     console.log('获取了windowId：', val + 'id1111' + this.id)
      //     this.windowId = val
      //   }
      // )
    },
    stopPreview() {
      // console.log('stopPreview')
      this.src = ''
      this.isPreview = false
      this.activePanelPtz = false
      this.activeCursorPtz = false
      this.$emit('stop-preview', this.id)
      // 关闭播放流
      this.windowId && stop(this.id, this.windowId)
      this.windowId = undefined
      // 关闭后回调 传cid ，去除playCids里的cid
      this.$emit('playCidsDiff', this.nowPlayData.cid)
    },

    // 根据 windowId 调用 stop 方法
    stopWindowId() {
      this.windowId && stop(this.id, this.windowId)
      this.windowId = undefined
    },

    // 是否预览
    hasPreview() {
      return this.isPreview
    },

    // startSmokeAlarm() {
    //   if (this.activeSmokeAlarm && this.isPreview) {
    //     // console.log(
    //     //   '!!!http://10.20.10.134:8089/stream/1542334274458357760/channel/0/webrtc?uuid=1542334274458357760&channel=0'
    //     // )
    //     this.smokeAlarmActive = true
    //     this.$emit('smoke-alarm', this.id, {
    //       src: this.src,
    //       flag: true
    //     })
    //   }
    // },
    // stopSmokeAlarm() {
    //   this.smokeAlarmActive = false
    //   this.$emit('smoke-alarm', this.id, {
    //     src: this.src,
    //     flag: false
    //   })
    // },

    // 初始化canvas
    initCanvas(flag) {
      // console.log('initCanvas  分屏id', this.id, flag, 'flag')
      var that = this
      const video = document.getElementById('video' + this.id)
      this.canvas = document.getElementById('showCanvas' + this.id)
      this.ctx = this.canvas.getContext('2d')
      // console.log(video, 'videovideovideovideo')
      // console.log(canvas)

      const myVideo_rect = video.getBoundingClientRect()

      this.canvas.width = myVideo_rect.width
      this.canvas.height = myVideo_rect.height
      this.ctxW = myVideo_rect.width
      this.ctxH = myVideo_rect.height

      const videoPlayFn = () => {
        // console.log('开始播放')
        this.startSmokeAlarm()
        this.videoLoading = false
      }
      video.removeEventListener('play', videoPlayFn)

      video.addEventListener('play', videoPlayFn)
      videoPlayFn()

      function fn(flag) {
        // console.log('flag11111111111111', flag)
        // TODO flag 要设置标识
        that.vW = video.videoWidth
        that.vH = video.videoHeight

        // console.log(that.vW, that.vH);
        // 实际视频比例
        const sPro = that.vH / that.vW
        // video 标签比例
        const vPro = myVideo_rect.height / myVideo_rect.width
        // console.log(myVideo_rect.height,myVideo_rect.width,sPro,vPro)

        if (vPro > sPro) {
          // 宽度适应计算高度偏移量
          const videoSHowHeight = sPro * myVideo_rect.width // 视频实际高度
          that.videoTop = (myVideo_rect.height - videoSHowHeight) / 2 // 求出偏移量
          that.videoLeft = 0 // 重置
          // 视频展示大小
          that.videoShowH = videoSHowHeight
          that.videoShowW = myVideo_rect.width
        } else {
          // 高度适应计算宽度偏移量
          const videoSHowWidth = myVideo_rect.height / sPro // 视频实际宽度
          that.videoLeft = (myVideo_rect.width - videoSHowWidth) / 2 // 求出偏移量
          that.videoTop = 0 // 重置
          // 视频展示大小
          that.videoShowW = videoSHowWidth
          that.videoShowH = myVideo_rect.height
        }
        //  可以进行绘制
        that.canDrawBol = true
        // that.onStartAlarm();
      }

      // !flag && video.addEventListener('canplay', fn)
      flag &&
        video.addEventListener('canplay', function(e) {
          // SomeJavaScriptCode
          // console.log(e, 'canplay')
        })

      !flag && fn()
      // flag && fn()
    }
    // 绘制 this.dataJson
    // drawFun(data) {
    //   map.forEach((value, index) => {
    //     console.log(index + ': ' + value)
    //     if (data.cid === value) {
    //       // 已知每个分屏中播放的摄像头id ，根据摄像头id 查有哪些分屏id ,然后分别渲染
    //       // data.id  摄像头id
    //       this.canvas = document.getElementById('showCanvas' + index)
    //       this.ctx = this.canvas.getContext('2d')
    //       console.log('VideoScreen  drawFun 摄像头值       ' + data.cid)
    //       var that = this

    //       // 绘制前清除画布
    //       this.ctx.clearRect(0, 0, this.ctxW, this.ctxH)

    //       // 绘制海岸线线
    //       const seaLineData = data.seasideLine
    //       this.ctx.beginPath()
    //       this.ctx.strokeStyle = 'green'
    //       this.ctx.lineWidth = 1
    //       this.ctx.moveTo(
    //         seaLineData[0][0] * this.videoShowW + that.videoLeft,
    //         seaLineData[0][1] * this.videoShowH + that.videoTop
    //       )
    //       seaLineData.slice(1).forEach((item, index) => {
    //         this.ctx.lineTo(
    //           item[0] * this.videoShowW + that.videoLeft,
    //           item[1] * this.videoShowH + that.videoTop
    //         )
    //       })
    //       this.ctx.stroke()

    //       // 绘制告警线
    //       const alramLineData = data.alramLine
    //       this.ctx.beginPath()
    //       this.ctx.strokeStyle = 'red'
    //       this.ctx.lineWidth = 3
    //       this.ctx.moveTo(
    //         alramLineData[0][0] * this.videoShowW + that.videoLeft,
    //         alramLineData[0][1] * this.videoShowH + that.videoTop
    //       )
    //       alramLineData.slice(1).forEach((item, index) => {
    //         this.ctx.lineTo(
    //           item[0] * this.videoShowW + that.videoLeft,
    //           item[1] * this.videoShowH + that.videoTop
    //         )
    //       })
    //       this.ctx.stroke()

    //       // 绘制物体框
    //       const rectData = data.detectBoxes
    //       this.ctx.strokeStyle = '#F1F956'
    //       this.ctx.lineWidth = 1
    //       rectData.forEach((item, index) => {
    //         this.ctx.strokeRect(
    //           item[0] * this.videoShowW + that.videoLeft,
    //           item[1] * this.videoShowH + that.videoTop,
    //           item[2] * this.videoShowW,
    //           item[3] * this.videoShowH
    //         )
    //       })

    //       // 绘制告警框
    //       const wranRectData = data.alarmBoxes || []
    //       this.ctx.strokeStyle = 'red'
    //       this.ctx.lineWidth = 1
    //       wranRectData.length !== 0 &&
    //         wranRectData.forEach((item, index) => {
    //           this.ctx.strokeRect(
    //             item[0] * this.videoShowW + that.videoLeft,
    //             item[1] * this.videoShowH + that.videoTop,
    //             item[2] * this.videoShowW,
    //             item[3] * this.videoShowH
    //           )
    //         })
    //     }
    //   })
    // }
  }
}
</script>

<style scoped>
.dub-video-screen {
  position: absolute;
  background: #262626;
  border: 1px solid transparent;
  overflow: hidden;
}

.dub-video-screen.is_smoke_alarm {
  animation: heart 1s ease infinite;
  border-width: 2px;
}

@keyframes is_smoke_alarm {
  0% {
    border-color: transparent;
  }
  100% {
    border-color: red;
  }
}

.dub-video-target {
  width: 100%;
  height: 100%;
}

.show-canvas {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0);
}

.dub-video-screen-toolbar {
  display: none;
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 100%;
  background: #1a1a1a;
  opacity: 0.8;
  height: 35px;
  align-items: center;
  justify-content: flex-end;
}

.dub-video-screen-toolbar > .dub-video-screen-btn {
  margin-right: 3px;
}

.dub-video-screen-btn {
  display: inline-block;
  width: 50px;
  height: 28px;
  line-height: 30px;
  color: #747474;
  font-size: 18px;
  text-align: center;
  cursor: pointer;
  border: 1px dotted #747474;
}

.dub-video-screen-btn:hover {
  color: #e72528;
  border-color: #e72528;
}

.dub-video-screen-btn.is_active {
  color: red;
  border-color: red;
}

.dub-video-screen.is_active {
  border-color: red;
}

.dub-video-screen.is_preview:hover .dub-video-screen-toolbar {
  display: flex;
}

.dub-video-screen-panel-ptz {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  width: 150px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
}

.dub-video-screen-panel-ptz .dub-video-screen-btn {
  width: 30%;
  margin-top: 3px;
}

.dub-video-screen-panel-group .dub-video-screen-btn {
  width: 45%;
}

.dub-video-screen-close {
  position: absolute;
  left: 10px;
  top: 10px;
}

.show-canvas {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0);
}
</style>
