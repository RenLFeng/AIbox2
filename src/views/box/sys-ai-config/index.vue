<template>
  <BasicLayout>
    <template #wrapper>
      <div class="main-box">
        <el-card class="associated">
          <el-row :gutter="10" class="mb8">
            <el-col :span="6">
              <span style="font-weight: bold; color: #7558f4">
                摄像头名称：</span>
              <span class="cameraStatus">
                <el-popover placement="bottom-end" width="280" trigger="hover">
                  <el-button
                    v-if="cameraForm.camOnlineStatus === '1'"
                    slot="reference"
                    type="success"
                    round
                  >{{ cameraForm.camName }}</el-button>
                  <el-button v-else slot="reference" type="danger" round>{{
                    cameraForm.camName
                  }}</el-button>
                  <p>
                    摄像头名称:
                    <el-tag
                      v-if="cameraForm.camOnlineStatus === '0'"
                      type="danger"
                      effect="dark"
                    >{{ cameraForm.camName }}</el-tag>
                    <el-tag
                      v-if="cameraForm.camOnlineStatus === '1'"
                      type="success"
                      effect="dark"
                    >{{ cameraForm.camName }}</el-tag>
                  </p>
                  <p>
                    厂商:
                    <el-tag
                      v-if="cameraForm.camManufacturer === '0'"
                      type="info"
                      effect="plain"
                    >海康</el-tag>
                    <el-tag
                      v-if="cameraForm.camManufacturer === '1'"
                      type="info"
                      effect="plain"
                    >大华</el-tag>
                  </p>
                  <p>
                    型号:
                    <el-tag v-if="cameraForm.camModel !== ''" type="info">{{
                      cameraForm.camModel
                    }}</el-tag>
                    <el-tag v-else type="info">暂无</el-tag>
                  </p>
                  <p>
                    外观类型:
                    <el-tag
                      v-if="cameraForm.camType === '0'"
                      type="info"
                      effect="plain"
                    >枪机</el-tag>
                    <el-tag
                      v-if="cameraForm.camType === '1'"
                      type="info"
                    >球机</el-tag>
                    <el-tag
                      v-if="cameraForm.camType === '2'"
                      type="info"
                    >半球机</el-tag>
                  </p>
                  <p>
                    传输类型:
                    <el-tag
                      v-if="cameraForm.camForm === '0'"
                      type="info"
                    >网络摄像头</el-tag>
                    <el-tag
                      v-if="cameraForm.camForm === '1'"
                      type="info"
                    >有线摄像头</el-tag>
                  </p>
                  <p>
                    IP状态:
                    <el-tag
                      v-if="cameraForm.camOnlineStatus === '0'"
                      type="danger"
                    >离线</el-tag>
                    <el-tag
                      v-if="cameraForm.camOnlineStatus === '1'"
                      type="success"
                    >在线</el-tag>
                  </p>
                </el-popover>
              </span>
            </el-col>
            <el-col :span="6" :offset="12">
              <div class="addCamera">
                <el-button
                  v-permisaction="['admin:sysAiConfig:add']"
                  type="primary"
                  size="medium"
                  @click="handleRelateAi"
                >
                  <svg-icon icon-class="relevance" />
                  关联算法
                </el-button>
              </div>
            </el-col>
          </el-row>
          <el-table v-loading="loading" :data="sysAiConfigList" border>
            <el-table-column
              v-if="showCol"
              label="id"
              align="center"
              prop="id"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              v-if="showCol"
              label="盒子id"
              align="center"
              prop="bId"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              v-if="showCol"
              label="叶子算法id"
              align="center"
              prop="aId"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="算法名称"
              align="center"
              prop="ai.aiName"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="识别时间段"
              align="center"
              prop="sysAiTimes"
              :show-overflow-tooltip="true"
            >
              <!-- 分行显示 -->
              <template slot-scope="scope">
                <div v-for="(vAT, iAT) in scope.row.sysAiTimes" :key="iAT">
                  <span>{{ parseTime(vAT.startAt, "{h}:{i}") }}-
                    {{ parseTime(vAT.endAt, "{h}:{i}") }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="识别尺寸(宽*高)"
              align="center"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <div>
                  {{ scope.row.detectSizeX }} * {{ scope.row.detectSizeY }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="置信度"
              align="center"
              prop="aiSensitivity"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <div>{{ scope.row.aiConf }}</div>
              </template>
            </el-table-column>
            <!-- <template slot-scope="scope">
              <div> {{ scope }}</div>
            </template> -->
            <el-table-column
              v-if="showCol"
              label="感兴趣区"
              align="center"
              prop="interestLine"
            >
              <template slot-scope="scope">
                <el-tag
                  :type="`${scope.row.interestLine ? 'success' : 'info'}`"
                >{{ scope.row.interestLine ? "已设置" : "未设置" }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="识别区" align="center" prop="detectionLine">
              <template slot-scope="scope">
                <el-tag
                  :type="`${scope.row.detectionLine ? 'success' : 'info'}`"
                >{{ scope.row.detectionLine ? "已设置" : "未设置" }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="屏蔽区" align="center" prop="shieldLine">
              <template slot-scope="scope">
                <el-tag
                  :type="`${scope.row.shieldLine ? 'success' : 'info'}`"
                >{{ scope.row.shieldLine ? "已设置" : "未设置" }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              v-if="showCol"
              label="围界区"
              align="center"
              prop="borderLine"
            >
              <template slot-scope="scope">
                <el-tag
                  :type="`${scope.row.borderLine ? 'success' : 'info'}`"
                >{{ scope.row.borderLine ? "已设置" : "未设置" }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              class-name="small-padding fixed-width my-dropdown"
              fixed="right"
            >
              <template slot-scope="scope">
                <div>
                  <el-button
                    slot="reference"
                    v-permisaction="['admin:sysAiConfig:edit']"
                    size="mini"
                    type="text"
                    @click="handleUpdate(scope.row)"
                  >
                    <svg-icon icon-class="configuration" />
                    基础配置
                  </el-button>
                </div>
                <div class="mg-b-10">
                  <el-dropdown
                    size="mini"
                    type="primary"
                    plain
                    class="dropdown-menu"
                  >
                    <el-button type="primary" size="small" plain>
                      设置区域<i class="el-icon-arrow-down el-icon--right" />
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item class="dropdown-item">
                        <div v-permisaction="['devops:sysAiConfig:interest']">
                          <el-button
                            type="text"
                            size="mini"
                            @click="handleCommon(scope.row, 'interestLine')"
                          >
                            <svg-icon icon-class="Interest" />
                            设置感兴趣区
                          </el-button>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item class="dropdown-item">
                        <div>
                          <el-button
                            type="text"
                            size="mini"
                            @click="handleCommon(scope.row, 'detectionLine')"
                          >
                            <svg-icon icon-class="modulation" />
                            设置识别区
                          </el-button>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item class="dropdown-item">
                        <div>
                          <el-button
                            type="text"
                            size="mini"
                            @click="handleCommon(scope.row, 'shieldLine')"
                          >
                            <svg-icon icon-class="forbid" />
                            设置屏蔽区
                          </el-button>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="scope.row.ai.aiName.includes('围界')"
                        class="dropdown-item"
                      >
                        <div>
                          <el-button
                            type="text"
                            size="mini"
                            @click="handleCommon(scope.row, 'borderLine')"
                          >
                            <svg-icon icon-class="hunting" />
                            设置围界区
                          </el-button>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="
                          scope.row.ai.aiName.includes('人员计数') ||
                            scope.row.ai.aiName.includes('静电球')
                        "
                        class="dropdown-item"
                      >
                        <div>
                          <el-button
                            type="text"
                            icon="el-icon-picture"
                            size="mini"
                            @click="handleCommon(scope.row, 'hideField')"
                          >设置方向
                          </el-button>
                        </div>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
                <div class="mg-b-10">
                  <el-dropdown type="primary" plain>
                    <el-button type="primary" size="small" plain>
                      PLC<i class="el-icon-arrow-down el-icon--right" />
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item class="dropdown-item">
                        <div>
                          <el-button
                            size="mini"
                            type="text"
                            @click="plcConfig(scope.row)"
                          >
                            <svg-icon icon-class="configuration" />
                            配置
                          </el-button>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item class="dropdown-item">
                        <div>
                          <el-button
                            size="small"
                            type="text"
                            @click="dlectPLC(scope.row)"
                          >
                            <svg-icon icon-class="delete" />
                            移除
                          </el-button>
                        </div>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>

                <div>
                  <el-button
                    v-permisaction="['devops:sysAiConfig:checkUp']"
                    size="mini"
                    type="text"
                    @click="handleValidation(scope.row)"
                  >
                    <svg-icon icon-class="poc" />
                    一键验证
                  </el-button>
                </div>
                <div>
                  <el-button
                    v-permisaction="['admin:sysAiConfig:remove']"
                    size="small"
                    type="text"
                    @click="handleDelete(scope.row)"
                  >
                    <svg-icon icon-class="delete" />
                    移除
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

          <!-- 基础配置对话框 -->
          <div class="baseDialog">
            <el-dialog :title="title" :visible.sync="open" width="800px">
              <el-form
                ref="form"
                :model="form"
                :rules="rules"
                label-width="150px"
              >
                <el-col :span="12">
                  <span>
                    <svg-icon icon-class="video" style="vertical-align: -2px" />
                    摄像头：
                  </span>
                  <el-tag>{{ cameraForm.camName }}</el-tag>
                </el-col>
                <el-col :span="12">
                  <span>
                    <svg-icon
                      icon-class="associated"
                      style="vertical-align: -2px"
                    />算法：
                  </span>
                  <el-tag>{{ aiNameFormat(form.aId) }}</el-tag>
                </el-col>

                <el-col :span="24">
                  <el-divider
                    content-position="left"
                  ><i class="el-icon-s-management" />算法配置
                  </el-divider>
                </el-col>
                <el-row v-if="form.aId === 7">
                  <el-col :span="8">
                    <el-form-item label="超员阈值" prop="threshold">
                      <el-input
                        v-model="form.threshold"
                        onkeyup="value=value.replace(/[^\d]/g,'')"
                        maxlength="3"
                        minlength="1"
                        size="mini"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="16">
                    <span
                      style="
                        font-size: 14px;
                        vertical-align: bottom;
                        line-height: 45px;
                      "
                    >
                      人（超过该人数，则触发告警）
                    </span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <div
                      v-for="(item, index) in form.sysAiTimes"
                      :key="index"
                      class="item-list"
                    >
                      <el-row>
                        <el-col :span="6">
                          <el-form-item label="识别时间段" prop="aiTime">
                            <el-time-picker
                              v-model="form.sysAiTimes[index].aiTimeArray"
                              is-range
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围"
                              :clearable="false"
                              :picker-options="{
                                selectableRange: '00:00:00 - 23:59:59'
                              }"
                              @change="changeSubmitForm"
                            />
                          </el-form-item>
                        </el-col>
                        <el-col :span="6" :offset="6">
                          <el-form-item label="">
                            <el-button
                              v-if="form.sysAiTimes.length > 0"
                              v-permisaction="['admin:sysAiConfig:add']"
                              size="mini"
                              type="text"
                              style="
                                vertical-align: 0px;
                                position: absolute;
                                top: -5px;
                                font-size: 30px;
                              "
                              @click="addItem(form.id)"
                            >
                              <svg-icon icon-class="addNew" />
                            </el-button>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6" :offset="6">
                          <el-form-item label="">
                            <el-button
                              v-if="form.sysAiTimes.length > 1"
                              v-permisaction="['admin:sysAiConfig:remove']"
                              size="small"
                              type="text"
                              style="
                                vertical-align: 0px;
                                position: absolute;
                                top: -31px;
                                left: 50px;
                                font-size: 32px;
                              "
                              @click="delItem(index)"
                            >
                              <svg-icon icon-class="subtract" />
                            </el-button>
                          </el-form-item>
                        </el-col>
                      </el-row>

                      <!-- <el-col :span="24">
                  <el-form-item label="">
                    <el-button
                      v-permisaction="['admin:sysAiConfig:add']"
                      size="mini"
                      type="text"
                      icon="el-icon-circle-plus-outline"
                      @click="addItem(form.id, form.id)"
                      >添加识别时间段
                    </el-button>
                  </el-form-item>
                </el-col> -->
                    </div>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="12">
                    <el-form-item label="识别尺寸(宽*高)" prop="detectSizeX">
                      <el-input-number
                        v-model="form.detectSizeX"
                        :step="1"
                        :min="1"
                        :max="5000"
                        @blur="changeSubmitForm"
                        @change="changeSubmitForm"
                      />
                      <!-- <template>
                        <el-select
                          v-model="value3"
                          filterable
                          placeholder="请选择"
                          @change="changeSubmitForm"
                        >
                          <el-option
                            v-for="item in options3"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            @blur="changeSubmitForm"
                            @change="changeSubmitForm"
                          />
                        </el-select>
                      </template> -->
                    </el-form-item>
                  </el-col>

                  <el-col :span="1">
                    <span
                      style="
                        font-size: 20px;
                        position: relative;
                        top: 10px;
                        transform: translateY(-80%);
                        left: 6px;
                      "
                    >*</span>
                  </el-col>

                  <el-col :span="11">
                    <el-form-item prop="detectSizeY" label-width="0px">
                      <el-input-number
                        v-model="form.detectSizeY"
                        :step="1"
                        :min="1"
                        :max="5000"
                        @blur="changeSubmitForm"
                        @change="changeSubmitForm"
                      />
                      <!-- <template>
                        <el-select
                          v-model="value4"
                          filterable
                          placeholder="请选择"
                          @change="changeSubmitForm"
                        >
                          <el-option
                            v-for="item in options4"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            @blur="changeSubmitForm"
                            @change="changeSubmitForm"
                          />
                        </el-select>
                        像 素
                      </template> -->
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item
                      label="事件持续"
                      prop="duration"
                      class="duration"
                    >
                      <el-input
                        v-model="form.duration"
                        :min="1"
                        :max="10000"
                        size="mini"
                        type="number"
                        @input="durationInput"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="16">
                    <span
                      style="
                        font-size: 14px;
                        vertical-align: bottom;
                        line-height: 45px;
                      "
                    >
                      秒触发告警</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="算法模糊度" prop="ambiguity">
                      <el-input
                        v-model="form.ambiguity"
                        maxlength="7"
                        minlength="1"
                        size="mini"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="16">
                    <span
                      style="
                        font-size: 14px;
                        vertical-align: bottom;
                        line-height: 45px;
                      "
                    >
                      (输入范围0-10000000,摄像头的模糊度低于该值将不进行算法识别)</span>
                  </el-col>
                </el-row>
                <el-col :span="24">
                  <el-form-item label="识别光线环境" prop="light">
                    <el-radio-group v-model="form.light">
                      <el-radio
                        v-for="dict in lightOptions"
                        :key="dict.value"
                        :label="dict.value"
                      >{{ dict.label }}
                      </el-radio>
                    </el-radio-group>
                    <!-- <el-radio-group v-model="form.aiLast">
                      <el-radio
                        v-for="dict in typeOptions"
                        :key="dict.value"
                        :label="dict.value"
                      >{{ dict.label }}</el-radio>
                    </el-radio-group> -->
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="连续判断帧数" prop="criticalFrame">
                    <div style="display: flex; width: 200px">
                      <div style="width: 55px">真帧数</div>
                      <div style="width: 55px; text-align: left">
                        <el-input
                          v-model="form.criticalFrame"
                          maxlength="2"
                          minlength="1"
                          size="mini"
                          prop="criticalFrame"
                        />
                      </div>
                      <div style="margin-left: 10px">帧</div>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item prop="totalFrame">
                    <div style="display: flex; width: 200px">
                      <div style="width: 55px">总帧数</div>
                      <div style="width: 55px; text-align: left">
                        <el-input
                          v-model="form.totalFrame"
                          prop="totalFrame"
                          maxlength="2"
                          minlength="1"
                          size="mini"
                        />
                      </div>
                      <div style="margin-left: 10px">帧</div>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <!-- <el-form-item label="置信度" prop="aiSensitivity"> -->
                  <el-form-item prop="aiConf">
                    <span
                      slot="label"
                    >置信度
                      <el-tooltip class="item" effect="light" placement="top">
                        <!--                    <span slot="content">&lt;!&ndash;slot&ndash;&gt;-->
                        <!--                      <span v-for="(item,index) in helpMsgList" :key="index">{{ item
                        }}<br></span>-->
                        <!--                    </span>-->
                        <div slot="content">
                          算法置信度<br>
                          值越大越识别准确
                        </div>
                        <i class="el-icon-question" />
                        <!--小问号提示-->
                      </el-tooltip>
                    </span>

                    <el-input-number
                      v-model="form.aiConf"
                      :step="0.01"
                      :min="0"
                      :max="1"
                      step-strictly
                      @change="changeSubmitForm"
                      @blur="changeSubmitForm"
                    />
                    <!-- <el-progress
                  text-inside
                  :percentage="form.aiSensitivity"
                ></el-progress> -->
                    <!-- <span class="sensitivity">
                      <el-slider
                        v-model="form.aiSensitivity"
                        :min="0"
                        :max="100"
                      /></span> -->
                    <!-- <el-input v-model="form.aiSensitivity" /> -->
                  </el-form-item>
                  <!-- </el-form-item> -->
                </el-col>
              </el-form>
              <div slot="footer" class="base-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="submitForm">添 加 </el-button>
              </div>
            </el-dialog>
          </div>

          <!-- 关联算法对话框 -->
          <div class="Correlation">
            <el-dialog
              :title="relateAiTitle"
              :visible.sync="relateAiOpen"
              width="521px"
            >
              <!-- <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox> -->
              <!--          <div style="margin: 15px 0;" />-->
              <!--          <div class="dialogDiv">-->
              <el-form
                ref="relateAiForm"
                :model="relateAiForm"
                :rules="relateAiRules"
                label-width="auto"
              >
                <!--            <el-checkbox-group v-model="relateAiForm.sysAiIds" style="display:inline-block; padding-left: 20px" @change="handleCheckedAiDatesChange">-->
                <el-checkbox-group
                  v-model="relateAiForm.sysAiIds"
                  @change="handleCheckedAiDatesChange"
                >
                  <!--              <el-checkbox  v-for="(item, index) in aiOptions" :key="index" class="el-checkbox-width" :label="item.aiId" :disabled="relateAiForm.sysAiIds.includes(item.aiId)">-->
                  <el-col
                    v-for="(item, index) in aiOptions"
                    :key="index"
                    class="checkbox-item"
                    :span="6"
                  >
                    <el-checkbox
                      :label="item.aiId"
                      :disabled="sysAiIdsOldU.includes(item.aiId)"
                    >
                      <svg-icon
                        :icon-class="item.icon"
                        :class-name="item.icon"
                      />
                      <span class="label-text">
                        {{ item.aiName }}
                      </span>
                    </el-checkbox>
                    <!--                  <el-checkbox-button :label="item.aiId" :disabled="sysAiIdsOldU.includes(item.aiId)">-->
                    <!--                    <div style="display:table-cell;height:100px;font-size:12px;font-height:14px;vertical-align:middle;text-align:center">-->
                    <!--                      <span>-->
                    <!--                        <svg-icon icon-class="one-split" class-name="one-split" style="font-size: 60px;line-height: 110px;color: #409EFF; " />-->
                    <!--                        &lt;!&ndash;                    <i class="el-icon-arrow-down" />&ndash;&gt;-->
                    <!--                        <div>-->
                    <!--                          {{ item.aiName }}-->
                    <!--                        </div>-->
                    <!--                      </span>-->
                    <!--                    </div>-->
                    <!--                  </el-checkbox-button>-->
                  </el-col>
                </el-checkbox-group>
              </el-form>
              <!--          </div>-->
              <div slot="footer" class="dialog-algorithm">
                <!--            <el-button type="primary" :disabled="submitFormRelateAiSwitch" @click="submitFormRelateAi">确 定</el-button>-->
                <el-button @click="cancelRelateAi">取 消</el-button>
                <el-button
                  type="primary"
                  :disabled="relateAiIsEdit"
                  @click="submitFormRelateAi"
                >确 定
                </el-button>

                <!--          </div>-->
              </div>
            </el-dialog>
          </div>
          <!-- 图形绘制 -->
          <canvasDraw
            :show="curDrawData.show"
            :ac-id="curDrawData.acId"
            :c-id="curDrawData.cId"
            :a-id="curDrawData.aId"
            :n-id="curDrawData.nId"
            :config-data="curDrawData.configData"
            :draw-type="curEditType"
            :draw-max-count="curDrawData.drawMaxCount"
            :cer-max-count="curDrawData.cerMaxCount"
            @ok="getList"
            @updateItem="commonUpdateItem"
          />
          <plcConfig
            :show="plcConfigVisible"
            :cur-item-data="curItemData"
            :config-list="curPlcConfigFormData"
            :plc-lists="plcLists"
            :plc-cmd-lists="plcCmdLists"
            :plc-config-type="plcConfigType"
            @hidePlcConfig="onHidePlcConfig"
          />
        </el-card>
      </div>
    </template>
  </BasicLayout>
</template>

<script>
// const dbgdata = {
//   requestId: "f5ba9eca-1ce9-4727-b4a3-5f531a61c85b",
//   code: 200,
//   msg: "查询成功",
//   data: {
//     count: 3,
//     pageIndex: 1,
//     pageSize: 10,
//     list: [
//       {
//         id: 13118292563285,
//         nId: 13118292561237,
//         bId: 13118132611413,
//         cId: 13,
//         aId: 359563954704901,
//         camStatus: "1",
//         aiStatus: "1",
//         detectionLine: "",
//         shieldLine:
//           "3,241,658,241,658,539,3,539|431,16,431,16,431,16,431,16|430,19,5,529,655,534,632,47,430,17",
//         borderLine: "8,15,943,15,943,511,8,511",
//         interestLine: "100",
//         aiConf: 0,
//         detectSizeX: 1,
//         detectSizeY: 50,
//         hideField: "",
//         duration: 0,
//         threshold: 2,
//         ambiguity: 0,
//         light: "2",
//         criticalFrame: 4,
//         totalFrame: 5,
//         ai: {
//           aiId: 359563954704901,
//           parentId: 359563868914181,
//           aiPath: "/0/359561051193861/359563868914181/359563954704901/",
//           aiName: "围界识别",
//           aiNickName: "围界识别",
//           sort: 1,
//           aiPackage: "N",
//           aiLast: "Y",
//           camLimit: 1,
//           npuLimit: 1,
//           alarmName: "围界告警",
//           alarmInterval: 10,
//           aiWeight: 25,
//           icon: "aiIcon",
//           aiColor: "rgba(255, 0, 0, 1)",
//           aiEnable: "1",
//           aiDescribe: "02",
//           sysBoxes: null,
//           createdAt: "2022-12-02T10:49:30.631+08:00",
//           updatedAt: "2022-12-02T10:49:30.643+08:00",
//           createBy: 0,
//           updateBy: 0,
//           dataScope: "",
//           params: "",
//           children: null,
//           sysCameraIds: [],
//           camIdNames: [],
//           sysCameras: null
//         },
//         sysAiTimes: [
//           {
//             id: 13118292565334,
//             acId: 13118292563285,
//             startAt: "2006-01-02T00:00:00+08:00",
//             endAt: "2006-01-02T23:59:59+08:00",
//             aiTimeArray: [
//               "2006-01-02T00:00:00+08:00",
//               "2006-01-02T23:59:59+08:00"
//             ],
//             createdAt: "2022-12-13T23:28:04.876+08:00",
//             updatedAt: "2022-12-13T23:28:04.876+08:00",
//             createBy: 0,
//             updateBy: 0
//           }
//         ],
//         aiTime: [{ startAt: "00:00", endAt: "23:59" }]
//       },
//       {
//         id: 13120540092605,
//         nId: 13120540091069,
//         bId: 13120469875901,
//         cId: 13,
//         aId: 359563060077061,
//         camStatus: "1",
//         aiStatus: "1",
//         detectionLine: "",
//         shieldLine: "5,19,922,19,922,518,5,518",
//         borderLine: "",
//         interestLine: "20",
//         aiConf: 0,
//         detectSizeX: 1,
//         detectSizeY: 20,
//         hideField: "",
//         duration: 0,
//         threshold: 2,
//         ambiguity: 0,
//         light: "2",
//         criticalFrame: 3,
//         totalFrame: 5,
//         ai: {
//           aiId: 359563060077061,
//           parentId: 359562685473285,
//           aiPath: "/0/359561051193861/359562685473285/359563060077061/",
//           aiName: "防毒口罩识别",
//           aiNickName: "防毒口罩识别",
//           sort: 1,
//           aiPackage: "N",
//           aiLast: "Y",
//           camLimit: 1,
//           npuLimit: 1,
//           alarmName: "未戴防毒口罩告警",
//           alarmInterval: 10,
//           aiWeight: 25,
//           icon: "aiIcon",
//           aiColor: "rgba(255, 0, 0, 1)",
//           aiEnable: "1",
//           aiDescribe: "25",
//           sysBoxes: null,
//           createdAt: "2022-12-02T10:45:52.216+08:00",
//           updatedAt: "2022-12-02T10:45:52.225+08:00",
//           createBy: 0,
//           updateBy: 0,
//           dataScope: "",
//           params: "",
//           children: null,
//           sysCameraIds: [],
//           camIdNames: [],
//           sysCameras: null
//         },
//         sysAiTimes: [],
//         aiTime: []
//       },
//       {
//         id: 13120621951317,
//         nId: 13120621949269,
//         bId: 13120473511253,
//         cId: 13,
//         aId: 359564556722693,
//         camStatus: "0",
//         aiStatus: "0",
//         detectionLine: "",
//         shieldLine: "3,8,950,8,950,528,3,528",
//         borderLine: "",
//         interestLine: "20",
//         aiConf: 0,
//         detectSizeX: 1,
//         detectSizeY: 20,
//         hideField: "",
//         duration: 0,
//         threshold: 2,
//         ambiguity: 0,
//         light: "2",
//         criticalFrame: 4,
//         totalFrame: 5,
//         ai: {
//           aiId: 359564556722693,
//           parentId: 359564369064453,
//           aiPath: "/0/359561051193861/359564369064453/359564556722693/",
//           aiName: "安全帽识别",
//           aiNickName: "安全帽识别",
//           sort: 1,
//           aiPackage: "N",
//           aiLast: "Y",
//           camLimit: 1,
//           npuLimit: 1,
//           alarmName: "未戴安全帽告警",
//           alarmInterval: 10,
//           aiWeight: 25,
//           icon: "aiIcon",
//           aiColor: "rgba(255, 0, 0, 1)",
//           aiEnable: "1",
//           aiDescribe: "01",
//           sysBoxes: null,
//           createdAt: "2022-12-02T10:51:57.607+08:00",
//           updatedAt: "2022-12-06T12:10:21.027+08:00",
//           createBy: 0,
//           updateBy: 0,
//           dataScope: "",
//           params: "",
//           children: null,
//           sysCameraIds: [],
//           camIdNames: [],
//           sysCameras: null
//         },
//         sysAiTimes: [
//           {
//             id: 13122429343311,
//             acId: 13120621951317,
//             startAt: "2006-01-02T00:00:00+08:00",
//             endAt: "2006-01-02T23:59:59+08:00",
//             aiTimeArray: [
//               "2006-01-02T00:00:00+08:00",
//               "2006-01-02T23:59:59+08:00"
//             ],
//             createdAt: "2022-12-14T15:51:18.35+08:00",
//             updatedAt: "2022-12-14T15:51:18.35+08:00",
//             createBy: 0,
//             updateBy: 0
//           }
//         ],
//         aiTime: [{ startAt: "00:00", endAt: "23:59" }]
//       }
//     ]
//   }
// };
const plcConfigData = () => {
  return [
    {
      plcId: "",
      dictCode: ""
    }
  ];
};
import {
  addSysAiConfig,
  authentication,
  delSysAiConfig,
  getExtendLine,
  getProductLine,
  getSysAiConfig,
  listSysAiConfig,
  updateSysAiConfig,
  removeAiFlow
} from "@/api/box/sys-ai-config";
import { getDicts } from "@/api/admin/dict/data.js";
import {
  getSysCamera,
  getSysCameraRelateAi,
  updateRelateAi
} from "@/api/box/sys-camera";
// import drawDetectionConfig from "./components/drawDetectionConfig";
// import drawBorderConfig from "./components/drawBorderConfig";
// import drawShieldConfig from "./components/drawShieldConfig";
// import drawPeopleCount from "./components/drawPeopleCount";
// import drawInterestedConfig from "./components/drawInterestedConfig";
import canvasDraw from "./canvasDraw";
import plcConfig from "@/views/box/plc-config/plcConfig";
import { getAllBoxRelateAi } from "@/api/box/sys-box";
import { getAllAiNameDict, getSysAi } from "@/api/box/sys-ai";
import {
  plcDictData,
  sysPlcRequest,
  sysPlcConfigRequest
} from "@/api/box/sys-plc";
const drawMaxCount = 20; // 可绘制的最大图形数量
const cerMaxCount = 50; // 多边形允许最多节点数量
export default {
  name: "SysAiConfigManage",
  components: {
    // drawDetectionConfig,
    // drawShieldConfig,
    // drawBorderConfig,
    // drawPeopleCount,
    // drawInterestedConfig,
    canvasDraw,
    plcConfig
  },
  data() {
    return {
      // 用户权限控制列显示
      showCol: true,
      submitFormRelateAiSwitch: false,
      // 遮罩层
      loading: true,
      checkList: ["选中且禁用", "复选框 A"],
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
      relateAiTitle: "",
      // 是否显示弹出层
      open: false,
      relateAiOpen: false,
      isEdit: false,
      relateAiIsEdit: false,
      isEditSubmitForm: false,
      // 类型数据字典
      typeOptions: [],
      sysAiConfigList: [],
      lightOptions: [],
      // 关系表类型
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        cId: this.$route.params.camId
        // cId: this.$route.query.camId
      },
      // 表单参数
      form: {},
      // 表单参数
      relateAiForm: {
        camId: "",
        sysAiIds: []
      },
      relateAiFormAiLength: 0,
      sysAiIdsOldU: [],
      aiOptions: [],
      aiOptionIds: [],
      sysAiNameOptions: [],
      // 表单参数
      cameraForm: {},
      // 表单参数
      aiForm: {},
      plcConfigRules: {},
      // 表单校验
      rules: {
        threshold: [
          { required: true, message: "请输入1-999的数字", trigger: "blur" }
        ],
        duration: [
          { required: true, message: "请输入1-10000的数字", trigger: "blur" }
        ],
        aiConf: [
          { required: true, message: "请输入0-1内的数值", trigger: "blur" }
        ],
        light: [
          { required: true, message: "请选择识别光线环境", trigger: "blur" }
        ],
        criticalFrame: [
          { required: true, message: "请输入0-100的数字", trigger: "blur" }
        ],
        totalFrame: [
          { required: true, message: "请输入0-100的数字", trigger: "blur" }
        ]
      },
      // 关联算法对话框表单校验
      relateAiRules: {},
      // 感兴趣区表单
      interestedDialog: {
        show: false,
        acId: 0,
        cId: 0,
        aId: 0,
        nId: 0,
        configData: undefined
      },
      // 识别区域表单
      detectionDialog: {
        show: false,
        acId: 0,
        cId: 0,
        aId: 0,
        nId: 0,
        configData: undefined
      },
      // 屏蔽区域表单
      shieldDialog: {
        show: false,
        acId: 0,
        cId: 0,
        aId: 0,
        nId: 0,
        configData: undefined
      },
      // 围界区域表单
      borderDialog: {
        show: false,
        acId: 0,
        cId: 0,
        aId: 0,
        nId: 0,
        configData: undefined
      },
      // 人员计数区域表单
      peopleCountDialog: {
        show: false,
        acId: 0,
        cId: 0,
        aId: 0,
        nId: 0,
        configData: undefined
      },

      checkAll: false,
      isIndeterminate: true,

      options3: [
        {
          value: 30,
          label: 30
        },
        {
          value: 50,
          label: 50
        },
        {
          value: 70,
          label: 70
        },
        {
          value: 90,
          label: 90
        },
        {
          value: 100,
          label: 100
        }
      ],
      value3: "",
      options4: [
        {
          value: 30,
          label: 30
        },
        {
          value: 50,
          label: 50
        },
        {
          value: 70,
          label: 70
        },
        {
          value: 90,
          label: 90
        },
        {
          value: 100,
          label: 100
        }
      ],
      value4: "",
      curEditType: "",
      curDrawData: {
        show: false,
        acId: 0,
        cId: 0,
        aId: 0,
        nId: 0,
        configData: undefined,
        drawMaxCount: drawMaxCount,
        cerMaxCount: cerMaxCount
      },
      curItemData: {},
      plcConfigVisible: false,
      curPlcConfigFormData: [],
      plcLists: [],
      plcCmdLists: [],
      plcConfigType: "add"
    };
  },
  // computed: {
  //   activeSysAiTimes: function () {
  //     return this.form.sysAiTimes.filter(function (sysAiTimes) {
  //       return "1" === sysAiTimes.preEnable;//返回isShow=true的项，添加到activeUsers数组
  //     })
  //   }
  // },
  watch: {
    handleCheckedAiDatesChange() {
      // console.log('handleCheckedAiDatesChange watch', this.relateAiForm.sysAiIds)
    }
  },
  created() {
    const camIdParam = this.$route.params && this.$route.params.camId;
    this.getList();
    this.getCamInfo(camIdParam);
    this.getAiTreeSelect();
    this.getAllAiNameDict();
    getDicts("sys_ai_light").then((response) => {
      this.lightOptions = response.data;
    });
    // 权限控制
    // console.info("user", this.$store.state.user);
    const roles = this.$store.state.user.roles;
    if (roles.indexOf("normal") !== -1) {
      // 修改对应角色名，控制权限
      this.showCol = false;
    }
    this.initLoadPlcdata();
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true;
      listSysAiConfig(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          // response = dbgdata;
          this.sysAiConfigList = response.data.list;
          console.log("查询参数列表", this.sysAiConfigList);
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
      this.value3 = "";
      this.value4 = "";
      this.form = {
        id: undefined,
        pId: undefined,
        bId: undefined,
        cId: undefined,
        aId: undefined,
        detectionLine: undefined,
        interestLine: undefined,
        shieldLine: undefined,
        borderLine: undefined,
        aiSensitivity: 1,
        detectSizeX: 50,
        detectSizeY: 100,
        hideField: undefined,
        ai: undefined,
        camera: undefined,
        aiTime: undefined
      };
      this.resetForm("form");
    },

    relateAiReset() {
      this.relateAiForm = {
        camId: undefined,
        sysAiIds: []
      };
      this.resetForm("relateAiForm");
    },
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
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "基础配置修改";
      this.isEdit = false;
    },
    /** 基础配置按钮操作 */
    handleUpdate(row) {
      this.reset();
      getSysAiConfig(row.id).then((response) => {
        // console.info("44444"+JSON.stringify( response.data))
        this.form = response.data;
        this.open = true;
        this.title = "算法基础配置";
        this.isEdit = true;
        this.isEditSubmitForm = true;
      });

      getSysAi(row.aId).then((response) => {
        this.aiForm = response.data;
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id !== undefined) {
            this.form.aiConf = Number(this.form.aiConf);
            // this.form.detectSizeX = this.value3
            // this.form.detectSizeY = this.value4
            this.form.duration = Number(this.form.duration);
            this.form.threshold = Number(this.form.threshold);
            this.form.ambiguity = Number(this.form.ambiguity);
            this.form.criticalFrame = Number(this.form.criticalFrame);
            this.form.totalFrame = Number(this.form.totalFrame);
            console.log(this.form, "表单信息");
            updateSysAiConfig(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess(response.msg);
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addSysAiConfig(this.form).then((response) => {
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
    // PLC 配置
    async plcConfig(row) {
      this.curItemData = row;
      let conFigData = plcConfigData();
      this.plcConfigType = "add";
      const { data } = await sysPlcConfigRequest({ query: { acId: row.id }});
      if (data && data.list && data.list.length) {
        conFigData = data.list;
        this.plcConfigType = "edit";
      }
      this.curPlcConfigFormData = conFigData;
      this.plcConfigVisible = true;
    },
    // 移除PLC
    dlectPLC(row) {
      this.$confirm("移除后相关配置将不生效", "移除此PLC?", {
        center: true,
        confirmButtonText: "确认移除"
      }).then((res) => {
        sysPlcConfigRequest({
          method: "delete",
          data: {
            acId: row.id
          }
        }).then((res) => {
          this.$message.success("移除成功");
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      // 检查是否可以删除
      const queryObj = { acId: row.id };
      removeAiFlow(queryObj).then((res) => {
        const { data } = res;
        if (data > 0) {
          this.$alert(
            "该算法已在流程算法中,不可移除,</br>若要移除，请先从流程步骤中删除！",
            "提示",
            {
              dangerouslyUseHTMLString: true,
              center: true
            }
          );
          return;
        }
        var aiName = row.ai.aiName;
        this.$confirm(
          ' 移除后，再次添加算法需重新配置！是否确认移除"' + aiName + '"算法?',
          "移除算法？",
          {
            confirmButtonText: "移除",
            cancelButtonText: "取消"
          }
        )
          .then(function() {
            // 删除-sys_ai_config  id  c_id   a_id
            // return delSysAiConfig({ 'ids': Ids })
            return delSysAiConfig(row);
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
      });
    },
    //* *一键验证 */
    handleValidation(row) {
      // console.info(row)
      authentication(row).then((response) => {
        if (response.code === 200) {
          this.msgSuccess(response.msg);
        } else {
          this.msgError(response.msg);
        }
      });
    },
    /** 表左上角：摄像头名称 */
    getCamInfo(camIdParam) {
      // const camId = this.$route.params.camId
      // console.info("ID值"+camIdParam)
      getSysCamera(camIdParam).then((response) => {
        this.cameraForm = response.data;
      });
    },
    commonUpdateItem(obj = {}) {
      if (obj.id) {
        for (let v of this.sysAiConfigList) {
          if (v.id === obj.id) {
            v = Object.assign(v, obj);
          }
        }
      }
    },
    // interestLine 感兴趣区
    // detectionLine 识别区
    // shieldLine 屏蔽区
    // borderLine 围界区
    // hideField 人员计数方向
    //* ****** */
    // 图形绘制
    handleCommon(row, type) {
      this.curDrawData = {
        show: false,
        acId: 0,
        cId: 0,
        aId: 0,
        nId: 0,
        configData: undefined,
        drawMaxCount: drawMaxCount,
        cerMaxCount: cerMaxCount
      };
      this.curEditType = type;
      let detailApi = getProductLine;
      switch (type) {
        case "interestLine":
          this.curDrawData.drawMaxCount = 1;
          break;
        case "hideField":
          detailApi = getExtendLine;
          break;
      }
      this.curDrawData.acId = row.id;
      this.curDrawData.aId = row.aId;
      detailApi(row.id).then((response) => {
        this.curDrawData.configData =
          response.data[type] !== "" ? response.data[type] : "";
        this.curDrawData.cId = response.data.cId;
        this.curDrawData.nId = response.data.nId;
        this.curDrawData.show = true;
      });
    },
    /** 关联按钮操作 查询 */
    handleRelateAi() {
      // this.relateAiReset()
      const camId = this.$route.params && this.$route.params.camId;
      getSysCameraRelateAi(camId).then((response) => {
        this.relateAiForm = response.data;
        this.sysAiIdsOldU = response.data.sysAiIds;
        this.relateAiFormAiLength = response.data.sysAiIds.length;
        this.relateAiOpen = true;
        this.relateAiTitle = "请选择算法";
        this.relateAiIsEdit = false;
        this.submitFormRelateAiSwitch = false;
      });
    },
    // 取消按钮
    cancelRelateAi() {
      this.relateAiOpen = false;
      this.getList();
      // this.relateAiReset()
    },
    /** 提交按钮 */
    submitFormRelateAi: function() {
      if (this.submitFormRelateAiSwitch) {
        this.$refs["relateAiForm"].validate((valid) => {
          if (valid) {
            // console.info(this.relateAiForm)
            this.relateAiIsEdit = true;
            updateRelateAi(this.relateAiForm).then((response) => {
              // console.info('11111115000000000'+JSON.stringify(response))
              if (response.code === 200) {
                this.msgSuccess(response.msg);
                this.relateAiOpen = false;
                this.relateAiIsEdit = false;
                this.getList();
              } else {
                // console.info('5000000000'+JSON.stringify(response.msg))
                this.relateAiIsEdit = false;
                this.msgError(response.msg);
              }
            });
          }
        });
      } else {
        this.msgSuccess("算法未发生改变");
        this.relateAiOpen = false;
      }
    },
    handleCheckedAiDatesChange(value) {
      // console.log('handleCheckedAiDatesChange', value)
      // console.info('222' + JSON.stringify(this.relateAiForm.sysAiIds))
      const checkedCount = value.length;
      // console.log('this.relateAiFormAiLength', this.relateAiFormAiLength)
      // console.log('checkedCount', checkedCount)
      this.submitFormRelateAiSwitch =
        checkedCount !== this.relateAiFormAiLength;
      this.checkAll = checkedCount === this.aiOptionIds.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.aiOptionIds.length;
    },
    handleCheckAllChange(val) {
      // console.info("handleCheckAllChange111"+ JSON.stringify(val))
      // console.info("handleCheckAllChange222"+ JSON.stringify(this.aiOptions))
      // console.info("handleCheckAllChange222"+ JSON.stringify(this.relateAiForm.sysAiIds))
      // console.info("handleCheckAllChange333"+  JSON.stringify(this.sysAiIdsOldU))
      const checkedCount = val.length;
      this.submitFormRelateAiSwitch =
        checkedCount !== this.relateAiFormAiLength;
      this.relateAiForm.sysAiIds = val ? this.aiOptionIds : this.sysAiIdsOldU;
      this.isIndeterminate = false;
    },
    /** 查询算法树结构 */
    getAiTreeSelect() {
      // 权限控制
      // console.info("deptId", this.$store.state.user.deptId)
      // console.info("user", this.$store.state.user)
      const deptId = this.$store.state.user.deptId;
      getAllBoxRelateAi(deptId).then((response) => {
        this.aiOptions = response.data.aiLastIdNameUniqueList;
        this.aiOptionIds = response.data.aiLastIdNameUniqueListIds;
        // console.info("222222"+(JSON.stringify(this.aiOptions)))
      });
    },
    addItem(acId) {
      // console.info(acId)
      let sum = this.form.sysAiTimes.length;
      // for (const sysAiTime of this.form.sysAiTimes) {
      sum++;
      // }
      // console.info('addItem sum' + sum)
      if (sum > 9) {
        this.$alert("最多可设置10个时间段", "提示", {});
        return;
      }

      this.form.sysAiTimes.push({
        id: 0,
        acId: acId,
        aiTimeArray: [
          new Date(2006, 0, 2, 0, 0, 0),
          new Date(2006, 0, 2, 23, 59, 59)
        ],
        startAt: "",
        endAt: ""
      });
      this.isEditSubmitForm = false;
      // console.info('111addItem' + this.form.sysAiTimes.length)
    },
    delItem(index) {
      this.form.sysAiTimes.splice(index, 1);
      this.isEditSubmitForm = false;
      // console.info('222delItem' + this.form.sysAiTimes.length)
    },
    /** 修改盒子名称 */
    changeSubmitForm() {
      this.isEditSubmitForm = false;
    },
    aiNameFormat(aId) {
      return this.selectDictLabel(this.sysAiNameOptions, aId);
    },
    /** 查询BoxAi参数列表 */
    getAllAiNameDict() {
      getAllAiNameDict().then((response) => {
        this.sysAiNameOptions = response.data;
      });
    },
    durationInput() {
      if (this.form.duration) {
        if (this.form.duration.length > 1) {
          if (this.form.duration.charAt(0) == "0") {
            this.form.duration = 1;
          }
        }
      }
      // if (this.form.duration == 0) {
      //   this.form.duration = 1;
      // }
      if (this.form.duration > 10000) {
        this.form.duration = 10000;
      }
    },
    onHidePlcConfig(value) {
      this.plcConfigVisible = value;
    },
    // PLC业务
    initLoadPlcdata() {
      this.querySysPlcList();
      this.initGetCmdOption();
    },
    // 获取plc输入方式下拉
    initGetCmdOption() {
      let temp = [];
      plcDictData({ dictType: "sys_plc_config_ins" }).then((res) => {
        const { data } = res;
        if (data && Array.isArray(data) && data.length) {
          temp = data;
        }
        this.plcCmdLists = temp;
      });
    },
    /** 查询plc列表 */
    querySysPlcList(queryData = "") {
      let temp = [];
      sysPlcRequest().then((res) => {
        if (res.code == 200) {
          const { data } = res;
          if (data && data.list && Array.isArray(data.list)) {
            temp = data.list;
          }
          this.plcLists = temp;
        }
      });
    },

    // #######################################################################
    //
    //   ************ 以下方法未使用，后期再删除。(绘制图形已整合到一起)，
    //
    // #######################################################################
    createInterestedDialogToggle(value) {
      this.interestedDialog.show = value;
    },
    createDetectionDialogToggle(value) {
      this.detectionDialog.show = value;
    },
    createShieldDialogToggle(value) {
      this.shieldDialog.show = value;
    },
    createBorderDialogToggle(value) {
      this.borderDialog.show = value;
    },
    createPeopleCountDialogToggle(value) {
      this.peopleCountDialog.show = value;
    },
    /** 感兴趣区修改按钮操作 */
    handleInterestedLine(row) {
      this.resetInterestedDialog();
      this.interestedDialog.acId = row.id;
      this.interestedDialog.aId = row.aId;
      getProductLine(row.id).then((response) => {
        this.interestedDialog.configData =
          response.data.interestLine !== "" ? response.data.interestLine : "";
        this.interestedDialog.cId = response.data.cId;
        this.interestedDialog.nId = response.data.nId;
        this.interestedDialog.show = true;
      });
    },
    /** 识别区域修改按钮操作 */
    handleDrawDetectionLine(row) {
      this.resetDetectionDialog();
      this.detectionDialog.acId = row.id;
      this.detectionDialog.aId = row.aId;
      getProductLine(row.id).then((response) => {
        this.detectionDialog.configData =
          response.data.detectionLine !== "" ? response.data.detectionLine : "";
        this.detectionDialog.cId = response.data.cId;
        this.detectionDialog.nId = response.data.nId;
        this.detectionDialog.show = true;
      });
    },
    /** 屏蔽区域修改按钮操作 */
    handleDrawShieldLine(row) {
      this.resetShieldDialog();
      this.shieldDialog.acId = row.id;
      this.shieldDialog.aId = row.aId;
      getProductLine(row.id).then((response) => {
        this.shieldDialog.configData =
          response.data.shieldLine !== "" ? response.data.shieldLine : "";
        this.shieldDialog.cId = response.data.cId;
        this.shieldDialog.nId = response.data.nId;
        this.shieldDialog.show = true;
      });
    },
    /** 围界区域修改按钮操作 */
    handleDrawBorderLine(row) {
      this.resetBorderDialog();
      this.borderDialog.acId = row.id;
      this.borderDialog.aId = row.aId;
      getProductLine(row.id).then((response) => {
        this.borderDialog.configData =
          response.data.borderLine !== "" ? response.data.borderLine : "";
        this.borderDialog.cId = response.data.cId;
        this.borderDialog.nId = response.data.nId;
        this.borderDialog.show = true;
      });
    },
    /** 人员计数区域修改按钮操作 */
    handleDrawPeopleCountLine(row) {
      this.resetPeopleCountDialog();
      this.peopleCountDialog.acId = row.id;
      this.peopleCountDialog.aId = row.aId;
      getExtendLine(row.id).then((response) => {
        this.peopleCountDialog.configData =
          response.data.hideField !== "" ? response.data.hideField : "";
        this.peopleCountDialog.cId = response.data.cId;
        this.peopleCountDialog.nId = response.data.nId;
        this.peopleCountDialog.show = true;
      });
    },
    // 表单重置
    resetInterestedDialog() {
      this.interestedDialog = {
        show: false,
        acId: 0,
        cId: 0,
        aId: 0,
        nId: 0,
        configData: undefined
      };
    },
    resetDetectionDialog() {
      this.detectionDialog = {
        show: false,
        acId: 0,
        cId: 0,
        aId: 0,
        nId: 0,
        configData: undefined
      };
    },
    resetShieldDialog() {
      this.shieldDialog = {
        show: false,
        acId: 0,
        cId: 0,
        aId: 0,
        nId: 0,
        configData: undefined
      };
    },
    // 表单重置
    resetBorderDialog() {
      this.borderDialog = {
        show: false,
        acId: 0,
        cId: 0,
        aId: 0,
        nId: 0,
        configData: undefined
      };
    },
    resetPeopleCountDialog() {
      this.peopleCountDialog = {
        show: false,
        acId: 0,
        cId: 0,
        aId: 0,
        nId: 0,
        configData: undefined
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.el-checkbox-width-aiConfig {
  width: 150px;
  height: 60px;
}

//.el-icon-plus {
//font-size: 30px; //改变图标大小
//line-height: 110px; //通过设置行高让图标垂直居中
//color: #409eff; //设置图标颜色
//}
// ::v-deep .el-input-number.is-controls-right .el-input-number__decrease{
//     display: none;
//   }
//   ::v-deep .el-input-number.is-controls-right .el-input-number__increase{
//     display: none;
//   }
.dialogDiv {
  height: 300px;
  overflow: auto;
}

.cameraStatus {
  .el-button--success {
    background-color: transparent;
    border: none;
    font-size: 24px;
    font-weight: 700;
    color: #7558f4;
  }

  .el-button--danger {
    background-color: transparent;
    border: none;
    font-size: 24px;
    font-weight: 700;
    color: #7558f4;
  }
}

.addCamera {
  .el-button--primary {
    padding: 10px 30px;
    background: linear-gradient(to bottom, #a388ff, #654ef4);
  }
}

//移除算法样式
.el-message-box__btns {
  .el-button--default {
    padding: 10px 30px;
    margin: 0 20px;
    color: #c3c1c7;
    border: 1px solid #c3c1c7;
    border-radius: 8px;
  }

  .el-button--primary {
    padding: 10px 30px;
    margin: 0 20px;
    color: #fff;
    border: 1px solid #7558f4;
    border-radius: 8px;
    background: linear-gradient(to bottom, #a388ff, #654ef4);
  }
}

//关联算法弹框样式
.Correlation {
  .el-dialog {
    padding: 20px;
    border-radius: 8px;
  }

  .el-dialog__header {
    text-align: center;

    .el-dialog__title {
      font-size: 24px;
      font-weight: 700;
      color: #7558f4;
      line-height: 70px;
    }
  }

  .dialog-algorithm {
    text-align: center;
    margin: 30px auto;

    .el-button--default {
      padding: 10px 30px;
      margin: 0 20px;
      color: #c3c1c7;
      border: 1px solid #c3c1c7;
      border-radius: 4px;
    }

    .el-button--primary {
      padding: 10px 30px;
      margin: 0 20px;
      color: #fff;
      border: 1px solid #7558f4;
      border-radius: 4px;
      background: linear-gradient(to bottom, #a388ff, #654ef4);
    }
  }

  //复选框样式
  .el-checkbox__input {
    text-align: center;
    border: 1px solid;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    line-height: 22px;

    .el-checkbox__inner {
      border: none;
    }

    .el-checkbox__inner:after {
      content: "";
      background-color: #7558f4;
      color: transparent;
      display: none;
    }
  }

  .el-checkbox__original {
    border: 1px solid #c3c1c7;
  }
}

//未设置样式
.associated {
  .el-tag--plain.el-tag--warning {
    color: #404554;
    background-color: transparent;
    border: none;
  }
}

//添加样式
.addIdentify {
  .el-button--text {
    padding: 0 8px;
    font-size: 30px;
    line-height: 30px;
    border: 2px solid #7558f4;
    border-radius: 4px;
  }
}

//灵敏度样式
//基础弹框样式
.baseDialog {
  .base-footer {
    text-align: center;
    line-height: 60px;

    .el-button--default {
      padding: 10px 30px;
      margin: 0 20px;
      color: #c3c1c7;
      border: 1px solid #c3c1c7;
      border-radius: 4px;
    }

    .el-button--primary {
      padding: 10px 30px;
      margin: 0 20px;
      color: #fff;
      border: 1px solid #7558f4;
      border-radius: 4px;
      background: linear-gradient(to bottom, #a388ff, #654ef4);
    }
  }
}
.checkbox-item {
  height: 60px;
  line-height: 60px;
  border: 1px solid #f0f0f0;
  width: calc(25% - 20px);
  margin: 5px 10px;
  border-radius: 5px;
  box-shadow: 0px 0px 7px -1px #ccc;

  overflow: hidden;
  transition: all 0.25s;
  label {
    // transition: all 0.2s;
  }
  &:hover {
    // label {
    transform: scale(1.1);
    // }
  }

  .el-checkbox {
    display: flex;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .el-checkbox__label {
      width: 100%;
    }
  }
}
.ellipsis {
  text-overflow: ellipsis;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
}
</style>
<style>
.Correlation .el-checkbox-group::after {
  content: "";
  display: block;
  visibility: hidden;
  clear: both;
  height: 0;
}
.Correlation .checkbox-item .el-checkbox__input {
  position: absolute;
  opacity: 0;
}
.Correlation .el-checkbox__label {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  padding-left: 0;
}
.Correlation svg {
  font-size: 22px;
}
.Correlation .label-text {
  display: inline-block;
  width: 100%;
  text-overflow: ellipsis;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-align: center;
  padding: 0 5px;
}
.duration input {
  padding: 0 0 0 10px;
}
</style>
