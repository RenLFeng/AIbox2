<template>
  <div class="alarm">
    <video
      :id="'dPlayerVideoMain' + 1"
      autoplay
      controls
      muted
      playsinline
      :style="{ height: '720px', width: '1280px' }"
    >
      您的浏览器不支持Video标签。
    </video>
    <!--    <div v-else class="alarm-title">-->
    <!--      <p>{{ showTag }}</p>-->
    <!--    </div>-->
    <!--    <img v-if="isLoading" src="@/assets/images/loading.svg">-->
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'WebRtc',
  components: {},
  data() {
    return {
      webRTC: undefined,
      webRTCSendChannel: undefined,
      webRTCSendChannelInterval: undefined
    }
  },
  created() {
    this.startPlay()
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
        console.log(event.streams.length + ' track is delivered')
        const videoPlay = document.getElementById('dPlayerVideoMain' + 1)
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
        console.info('sendChannel has closed')
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
      console.log(param, 'RTCparam')

      // const url = `http://10.20.10.2:8089/stream/1573237356142792704/channel/0/webrtc?uuid=1573237356142792704&channel=0`
      const url = `http://10.20.10.2:8880/api/v1/preview/stream/1573237356142792704/channel/0/webrtc?uuid=1573237356142792704&channel=0`
      instance
        .post(url, param)
        .then(res => {
          try {
            console.log('res', res)

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
    }
  }
}
</script>
