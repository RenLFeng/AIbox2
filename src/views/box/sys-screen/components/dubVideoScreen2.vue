<template>
  <BasicLayout>
    <template #wrapper>
      <div class="main-box">
        <el-card class="box-card">
          <el-row :gutter="20">
            <!--部门数据-->
            <el-col :span="4" :xs="24">
              <div class="head-container">
                <div>
                  <el-input
                    v-model="camName"
                    placeholder="请输入摄像头名称"
                    clearable
                    size="small"
                    prefix-icon="el-icon-search"
                    style="margin-bottom: 20px"
                  />
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
                  accordion
                  @node-click="handleNodeClick"
                />
              </div>
            </el-col>
            <el-col v-if="show" :span="20" :xs="24">
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
import { treeselect } from '@/api/box/sys-camera'
export default {
  name: 'DubVideoPlugin',
  components: {
    dubVideoWindow
  },
  props: {
    width: {
      type: Number,
      default: 1250
    },
    height: {
      type: Number,
      default: 600
    }
  },
  data() {
    return {
      show: true,
      screenWidth: 0,
      offset: [],
      // 部门树选项
      // camOptions: undefined,
      camOptions: [
      ],
      defaultProps: undefined,
      camName: undefined,
      baseUrl: '',
      // 定义点击次数,默认0次
      treeClickCount: 0,
      index: undefined
    }
  },
  watch: {
    // 根据名称筛选部门树
    camName(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getTreeselect()
    // this.screenWidth = window.screen.width
    // console.log(this.screenWidth)
  },
  mounted() {
    this.resize([this.width, this.height])
    // this.offset = this.$refs.refVideoPlugin.offset;
  },
  methods: {
    // 选中
    select(index) {
      console.log('选中', index)
      this.index = index
    },
    // 停止预览
    stopPreview(index) {
      console.log(index, '停止预览')
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
    // 打开视频双击事件
    // openCamera(data) {
    //   console.log('打开视频双击事件====')
    //   console.log(data)
    // },
    // 设备列表渲染
    // renderContent(h, { node, data, store }) {
    //   console.log('nodeID:' + node.data.id + ',label:' + data.label + ',state:' + data.state)
    //   if (data.type === 'camera') {
    //     // 在线状态的设备
    //     if (data.state === 1) {
    //       return (<span><svg-icon icon-class='full-screen' /><span style='padding-left: 4px;' ondblclick = { this.openCamera(data) }>{node.label}</span></span>)
    //     } else {
    //       return (<span><svg-icon icon-class='full-screen' /><span style='padding-left: 4px;' ondblclick = { this.openCamera(data) }>{node.label}</span></span>)
    //     }
    //   }
    //   return (<span>{node.label}</span>)
    // },
    // 节点单击事件
    handleNodeClick(data, node) {
      // 记录点击次数
      this.treeClickCount++
      // 单次点击次数超过2次不作处理,直接返回,也可以拓展成多击事件
      if (this.treeClickCount >= 2) {
        return
      }
      // 计时器,计算300毫秒为单位,可自行修改
      this.timer = window.setTimeout(() => {
        if (this.treeClickCount === 1) {
          // 把次数归零
          this.treeClickCount = 0
          // 单击事件处理
          // console.log('单击事件,可在此处理对应逻辑')
        } else if (this.treeClickCount > 1) {
          // 把次数归零
          this.treeClickCount = 0
          // 双击事件
          console.log('双击事件,可在此处理对应逻辑')
          this.startPreview(this.index, data)
        }
      }, 300)
    },
    stopWindowId() {
      this.$refs.refVideoWindow.stopWindowId()
    },
    resize(size) {
      var that = this
      this.$nextTick(function() {
        that.$refs.refVideoWindow.resize(size)
      })
    },
    // 开始预览
    startPreview(index, data) {
      console.log('11111111111', index, data)
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
