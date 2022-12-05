<template>
  <div :key="refreshTime" class="ipDiv" @paste="pasting">
    <el-input
      :ref="'ipv1' + keySet"
      v-model="ipv1"
      size="mini"
      class="ip-el-input"
      @focus="focusInput('ipv2' + keySet)"
    />
    <div class="ipDiv-dot">.</div>
    <el-input
      :ref="'ipv2' + keySet"
      v-model="ipv2"
      size="mini"
      class="ip-el-input"
      @focus="focusInput('ipv3' + keySet)"
    />
    <div class="ipDiv-dot">.</div>
    <el-input
      :ref="'ipv3' + keySet"
      v-model="ipv3"
      size="mini"
      class="ip-el-input"
      @focus="focusInput('ipv4' + keySet)"
    />
    <div class="ipDiv-dot">.</div>
    <el-input
      :ref="'ipv4' + keySet"
      v-model="ipv4"
      size="mini"
      class="ip-el-input"
      @blur="check = null"
    />
    <!-- <i
      class="el-icon-document-copy"
      v-clipboard:copy="ipInfo.ip"
      v-clipboard:success="onCopy"
      v-clipboard:error="onError"
    /> -->
  </div>
</template>
<script>
export default {
  props: {
    // 是否需要自动聚焦
    autoFocus: {
      type: Boolean,
      default: false,
    },
    ipType: {
      type: String || Number,
      String: "ip",
      default: false,
    },
    configIp: {
      type: String,
      default: String,
    },
    keySet: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      ipv1: null,
      ipv2: null,
      ipv3: null,
      ipv4: null,
      check: null,
      ipInfo: {
        flag: false,
        ip: null,
      },
      ipInfo1: {
        flag: false,
        ip: null,
      },
      refreshTime: null,
    };
  },
  watch: {
    ipv1: {
      handler(cur) {
        // this.$refs.ipv4.focus();
        // console.log('cur:' + this.valid(cur))
        if (this.valid(cur)) {
          if (Number(cur) === 0) {
            return (this.ipv1 = null);
          }
          if (this.ipType === "ip") {
            if (cur > 253) {
              this.ipv1 = 253;
              // if (this.autoFocus) this.$refs[`ipv2${this.keySet}`].focus()
              this.$message({
                message: "只能输入1~253之间的数字",
                type: "warning",
                duration: 1000,
              });
            }
          } else if (this.ipType === "subnet") {
            if (cur > 255) {
              this.ipv1 = 255;
              // if (this.autoFocus) this.$refs[`ipv2${this.keySet}`].focus()
              this.$message({
                message: "只能输入1~255之间的数字",
                type: "warning",
                duration: 1000,
              });
            }
          }
          if (cur.length === 3) {
            // if (this.autoFocus) this.$refs[`ipv2${this.keySet}`].focus()
          }
          this.returnIpInfo();
        } else {
          this.ipv1 = null;
        }
      },
    },
    ipv2: {
      handler(cur) {
        // console.log('cur:' + this.valid(cur))
        if (this.valid(cur)) {
          if (cur > 255) {
            this.ipv2 = 255;
            // if (this.autoFocus) this.$refs[`ipv3${this.keySet}`].focus()
          } else {
            this.ipv2 = Number(cur);
          }
          if (cur.length === 3) {
            // if (this.autoFocus) this.$refs[`ipv3${this.keySet}`].focus()
          }
          this.returnIpInfo();
        } else {
          this.ipv2 = null;
        }
      },
    },
    ipv3: {
      handler(cur) {
        // console.log('cur:' + this.valid(cur))
        // console.log('cur:' + cur)
        if (this.valid(cur)) {
          if (cur > 255) {
            this.ipv3 = 255;
            // if (this.autoFocus) this.$refs[`ipv4${this.keySet}`].focus()
          } else {
            this.ipv3 = Number(cur);
          }
          if (cur.length === 3) {
            // if (this.autoFocus) this.$refs[`ipv4${this.keySet}`].focus()
          }
          this.returnIpInfo();
        } else {
          this.ipv3 = null;
        }
      },
    },
    ipv4: {
      handler(cur) {
        // console.log('cur:' + this.valid(cur))
        if (this.valid(cur)) {
          if (Number(cur) === 0) {
            return (this.ipv4 = null);
          }
          if (cur > 254) {
            this.ipv4 = 254;
          }
          if (cur === 0) {
            this.ipv4 = null;
          }
          this.returnIpInfo();
        } else {
          this.ipv4 = null;
        }
      },
    },
    configIp: {
      handler(cur) {
        // console.log('cur:' + this.valid(cur))
        this.initIpconponent();
      },
    },
  },
  mounted() {
    this.init();
  },
  // 销毁键盘监听事件,enter按下事件
  destroyed() {
    document.removeEventListener("keydown", this.getEventType);
  },
  methods: {
    init() {
      this.initEvent();
      this.initIpconponent();
    },
    onCopy() {
      this.$message({
        message: "复制成功",
        type: "success",
        duration: 1000,
      });
    },
    onError() {
      this.$message({
        message: "复制失败",
        type: "error",
        duration: 1000,
      });
    },
    pasting(e) {
      // console.log('pasting-e:', e)
      // console.log('value:', e.clipboardData.getData('text/plain'))
      const tempIp = e.clipboardData.getData("text/plain");
      // console.log('tempIpArr:', tempIp.split('.'))
      const tempIpArr = tempIp.split(".");
      this.ipv1 = tempIpArr[0] || null;
      this.ipv2 = tempIpArr[1] || null;
      this.ipv3 = tempIpArr[2] || null;
      this.ipv4 = tempIpArr[3] || null;
      this.refreshTime = new Date().getTime();
    },
    initIpconponent() {
      // console.log('ip 组件初始化')
      this.ipv1 = this.configIp.split(".")[0] || null;
      this.ipv2 = this.configIp.split(".")[1] || null;
      this.ipv3 = this.configIp.split(".")[2] || null;
      this.ipv4 = this.configIp.split(".")[3] || null;
      this.ipInfo = this.ipInfo1;
      //   if (this.autoFocus) {
      //     let ipEn = this.$refs[`ipv1${this.keySet}`];
      //     ipEn.focus();
      //   }
    },
    // 返回ip信息
    returnIpInfo() {
      if (
        this.ipv1 === null ||
        this.ipv2 === null ||
        this.ipv3 === null ||
        this.ipv4 === null
      ) {
        this.ipInfo.flag = false;
      } else {
        this.ipInfo.flag = true;
      }
      this.ipInfo.ip =
        this.ipv1 + "." + this.ipv2 + "." + this.ipv3 + "." + this.ipv4;
      this.$emit("getIp", this.ipInfo);
    },
    // 当前聚焦输入框,预先聚焦下一个输入框
    focusInput(flag) {
      this.check = flag;
    },
    // 初始化键盘事件,监听enter按下事件
    initEvent() {
      document.addEventListener("keydown", this.getEventType);
    },
    // 各分支IP校验正则表达式
    valid(val) {
      const reg = /^\d{1,}$/;
      return reg.test(val);
    },
    // enter按键后，所聚焦的输入框
    getEventType(e) {
      /*  console.log('check: ', this.check)
      console.log('e: ', e) */
      // console.log('e: ', e)
      // console.log('ipv1:', this.ipv1)
      // console.log('ipv2:', this.ipv2)
      // console.log('ipv3:', this.ipv3)
      // console.log('ipv4:', this.ipv4)
      if (e.keyCode === 13 || e.keyCode === 110) {
        switch (this.check) {
          case "ipv1":
            if (this.ipv4 === null) return;
            // this.$refs.ipv1.focus();
            this.$refs[`ipv1${this.keySet}`].focus();
            break;
          case "ipv2":
            if (this.ipv1 === null) return;
            // this.$refs.ipv2.focus();
            this.$refs[`ipv2${this.keySet}`].focus();
            break;
          case "ipv3":
            if (this.ipv2 === null) return;
            // this.$refs.ipv3.focus();
            this.$refs[`ipv3${this.keySet}`].focus();
            break;
          case "ipv4":
            if (this.ipv3 === null) return;
            // this.$refs.ipv4.focus();
            this.$refs[`ipv4${this.keySet}`].focus();
            break;
          // default:
          //   this.$refs.ipv1.focus()
        }
      }
    },
  },
};
</script>
<style>
.ipDiv {
  width: 100%;
  display: flex;
  border: 1px solid #eeeeee;
  border-radius: 4px;
}
.ip-el-input {
  width: 25%;
  text-align: center;
}
.ipDiv .el-input__inner,
.ipDiv .el-input__inner:focus {
  text-align: center;
  border: 0;
}
.el-input__inner {
  width: 100%;
}
.ipDiv-dot {
  width: 3%;
}
</style>
