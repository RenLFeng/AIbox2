<template>
  <BasicLayout>
    <template #wrapper>
      <div class="main-box">
        <el-card class="box-card">
          <el-row :gutter="20">
            <el-col :span="4" :xs="24">
              <div ref="leftWidth" class="head-container-cam">
                <div>
                  <el-input
                    v-model="camName"
                    placeholder="请输入摄像头名称"
                    clearable
                    size="small"
                    prefix-icon="el-icon-search"
                    style="margin-bottom: 20px"
                    @change="changeCamName"
                  />
                </div>
                <div style="margin: 0 5px;">
                  <el-button size="small">搜索</el-button>
                </div>
              </div>
              <div class="head-container">
                <el-tree
                  ref="tree"
                  :data="camOptions"
                  :props="defaultProps"
                  :expand-on-click-node="false"
                  :filter-node-method="filterNode"
                  default-expand-all
                  @node-click="handleNodeClick"
                />
              </div>
            </el-col>
            <el-col :span="20" :xs="24">

              <div class="grid-content bg-purple-dark">
                <div
                  class="dub-video-plugin"
                  v-bind="$attrs"
                  :style="{
                    width: width + 'px',
                    height: height + 'px'
                  }"
                >
                  <dub-video-window
                    ref="refVideoWindow"
                    :base-url="baseUrl"
                    v-on="$listeners"
                    @setColor="setColor"
                    @stop-preview="stopPreview"
                    @start-preview="startPreview"
                    @select="select"
                  />

                  <dubVideoWindow />
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </div>
    </template>
  </BasicLayout>
</template>

<script>
import dubVideoWindow from '@/views/box/sys-screen/components/dubVideoWindow'
import { treeselect, streamAdd, streamDelete } from '@/api/box/sys-camera'

export default {
  name: 'DubVideoPlugin',
  components: {
    dubVideoWindow
  },
  props: {
    width: {
      type: Number,
      default: 1383
    },
    height: {
      type: Number,
      default: 600
    }
  },

  data() {
    return {
      // show: true,
      screenWidth: 0,
      offset: [],
      // 部门树选项
      // camOptions: undefined,
      camOptions: [
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      queryParams: {},
      camName: '',
      baseUrl: ''
    }
  },
  //   watch() {
  // handler(){

  // }
  //   },
  created() {
    this.getTreeselect()
  },
  mounted() {
    // console.info('mounted')
    this.resize([this.width, this.height])
    this.stopWindowId()
    // this.screenWidth = document.documentElement.clientWidth - this.$refs.leftWidth.clientWidth - this.$refs.leftWidth.offsetLeft - this.$refs.leftWidth.clientWidth
    // console.log(this.$refs.leftWidth.clientWidth, 'width')
    // console.log(this.screenWidth, 'screenWidthWidth')
    // this.offset = this.$refs.refVideoPlugin.offset;
  },
  methods: {
    // 选中
    select(index) {
      // console.log('选中', index)
    },
    // 停止预览
    stopPreview(index) {
      // console.log(index, '停止预览')
    },
    // 开始预览
    changeCamName(value) {
      this.$emit('changeCamName', value)
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.camOptions = response.data
      })
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 节点单击事件
    handleNodeClick(data) {
      // localStorage.removeItem('baseUrl')
      this.queryParams.camId = '/' + data.id + '/'
      localStorage.setItem('videoId', data.id)
      // this.getList()
      // 删除视频流
      streamDelete(localStorage.getItem('videoId'))
      // console.log(localStorage.getItem('videoId'))
      // console.log(data, this.queryParams, '打印摄像头列表')
      setTimeout(() => {
        // console.log(data.id, 'data.id')
        streamAdd(data.id).then(response => {
          // console.log(response, 'response')
          // localStorage.setItem('baseUrl', response.data)
          this.baseUrl = response.data
          // console.log(this, 'this')
        }

        )
      }, 500)
      // console.log(this.$refs.refVideoWindow, 'refs')
      // var that = this
      // this.$nextTick(function() {
      //   that.$refs.refVideoWindow.$refs[refVideoScreen].startPlay()
      // })

      // console.log(res)
    },
    stopWindowId() {
      this.$refs.refVideoWindow.stopWindowId()
      // console.log(this.$refs.refVideoWindow, 'Video window')
    },
    resize(size) {
      var that = this
      this.$nextTick(function() {
        that.$refs.refVideoWindow.resize(size)
      })
    },
    // 开始预览
    startPreview(index, data) {
      // console.log('开始预览', index, data)
      var that = this
      this.$nextTick(function() {
        that.$refs.refVideoWindow.startPreview(index, data)
      })
    },
    // startSmokeAlarm(index) {
    //   var that = this
    //   this.$nextTick(function() {
    //     that.$refs.refVideoWindow.startSmokeAlarm(index)
    //   })
    // },
    // stopSmokeAlarm(index) {
    //   var that = this
    //   this.$nextTick(function() {
    //     that.$refs.refVideoWindow.stopSmokeAlarm(index)
    //   })
    // },
    setColor(data) {
      this.$emit('setColor', data)
    }
  }
}
</script>

<style lang="scss">
.head-container-cam {
  display: flex;
}
.head-container {
  ul {
    list-style: none;
    cursor: pointer;
  }
}
</style>
