<template>
  <div class="container">
    <p class="description">
      {{ description }}
    </p>

    <div class="image-container">
      <buffered-image
        ref="bufferedImage"
        class="item"
      />
    </div>
  </div>
</template>

<script>

import BufferedImage from '@/components/BufferedImage'
import { getOutBoundIP } from '@/api/box/sys-box'
import { unWsLogout } from '@/api/ws'
import { webImgPlayTicker } from '@/api/box/sys-camera'

export default {
  components: {

    BufferedImage
  },
  data() {
    return {
      currentIndex: 1,
      description: '',
      intervalMs: 500,
      id: undefined,
      group: undefined,
      webImgUrl: ''
    }
  },
  created() {
    this.id = this.guid()
    this.group = 'webImg'
    this.initWebSocket()
    this.initWebImgPlayTicker()
  },
  mounted() {
    setInterval(() => {
      if (this.$refs.bufferedImage.change(this.webImgUrl)) {
        this.description = `当前图片：${this.currentIndex}.jpg，切换间隔：${this.intervalMs}ms`
        this.currentIndex++
      }
      if (this.currentIndex === 2) {
        this.currentIndex = 0
      }
    }, this.intervalMs)
  },
  methods: {
    initWebSocket() { // 初始化weosocket
      getOutBoundIP({}).then(response => {
        // console.log(this.$store.state.user.token)
        const wsuri = 'ws://' + response.data + ':8880/ws/' + this.id + '/' + this.group + '?token=' + this.$store.state.user.token
        this.websock = new WebSocket(wsuri)
        this.websock.onmessage = this.websocketonmessage
        this.websock.onopen = this.websocketonopen
        this.websock.onerror = this.websocketonerror
        this.websock.onclose = this.websocketclose
      })
    },
    websocketonopen() { // 连接建立之后执行send方法发送数据
      // console.log('webImgWebsocket连接打开')
      //   const actions = { 'test': '12345' }
      //   this.websocketsend(JSON.stringify(actions))
    },
    websocketonerror() { // 连接建立失败重连
      this.initWebSocket()
    },
    // 数据接收
    websocketonmessage(e) {
      console.log('---------------WebImg---------------')
      const jsonData = JSON.parse(e.data)
      // if (jsonData.code === 200) {
      // console.log(jsonData.data)
      this.webImgUrl = jsonData.data
      // console.log(this.webImgUrl)
      this.$refs.bufferedImage.change(this.webImgUrl)
      // }
    },
    websocketsend(Data) { // 数据发送
      //   this.websock.send(Data)
    },
    websocketclose(e) { // 关闭
      unWsLogout(this.id, this.group).then(response => {
        console.log(response.data)
      }
      )
      console.log('断开连接', e)
    },
    guid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0; var v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
    },
    initWebImgPlayTicker() {
      const _this = this
      webImgPlayTicker(1)
        .then(res => {
          // console.info(res)
          _this.$emit('ok')
          _this.$message({
            message: '预览成功',
            type: 'success'
          })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;

  .description {
    width: 400px;
    text-align: center;
  }

  .image-container {
    display: flex;

    .item {
      width: 1280px;
      height: 720px;
    }
  }
}
</style>
