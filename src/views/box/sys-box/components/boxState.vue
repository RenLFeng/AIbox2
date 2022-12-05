<template>

  <el-card class="box-management">
    <div class="query">
      <el-form
        ref="queryForm"
        :model="queryParams"
        :inline="true"
        label-width="90px"
      >
        <el-form-item label="盒子名称" prop="boxName">
          <el-input
            v-model="queryParams.boxName"
            prefix-icon="el-icon-search"
            placeholder="请输入盒子名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="盒子状态" prop="boxStatus">
          <el-select
            v-model="queryParams.boxStatus"
            placeholder="请选择盒子在线状态"
            clearable
            size="small"
          >
            <el-option
              v-for="dict in boxStatusQueryOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <!-- <el-button type="primary" @click="handleQuery">查询 </el-button> -->
          <div class="right-box-message">
            <div class="left">
              <div class="seek-1" @click="handleQuery">
                <svg-icon
                  icon-class="newSearch"
                  style="vertical-align:0
                      "
                />
                <span>查询</span>
              </div>
              <div class="reset-1">重置</div>
            </div>
            <div class="right">
              <div class="scanning" @click="handleIPAdd">
                <svg-icon
                  icon-class="scanning"
                  style="vertical-align:0
                      "
                />
                <span>扫描添加盒子</span>
              </div>
            </div>
          </div>
          <!-- <el-button @click="resetQuery">重置 </el-button> -->
        </el-form-item>
      </el-form>
    </div>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-permisaction="['admin:sysbox:add']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增
        </el-button>
      </el-col>

      <!-- <el-col :span="1.5">
              <el-button
                v-permisaction="['admin:sysbox:add']"
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="handleIPAdd"
                >扫描添加盒子
              </el-button>
            </el-col> -->

      <el-col :span="1.5">
        <el-button
          v-permisaction="['admin:sysFederation:add']"
          type="primary"
          icon="el-icon-circle-plus"
          size="mini"
          @click="handleFederation"
        >加入集群
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-permisaction="['admin:sysFederation:add']"
          type="danger"
          icon="el-icon-share"
          size="mini"
          @click="handleSyncBox"
        >集群数据同步
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-dropdown @command="handleCommand">
          <el-button
            size="mini"
            icon="el-icon-s-unfold"
            placement="bottom-start"
            :style="{ width: '100%' }"
          >
            更多批量操作菜单
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="2">
              <el-button style="margin:3px 0 0 0" icon="el-icon-download">
                批量导出设备
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item :command="2">
              <el-button style="margin:3px 0 0 0" icon="el-icon-upload2">
                批量导入设备
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item :command="3">
              <el-button
                style="margin:3px 0 0 0"
                icon="el-icon-warning-outline"
              >
                注销选中设备
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item :command="6">
              <el-button
                type="danger"
                style="margin:3px 0 0 0"
                icon="el-icon-delete"
              >
                删除选中设备
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item :command="4">
              <el-button
                type="danger"
                style="margin:3px 0 0 0"
                icon="el-icon-success"
              >
                激活选中设备
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item :command="5">
              <el-button
                type="danger"
                style="margin:3px 0 0 0"
                icon="el-icon-refresh-right"
              >
                同步设备状态
              </el-button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
    <!--        :row-class-name="rowClassName"-->
    <el-table
      v-loading="loading"
      :data="sysboxList"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChang"
    >
      <el-table-column
        label="编码"
        sortable="custom"
        width="auto"
        prop="boxId"
      />
      <el-table-column
        label="盒子名称"
        align="center"
        prop="boxName"
        sortable="custom"
        :show-overflow-tooltip="true"
        width="150"
      />
      <el-table-column
        label="产品"
        align="center"
        prop="prodName"
        :formatter="productNameFormat"
        sortable="custom"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          {{ productNameFormat(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column
        label="机构"
        align="center"
        prop="deptName"
        :formatter="deptNameFormat"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          {{ deptNameFormat(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column label="序列号" align="center" prop="boxSno" />
      <el-table-column label="型号" align="center" prop="boxModel" />
      <el-table-column
        label="盒子IP"
        align="center"
        prop="boxIp"
        sortable="custom"
        width="130"
      />
      <el-table-column
        label="算法"
        align="center"
        prop="aiLastNameShow"
        sortable="custom"
        width="130"
      />
      <el-table-column
        label="盒子状态"
        align="center"
        sortable="custom"
        width="100"
      >
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.boxStatus === '1' ? '' : 'danger'"
            disable-transitions
          >{{ boxStatusFormat(scope.row) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="集群状态"
        align="center"
        sortable="custom"
        width="100"
      >
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.fedStatus === '1' ? '' : 'danger'"
            disable-transitions
          >{{ fedStatusFormat(scope.row) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="摄像头及算法" prop="boxNpus" align="left">
        <template slot-scope="scope">
          <div
            v-for="(u, i) in scope.row.sysAiConfigCamGroupAiStatuses"
            :key="i"
          >
            <!-- <Link
                    to=""
                    v-for="(uAiConfig, iAiConfig) in u.aiConfigStatuses"
                    :key="iAiConfig"
                  > -->
            <div
              v-for="(uAiConfig, iAiConfig) in u.aiConfigStatuses"
              :key="iAiConfig"
            >
              <!--   :to="{
                      class="link-type"
                      name: 'SysAiConfigManage',
                      params: { camId: scope.row.camId }
                    }" -->
              <!--                                                      {{ uAiConfig }}-->
              <span
                :style="{
                  color:
                    u.camStatus === '1' && uAiConfig.aiStatus === '1'
                      ? 'green'
                      : 'red'
                }"
              >●
              </span>
              <router-link
                class="link-type"
                :to="{
                  name: 'SysAiConfigManage',
                  params: { camId: u.cId }
                }"
                :style="{ color: u.camStatus === '1' ? 'green' : 'red' }"
              >{{ u.camName }} -
              </router-link>
              <router-link
                class="link-type"
                :to="{
                  name: 'SysAiConfigManage',
                  params: { camId: u.cId }
                }"
                :style="{
                  color: uAiConfig.aiStatus === '1' ? 'green' : 'red'
                }"
              >{{ uAiConfig.aiNames }}
              </router-link>
            </div>
          </div>
          <!--              <div v-if="scope.row.sysAiConfigCamGroupAiStatuses.length===0">暂无</div>-->
        </template>
      </el-table-column>

      <el-table-column
        label="激活时间"
        align="center"
        prop="registryAt"
        sortable="custom"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.registryAt) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-permisaction="['admin:sysbox:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdateBoxName(scope.row)"
          >修改盒子名称
          </el-button>
          <el-button
            v-permisaction="['admin:sysbox:edit']"
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="viewBox(scope.row)"
          >查看
          </el-button>
          <el-button
            v-permisaction="['admin:sysbox:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改
          </el-button>
          <el-button
            v-permisaction="['admin:sysbox:remove', 'normal']"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
          <el-button
            v-permisaction="['admin:sysboxnpu:edit']"
            type="text"
            icon="el-icon-s-tools"
            size="mini"
            @click="npuSet(scope.row)"
          >算法配置
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageIndex"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改对话框 -->
    <AddDialog
      ref="addDialog"
      :title="title"
      :network-way-options="networkWayOptions"
      :transport-protocol-options="transportProtocolOptions"
      :box-type-options="boxTypeOptions"
      :ai-options="aiOptions"
      :dept-options="deptOptions"
      :prod-options="prodOptions"
      @success="getList"
    />

    <!-- 修改盒子名称对话框 -->
    <UpdateBoxTitle ref="updateBoxTitle" @success="getList" />

    <!-- 自动搜索添加对话框 -->
    <AutoSearchBox
      ref="autoSearchBox"
      :box-type-options="boxTypeOptions"
      :box-status-options="boxStatusOptions"
      @success="getList"
    />
  </el-card>

</template>
<script>
export default {
  name: 'BoxState'
}
</script>
<style lang="scss" scoped></style>
