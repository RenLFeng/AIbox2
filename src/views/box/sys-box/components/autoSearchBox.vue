<template>
  <el-dialog
    title="扫描添加盒子"
    width="917px"
    :visible.sync="openByIPVisible"
    style="padding: 40px"
    class="searchBox"
  >
    <div v-if="!isShow">
      <el-form
        ref="queryFormByIP"
        :model="queryParamsByIP"
        :inline="true"
        label-width="100px"
      >
        <el-row type="flex">
          <el-col :span="3">
            <span
              style="
                font-size: 14px;
                position: relative;
                top: 20%;
                transform: translateY(-50%);
              "
            >设备网段</span>
          </el-col>
          <el-col :span="9">
            <el-form-item>
              <ip-input
                :key-set="1"
                :ip-type="'ip'"
                :auto-focus="true"
                :config-ip="beginIP"
                @getIp="getIpAddr"
              />
              <!--              <IpAddress v-model="beginIP" @change="changeIp" />-->
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <span
              style="
                font-size: 18px;
                position: relative;
                top: 10%;
                left: 25%;
                transform: translateY(-50%);
              "
            >-</span>
          </el-col>
          <el-col :span="9">
            <el-form-item>
              <ip-input
                :key-set="2"
                :ip-type="'ip'"
                :auto-focus="true"
                :config-ip="endIP"
                @getIp="getEndIpAddr"
              />
              <!--              <IpAddress v-model="endIP" @change="changeIp" />-->
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-button
                type="primary"
                style="background: linear-gradient(to bottom, #a388ff, #654ef4)"
                @click="handleQueryByIP"
              >
                <svg-icon icon-class="newSearch" style="vertical-align: -2px" />
                搜索设备
              </el-button>
              <!-- <div class="seek-33" @click="handleQueryByIP">
                <svg-icon
                  icon-class="newSearch"
                  style="vertical-align:0
                      "
                />
                <span>搜索</span>
              </div> -->
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 自动搜索局域网盒子添加对话框 -->
      <el-table
        v-loading="loadingByIP"
        :data="sysboxListByIP"
        empty-text="未搜索到盒子！"
        border
        @selection-change="handleSelectionChangeByIP"
      >
        <el-table-column
          type="selection"
          width="55"
          :selectable="
            (row) => {
              return row.boxStatus === '2';
            }
          "
          align="center"
        />
        <!-- :selectable="selectInit" -->
        <!--            <el-table-column type="selection" width="55" align="center" />-->
        <el-table-column
          label="盒子名称"
          align="center"
          prop="boxName"
          :show-overflow-tooltip="true"
          width="auto"
        />
        <el-table-column
          v-if="showCol"
          label="序列号"
          align="center"
          prop="boxSno"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="盒子IP/域名"
          align="center"
          prop="boxIp"
          :show-overflow-tooltip="true"
          width="auto"
        />
        <el-table-column
          label="算法"
          align="center"
          prop="sysAiName"
          :show-overflow-tooltip="true"
          width="auto"
        />
        <el-table-column
          v-if="showCol"
          label="盒子类型"
          align="center"
          prop="boxType"
          :formatter="boxTypeFormat"
          width="auto"
        >
          <template slot-scope="scope">
            {{ boxTypeFormat(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          align="center"
          :formatter="boxStatusFormat"
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.boxStatus === '2' ? 'success' : 'danger'"
              disable-transitions
            >{{ boxStatusFormat(scope.row) }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="box-add">
        <el-button @click="openByIPVisible = false">取 消</el-button>
        <el-button
          type="primary"
          :disabled="multipleSelection.length === 0"
          @click="submitFormByIP"
        >添 加
        </el-button>
      </div>
    </div>
    <div v-else class="empty">
      <div class="img">
        <img src="../../../../assets/logo/nofind.png" alt="">
      </div>
      <div class="text">未搜索到盒子！</div>
      <div class="add" @click="show">添加</div>
    </div>
  </el-dialog>
</template>
<script>
import { addSysBoxByIP, listSysBoxByIP } from "@/api/box/sys-box";
// import IpAddress from './IpAddress.vue'
import ipInput from "./ipInput";
export default {
  name: "AutoSearchBox",
  components: {
    // IpAddress
    ipInput
  },
  props: {
    boxTypeOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // 用户权限控制列显示
      showCol: true,
      isShow: false,
      openByIPVisible: false,
      loadingByIP: false,
      queryParamsByIP: {
        pageIndex: 1,
        pageSize: 10,
        beginIP: undefined,
        endIP: undefined
      },
      beginIP: "",
      endIP: "",
      multipleSelection: [],
      sysboxListByIP: []
    };
  },
  created() {
    this.getHost(this.$store.state.system.info.sys_app_ip);
    const roles = this.$store.state.user.roles;
    if (roles.indexOf("normal") !== -1) {
      // 修改对应角色名，控制权限
      this.showCol = false;
    }
  },
  activated() {
    this.getDicts("sys_box_status").then((response) => {
      this.boxStatusOptions = response.data;
    });
  },
  methods: {
    // 展开状态
    show() {
      this.isShow = true;
    },
    getIpAddr(ip) {
      // console.info('getIpAddr' + JSON.stringify(ip))
      this.beginIP = ip.ip;
    },
    getEndIpAddr(ip) {
      this.endIP = ip.ip;
    },
    /** 扫描添加盒子状态判断禁用 2正常其他可以 */
    selectInit(row, index) {
      console.log(row, "row");
      return row.boxStatus === "2" && row.sysAiName !== "";
    },
    open(data) {
      this.sysboxListByIP = [];
      this.$data.queryParamsByIP =
        this.$options.data.call(this).queryParamsByIP;
      this.openByIPVisible = true;
    },
    // 多选框选中数据
    handleSelectionChangeByIP(selection) {
      // console.log(selection)
      this.multipleSelection = selection;
    },
    /** 搜索按钮操作 */
    handleQueryByIP() {
      this.queryParamsByIP.pageIndex = 1;
      this.queryParamsByIP.beginIP = this.beginIP;
      this.queryParamsByIP.endIP = this.endIP;
      this.getListByIP();
    },
    getListByIP() {
      this.$refs["queryFormByIP"].validate((valid) => {
        if (valid) {
          this.loadingByIP = true;
          listSysBoxByIP(
            this.addDateRange(this.queryParamsByIP, this.dateRange)
          ).then((response) => {
            this.sysboxListByIP = response.data.list;
            this.total = response.data.count;
            this.loadingByIP = false;
          });
        }
      });
    },
    // getIpAddr(ip) {
    //   this.beginIP = this.$store.state.system.info.sys_app_ip
    //   const ipArry = this.$store.state.system.info.sys_app_ip.split('.')
    //   ipArry.pop()
    //   const ipSet = ipArry.join('.') + '.255'
    //   this.endIP = ipSet
    // },
    getHost(ip) {
      const begIndex = ip.lastIndexOf(".");
      const rootIp = ip.substring(0, begIndex);
      this.endIP = rootIp + ".255";
      this.beginIP = rootIp + ".1";
    },
    submitFormByIP: function() {
      addSysBoxByIP(this.multipleSelection).then((response) => {
        if (response.code === 200) {
          this.msgSuccess("新增成功");
          this.openByIPVisible = false;
          this.$emit("success");
        } else {
          this.msgError(response.msg);
        }
      });
    },
    boxTypeFormat(row) {
      return this.selectDictLabel(this.boxTypeOptions, row.boxType);
    },
    boxStatusFormat(row) {
      return this.selectDictLabel(this.boxStatusOptions, row.boxStatus);
    },
    fedStatusFormat(row) {
      return this.selectDictLabel(this.fedStatusOptions, row.fedStatus);
    },
    productNameFormat(row) {
      return this.selectDictLabel(this.sysProductNameOptions, row.pId);
    },
    deptNameFormat(row) {
      return this.selectDictLabel(this.sysDeptNameOptions, row.deptId);
    }
  }
};
</script>
<style lang="scss" scoped>
.box-add {
  text-align: center;
  margin: 40px auto;

  .el-button--default {
    color: #c3c1c7;
    padding: 10px 30px;
  }

  .el-button--primary {
    padding: 10px 30px;
    background: linear-gradient(to bottom, #a388ff, #654ef4);
  }
}

.searchBox {
  .el-dialog {
    .el-dialog__header {
      text-align: center;
      border-bottom: 1px solid #ededed;

      .el-dialog__title {
        color: #7558f4;
        font-size: 24px;
        font-weight: 700;
      }
    }
  }
}

.empty {
  height: 400px;
  text-align: center;
  font-size: 16px;

  // background: url(../../../../assets/logo/nofind.png) no-repeat center top;
  .img {
    border: dashed 1px #c3c1c7;
    width: 475px;
    height: 256px;
    margin: 124px auto 0px;
  }

  .text {
    padding-top: 25px;
    color: #c3c1c7;
  }

  .add {
    cursor: pointer;
    margin: 20px auto;
    width: 120px;
    line-height: 40px;
    color: #c3c1c7;
    border-radius: 4px;
    background: linear-gradient(to bottom, #a388ff, #654ef4);
  }
}

.el-dialog {
  padding: 0 40px;
}

.el-dialog__header {
  height: 110px;
  line-height: 110px;
  text-align: center;
  border-bottom: 1px solid #ededed;

  .el-dialog__title {
    color: #7558f4;
    font-size: 24px;
    font-weight: 700;
  }
}

.seek-33 {
  cursor: pointer;
  margin-left: 20px;

  span {
    vertical-align: 3px;
    margin-left: 10px;
  }

  width: 85px;
  height: 37px;
  line-height: 37px;
  background: linear-gradient(to bottom, #a388ff, #654ef4);
  text-align: center;
  vertical-align: middle;
  color: #fff;
  font-size: 16px;
  border-radius: 4px;
}
</style>
