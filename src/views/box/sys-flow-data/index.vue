<template>
  <BasicLayout>
    <template #wrapper>
      <div class="main-box flow-history-wrap">
        <el-card class="box-card">
          <div class="container">
            <el-row>
              <el-form
                ref="formref"
                class="formdata-wrap"
                :model="seachForm"
                label-width="auto"
                :inline="true"
              >
                <el-form-item label="流程名称:">
                  <el-input
                    v-model="seachForm.nodeName"
                    placeholder="请输入流程名称"
                  />
                </el-form-item>
                <el-form-item class="steps" label="流程状态:">
                  <el-select
                    v-model="seachForm.status"
                    placeholder="请选择流程状态"
                  >
                    <el-option
                      v-for="(v, i) in flowStatusLists"
                      :key="i"
                      :label="v.label"
                      :value="v.state"
                    />
                  </el-select>
                </el-form-item>
                <!-- value-format="yyyy-MM-dd" -->
                <el-form-item>
                  <el-date-picker
                    v-model="dateValue"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00', '23:59:59']"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary"
                    icon="el-icon-search"
                    @click="handleSeach('query')"
                  >查询
                  </el-button>
                  <el-button
                    icon="el-icon-refresh"
                    @click="handleSeach('reset')"
                  >重置</el-button>
                </el-form-item>
              </el-form>
            </el-row>
            <div class="table-wrap">
              <el-table
                v-loading="loading"
                :data="tableDataList"
                style="width: 100%"
              >
                <el-table-column label="流程名称" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.nodeName }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="开始时间" align="center">
                  <template slot-scope="scope">
                    <span>{{
                      scope.row.startAt ? parseTime(scope.row.startAt) : "-"
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="结束时间" align="center">
                  <template slot-scope="scope">
                    <span>{{
                      scope.row.endAt ? parseTime(scope.row.endAt) : "-"
                    }}</span></template>
                </el-table-column>
                <el-table-column label="流程状态" align="center">
                  <template slot-scope="scope">
                    <span>{{ showFlowStatesText(scope.row.status) }}</span>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      size="small"
                      @click="ViewDetailFn(scope.row)"
                    >
                      <svg-icon
                        icon-class="View"
                        style="vertical-align: -2px"
                      />
                      查看详情
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="queryParams.pageIndex"
            :limit.sync="queryParams.pageSize"
            @pagination="getLists(queryParams)"
          />
        </el-card>
        <el-dialog
          :visible.sync="openDeiltDialog"
          :close-on-click-modal="false"
          class="flow-deilt-dialog fulldialog"
        >
          <div slot="title" class="detil-title">
            <div class="slot-title">流程详情</div>
            <div class="flow-name">
              <p>
                <span>名称:&nbsp;</span><span>{{ curFlowData.nodeName }}</span>
              </p>
              <p class="flow-status">
                <el-tag :type="`${curFlowData.status ? 'success' : 'info'}`">{{
                  showFlowStatesText(curFlowData.status)
                }}</el-tag>
              </p>
            </div>
          </div>
          <div class="detil-lists h100">
            <el-table
              :data="curFlowData.children"
              style="width: 100%"
              class="detil-table"
              :style="'height: 100%;    overflow: auto;'"
              :stripe="true"
            >
              <el-table-column :label="`流程：${curFlowData.children.length}`">
                <template slot-scope="scope">
                  <div style="position: relative; padding-left: 35px">
                    <span class="sort-index position-l">{{
                      scope.$index + 1
                    }}</span>
                    <span>{{ scope.row.nodeName }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="时间">
                <template slot-scope="scope">
                  <span>{{
                    scope.row.startAt ? parseTime(scope.row.startAt) : "-"
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column label="摄像头">
                <template slot-scope="scope">
                  <span>{{
                    scope.row.camName ? scope.row.camName : "-"
                  }}</span></template>
              </el-table-column>
              <el-table-column label="算法名称">
                <template slot-scope="scope">
                  <span>{{
                    scope.row.aiName ? scope.row.aiName : "-"
                  }}</span></template>
              </el-table-column>
              <el-table-column label="抓拍图片">
                <template slot-scope="scope">
                  <span v-if="!scope.row.imgFilePath">-</span>
                  <div v-else>
                    <my-image
                      v-if="openDeiltDialog"
                      :src="scope.row.imgpath"
                      :preview-list="[scope.row.imgpath]"
                      width="80px"
                      height="50px"
                    />
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="" width="100">
                <template slot-scope="scope">
                  <div style="display: flex; flex-direction: column">
                    <span
                      :class="`${
                        endStates(scope.row.status)
                          ? 'el-icon-success endstates'
                          : ''
                      } tc`"
                    >{{ !endStates(scope.row.status) ? "-" : "" }}</span>
                    <span
                      v-if="scope.row.status && scope.row.status < 0"
                      style="font-size: 12px"
                    >超时自动结束</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-dialog>
      </div>
    </template>
  </BasicLayout>
</template>

<script>
import { sysFlowData } from "@/api/box/sys-ai";
import { parseTime } from "@/utils/costum";
const curDate = () => {
  const f_date = new Date();
  const f_y = f_date.getFullYear();
  const f_m = f_date.getMonth() + 1;
  const f_d = f_date.getDate();
  const f_date_str = `${f_y}-${f_m}-${f_d} 00:00:00`;
  let l_date = new Date().getTime() + 86400000;
  l_date = new Date(l_date);
  const l_y = l_date.getFullYear();
  const l_m = l_date.getMonth() + 1;
  const l_d = l_date.getDate();
  const l_date_str = `${l_y}-${l_m}-${l_d} 23:59:59`;
  return [parseTime(f_date_str), parseTime(l_date_str)];
};
const flowStatusLists = [
  {
    label: "进行中",
    state: 1
  },
  {
    label: "已结束",
    state: 0
  }
];
export default {
  name: "SysFlowDataManage",
  components: {},
  data() {
    return {
      loading: false,
      show: true,
      flowStatusLists,
      seachForm: {
        nodeName: "",
        status: "",
        createdAtOrder: "desc",
        beginTime: "",
        endTime: ""
      },
      dateValue: curDate(),
      tableDataList: [],
      openDeiltDialog: false,
      curFlowData: {
        children: []
      },
      total: 0,
      queryParams: {
        createdAtOrder: "desc",
        pageIndex: 1,
        pageSize: 10,
        beginTime: "",
        endTime: ""
      }
    };
  },
  computed: {
    _beginTime() {
      return `${this.dateValue[0]}`;
    },
    _endTime() {
      return `${this.dateValue[1]}`;
    }
  },
  activated() {
    this.getLists(this.queryParams);
  },
  created() {},
  mounted() {},
  methods: {
    async getLists(queryData = {}) {
      this.loading = true;
      this.setFiletime(queryData);
      let temp = [];
      const { data } = await sysFlowData(queryData);
      if (data.count) {
        this.total = data.count;
      }
      if (data && data.list && Array.isArray(data.list)) {
        temp = data.list;
      }
      this.tableDataList = temp;
      this.loading = false;
    },
    handleSeach(type) {
      switch (type) {
        case "query":
          this.getLists(this.seachForm);
          break;
        case "reset":
          this.seachForm = {
            nodeName: "",
            status: "",
            beginTime: "",
            endTime: ""
          };
          this.dateValue = curDate();
          this.getLists(this.queryParams);
          break;
      }
    },
    ViewDetailFn(row) {
      if (row.children) {
        for (const v of row.children) {
          v.imgpath = "";
          // v.imgpaths = [];
          if (v.imgFilePath) {
            if (typeof v.imgFilePath === "string") {
              v.imgFilePath = JSON.parse(v.imgFilePath);
            }
            if (Array.isArray(v.imgFilePath) && v.imgFilePath.length) {
              v.imgpath = v.imgFilePath[0].imgUrl;
              // for (const imgItem of v.imgFilePath) {
              //   v.imgpaths.push(imgItem.imgUrl);
              // }
            }
          }
        }
      }
      console.log("详情", row);
      this.curFlowData = row;
      this.openDeiltDialog = true;
    },
    endStates(states) {
      if (states + "" === "0" || states + "" === "-1") {
        return true;
      }
      return false;
    },
    showFlowStatesText(state) {
      for (const v of this.flowStatusLists) {
        if (parseInt(v.state) === parseInt(state)) {
          return v.label;
        }
      }
      return "未开始";
    },
    setFiletime(queryParams = {}) {
      if (this.dateValue && this.dateValue.length) {
        queryParams["beginTime"] = `${this.dateValue[0]}`;
        queryParams["endTime"] = `${this.dateValue[1]}`;
      }
    }
  }
};
</script>
<style scoped lang="scss">
.main-box {
  .table-wrap {
    margin: 20px 0;
  }

  .flow-deilt-dialog {
    .detil-title {
      .tit {
        font-size: 20px;
        margin-bottom: 15px;
      }

      .flow-name {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 20px;
        padding-right: 20px;
        p {
          margin: 0;
        }
      }

      .flow-size {
        color: #666;
        margin: 0;
        font-size: 14px;
        margin-top: 25px;
      }

      p {
        color: #666;

        margin: 5px 0;
      }
    }

    .detil-lists {
      .item-detil {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 25px;
        border-bottom: 1px solid #f0f0f0;
      }
    }

    .sort-index {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 1px solid #7558f4;
      border-radius: 50%;
      text-align: center;
      line-height: 20px;
      font-size: 12px;
      margin-right: 5px;
      background: #7558f4;
      color: #fff;
    }
  }
  .detil-table {
    .endstates {
      color: #13ce66;
      font-size: 24px;
    }
  }
}
</style>
<style>
.flow-history-wrap .el-dialog__body {
  padding-top: 0;
}

.flow-history-wrap .detil-table .el-table__header-wrapper th {
  background: #fff !important;
  border-bottom: 1px dashed #ccc;
}

.detil-table .el-table__header-wrapper {
  /* height: 20px; */
}

.detil-table.el-table::before {
  opacity: 0;
}
.detil-table td {
  height: 30px;
}
</style>
