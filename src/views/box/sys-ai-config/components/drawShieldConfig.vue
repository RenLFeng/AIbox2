<template>
  <el-dialog
    title="编辑屏蔽区"
    width="1300px"
    :visible.sync="dialogShow"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="closeDialog"
  >
    <el-form ref="form" :model="drawData" :rules="rules" size="small">
      <el-row>
        <el-col :span="19">
          <canvas
            :id="random"
            :class="{ canDraw: 'canvas' }"
            :width="width"
            :height="height"
            :style="{ width: `${width}px`, height: `${height}px` }"
            unselectable="on"
            onselectstart="return false"
            style="
              -moz-user-select: none;
              -webkit-user-select: none;
              -ms-user-select: none;
            "
            @mousedown="canvasDown($event)"
            @mouseup="canvasUp($event)"
            @mousemove="canvasMove($event)"
            @mouseout="canvasOut($event)"
            @touchstart="canvasDown($event)"
            @touchend="canvasUp($event)"
            @touchmove="canvasMove($event)"
          />
        </el-col>
        <el-col :span="5">
          <el-row>
            <el-col>
              <el-form-item label="已绘屏蔽区数：">
                {{ drawCount }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col class="identifyRadio">
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
                <div style="display: flex">
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
                    :disabled="cerLineHistory.length === 0"
                    @click="clearCerLine()"
                  >撤销绘图</el-button>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <div style="display: flex">
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
              style="background: linear-gradient(to bottom, #a388ff, #654ef4)"
              @click="submitForm('formRules')"
            >保存</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>
<script>
import { grabImage } from "@/api/box/sys-camera";
import { updateShieldLine } from "@/api/box/sys-ai-config";

export default {
  components: {},
  props: {
    show: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    acId: {
      type: Number,
      default: function() {
        return 0;
      }
    },
    cId: {
      type: Number,
      default: function() {
        return 0;
      }
    },
    aId: {
      type: Number,
      default: function() {
        return 0;
      }
    },
    nId: {
      type: Number,
      default: function() {
        return 0;
      }
    },
    configData: {
      type: String,
      default: function() {
        return "";
      }
    }
  },
  data() {
    const thMiniValue = 3;
    return {
      dialogShow: this.show,
      drawData: {
        acId: 0,
        cId: 0,
        aId: 0,
        nId: 0,
        configData: ""
      },
      // 表单校验
      rules: {
        acId: [{ required: true, message: "配置ID不能为空", trigger: "blur" }],
        cId: [{ required: true, message: "摄像头ID不能为空", trigger: "blur" }],
        aId: [{ required: true, message: "算法ID不能为空", trigger: "blur" }],
        nId: [{ required: true, message: "NPUID不能为空", trigger: "blur" }]
      },
      showDrawBtn: false,
      canDraw: true, // 是否开始绘画
      width: "960", // 绘图区域宽度
      height: "540", // 绘图区域高度
      drawCount: 0,
      // fillStyle: 'rgb(113, 252, 166)',
      fillStyle: "rgba(56,161,36,.3)",
      globalAlpha: 0.5,
      url: "", // 图片路径
      info: [], // 位置点信息
      lineColor: "#f00", // 画笔颜色
      // lineColor: 'green', // 画笔颜色
      lineWidth: 2, // 画笔宽度
      lineType: "rec", // 画笔类型
      random: require("uuid").v1(),
      context: {}, // canvas对象
      boundingClientRect: {},
      // 是否处于绘制状态
      canvasMoveUse: false,
      // 绘制矩形和椭圆时用来保存起始点信息
      beginRec: {
        x: "",
        y: "",
        imageData: ""
      },
      // 储存坐标信息
      drawInfo: [],
      // 背景图片缓存
      img: new Image(),
      history: [], // 存储每次操作
      cerLineHistory: [],
      isArea: false,
      thMiniValue, // 靠边最小阈值
      thXMaxValue: 960 - thMiniValue, // X靠边最大阈值
      thYMaxValue: 540 - thMiniValue // Y靠边最大阈值
    };
  },
  watch: {
    acId: {
      handler(newValue, oldValue) {
        this.drawData.acId = newValue;
      },
      deep: true
    },
    cId: {
      handler(newValue, oldValue) {
        this.drawData.cId = newValue;
      },
      deep: true
    },
    aId: {
      handler(newValue, oldValue) {
        this.drawData.aId = newValue;
      },
      deep: true
    },
    nId: {
      handler(newValue, oldValue) {
        this.drawData.nId = newValue;
      },
      deep: true
    },
    configData: {
      handler(newValue, oldValue) {
        this.drawData.configData = newValue;
      },
      deep: true
    },
    // 监听父组件传来的参数变化
    show: {
      handler(newValue, oldValue) {
        this.dialogShow = newValue;
        if (newValue) {
          this.initData();
        }
      },
      deep: true
    },
    // 子控件显示状态改变，执行父级showChange方法
    dialogShow: {
      handler(newValue, oldeValue) {
        this.eventListener(newValue);
        this.$emit("showChange", newValue);
      },
      deep: true
    }
  },
  // created() {
  //   this.initData()
  // },
  methods: {
    // 加载数据
    initData() {
      const _this = this;
      this.drawData.configData = _this.configData;
      this.drawData.id = _this.acId;
      this.drawData.cId = _this.cId;
      this.drawData.aId = _this.aId;
      this.drawData.nId = _this.nId;
      grabImage(_this.drawData.cId, _this.drawData.id, _this.drawData.aId)
        .then((res) => {
          if (res.code === 200) {
            // console.info(res)
            // _this.drawData = res.data;
            _this.history = [];
            _this.drawInfo = [];
            //
            if (res.data) _this.url = res.data;
            else {
              _this.url =
                "http://" +
                this.$store.state.system.info.sys_app_ip +
                ":8880/static/capture-img/imgNotFound.jpg";
            }
            _this.initDraw();
          } else {
            this.msgError(res.msg);
          }
        })
        .catch((error) => {
          console.log(error);
          _this.url =
            "http://" +
            this.$store.state.system.info.sys_app_ip +
            ":8880/static/capture-img/imgNotFound.jpg";
          _this.initDraw();
        });
    },
    // 初始化画布
    initDraw() {
      if (!this.url) {
        this.$message({
          message: "未找到绘图背景，请联系管理员!",
          type: "error"
        });
        return;
      }
      // 初始化画布
      const canvas = document.getElementById(this.random);
      this.context = canvas.getContext("2d");
      this.boundingClientRect = canvas.getBoundingClientRect();
      // 初始化背景图片
      this.img.setAttribute("crossOrigin", "Anonymous");
      this.img.src = this.url;
      this.img.onerror = () => {
        this.img.src =
          "http://" +
          this.$store.state.system.info.sys_app_ip +
          ":8880/static/capture-img/imgNotFound.jpg";
      };
      this.img.onload = () => {
        // this.clean();
        for (var i = 0; i < 4; i++) {
          this.context.drawImage(this.img, 0, 0, this.width, this.height);
        }
        this.history.push(
          this.context.getImageData(0, 0, this.width, this.height)
        );
        this.initDrawRec(this.drawData);
      };
      // 初始化画笔
      this.context.lineWidth = this.lineWidth;
      this.context.strokeStyle = this.lineColor;
    },
    // 初始化已绘制图形区域
    initDrawRec(data) {
      this.drawCount = 0;
      if (data.configData) {
        const shieldArray = data.configData.split("|");
        shieldArray.forEach((item, index) => {
          const points = [];
          const enArry = item.split(",");
          for (var i = 0; i < enArry.length / 2; i++) {
            points.push({
              x: enArry[i * 2],
              y: enArry[i * 2 + 1]
            });
          }
          this.drawPolygon(points);
        });
        this.drawCount = shieldArray.length;
      }
    },
    // 鼠标按下
    canvasDown(e) {
      this.isArea = true;
      if (this.drawCount > 19) {
        this.$message({
          message: "最多可设置20个屏蔽区，请删除后再绘制",
          type: "error"
        });
        return;
      }
      if (this.canDraw) {
        if (this.lineType === "cer" && this.drawInfo.length > 51) {
          this.$message({
            message: "一个区域最多50个点",
            type: "error"
          });
          return;
        }
        if (this.lineType !== "cer") this.canvasMoveUse = true;
        // client是基于整个页面的坐标，offset是cavas距离pictureDetail顶部以及左边的距离
        // const canvasX = e.clientX - e.target.parentNode.offsetLeft;
        // const canvasY = e.clientY - e.target.parentNode.offsetTop;
        // const canvasX = Math.round(e.clientX - this.boundingClientRect.left)
        // const canvasY = Math.round(e.clientY - this.boundingClientRect.top - 15)
        // const canvasX = e.offsetX;
        // const canvasY = e.offsetY;
        const { canvasX, canvasY } = this.initXY(e.offsetX, e.offsetY);
        // 记录起始点和起始状态
        this.beginRec.x = canvasX;
        this.beginRec.y = canvasY;
        this.beginRec.imageData = this.context.getImageData(
          0,
          0,
          this.width,
          this.height
        );
        // 存储本次绘制坐标信息
        this.drawInfo.push({
          x: canvasX,
          y: canvasY,
          type: this.lineType
        });
        // 起始点
        if (this.lineType === "cer" && this.drawInfo.length === 1) {
          this.cerLineHistory.push(
            this.context.getImageData(0, 0, this.width, this.height)
          );
          this.context.beginPath();
          this.context.arc(canvasX, canvasY, 1.5, 0, 2 * Math.PI);
          this.context.closePath();
          this.context.stroke();
        }
      }
    },
    // 鼠标移动时绘制
    canvasMove(e) {
      if (this.canvasMoveUse && this.canDraw) {
        // client是基于整个页面的坐标，offset是cavas距离pictureDetail顶部以及左边的距离
        // const canvasX = e.clientX - this.boundingClientRect.left
        // const canvasY = e.clientY - this.boundingClientRect.top - 15
        // const canvasX = e.offsetX;
        // const canvasY = e.offsetY;
        this.getMoveXY(e.offsetX, e.offsetY);
        const { canvasX, canvasY } = this.initXY(e.offsetX, e.offsetY);
        if (this.lineType === "rec") {
          // 绘制矩形时恢复起始点状态再重新绘制
          this.moveDrwRec(canvasX, canvasY);
          // this.context.putImageData(this.beginRec.imageData, 0, 0);
          // this.context.beginPath();
          // this.context.rect(
          //   this.beginRec.x,
          //   this.beginRec.y,
          //   canvasX - this.beginRec.x,
          //   canvasY - this.beginRec.y
          // );
          // this.context.fillStyle = this.fillStyle;
          // this.context.globalAlpha = this.globalAlpha;
          // this.context.fill();
          // const info = this.drawInfo[this.drawInfo.length - 1];
          // info.w = canvasX - info.x;
          // info.h = canvasY - info.y;
        } else if (this.lineType === "circle") {
          // 绘制椭圆时恢复起始点状态再重新绘制
          this.context.putImageData(this.beginRec.imageData, 0, 0);
          this.context.beginPath();
          const a = (canvasX - this.beginRec.x) / 2;
          const b = (canvasY - this.beginRec.y) / 2;
          this.drawEllipse(
            this.context,
            this.beginRec.x + a,
            this.beginRec.y + b,
            a > 0 ? a : -a,
            b > 0 ? b : -b
          );
          const info = this.drawInfo[this.drawInfo.length - 1];
          info.a = a / this.width;
          info.b = b / this.height;
          this.context.stroke();
        }
      }
    },
    // 绘制椭圆
    drawEllipse(context, x, y, a, b) {
      context.save();
      var r = a > b ? a : b;
      var ratioX = a / r;
      var ratioY = b / r;
      context.scale(ratioX, ratioY);
      context.beginPath();
      context.arc(x / ratioX, y / ratioY, r, 0, 2 * Math.PI, false);
      context.closePath();
      context.restore();
    },
    // 绘制多边形
    drawPolygon(points) {
      // this.context.putImageData(this.beginRec.imageData, 0, 0);
      this.context.beginPath();
      this.context.moveTo(points[0].x, points[0].y);
      for (var i = 1; i < points.length; i++) {
        this.context.lineTo(points[i].x, points[i].y);
      }
      this.context.fillStyle = this.fillStyle;
      this.context.globalAlpha = this.globalAlpha;
      this.context.fill();
      this.context.closePath();
      this.context.stroke();
      this.history.push(
        this.context.getImageData(0, 0, this.width, this.height)
      );
    },
    // 获取坐标信息
    getInfo() {
      return this.drawInfo;
    },
    eventListener(show) {
      if (show) {
        document.addEventListener("mouseup", this.pageMosuUp);
      } else {
        document.removeEventListener("mouseup", this.pageMosuUp);
      }
    },
    pageMosuUp(e) {
      if (this.lineType == "rec") {
        if (this.isArea && this.canvasMoveUse) {
          console.log("矩形 模拟 up");
          this.canvasUp(e);
          return;
        }
      }
      console.log("无效 page up");
    },
    canvasOut(e) {
      if (this.lineType == "rec") {
        if (this.isArea && this.canvasMoveUse) {
          if (this.moveEndXY && this.maxSpeed) {
            const bgx = this.beginRec.x;
            const bgy = this.beginRec.y;
            // console.log("移出 bgx bgy", bgx, bgy);
            const { x, y } = this.moveEndXY;
            // console.log("移出 end  x y ", x, y);
            let canvasx = x;
            let canvasy = y;
            if (x - bgx < 0 && y - bgy < 0) {
              if (x < y) {
                canvasx = 0;
              } else {
                canvasy = 0;
              }
            }
            if (x - bgx > 0 && y - bgy > 0) {
              const thX = this.width - x;
              const thY = this.height - y;
              if (thX < thY) {
                canvasx = this.width;
              } else {
                canvasy = this.height;
              }
            }

            if (x - bgx < 0 && y - bgy > 0) {
              const thY = this.height - y;
              if (thY < x) {
                canvasy = this.height;
              } else {
                canvasx = 0;
              }
            }

            if (y - bgy < 0 && x - bgx > 0) {
              const thX = this.width - x;
              if (thX < y) {
                canvasx = this.width;
              } else {
                canvasy = 0;
              }
            }

            console.log("超级兵", canvasx, canvasy);
            this.moveDrwRec(canvasx, canvasy);
            return;
          }
        }
        console.log("无效 canvasOut");
      }
    },
    // 移动绘制 矩形
    moveDrwRec(canvasX, canvasY) {
      this.context.putImageData(this.beginRec.imageData, 0, 0);
      this.context.beginPath();
      this.context.rect(
        this.beginRec.x,
        this.beginRec.y,
        canvasX - this.beginRec.x,
        canvasY - this.beginRec.y
      );
      this.context.fillStyle = this.fillStyle;
      this.context.globalAlpha = this.globalAlpha;
      this.context.fill();
      const info = this.drawInfo[this.drawInfo.length - 1];
      info.w = canvasX - info.x;
      info.h = canvasY - info.y;
      this.context.stroke();
    },
    getMoveXY(curOffsetX, curOffsetY) {
      if (this.moveEndXY) {
        const { x, y } = this.moveEndXY;
        if (Math.abs(curOffsetX - x) >= 5 || Math.abs(curOffsetY - y) >= 5) {
          this.maxSpeed = true;
        } else {
          this.maxSpeed = false;
        }
      }
      this.moveEndXY = { x: curOffsetX, y: curOffsetY };
    },
    initXY(x, y) {
      if (x < this.thMiniValue) {
        x = 0;
      }
      if (y < this.thMiniValue) {
        y = 0;
      }
      if (x > this.thXMaxValue) {
        x = this.width;
      }
      if (y > this.thYMaxValue) {
        y = this.height;
      }
      return { canvasX: x, canvasY: y };
    },
    // 鼠标抬起
    canvasUp(e) {
      if (this.canDraw) {
        this.canvasMoveUse = false;
      }
      if (!this.isArea) {
        this.$message({
          message: "绘图超出边界,请重新绘制",
          type: "error"
        });
        this.revoke();
        return;
      }
      if (this.drawCount > 19) {
        this.$message({
          message: "最多可设置20个屏蔽区，请删除后再绘制",
          type: "error"
        });
        return;
      }
      if (this.drawInfo.length > 1 && this.lineType === "cer") {
        this.context.beginPath();
        const moveToX = this.drawInfo[this.drawInfo.length - 2].x;
        const moveToY = this.drawInfo[this.drawInfo.length - 2].y;
        // 定义直线的起点坐标
        this.context.moveTo(moveToX, moveToY);
        // 定义直线的终点坐标
        const lineToX = this.drawInfo[this.drawInfo.length - 1].x;
        const lineToY = this.drawInfo[this.drawInfo.length - 1].y;
        this.context.lineTo(lineToX, lineToY);
        // 沿着坐标点顺序的路径绘制直线
        this.context.stroke();
        // 关闭当前的绘制路径
        this.context.closePath();
      }
      if (this.lineType === "rec") {
        this.history.push(
          this.context.getImageData(0, 0, this.width, this.height)
        );
        //
        if (this.drawCount < 20) this.drawCount++;
        else return;
        const info = this.drawInfo[this.drawInfo.length - 1];
        // var x = info.x
        // var y = info.y
        // var w = info.w
        // var h = info.h

        if (info !== undefined) {
          if (isNaN(info.x)) {
            this.$message({
              message: "绘图超出边界,请重新绘制",
              type: "error"
            });
            this.revoke();
          }
          if (isNaN(info.y)) {
            this.$message({
              message: "绘图超出边界,请重新绘制",
              type: "error"
            });
            this.revoke();
          }
          if (isNaN(info.w)) {
            this.$message({
              message: "需拖拽,请重新绘制",
              type: "error"
            });
            // this.revoke()
            return;
          }
          if (isNaN(info.h)) {
            this.$message({
              message: "需拖拽,请重新绘制",
              type: "error"
            });
            // this.revoke()
            return;
          }
          if (!this.drawData.configData) {
            // console.info('setRecData' + JSON.stringify(info))
            this.drawData.configData = this.setRecData(info);
          } else {
            // console.info('setRecData |||||||||' + JSON.stringify(info))
            this.drawData.configData += "|" + this.setRecData(info);
          }
        } else {
          this.$message({
            message: "绘图超出边界,请重新绘制",
            type: "error"
          });
        }
      }
      this.isArea = false;
    },
    // 清空画布
    clean() {
      for (var i = 0; i < 10; i++) {
        this.context.drawImage(this.img, 0, 0, this.width, this.height);
      }
      this.drawInfo = [];
      this.history = [];
      this.drawData.configData = "";
      this.drawCount = 0;
    },
    // 多边形区域绘制完成事件
    setImgInfo() {
      if (this.drawInfo.length < 2) {
        this.$message({
          message: "请绘制图案!!",
          type: "error"
        });
        return;
      }
      if (this.lineType === "cer") {
        this.cerLineHistory = [];
        if (!this.drawData.configData) {
          this.drawData.configData = "";
        } else {
          this.drawData.configData += "|";
        }
        this.drawInfo.forEach((item, index) => {
          this.drawData.configData += item.x + "," + item.y + ",";
        });
        this.drawData.configData = this.drawData.configData.substring(
          0,
          this.drawData.configData.length - 1
        );
        //
        this.drawPolygon(this.drawInfo);
        this.$message({
          message: "屏蔽区绘图完成!!",
          type: "success"
        });
        this.drawCount++;
        this.drawInfo = [];
      }
    },
    // 拼接矩形四个点坐标
    setRecData(info) {
      return (
        Math.floor(info.x) +
        "," +
        Math.floor(info.y) +
        "," +
        Math.floor(info.x + info.w) +
        "," +
        Math.floor(info.y) +
        "," +
        Math.floor(info.x + info.w) +
        "," +
        Math.floor(info.y + info.h) +
        "," +
        Math.floor(info.x) +
        "," +
        Math.floor(info.y + info.h)
      );
    },
    // 清空画布
    cleanAll() {
      const _this = this;
      _this.clean();
    },
    // 绘画图形切换事件
    radioChange() {
      if (this.lineType !== "cer") {
        this.showDrawBtn = false;
      } else {
        this.showDrawBtn = true;
      }
      if (this.cerLineHistory.length > 0) this.clearCerLine();
      this.drawInfo = [];
    },
    // 撤销
    revoke() {
      this.history.pop();
      if (this.history.length > 0) {
        // 从存入的记录里删除
        this.context.putImageData(this.history[this.history.length - 1], 0, 0);
        this.drawCount--;
        const shieldArray = this.drawData.configData.split("|");
        shieldArray.pop();
        this.drawData.configData = shieldArray.join("|");
        if (this.lineType === "cer") {
          this.drawInfo = [];
        }
      }
    },
    // 清除未完成多边形的边线
    clearCerLine() {
      this.context.putImageData(this.cerLineHistory[0], 0, 0);
      this.cerLineHistory.pop();
      this.drawInfo = [];
    },
    // 提交表单
    submitForm: function() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          updateShieldLine(this.drawData).then((response) => {
            if (response.code === 200) {
              this.updateData(this.drawData, response.data);
              this.msgSuccess(response.msg);
              this.dialogShow = false;
              // this.reset()
            } else {
              this.msgError(response.msg);
              // this.reset()
            }
          });
        }
      });
    },
    updateData(resData, id) {
      this.$emit("updateItem", { id: id, shieldLine: resData.configData });
    },
    // 关闭弹框的事件
    closeDialog() {
      this.reset();
    },
    // 表单重置
    reset() {
      this.drawData = {
        acId: 0,
        cId: 0,
        nId: 0,
        configData: ""
      };
      this.dialogShow = false;
      this.resetForm("form");
    }
  }
};
</script>
<style lang="scss">
.identifyRadio {
  .el-radio__inner {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    border: 1px solid #7558f4;
  }
  .el-radio__input.is-checked .el-radio__inner {
    background: none;
  }
  .el-radio__inner:after {
    width: 18px;
    height: 18px;
    transition: none;
    border-radius: 4px;

    // color: #7558f4;
    background-color: #654ef4;
  }
}
.el-dialog {
  border-radius: 8px;
  padding: 20px;
}
.el-dialog__title {
  font-size: 24px;
  font-weight: 700;
  color: #7558f4;
}
</style>
