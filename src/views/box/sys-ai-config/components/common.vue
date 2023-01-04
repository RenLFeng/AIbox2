<script>
export default {
  name: "",
  components: {},
  data() {
    const thMiniValue = 3;
    return {
      thMiniValue, // 靠边最小阈值
      thXMaxValue: 960 - thMiniValue, // X靠边最大阈值
      thYMaxValue: 540 - thMiniValue // Y靠边最大阈值
    };
  },
  watch: {
    // 子控件显示状态改变，执行父级showChange方法
    dialogShow: {
      handler(newValue, oldeValue) {
        this.eventListener(newValue);
        if (!newValue) {
          setTimeout(() => {
            this.cleanAll();
            this.loadingImg = true;
          }, 500);
        }
      },
      deep: true
    }
  },
  created() {},
  activated() {},
  mounted() {},
  deactivated() {},
  beforeDestroy() {},
  methods: {
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
          //   console.log("矩形 模拟 up");
          this.canvasUp(e);
          return;
        }
      }
      // console.log("无效 page up");
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

            // console.log("超级兵", canvasx, canvasy);
            this.moveDrwRec(canvasx, canvasy);
            return;
          }
        }
        // console.log("无效 canvasOut");
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
        if (
          Math.abs(curOffsetX - x) >= this.thMiniValue ||
          Math.abs(curOffsetY - y) >= this.thMiniValue
        ) {
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
    }
  }
};
</script>
