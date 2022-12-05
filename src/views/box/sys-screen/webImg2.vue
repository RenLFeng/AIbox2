<template>
  <BasicLayout>
    <template #wrapper>
      <!--      <img src="http://127.0.0.1:8880/static/uploadfile/16942ca0-2025-4e9f-b140-64fb6754fec7.jpg" style="width:1280px;height:720px"/>-->
      <!--      <img :src="webImgUrl" style="width:1280px;height:720px">-->
      <div class="main-box">
        <canvas
          id="can"
          width="1280px"
          height="720px"
          style="background-color: #CCCCCC"
        />
      </div>
    </template>
  </BasicLayout>
</template>

<script>
import { unWsLogout } from '@/api/ws'
import { webImgPlayTicker } from '@/api/box/sys-camera'
export default {
  name: 'SysWebImgManage',
  data() {
    return {
      websock: null,
      arrs: [],
      id: undefined,
      group: undefined,
      webImgUrl: ''
    }
  },
  // watch: {
  //   webImgUrl(newName, oldName) {
  //     this.loadImage(newName)
  //     this.runAnimation(cxt)
  //   }
  // },
  mounted: function() {
    this.initWebImgPlayTicker()
    // this.drawfame()
  },
  created() {
    this.id = this.guid()
    this.group = 'webImg'
    this.initWebSocket()
  },
  destroyed() {
    // console.log('断开webImgWebsocket连接')
    // 离开路由之后断开websocket连接
    this.websock.close()
    unWsLogout(this.id, this.group).then(response => {
      console.log(response.data)
    })
  },
  methods: {
    initWebSocket() {
      // 初始化weosocket
      // console.log(this.$store.state.user.token)
      const wsuri =
          'ws://' +
          this.$store.state.system.info.sys_app_ip +
          ':8880/ws/' +
          this.id +
          '/' +
          this.group +
          '?token=' +
          this.$store.state.user.token
      this.websock = new WebSocket(wsuri)
      this.websock.onmessage = this.websocketonmessage
      this.websock.onopen = this.websocketonopen
      this.websock.onerror = this.websocketonerror
      this.websock.onclose = this.websocketclose
    },
    websocketonopen() {
      // 连接建立之后执行send方法发送数据
      // console.log('webImgWebsocket连接打开')
      //   const actions = { 'test': '12345' }
      //   this.websocketsend(JSON.stringify(actions))
    },
    websocketonerror() {
      // 连接建立失败重连
      this.initWebSocket()
    },
    // 数据接收
    websocketonmessage(e) {
      // console.log('---------------WebImg---------------')
      const jsonData = JSON.parse(e.data)
      // console.log(jsonData)
      // if (jsonData.code === 200) {
      // console.log(jsonData.data)
      this.webImgUrl = jsonData.data
      // this.webImgUrl = 'http://192.168.124.65:8880/static/web-img/1.jpg'

      this.drawfame()
      // const can = document.getElementById('can')
      // const cxt = can.getContext('2d')
      // this.loadImage(jsonData.data)
      // this.runAnimation(cxt)
      // }
    },
    websocketsend(Data) {
      // 数据发送
      //   this.websock.send(Data)
    },
    websocketclose(e) {
      // 关闭
      unWsLogout(this.id, this.group).then(response => {
        console.log(response.data)
      })
      console.log('断开连接', e)
    },
    guid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(
        c
      ) {
        var r = (Math.random() * 16) | 0
        var v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    },

    drawfame() {
      const can = document.getElementById('can')
      const cxt = can.getContext('2d')
      const img = new Image()
      img.crossOrigin = 'anonymous'
      // 在Canvas画布 添加图片
      // var img = document.getElementById('fames')
      console.log('drawfame' + this.webImgUrl)
      img.src = this.webImgUrl
      img.onload = () => {
        cxt.drawImage(img, 0, 0, 1280, 720)
      }
      img.onerror = () => {
        console.log('err')
      }
    },
    // initContext() {
    //   const can = document.getElementById('can')
    //   const cxt = can.getContext('2d')
    // },
    // loadImage(url) {
    //   return new Promise((r) => {
    //     const img = new Image()
    //     img.onload = () => r(img)
    //     img.onerror = () => r()
    //     img.src = url
    //   })
    // },
    // runAnimation(cxt = undefined, url) {
    //   cxt.drawImage(img, 0, 0, 1280, 720)
    // },
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
<style lang="scss"></style>
