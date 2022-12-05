<template>
  <BasicLayout>
    <template #wrapper>
      <div class="main-box">
        <el-card class="box-card">
          <div class="query">
            <el-form
              ref="queryForm"
              :model="queryParams"
              :inline="true"
              label-width="90px"
            >
              <el-row :gutter="24">
                <el-col
                  :span="6"
                ><el-form-item label="输入查询" prop="camName">
                  <el-input
                    v-model="queryParams.camName"
                    prefix-icon="el-icon-search"
                    placeholder="请输入摄像头名称"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                  /> </el-form-item></el-col>
                <el-col :span="6">
                  <el-form-item label="摄像头厂商" prop="camManufacturer">
                    <el-select
                      v-model="queryParams.camManufacturer"
                      placeholder="请选择摄像头厂商"
                      clearable
                      size="small"
                    >
                      <el-option
                        v-for="dict in camManufacturerOptions"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      />
                    </el-select> </el-form-item></el-col>
                <el-col :span="6">
                  <el-form-item label="摄像头状态" prop="camOnlineStatus">
                    <el-select
                      v-model="queryParams.camOnlineStatus"
                      placeholder="请选择摄像头状态"
                      clearable
                      size="small"
                    >
                      <el-option
                        v-for="dict in camOnlineStatusOptions"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      />
                    </el-select> </el-form-item></el-col>
                <el-col :span="6">
                  <el-form-item label="外观类型" prop="camType">
                    <el-select
                      v-model="queryParams.camType"
                      placeholder="请选择摄像头外观类型"
                      clearable
                      size="small"
                    >
                      <el-option
                        v-for="dict in camTypeOptions"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item label="传输类型" prop="camForm">
                <el-select
                  v-model="queryParams.camForm"
                  placeholder="请选择摄像头传输类型"
                  clearable
                  size="small"
                >
                  <el-option
                    v-for="dict in camFormOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>

              <el-button
                type="primary"
                size="small"
                @click="handleQuery"
              ><svg-icon
                icon-class="newSearch"
                style="vertical-align: -2px; margin-right: 3px"
              />
                查询
              </el-button>
              <!-- <div class="seek" @click="handleQuery">
                <svg-icon
                  icon-class="newSearch"
                  style="vertical-align:0
                      "
                />
                <span>查询</span>
              </div> -->
              <el-button
                icon="el-icon-refresh"
                size="small"
                style="padding: 11px 30px"
                @click="resetQuery"
              >重置
              </el-button>
              <div class="add">
                <el-button
                  v-permisaction="['admin:syscamera:add']"
                  type="primary"
                  icon="el-icon-plus"
                  size="small"
                  @click="handleAdd"
                >添加网络摄像头
                </el-button>
              </div>
              <div class="online-1">
                <sysShowStateVue :show-state="showState" />
              </div>
              <!-- <el-button><svg-icon icon-class="menu" /></el-button> -->
            </el-form>
          </div>
          <el-table
            v-loading="loading"
            :data="syscameraList"
            @selection-change="handleSelectionChange"
            @sort-change="handleSortChang"
          >
            <el-table-column
              v-if="showCol"
              label="编号"
              align="center"
              prop="camId"
              sortable="custom"
              width="auto"
            />
            <el-table-column
              v-if="showState.camName"
              label="摄像头名称"
              align="center"
              prop="camName"
              sortable="custom"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              v-if="showState.camManufacturer"
              label="厂商"
              align="center"
              prop="camManufacturer"
              sortable="custom"
              :formatter="camManufacturerFormat"
              width="80"
            >
              <template slot-scope="scope">
                {{ camManufacturerFormat(scope.row) }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="showState.camModel"
              label="型号"
              align="center"
              prop="camModel"
              :show-overflow-tooltip="true"
              width="90"
            >
              <template slot-scope="scope">
                <div v-if="scope.row.camModel === ''">暂无</div>
                <div v-else>{{ scope.row.camModel }}</div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="showState.camType"
              label="外观类型"
              align="center"
              prop="camType"
              sortable="custom"
              :formatter="camTypeFormat"
              width="100"
            >
              <template slot-scope="scope">
                {{ camTypeFormat(scope.row) }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="showState.camForm"
              label="传输类型"
              align="center"
              prop="camForm"
              sortable="custom"
              :formatter="camFormFormat"
              width="100"
            >
              <template slot-scope="scope">
                {{ camFormFormat(scope.row) }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="showState.camIp"
              label="IP地址"
              align="center"
              prop="camIp"
              width="130"
            />

            <el-table-column
              v-if="showState.sound"
              label="关联音响"
              align="center"
              width="120"
            >
              <template slot-scope="scope">
                <div v-if="scope.row.audioNameStatusList.length === 0">
                  暂无
                </div>
                <div
                  v-for="(u, i) in scope.row.audioNameStatusList"
                  :key="i"
                  style="display: inline"
                >
                  <span style="color: #404554">
                    <!-- :style="{ color: u.audioStatus === '1' ? 'green' : 'red' }" -->
                    {{ u.audioName }}
                    <span />
                  </span>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              v-if="showState.box"
              label="关联盒子"
              align="center"
            >
              <template slot-scope="scope">
                <el-link
                  v-for="(u, i) in scope.row.boxIdNameStatusList"
                  :key="i"
                  type="primary"
                  @click="linkToBox(u.boxName)"
                >
                  <span
                    :style="{ color: u.boxStatus === '1' ? 'green' : 'red' }"
                  >
                    ●{{
                      u.boxName + (u.boxStatus === "1" ? "(在线)" : "(离线)")
                    }}
                    <br></span>
                </el-link>
                <div v-if="scope.row.boxIdNameStatusList.length === 0">
                  暂无
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="showState.algorithm"
              label="算法"
              align="center"
            >
              <template slot-scope="scope">
                <div v-if="scope.row.aiConfigIdNameStatusList.length === 0">
                  暂无
                </div>
                <div
                  v-for="(u, i) in scope.row.aiConfigIdNameStatusList"
                  :key="i"
                  style="display: inline"
                >
                  <span
                    :style="{ color: u.aiStatus === '1' ? 'green' : 'red' }"
                  >
                    {{ u.aiName }}
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="showState.IPState"
              label="IP状态"
              width="90"
              align="center"
              sortable="custom"
            >
              <template slot-scope="scope">
                <el-tag
                  :type="
                    scope.row.camOnlineStatus === '1' ? 'success' : 'danger'
                  "
                  disable-transitions
                >{{ camOnlineStatusFormat(scope.row) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              v-if="showCol"
              label="启用开关"
              align="center"
              sortable="custom"
              width="100"
            >
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.camEnable"
                  active-value="1"
                  inactive-value="0"
                  @change="handleCamEnableChange(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column
              v-if="showCol"
              label="告警开关"
              align="center"
              sortable="custom"
              width="100"
            >
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.camAlarmStatus"
                  active-value="1"
                  inactive-value="0"
                  @change="handleCamAlarmStatusChange(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column
              v-if="showCol"
              label="算法开关"
              align="center"
              sortable="custom"
              width="100"
            >
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.camAiStatus"
                  active-value="1"
                  inactive-value="0"
                  @change="handleCamAiStatusChange(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <router-link
                  :to="{
                    name: 'SysAiConfigManage',
                    params: { camId: scope.row.camId }
                  }"
                  class="link-type"
                >
                  <!-- <i
                  class="el-icon-s-tools"
                  style="color: #7558F4;font-size: 12px"
                /> -->
                  <div style="font-size: 12px; color: #7558f4">
                    <svg-icon icon-class="associated" />
                    关联算法
                  </div>
                </router-link>
                <router-link
                  :to="{
                    name: 'SysAudioConfigManage',
                    params: { camId: scope.row.camId }
                  }"
                  class="link-type"
                >
                  <!-- <i
                  class="el-icon-message-solid"
                  style="color: #7558F4;font-size: 12px"
                /> -->
                  <div style="font-size: 12px; color: #7558f4">
                    <svg-icon icon-class="acoustics" /> 关联音响
                  </div>
                </router-link>
                <div>
                  <el-button
                    v-permisaction="['admin:syscamera:edit']"
                    size="mini"
                    type="text"
                    icon="el-icon-edit"
                    @click="handleUpdate(scope.row)"
                  >修改
                  </el-button>
                </div>

                <div>
                  <el-button
                    v-permisaction="['admin:syscamera:remove']"
                    class="del"
                    size="mini"
                    type="text"
                    icon="el-icon-delete"
                    @click="handleDelete(scope.row)"
                  >删除
                  </el-button>
                </div>
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
          <el-dialog
            :title="title"
            :visible.sync="open"
            width="800px"
            class="editDialog"
            :close-on-click-modal="false"
          >
            <el-form
              ref="form"
              :model="form"
              :rules="rules"
              label-position="left"
            >
              <el-col :span="24">
                <el-divider
                  content-position="left"
                  style="color: #c3c1c7"
                ><i class="el-icon-info" />基本信息
                </el-divider>
              </el-col>
              <el-col :span="24">
                <el-form-item label="名称" prop="camName" label-width="60px">
                  <el-input
                    v-model="form.camName"
                    placeholder="请输入摄像头名称"
                    type="text"
                    maxlength="40"
                    show-word-limit
                    style="width: 400px"
                    @input="change"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  label="厂商"
                  prop="camManufacturer"
                  label-width="60px"
                >
                  <el-select
                    v-model="form.camManufacturer"
                    placeholder="请选择摄像头厂商"
                    style="width: 400px"
                    :disabled="isEdit"
                    @change="change"
                  >
                    <el-option
                      v-for="dict in camManufacturerOptions"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  label="型号"
                  prop="camModel"
                  label-width="50px"
                  @change="change"
                >
                  <el-input
                    v-model="form.camModel"
                    placeholder="请选择摄像头型号"
                    type="text"
                    maxlength="40"
                    show-word-limit
                    style="width: 410px"
                    @input="change"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  label="外观类型"
                  prop="camType"
                  label-width="80px"
                >
                  <el-select
                    v-model="form.camType"
                    placeholder="请选择外观类型"
                    style="width: 380px"
                    @change="change"
                  >
                    <el-option
                      v-for="dict in camTypeOptions"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  label="传输类型"
                  prop="camForm"
                  label-width="80px"
                >
                  <el-select
                    v-model="form.camForm"
                    placeholder="请选择传输类型"
                    style="width: 380px"
                    @change="change"
                  >
                    <el-option
                      v-for="dict in camFormOptions"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-divider
                  content-position="left"
                ><i class="el-icon-share" />连接信息
                </el-divider>
              </el-col>
              <el-col :span="24">
                <el-form-item label="IP" prop="camIp" label-width="50px">
                  <el-input
                    v-model="form.camIp"
                    placeholder="请输入摄像头IP地址"
                    :disabled="isEdit"
                    type="text"
                    maxlength="15"
                    show-word-limit
                    @change="change"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item
                  label="账号"
                  prop="camUserName"
                  label-width="60px"
                >
                  <el-input
                    v-model="form.camUserName"
                    placeholder="请输入摄像头账号"
                    :disabled="isEdit"
                    maxlength="40"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  label="密码"
                  prop="camPassword"
                  label-width="60px"
                >
                  <el-input
                    v-model="form.camPassword"
                    placeholder="请输入摄像头密码"
                    show-password
                    maxlength="40"
                    show-word-limit
                    @input="change"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="端口" prop="camPort" label-width="60px">
                  <el-input
                    v-model="form.camPort"
                    placeholder="请输入摄像头端口号"
                    :disabled="isEdit"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  v-if="showCol"
                  label="通道号"
                  prop="camSequence"
                  label-width="80px"
                >
                  <el-input-number
                    v-model="form.camSequence"
                    controls-position="right"
                    :min="1"
                    :max="3"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  v-if="showCol"
                  label="视频编码"
                  prop="camCoding"
                  label-width="80px"
                >
                  <el-select
                    v-model="form.camCoding"
                    placeholder="请选择视频编码"
                    style="width: 380px"
                  >
                    <el-option
                      v-for="dict in camCodingOptions"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  label="RTSP地址"
                  prop="pullStreamUrl"
                  label-width="80px"
                >
                  <el-input
                    v-model="form.pullStreamUrl"
                    placeholder="请输入主码流RTSP地址"
                    :disabled="isEdit"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  v-if="showCol"
                  label="分发地址"
                  prop="pushStreamUrl"
                  label-width="80px"
                >
                  <el-input
                    v-model="form.pushStreamUrl"
                    placeholder="流媒体分发地址"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  v-if="showCol"
                  label="子码流地址"
                  prop="minorRtspUrl"
                  label-width="90px"
                >
                  <el-input
                    v-model="form.minorRtspUrl"
                    placeholder="子码流地址"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-divider
                  v-if="showCol"
                  content-position="left"
                ><i class="el-icon-circle-plus" />其他配置
                </el-divider>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  v-if="showCol"
                  label="序列号"
                  prop="camSno"
                  label-width="80px"
                >
                  <el-input v-model="form.camSno" placeholder="摄像头序列号" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  v-if="showCol"
                  label="可视半径"
                  prop="camRadius"
                  label-width="80px"
                >
                  <el-input
                    v-model="form.camRadius"
                    placeholder="摄像头可视半径"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  v-if="showCol"
                  label="通道总数"
                  prop="camChannelSum"
                  label-width="80px"
                >
                  <el-input-number
                    v-model="form.camChannelSum"
                    controls-position="right"
                    :min="1"
                    :max="5"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item
                  v-if="showCol"
                  label="经度"
                  prop="camLongitude"
                  label-width="50px"
                >
                  <el-input v-model="form.camLongitude" placeholder="经度" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  v-if="showCol"
                  label="纬度"
                  prop="camLatitude"
                  label-width="50px"
                >
                  <el-input v-model="form.camLatitude" placeholder="纬度" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  v-if="showCol"
                  label="海拔"
                  prop="camAltitude"
                  label-width="50px"
                >
                  <el-input v-model="form.camAltitude" placeholder="海拔" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  v-if="showCol"
                  label="塔高"
                  prop="camTowerHeight"
                  label-width="50px"
                >
                  <el-input v-model="form.camTowerHeight" placeholder="塔高" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  v-if="showCol"
                  label="备注"
                  prop="camNote"
                  label-width="50px"
                >
                  <el-input v-model="form.camNote" placeholder="备注" />
                </el-form-item>
              </el-col>
            </el-form>

            <div slot="footer" class="dialog-footer-11">
              <div class="confirm">
                <el-button @click="cancel">取 消</el-button>
                <el-button
                  v-if="title === '修改摄像头'"
                  type="primary"
                  :disabled="isEditSubmit"
                  @click="submitForm"
                >确 定</el-button>
                <el-button
                  v-else
                  type="primary"
                  :disabled="isEditSubmit"
                  @click="submitForm"
                >添 加</el-button>
              </div>
            </div>
          </el-dialog>
          <!--           <addCameraVue :title="title" :visible.sync="open" /> -->
          <!-- 删除摄像头没取消关联提示框 -->
          <el-dialog
            :visible.sync="dialogVisible"
            width="20%"
            center
            class="error"
            :close-on-click-modal="false"
          >
            <!-- dialogVisible -->
            <div
              style="
                padding: 0;
                width: 160px;
                margin: 0 auto;
                border: 1px dashed #404554;
              "
            >
              <img
                src="../../../assets/logo/error.png"
                alt=""
                style="width: 160px"
              >
            </div>
            <div style="color: #404554; padding-top: 30px; text-align: center">
              摄像头未关联算法时，才可删除！！
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button
                type="primary"
                @click="dialogVisible = false"
              >好 的</el-button>
            </span>
          </el-dialog>
        </el-card>
      </div>
    </template>
  </BasicLayout>
</template>

<script>
import {
  addSysCamera,
  changeCamAiStatus,
  changeCamAlarmStatus,
  changeCamEnable,
  delSysCamera,
  getSysCamera,
  listSysCamera,
  updateSysCamera
} from "@/api/box/sys-camera";
import { unWsLogout } from "@/api/ws";
import sysShowStateVue from "../components/sys-showState.vue";
// import addCameraVue from './components/addCamera.vue'
export default {
  name: "SysCamera",
  components: {
    sysShowStateVue
  },
  data() {
    const checkoutIP = (rule, value, callback) => {
      const ipRules =
        /^((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9]))$/;
      if (!ipRules.test(value)) {
        callback(new Error("请输入正确的IP格式"));
      } else {
        callback();
      }
    };
    // 经度
    const checkLong = (rule, value, callback) => {
      // const longrg = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/;
      const longrg =
        /^[-+]?(((0|1?[0-7]?[0-9]?)|([1-9]?[0-9]?))(([.][0-9]{1,15})?)|180(([.][0]{1,15})?))$/;
      if (value && !longrg.test(value)) {
        callback(new Error("经度整数部分为0-180,小数部分为0到15位!"));
      }
      callback();
    };
    // 纬度
    const checkLat = (rule, value, callback) => {
      // const latreg = /^(\-|\+)?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/;
      const latreg = /^[-+]?([1-8]?\d(\.\d{1,15})?|90(\.0{1,15})?)$/;
      if (value && !latreg.test(value)) {
        callback(new Error("纬度整数部分为0-90,小数部分为0到15位!"));
      }
      callback();
    };
    return {
      showState: {
        showCol: true,
        camName: true,
        camManufacturer: true,
        camModel: true,
        camType: true,
        camForm: true,
        camIp: true,
        sound: true,
        box: true,
        algorithm: true,
        IPState: true
      },
      // 用户权限控制列显示
      showCol: true,
      // 搜索栏折叠展开功能
      showMore: false,
      moreName: "显示",
      iconName: "el-icon-caret-bottom",
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      isEdit: false,
      isEditSubmit: false,
      dialogVisible: false,
      // 类型数据字典
      typeOptions: [],
      syscameraList: [],
      camManufacturerOptions: [],
      camTypeOptions: [],
      camFormOptions: [],
      camEnableOptions: [],
      camOnlineStatusOptions: [],
      camAlarmStatusOptions: [],
      camAiStatusOptions: [],
      camCodingOptions: [],
      // 关系表类型

      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        camName: undefined,
        camModel: undefined,
        camManufacturer: undefined,
        camType: undefined,
        camForm: undefined,
        camEnable: undefined,
        camOnlineStatus: undefined,
        createdAtOrder: "desc"
      },
      // 表单参数
      form: {
        camSequence: "1",
        camChannelSum: "1"
      },
      // 表单校验
      rules: {
        camName: [
          { required: true, message: "请输入摄像头名称", trigger: "change" }
        ],
        camManufacturer: [
          {
            required: true,
            message: "请选择摄像头厂商",
            trigger: "change"
          }
        ],
        camType: [
          {
            required: true,
            message: "请选择摄像头外观类型",
            trigger: "change"
          }
        ],
        camForm: [
          {
            required: true,
            message: "请选择摄像头传输类型",
            trigger: "change"
          }
        ],
        camIp: [
          {
            required: true,
            message: "请输入摄像头IP",
            trigger: "change"
          },
          { validator: checkoutIP, trigger: "blur" }
        ],
        camUserName: [
          {
            required: true,
            message: "请输入摄像头账号",
            trigger: "change"
          }
        ],
        camPassword: [
          {
            required: true,
            message: "请输入摄像头密码",
            trigger: "change"
          }
        ],
        camPort: [
          {
            required: true,
            type: "integer",
            min: 0,
            max: 65535,
            message: "请输入摄像头端口号且范围是0到65535",
            trigger: "change",
            transform(value) {
              return Number(value);
            }
          }
        ],
        camSequence: [
          {
            required: true,
            message: "请输入摄像头通道号",
            trigger: "change"
          }
        ],
        camCoding: [
          {
            required: true,
            message: "请输入摄像头视频编码",
            trigger: "change"
          }
        ],
        camLongitude: [
          { required: false },
          { validator: checkLong, trigger: "change" }
        ], // 经度
        camLatitude: [
          { required: false },
          { validator: checkLat, trigger: "change" }
        ] // 纬度
      }
    };
  },
  activated() {
    this.getList();
    this.getDicts("sys_cam_manu").then((response) => {
      this.camManufacturerOptions = response.data;
    });
    this.getDicts("sys_cam_model").then((response) => {
      this.camTypeOptions = response.data;
    });
    this.getDicts("sys_cam_form").then((response) => {
      this.camFormOptions = response.data;
    });
    this.getDicts("sys_device_status").then((response) => {
      this.camEnableOptions = response.data;
    });
    this.getDicts("sys_box_query").then((response) => {
      this.camOnlineStatusOptions = response.data;
    });
    this.getDicts("sys_ai_switch").then((response) => {
      this.camAlarmStatusOptions = response.data;
    });
    this.getDicts("sys_ai_switch").then((response) => {
      this.camAiStatusOptions = response.data;
    });
    this.getDicts("sys_cam_coding").then((response) => {
      this.camCodingOptions = response.data;
    });
    // websocket
    this.id = this.guid();
    this.group = "camera";
    this.initWebSocket();
    // 权限控制
    // console.info("user", this.$store.state.user);
    const roles = this.$store.state.user.roles;
    if (roles.indexOf("normal") !== -1) {
      // 修改对应角色名，控制权限
      this.showCol = false;
    }
  },
  deactivated() {
    console.log("断开cameraWebsocket连接");
    // 离开路由之后断开websocket连接
    this.websock.close();
    unWsLogout(this.id, this.group).then((response) => {
      console.log(response.data);
    });
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      // debugger
      // console.log('查询', 123)
      this.loading = true;
      listSysCamera(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.syscameraList = response.data.list;
          // console.info(JSON.stringify(this.syscameraList))
          this.total = response.data.count;
          this.loading = false;
        }
      );
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        camSno: undefined,
        camName: undefined,
        camModel: undefined,
        camManufacturer: undefined,
        camType: undefined,
        camForm: undefined,
        camRadius: undefined,
        camIp: undefined,
        camPort: undefined,
        camUserName: undefined,
        camPassword: undefined,
        camChannelNum: undefined,
        camChannelSum: 1,
        camPresetId: undefined,
        camSequence: 1,
        camStartId: undefined,
        camWindowId: undefined,
        pullStreamUrl: undefined,
        pushStreamUrl: undefined,
        minorRtspUrl: undefined,
        camLinePath: undefined,
        camLoginId: undefined,
        camRealPlayId: undefined,
        camLongitude: undefined,
        camLatitude: undefined,
        camAltitude: undefined,
        camTowerHeight: undefined,
        camEnable: undefined,
        camOnlineStatus: undefined,
        camAlarmStatus: undefined,
        camAiStatus: undefined,
        camCoding: "0",
        camNote: undefined
      };
      this.resetForm("form");
    },
    getImgList: function() {
      this.form[this.fileIndex] =
        this.$refs["fileChoose"].resultList[0].fullUrl;
    },
    fileClose: function() {
      this.fileOpen = false;
    },
    camManufacturerFormat(row) {
      return this.selectDictLabel(
        this.camManufacturerOptions,
        row.camManufacturer
      );
    },
    camTypeFormat(row) {
      return this.selectDictLabel(this.camTypeOptions, row.camType);
    },
    camFormFormat(row) {
      return this.selectDictLabel(this.camFormOptions, row.camForm);
    },
    camEnableFormat(row) {
      return this.selectDictLabel(this.camEnableOptions, row.camEnable);
    },
    camOnlineStatusFormat(row) {
      return this.selectDictLabel(
        this.camOnlineStatusOptions,
        row.camOnlineStatus
      );
    },
    camAiStatusFormat(row) {
      return this.selectDictLabel(this.camAiStatusOptions, row.camAiStatus);
    },
    camCodingFormat(row) {
      return this.selectDictLabel(this.camCodingOptions, row.camCoding);
    },
    // 关系
    // 文件
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageIndex = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.queryParams["createdAtOrder"] = "desc";
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加摄像头";
      this.isEdit = false;
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.camId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 排序回调函数 */
    handleSortChang(column, prop, order) {
      prop = column.prop;
      order = column.order;
      if (this.order !== "" && this.order !== prop + "Order") {
        this.queryParams[this.order] = undefined;
      }
      if (order === "descending") {
        this.queryParams[prop + "Order"] = "desc";
        this.order = prop + "Order";
      } else if (order === "ascending") {
        this.queryParams[prop + "Order"] = "asc";
        this.order = prop + "Order";
      } else {
        this.queryParams[prop + "Order"] = undefined;
      }
      this.getList();
    },
    // 摄像头状态修改
    handleCamEnableChange(row) {
      const text = row.camEnable === "1" ? "启用" : "关闭";
      this.$confirm(
        '确认要"' + text + '""' + row.camName + '"摄像头吗?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }
      )
        .then(function() {
          return changeCamEnable(row);
        })
        .then(() => {
          this.msgSuccess(text + "成功");
        })
        .catch(function() {
          row.camEnable = row.camEnable === "1" ? "0" : "1";
        });
    },
    // 摄像头告警状态修改
    handleCamAlarmStatusChange(row) {
      const text = row.camAlarmStatus === "1" ? "开启" : "关闭";
      this.$confirm(
        '确认要"' + text + '""' + row.camName + '"告警吗?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }
      )
        .then(function() {
          return changeCamAlarmStatus(row);
        })
        .then(() => {
          this.msgSuccess(text + "成功");
        })
        .catch(function() {
          row.camAlarmStatus = row.camAlarmStatus === "1" ? "0" : "1";
        });
    },
    // 摄像头算法状态修改
    handleCamAiStatusChange(row) {
      const text = row.camAiStatus === "1" ? "开启" : "关闭";
      this.$confirm(
        '确认要"' + text + '""' + row.camName + '"算法吗?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }
      )
        .then(function() {
          return changeCamAiStatus(row);
        })
        .then(() => {
          this.msgSuccess(text + "成功");
        })
        .catch(function() {
          row.camAiStatus = row.camAiStatus === "1" ? "0" : "1";
        });
    },
    // 摄像头算法状态修改
    // handleCamPreEnableChange(row) {
    //   const text = row.camAiStatus === '1' ? '开启' : '关闭'
    //   this.$confirm(
    //     '确认要"' + text + '""' + row.camName + '"预演配置吗?',
    //     '警告',
    //     {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消'
    //     }
    //   )
    //     // .then(function() {
    //     //   return changeCamPreEnable(row)
    //     // })
    //     .then(() => {
    //       this.msgSuccess(text + '成功')
    //     })
    //     .catch(function() {
    //       row.preEnable = row.preEnable === '1' ? '0' : '1'
    //     })
    // },

    // 摄像头算法状态修改
    handleCamPreEnableChange(row) {
      const text = row.camAiStatus === "1" ? "开启" : "关闭";
      this.$confirm(
        '确认要"' + text + '""' + row.camName + '"预演配置吗?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }
      )
        .then(function() {
          // return changeCamPreEnable(row)
        })
        .then(() => {
          this.msgSuccess(text + "成功");
        })
        .catch(function() {
          row.preEnable = row.preEnable === "1" ? "0" : "1";
        });
    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      getSysCamera(row.camId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改摄像头";
        this.isEdit = true;
        this.isEditSubmit = true;
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.camId !== undefined) {
            this.isEditSubmit = true;
            // console.info(JSON.stringify(this.form))
            updateSysCamera(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess(response.msg);
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            this.isEditSubmit = true;
            addSysCamera(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess(response.msg);
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      console.log(row);
      // this.dialogVisible = true
      if (row.boxIdNameStatusList.length > 0) {
        this.dialogVisible = true;
      } else {
        this.$confirm(
          '删除后将不可恢复!  是否确认删除摄像头名称为"' +
            row.camName +
            '"的数据项?',
          "删除该摄像头?",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消"
          }
        )
          .then(function() {
            return delSysCamera({ id: row.camId });
          })
          .then((response) => {
            if (response.code === 200) {
              this.msgSuccess(response.msg);
              this.open = false;
              this.getList();
            } else {
              this.msgError(response.msg);
            }
          })
          .catch(function() {});
      }
    },
    showMoreHandle() {
      this.showMore = !this.showMore;
      if (this.moreName === "显示") {
        this.moreName = "隐藏";
        this.iconName = "el-icon-caret-top";
      } else {
        this.moreName = "显示";
        this.iconName = "el-icon-caret-bottom";
      }
    },
    linkToBox(bName) {
      this.$router.push({
        path: "/box/sys-box",
        query: { boxName: bName }
      });
    },
    addStreamSubmit() {
      const params = {
        uuid: 3, // 视频流Id
        name: "视频流1", // 视频流名称
        channels: {}
      };
      params.channels = [
        {
          url: "rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov",
          on_demand: 1,
          debug: false
        },
        {
          url: "rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov",
          on_demand: 0,
          debug: true
        }
      ];
      // goRequest('add', params.uuid, params)
    },
    aiSet(row) {
      this.$router.push({
        path: "/sys-camera/aiList",
        query: { camId: row.camId }
      });
    },
    initWebSocket() {
      // 初始化weosocket
      // console.log(this.$store.state.user.token)
      const wsuri =
        "ws://" +
        this.$store.state.system.info.sys_app_ip +
        ":8880/ws/" +
        this.id +
        "/" +
        this.group +
        "?token=" +
        this.$store.state.user.token;
      this.websock = new WebSocket(wsuri);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    websocketonopen() {
      // 连接建立之后执行send方法发送数据
      console.log("cameraWebsocket连接打开");
      //   const actions = { 'test': '12345' }
      //   this.websocketsend(JSON.stringify(actions))
    },
    websocketonerror() {
      // 连接建立失败重连
      this.initWebSocket();
    },
    // 数据接收
    websocketonmessage(e) {
      // console.log(e.data)
      // const jsonData = JSON.parse(e.data)
      // console.log(jsonData)
      // if (jsonData.code === 200) {
      // console.log(jsonData.data)
      // }
      // this.getList()
      const jsonData = JSON.parse(e.data);
      console.log(jsonData);
      for (let i = 0; i < this.syscameraList.length; i++) {
        if (this.syscameraList[i].camId === jsonData.camId) {
          // console.log(this.syscameraList[i])
          if ("camOnlineStatus" in jsonData) {
            this.syscameraList[i].camOnlineStatus = jsonData.camOnlineStatus;
          }
          if ("audioNameStatusList" in jsonData) {
            this.syscameraList[i].audioNameStatusList =
              jsonData.audioNameStatusList;
          }
          if ("boxIdNameStatusList" in jsonData) {
            this.syscameraList[i].boxIdNameStatusList =
              jsonData.boxIdNameStatusList;
          }
          if ("aiConfigIdNameStatusList" in jsonData) {
            this.syscameraList[i].aiConfigIdNameStatusList =
              jsonData.aiConfigIdNameStatusList;
          }
          this.$set(this.syscameraList, i, this.syscameraList[i]);
          break;
        }
      }
    },
    websocketsend(Data) {
      // 数据发送
      //   this.websock.send(Data)
    },
    websocketclose(e) {
      // 关闭
      unWsLogout(this.id, this.group).then((response) => {
        // console.log(response.data)
        console.log("cameraWebsocket连接断开");
      });
      console.log("cameraWebsocket连接断开", e);
    },
    guid() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function(c) {
          var r = (Math.random() * 16) | 0;
          var v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    },
    routerClick() {
      // console.log(1111111111111)
    },
    /** 修改摄像头名称 */
    change() {
      this.isEditSubmit = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-dialog--center .el-dialog__body {
  border-radius: 8px;
  text-align: center;
  padding: 25px 25px 30px;
}
.el-divider__text.is-left {
  color: #c3c1c7;
  font-size: 16px;
}
.dialog-footer-11 {
  .confirm {
    text-align: center;
    .el-button {
      padding: 10px 40px;
      margin: 0 20px;
    }
  }
}
.el-button--text {
  &.del {
    color: #f44040;
  }
}

.el-tag.el-tag--danger {
  background-color: #ffeded;
  border-color: #f44040;
  color: #f44040;
  border-radius: 4px 4px 4px 0px;
}
.el-tag.el-tag--success {
  background-color: #e7faf0;
  border-color: #32d47b;
  color: #32d47b;
  border-radius: 4px 4px 4px 0px;
}
.el-button--primary {
  background: linear-gradient(to bottom, #a388ff, #654ef4) !important;
}
.editDialog {
  .el-dialog__header {
    text-align: center;
    line-height: 110px;
    .el-dialog__title {
      color: #7558f4;
      font-size: 24px;
      font-weight: 700;
    }
  }
  .el-form-item {
    margin-left: 150px;
    margin-right: 150px;
  }
}

.query {
  position: relative;
  .add {
    position: absolute;
    top: 62px;
    left: 850px;
  }
  .online {
    position: absolute;
    top: 62px;
    left: 1290px;
    .el-button--success {
      color: #fff;
      background-color: #13ce66;
      border-color: #13ce66;
    }
  }
  .online-1 {
    position: absolute;
    top: 60px;
    left: 1500px;
    .el-button--medium {
      padding: 7px 30px;
    }
  }
  .seek {
    position: absolute;
    top: 62px;
    left: 410px;
    cursor: pointer;
    margin-left: 20px;
    span {
      vertical-align: 3px;
      margin-left: 10px;
    }
    width: 85px;
    height: 32px;
    line-height: 32px;
    background: linear-gradient(to bottom, #a388ff, #654ef4);
    text-align: center;
    vertical-align: middle;
    color: #fff;
    font-size: 16px;
    border-radius: 4px;
  }
}
</style>
