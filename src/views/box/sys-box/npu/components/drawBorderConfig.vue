<style scoped></style>
<template>
  <el-dialog
    title="编辑围界区"
    width="1300px"
    :visible.sync="dialogShow"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form ref="formRules" :model="formData" size="small">
      <el-row>
        <el-col :span="19">
          <!-- <img :src="formData.imgPath" width="800" height="500" alt=""> -->
          <canvas
            :id="radom"
            :class="{ canDraw: 'canvas' }"
            :width="width"
            :height="height"
            :style="{ width: `${width}px`, height: `${height}px` }"
            @mousedown="canvasDown($event)"
            @mouseup="canvasUp($event)"
            @mousemove="canvasMove($event)"
            @touchstart="canvasDown($event)"
            @touchend="canvasUp($event)"
            @touchmove="canvasMove($event)"
          />
        </el-col>
        <el-col :span="5">
          <!-- <el-row>
            <el-col>
              <el-form-item label="已绘屏蔽区数：">
                {{ drawCount }}
              </el-form-item>
            </el-col>
          </el-row> -->
          <el-row>
            <el-col>
              <el-form-item label="绘图类型：">
                <el-radio-group v-model="lineType" @change="radioChange">
                  <el-radio label="rec">矩形</el-radio>
                  <el-radio label="cer">多边形</el-radio>
                  <!--  <el-radio disabled label="circle">圆形</el-radio>-->
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item v-if="showDrawBtn" label="多边形：">
                <div style="display:flex">
                  <el-button
                    v-if="showDrawBtn"
                    type="primary"
                    size="mini"
                    @click="setImgInfo()"
                  >完成绘图</el-button>
                  <el-button
                    v-if="showDrawBtn"
                    type="danger"
                    size="mini"
                    :disabled="cerLineHistory.length == 0"
                    @click="clearCerLine()"
                  >撤销绘图</el-button>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <div style="display:flex">
            <el-button
              type="danger"
              size="mini"
              @click="cleanAll()"
            >清空</el-button>
            <el-button
              type="danger"
              :disabled="history.length <= 1"
              size="mini"
              @click="revoke"
            >撤销</el-button>
            <el-button
              type="primary"
              size="mini"
              @click="submitForm('formRules')"
            >保存</el-button></div>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>
