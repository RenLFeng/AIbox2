<template>
  <BasicLayout>
    <template #wrapper>
      <!--      <img src="http://127.0.0.1:8880/static/uploadfile/16942ca0-2025-4e9f-b140-64fb6754fec7.jpg" style="width:1280px;height:720px"/>-->
      <!--      <img :src="webImgUrl" style="width:1280px;height:720px">-->
      <!--      <canvas id="canvas" width="1280px" height="720px" style="background-color: #CCCCCC" />-->
      <!--      <img class="video-tag" width="1280px" height="720px" src="http://10.20.10.181:10000/?action=stream" alt="">-->
      <div class="main-box-browse">
        <div class="main-box-list">
          <el-form
            ref="queryForm"
            :model="queryParams"
            :inline="true"
            label-width="90px"
          >
            <el-form-item label="流地址" prop="address">
              <el-input
                v-model="queryParams.address"
                placeholder="请输入MJGP-Stream流地址"
              />
            </el-form-item>
            <el-button
              type="primary"
              icon="el-icon-video-play"
              size="small"
              @click="handlePlay"
            >播放
            </el-button>
          </el-form>
          <!-- <h5 style="text-indent: 1em;line-height: 0; color: #555555;">
            摄像头列表
          </h5> -->
          <!-- <div style="display: flex;">
            <el-input placeholder="摄像头名称" v-model="input" clearable>
            </el-input>
            <el-button style="margin: 0 5px;">搜索</el-button>
          </div> -->
          <!-- <ul
            v-for="(item, index) in list"
            :class="flag === index ? 'active' : ''"
            @click="fn(index)"
          >
            <li>
              <svg
                t="1662695848216"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="1333"
                width="25"
                height="25"
                style="vertical-align: -7px;"
              >
                <path
                  d="M658.103 735.569c0 26.458-20.723 47.99-46.187 47.99h-492.66c-25.464 0-46.187-21.532-46.187-47.99V319.647c0-26.459 20.723-47.99 46.187-47.99h492.66c25.464 0 46.187 21.531 46.187 47.99V735.57z m206.611-420.756l-133.483 86.308v252.926l132.582 85.64c1.423 1.227 9.153 7.307 21.183 7.307 16.026 0 29.058-13.915 29.058-31.025V339.245c0-17.11-13.033-31.024-29.058-31.024-12.03 0-19.759 6.08-20.282 6.592z"
                  p-id="1334"
                  fill="#bfbfbf"
                ></path>
              </svg>
              {{ item }}
            </li>
          </ul> -->
        </div>
        <div>
          <el-image style="width: 1280px; height: 720px" :src="playUrl" />
        </div>
      </div>
    </template>
  </BasicLayout>
</template>

<script>
export default {
  name: 'SysWebImgManage',
  data() {
    return {
      flag: 0,
      list: ['摄像头1', ' 摄像头2', ' 摄像头3', ' 摄像头4'],
      queryParams: {
        address:
          'http://10.20.10.134:8089/stream/1542334274458357760/channel/0/webrtc?uuid=1542334274458357760&channel=0'
      },
      input: '',
      // playUrl: 'http://10.20.10.181:10000/?action=stream'
      playUrl: ''
    }
  },
  methods: {
    handlePlay() {
      // console.info(this.queryParams.address)
      this.playUrl = this.queryParams.address
    },
    fn(value) {
      this.flag = value
    }
  }
}
</script>
<style lang="scss">
.main-box-browse {
  // display: flex;
  .main-box-list {
    ul {
      list-style-type: none;
      cursor: pointer;
    }
  }
}
.active {
  color: #d9001b;
}
</style>