<script>
// import api from "@/reqs/apis";
import { grabImage } from '@/api/box/sys-camera'
import { setLine } from '@/api/box/sys-box-npu'
const defaultFormData = {
  npuId: 0,
  configData: undefined
}
const uuid = require('node-uuid')
export default {
  components: {},
  props: {
    show: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    npuId: {
      type: Number,
      default: function() {
        return 0
      }
    },
    configData: {
      type: Object,
      default: function() {
        return undefined
      }
    }
  },
  data() {
    return {
      dialogShow: this.show,
      formData: defaultFormData,
      showDrawBtn: false,
      canDraw: true, // 是否开始绘画
      width: '960', // 绘图区域宽度
      height: '540', // 绘图区域高度
      drawCount: 0,
      fillStyle: 'rgb(113, 252, 166)',
      globalAlpha: 0.5,
      url: '', // 图片路径
      info: [], // 位置点信息
      lineColor: 'green', // 画笔颜色
      lineWidth: 2, // 画笔宽度
      lineType: 'rec', // 画笔类型
      radom: uuid.v4(),
      context: {}, // canvas对象
      boundingClientRect: {},
      // 是否处于绘制状态
      canvasMoveUse: false,
      // 绘制矩形和椭圆时用来保存起始点信息
      beginRec: {
        x: '',
        y: '',
        imageData: ''
      },
      // 储存坐标信息
      drawInfo: [],
      // 背景图片缓存
      img: new Image(),
      history: [], // 存储每次操作
      cerLineHistory: []
    }
  },
  watch: {
    npuId: {
      handler(newValue, oldValue) {
        this.formData.npuId = newValue
      },
      deep: true
    },
    configData: {
      handler(newValue, oldValue) {
        this.formData.configData = newValue
      },
      deep: true
    },
    // 监听父组件传来的参数变化
    show: {
      handler(newValue, oldValue) {
        this.dialogShow = newValue
        if (newValue && this.formData.npuId !== 0) {
          this.initData()
        }
      },
      deep: true
    },
    // 子控件显示状态改变，执行父级showChange方法
    dialogShow: {
      handler(newValue, oldeValue) {
        this.$emit('showChange', newValue)
      },
      deep: true
    }
  },
  created() {},
  methods: {
    // 加载数据
    initData() {
      const _this = this
      grabImage(_this.formData.configData.cId)
        .then(res => {
          console.info(res)
          // _this.formData = res.data;
          _this.history = []
          _this.drawInfo = []
          //
          if (res.data) _this.url = res.data
          else {
            _this.url =
              'http://127.0.0.1:8880/static/capture-img/imgNotFound.jpg'
          }
          _this.initDraw()
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 初始化画布
    initDraw() {
      if (!this.url) {
        this.$message({
          message: '未找到绘图背景，请联系管理员!',
          type: 'error'
        })
        return
      }
      // 初始化画布
      const canvas = document.getElementById(this.radom)
      this.context = canvas.getContext('2d')
      this.boundingClientRect = canvas.getBoundingClientRect()
      // 初始化背景图片
      this.img.setAttribute('crossOrigin', 'Anonymous')
      this.img.src = this.url
      this.img.onerror = () => {
        var timeStamp = +new Date()
        this.img.src = this.url + '?' + timeStamp
      }
      this.img.onload = () => {
        // this.clean();
        for (var i = 0; i < 4; i++) {
          this.context.drawImage(this.img, 0, 0, this.width, this.height)
        }
        this.history.push(
          this.context.getImageData(0, 0, this.width, this.height)
        )
        this.initDrawRec(this.formData)
      }
      // 初始化画笔
      this.context.lineWidth = this.lineWidth
      this.context.strokeStyle = this.lineColor
    },
    // 初始化已绘制图形区域
    initDrawRec(data) {
      this.drawCount = 0
      if (data.configData.detectionLine) {
        const shieldArray = data.configData.detectionLine.split('|')
        shieldArray.forEach((item, index) => {
          const points = []
          const enArry = item.split(',')
          for (var i = 0; i < enArry.length / 2; i++) {
            points.push({
              x: enArry[i * 2],
              y: enArry[i * 2 + 1]
            })
          }
          this.drawPolygon(points)
        })
        this.drawCount = shieldArray.length
      }
    },
    // 鼠标按下
    canvasDown(e) {
      if (this.drawCount === 5) {
        this.$message({
          message: '最多可设置5个屏蔽区，请删除后再绘制',
          type: 'error'
        })
        return
      }
      if (this.canDraw) {
        if (this.lineType !== 'cer') this.canvasMoveUse = true
        // client是基于整个页面的坐标，offset是cavas距离pictureDetail顶部以及左边的距离
        // const canvasX = e.clientX - e.target.parentNode.offsetLeft;
        // const canvasY = e.clientY - e.target.parentNode.offsetTop;
        const canvasX = e.clientX - this.boundingClientRect.left
        const canvasY = e.clientY - this.boundingClientRect.top - 15
        // 记录起始点和起始状态
        this.beginRec.x = canvasX
        this.beginRec.y = canvasY
        this.beginRec.imageData = this.context.getImageData(
          0,
          0,
          this.width,
          this.height
        )
        // 存储本次绘制坐标信息
        this.drawInfo.push({
          x: canvasX,
          y: canvasY,
          type: this.lineType
        })
        // 起始点
        if (this.lineType === 'cer' && this.drawInfo.length === 1) {
          this.cerLineHistory.push(
            this.context.getImageData(0, 0, this.width, this.height)
          )
          this.context.beginPath()
          this.context.arc(canvasX, canvasY, 1.5, 0, 2 * Math.PI)
          this.context.closePath()
          this.context.stroke()
        }
      }
    },
    // 提交表单
    submitForm(formName) {
      const _this = this
      _this.$refs[formName].validate(valid => {
        if (valid) {
          _this.editSave()
        } else {
          _this.$message({
            message: '数据验证失败!!',
            type: 'warning'
          })
          return false
        }
      })
    },
    // 鼠标移动时绘制
    canvasMove(e) {
      if (this.canvasMoveUse && this.canDraw) {
        // client是基于整个页面的坐标，offset是cavas距离pictureDetail顶部以及左边的距离
        const canvasX = e.clientX - this.boundingClientRect.left
        const canvasY = e.clientY - this.boundingClientRect.top - 15
        if (this.lineType === 'rec') {
          // 绘制矩形时恢复起始点状态再重新绘制
          this.context.putImageData(this.beginRec.imageData, 0, 0)
          this.context.beginPath()
          this.context.rect(
            this.beginRec.x,
            this.beginRec.y,
            canvasX - this.beginRec.x,
            canvasY - this.beginRec.y
          )
          this.context.fillStyle = this.fillStyle
          this.context.globalAlpha = this.globalAlpha
          this.context.fill()
          const info = this.drawInfo[this.drawInfo.length - 1]
          info.w = canvasX - info.x
          info.h = canvasY - info.y
        } else if (this.lineType === 'circle') {
          // 绘制椭圆时恢复起始点状态再重新绘制
          this.context.putImageData(this.beginRec.imageData, 0, 0)
          this.context.beginPath()
          const a = (canvasX - this.beginRec.x) / 2
          const b = (canvasY - this.beginRec.y) / 2
          this.drawEllipse(
            this.context,
            this.beginRec.x + a,
            this.beginRec.y + b,
            a > 0 ? a : -a,
            b > 0 ? b : -b
          )
          const info = this.drawInfo[this.drawInfo.length - 1]
          info.a = a / this.width
          info.b = b / this.height
        }
        this.context.stroke()
      }
    },
    // 绘制椭圆
    drawEllipse(context, x, y, a, b) {
      context.save()
      var r = a > b ? a : b
      var ratioX = a / r
      var ratioY = b / r
      context.scale(ratioX, ratioY)
      context.beginPath()
      context.arc(x / ratioX, y / ratioY, r, 0, 2 * Math.PI, false)
      context.closePath()
      context.restore()
    },
    // 绘制多边形
    drawPolygon(points) {
      // this.context.putImageData(this.beginRec.imageData, 0, 0);
      this.context.beginPath()
      this.context.moveTo(points[0].x, points[0].y)
      for (var i = 1; i < points.length; i++) {
        this.context.lineTo(points[i].x, points[i].y)
      }
      this.context.fillStyle = this.fillStyle
      this.context.globalAlpha = this.globalAlpha
      this.context.fill()
      this.context.closePath()
      this.context.stroke()
      this.history.push(
        this.context.getImageData(0, 0, this.width, this.height)
      )
    },
    // 获取坐标信息
    getInfo() {
      return this.drawInfo
    },
    // 鼠标抬起
    canvasUp(e) {
      if (this.canDraw) {
        this.canvasMoveUse = false
      }
      if (this.drawCount >= 5) return
      if (this.drawInfo.length > 1 && this.lineType === 'cer') {
        this.context.beginPath()
        const moveToX = this.drawInfo[this.drawInfo.length - 2].x
        const moveToY = this.drawInfo[this.drawInfo.length - 2].y
        // 定义直线的起点坐标
        this.context.moveTo(moveToX, moveToY)
        // 定义直线的终点坐标
        const lineToX = this.drawInfo[this.drawInfo.length - 1].x
        const lineToY = this.drawInfo[this.drawInfo.length - 1].y
        this.context.lineTo(lineToX, lineToY)
        // 沿着坐标点顺序的路径绘制直线
        this.context.stroke()
        // 关闭当前的绘制路径
        this.context.closePath()
      }
      if (this.lineType === 'rec') {
        this.history.push(
          this.context.getImageData(0, 0, this.width, this.height)
        )
        //
        if (this.drawCount < 5) this.drawCount++
        else return
        const info = this.drawInfo[this.drawInfo.length - 1]
        var x = info.x
        var y = info.y
        var w = info.w
        var h = info.h

        if (isNaN(x)) {
          this.$message({
            message: '绘图超出边界,请重新绘制',
            type: 'error'
          })
          this.clean()
        }
        if (isNaN(y)) {
          this.clean()
        }
        if (isNaN(w)) {
          this.clean()
        }
        if (isNaN(h)) {
          this.clean()
        }
        if (!this.formData.configData.detectionLine) {
          this.formData.configData.detectionLine = this.setRecData(info)
        } else {
          this.formData.configData.detectionLine += '|' + this.setRecData(info)
        }
      }
    },
    // 清空画布
    clean() {
      for (var i = 0; i < 4; i++) {
        this.context.drawImage(this.img, 0, 0, this.width, this.height)
      }
      this.drawInfo = []
      this.history = []
      this.formData.configData.detectionLine = ''
      this.drawCount = 0
    },
    // 多边形区域绘制完成事件
    setImgInfo() {
      if (this.drawInfo.length < 2) {
        this.$message({
          message: '请绘制图案!!',
          type: 'error'
        })
        return
      }
      if (this.lineType === 'cer') {
        this.cerLineHistory = []
        if (!this.formData.configData.detectionLine) {
          this.formData.configData.detectionLine = ''
        } else {
          this.formData.configData.detectionLine += '|'
        }
        this.drawInfo.forEach((item, index) => {
          this.formData.configData.detectionLine += item.x + ',' + item.y + ','
        })
        this.formData.configData.detectionLine = this.formData.configData.detectionLine.substring(
          0,
          this.formData.configData.detectionLine.length - 1
        )
        //
        this.drawPolygon(this.drawInfo)
        this.$message({
          message: '屏蔽区绘图完成!!',
          type: 'success'
        })
        this.drawCount++
        this.drawInfo = []
      }
    },
    // 拼接矩形四个点坐标
    setRecData(info) {
      return (
        info.x +
        ',' +
        info.y +
        ',' +
        (info.x + info.w) +
        ',' +
        info.y +
        ',' +
        (info.x + info.w) +
        ',' +
        (info.y + info.h) +
        ',' +
        info.x +
        ',' +
        (info.y + info.h)
      )
    },
    // 清空画布
    cleanAll() {
      const _this = this
      _this.clean()
    },
    // 绘画图形切换事件
    radioChange() {
      if (this.lineType !== 'cer') {
        this.showDrawBtn = false
      } else {
        this.showDrawBtn = true
      }
      if (this.cerLineHistory.length > 0) this.clearCerLine()
      this.drawInfo = []
    },
    // 撤销
    revoke() {
      this.history.pop()
      if (this.history.length > 0) {
        // 从存入的记录里删除
        this.context.putImageData(this.history[this.history.length - 1], 0, 0)
        this.drawCount--
        const shieldArray = this.formData.configData.detectionLine.split('|')
        shieldArray.pop()
        this.formData.configData.detectionLine = shieldArray.join('|')
        if (this.lineType === 'cer') {
          this.drawInfo = []
        }
      }
    },
    // 清除未完成多边形的边线
    clearCerLine() {
      this.context.putImageData(this.cerLineHistory[0], 0, 0)
      this.cerLineHistory.pop()
      this.drawInfo = []
    },
    // 编辑保存
    editSave() {
      const _this = this
      const postData = {
        npuId: _this.formData.npuId,
        aiId: _this.formData.configData.aiId,
        aiConfig: {
          id: _this.formData.configData.id,
          detectionLine: _this.formData.configData.detectionLine,
          shieldLine: _this.formData.configData.shieldLine
        }
      }
      // console.info(postData)
      setLine(postData)
        .then(res => {
          _this.$emit('ok')
          _this.$message({
            message: '数据保存成功',
            type: 'success'
          })
          _this.dialogShow = false
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>
