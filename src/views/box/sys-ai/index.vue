<template>
  <BasicLayout>
    <template #wrapper>
      <div class="main-box">
        <el-card class="box-card">
          <el-form
            ref="queryForm"
            :model="queryParams"
            :inline="true"
            label-width="68px"
          >
            <el-form-item
              label="名称"
              prop="aiName"
            ><el-input
              v-model="queryParams.aiName"
              prefix-icon="el-icon-search"
              placeholder="请输入算法名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
            </el-form-item>
            <el-form-item label="状态" prop="aiEnable">
              <el-select
                v-model="queryParams.aiEnable"
                placeholder="算法启用/停用状态"
                clearable
                size="small"
              >
                <el-option
                  v-for="dict in aiEnableOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="叶子节点" prop="configType">
              <el-select
                v-model="queryParams.aiLast"
                placeholder="是否是叶子节点"
                clearable
                size="small"
              >
                <el-option
                  v-for="dict in typeOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="集合包" prop="configType">
              <el-select
                v-model="queryParams.aiPackage"
                placeholder="是否是算法集合包"
                clearable
                size="small"
              >
                <el-option
                  v-for="dict in typeOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button
                class="filter-item"
                type="primary"
                size="small"
                @click="handleQuery"
              ><svg-icon icon-class="newSearch" /> 搜索</el-button>

              <el-button
                v-permisaction="['admin:sysai:add']"
                class="filter-item"
                type="primary"
                icon="el-icon-plus"
                size="small"
                @click="handleAdd"
              >新增</el-button>

              <el-button
                v-permisaction="['admin:sysai:add']"
                class="filter-item"
                type="danger"
                icon="el-icon-share"
                size="small"
                @click="handleSync"
              >集群同步</el-button>
            </el-form-item>
          </el-form>

          <!-- default-expand-all-->
          <el-table
            v-loading="loading"
            :data="sysaiList"
            row-key="aiId"
            border
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          >
            <el-table-column
              label="编号"
              align="center"
              prop="aiId"
              width="80"
            />
            <el-table-column
              label="名称"
              align="center"
              prop="aiName"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="别名"
              align="center"
              prop="aiNickName"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="算法权重"
              align="center"
              prop="aiWeight"
              width="80"
            />

            <el-table-column
              label="集合包"
              sortable="custom"
              prop="aiPackage"
              :formatter="aiPackageFormat"
              width="90"
            />
            <el-table-column
              label="叶子节点"
              sortable="custom"
              prop="aiLast"
              :formatter="aiLastFormat"
              width="100"
            />
            <el-table-column
              label="摄像头限制"
              align="center"
              prop="camLimit"
              width="100"
            />
            <el-table-column
              label="NPU限制"
              align="center"
              prop="npuLimit"
              width="100"
            />
            <el-table-column
              label="告警名称"
              align="center"
              prop="alarmName"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="告警时间间隔"
              align="center"
              prop="alarmInterval"
            />
            <el-table-column
              label="告警音频路径"
              align="center"
              prop="alarmAudio"
              :show-overflow-tooltip="true"
            />

            <el-table-column
              prop="icon"
              label="图标"
              align="center"
              width="100px"
            >
              <template slot-scope="scope">
                <svg-icon :icon-class="scope.row.icon" />
              </template>
            </el-table-column>
            <el-table-column label="颜色" align="center" prop="aiColor">
              <template slot-scope="scope">
                <el-color-picker
                  v-model="scope.row.aiColor"
                  size="small"
                  disabled
                />
              </template>
            </el-table-column>
            <el-table-column
              label="算法描述"
              align="center"
              prop="aiDescribe"
              :show-overflow-tooltip="true"
            />
            <!--          <el-table-column-->
            <!--            label="更新时间"-->
            <!--            align="center"-->
            <!--            prop="updatedAt"-->
            <!--          >-->
            <!--            <template slot-scope="scope">-->
            <!--              <span>{{ parseTime(scope.row.updatedAt) }}</span>-->
            <!--            </template>-->
            <!--          </el-table-column>-->
            <!--          <el-table-column label="绘制" align="center" width="80">-->
            <!--            <template slot-scope="scope">-->
            <!--              <el-switch-->
            <!--                v-model="scope.row.aiDraw"-->
            <!--                active-value="1"-->
            <!--                inactive-value="0"-->
            <!--                @change="handleAiEnableChange(scope.row)"-->
            <!--              />-->
            <!--            </template>-->
            <!--          </el-table-column>-->
            <el-table-column label="启用" align="center" width="80">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.aiEnable"
                  active-value="1"
                  inactive-value="0"
                  @change="handleAiEnableChange(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <!--              <el-button-->
                <!--                v-permisaction="['admin:sysai:edit']"-->
                <!--                size="mini"-->
                <!--                type="text"-->
                <!--                icon="el-icon-view"-->
                <!--                @click="viewAi(scope.row)"-->
                <!--              >详情查看-->
                <!--              </el-button>-->
                <div
                  style="display:flex;flex-wrap: wrap;justify-content: flex-end;"
                >
                  <el-button
                    v-permisaction="['admin:sysDept:add']"
                    size="mini"
                    type="text"
                    icon="el-icon-plus"
                    @click="handleAdd(scope.row)"
                  >新增</el-button>
                  <el-button
                    v-permisaction="['admin:sysai:edit']"
                    size="mini"
                    type="text"
                    icon="el-icon-edit"
                    @click="handleUpdate(scope.row)"
                  >修改
                  </el-button>
                  <el-button
                    v-if="scope.row.p_id !== 0"
                    v-permisaction="['admin:sysai:remove']"
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

          <!-- 添加或修改对话框 -->
          <el-dialog :title="title" :visible.sync="open" width="700px">
            <el-form ref="form" :model="form" :rules="rules" label-width="auto">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="上级算法" prop="parentId">
                    <treeselect
                      v-model="form.parentId"
                      :options="aiOptions"
                      :normalizer="normalizer"
                      :show-count="true"
                      placeholder="选择上级算法"
                      :is-disabled="isEdit"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="aiId">
                    <span slot="label">
                      算法ID
                      <el-tooltip
                        content="新增算法不填/添加已定算法请复制ID输入"
                        placement="top"
                      >
                        <i class="el-icon-warning" />
                      </el-tooltip>
                    </span>
                    <el-input
                      v-model="form.aiId"
                      placeholder="请输入算法ID"
                      :disabled="form.aiId !== undefined"
                      oninput="value=value.replace(/[^\d]/g,'')"
                      max-length="9999999999999999999"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="算法名称" prop="aiName">
                    <el-input
                      v-model="form.aiName"
                      placeholder="请输入算法名称"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="别名" prop="aiNickName">
                    <el-input
                      v-model="form.aiNickName"
                      placeholder="请输入算法别名"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="排序" prop="orderNum">
                    <el-input-number
                      v-model="form.sort"
                      controls-position="right"
                      :min="1"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="告警时差" prop="alarmInterval">
                    <el-input-number
                      v-model="form.alarmInterval"
                      controls-position="right"
                      :min="0"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="算法权重" prop="aiWeight">
                    <el-input-number
                      v-model="form.aiWeight"
                      controls-position="right"
                      :min="0"
                      :max="100"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="叶子节点" prop="aiLast">
                    <el-radio-group v-model="form.aiLast">
                      <el-radio
                        v-for="dict in typeOptions"
                        :key="dict.value"
                        :label="dict.value"
                      >{{ dict.label }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="集合包" prop="aiPackage">
                    <el-radio-group v-model="form.aiPackage">
                      <el-radio
                        v-for="dict in typeOptions"
                        :key="dict.value"
                        :label="dict.value"
                      >{{ dict.label }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="摄像头限制" prop="camLimit">
                    <el-input-number
                      v-model="form.camLimit"
                      controls-position="right"
                      :min="0"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="NPU限制" prop="npuLimit">
                    <el-input-number
                      v-model="form.npuLimit"
                      controls-position="right"
                      :min="0"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="告警名称" prop="aiName">
                    <el-input
                      v-model="form.alarmName"
                      placeholder="请输入算法名称"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="告警框颜色">
                    <el-color-picker
                      v-model="form.aiColor"
                      show-alpha
                      :predefine="predefineColors"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="菜单图标">
                    <el-popover
                      placement="bottom-start"
                      width="460"
                      trigger="click"
                      @show="$refs['iconSelect'].reset()"
                    >
                      <IconSelect ref="iconSelect" @selected="selected" />
                      <el-input
                        slot="reference"
                        v-model="form.icon"
                        placeholder="点击选择图标"
                        readonly
                      >
                        <svg-icon
                          v-if="form.icon"
                          slot="prefix"
                          :icon-class="form.icon"
                          class="el-input__icon"
                          style="height: 32px;width: 16px;"
                        />
                        <i
                          v-else
                          slot="prefix"
                          class="el-icon-search el-input__icon"
                        />
                      </el-input>
                    </el-popover>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="预览绘制">
                    <el-radio-group v-model="form.aiDraw">
                      <el-radio
                        v-for="dict in aiEnableOptions"
                        :key="dict.value"
                        :label="dict.value"
                      >{{ dict.label }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="算法状态">
                    <el-radio-group v-model="form.aiEnable">
                      <el-radio
                        v-for="dict in aiEnableOptions"
                        :key="dict.value"
                        :label="dict.value"
                      >{{ dict.label }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="8">
                  <el-form-item label="算法模糊度" prop="ambiguity">
                    <el-input
                      v-model="form.ambiguity"
                      maxlength="7"
                      minlength="1"
                      size="mini"
                    />
                  </el-form-item>
                </el-col> -->
                <!-- <el-col :span="16">
                  <span
                    style="font-size:14px;vertical-align: bottom;line-height:45px
                  "
                  >
                    (输入范围0-10000000,摄像头的模糊度低于该值将不进行算法识别)</span>
                </el-col> -->
                <!-- <el-col :span="24">
                  <el-form-item label="识别光线环境" prop="lightEnvir">
                    <el-radio-group v-model="form.lightEnvir">
                      <el-radio
                        v-for="dict in lightOptions"
                        :key="dict.value"
                        :label="dict.value"
                      >{{ dict.label }}</el-radio>
                    </el-radio-group>
                    <el-radio-group v-model="form.aiLast">
                      <el-radio
                        v-for="dict in typeOptions"
                        :key="dict.value"
                        :label="dict.value"
                        >{{ dict.label }}</el-radio
                      >
                    </el-radio-group>
                  </el-form-item>
                </el-col> -->
                <!-- <el-col :span="12">
                  <el-form-item label="连续判断帧数" prop="criticalFrame">
                    <div style="display: flex;width: 200px; ">
                      <div style="width: 55px;">
                        真帧数
                      </div>
                      <div style="width: 55px; text-align: left;">
                        <el-input
                          v-model="form.criticalFrame"
                          maxlength="2"
                          minlength="1"
                          size="mini"
                          prop="criticalFrame"
                        />
                      </div>
                      <div style="margin-left: 10px;">帧</div>
                    </div>

                    <div style="display: flex; ">
                      <div style="width: 80px;">
                        总帧数
                      </div>
                      <el-input
                        prop="totalFrame"
                        maxlength="3"
                        minlength="1"
                        size="mini"
                        v-model="form.totalFrame"
                      />
                    </div>
                  </el-form-item>
                </el-col> -->
                <!-- <el-col :span="24">
                  <el-form-item prop="totalFrame">
                    <div style="display: flex;width: 200px; ">
                      <div style="width: 55px;">
                        总帧数
                      </div>
                      <div style="width: 55px; text-align: left;">
                        <el-input
                          v-model="form.totalFrame"
                          prop="totalFrame"
                          maxlength="2"
                          minlength="1"
                          size="mini"
                        />
                      </div>
                      <div style="margin-left: 10px;">帧</div>
                    </div>
                  </el-form-item>
                </el-col> -->
                <el-col :span="24">
                  <el-form-item label="告警音频路径" prop="alarmAudio">
                    <el-input
                      v-model="form.alarmAudio"
                      placeholder="告警音频路径"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="算法描述" prop="aiDescribe">
                    <el-input
                      v-model="form.aiDescribe"
                      placeholder="算法描述"
                      type="textarea"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>

            <div slot="footer" class="ALG">
              <el-button v-if="title==='添加算法'" type="primary" @click="submitForm">添 加</el-button>
              <el-button v-else type="primary" @click="submitForm">确 定</el-button>
              <el-button @click="cancel">取 消</el-button>
            </div>
          </el-dialog>
        </el-card>
      </div>
    </template>
  </BasicLayout>
</template>

<script>
import {
  addSysAi,
  changeAiEnable,
  delSysAi,
  getAiList,
  getSysAi,
  syncSysAi,
  updateSysAi
} from '@/api/box/sys-ai'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import IconSelect from '@/components/IconSelect'

export default {
  name: 'SysAi',
  components: { Treeselect, IconSelect },
  data() {
    return {
      // 表单参数
      form: {},
      // 遮罩层
      loading: true,
      // 算法树选项
      aiOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      isEdit: false,
      // 类型数据字典
      typeOptions: [],
      sysaiList: [],
      aiEnableOptions: [],
      lightOptions: [],
      // 关系表类型

      // 查询参数
      queryParams: {
        aiName: undefined,
        aiEnable: undefined,
        aiLast: undefined,
        aiPackage: undefined,
        aiAmbiguity: undefined
      },
      color: 'rgba(255, 69, 0, 0.68)',
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        'rgba(255, 69, 0, 0.68)',
        'rgb(255, 120, 0)',
        'hsv(51, 100, 98)',
        'hsva(120, 40, 94, 0.5)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)',
        '#c7158577'
      ],
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: '上级算法不能为空', trigger: 'blur' }
        ],
        aiName: [
          { required: true, message: '算法名称不能为空', trigger: 'blur' }
        ],
        aiNickName: [
          { required: true, message: '算法别名不能为空', trigger: 'blur' }
        ],
        aiLast: [
          { required: true, message: '叶子节点不能为空', trigger: 'blur' }
        ],
        aiPackage: [
          { required: true, message: '集合包不能为空', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '算法顺序不能为空', trigger: 'blur' }
        ],
        camLimit: [
          { required: true, message: '摄像头限制不能为空', trigger: 'blur' }
        ],
        npuLimit: [
          { required: true, message: 'NPU限制不能为空', trigger: 'blur' }
        ],
        aiEnable: [
          {
            required: true,
            message: '算法启用/停用状态不能为空',
            trigger: 'blur'
          }
        ],
        aiWeight: [
          { required: true, message: '算法权重不能为空', trigger: 'blur' }
        ],
        alarmInterval: [
          { required: true, message: '告警时间间隔不能为空', trigger: 'blur' }
        ],
        alarmName: [
          { required: true, message: '告警名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getDicts('sys_ai_statue').then(response => {
      // console.log(response, 12312354535, 'xxx')
      this.aiEnableOptions = response.data
    })
    this.getDicts('sys_yes_no').then(response => {
      this.typeOptions = response.data
    })
    this.getDicts('sys_ai_light').then(response => {
      this.lightOptions = response.data
    })
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      getAiList(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          console.log(response, '内容详情')
          this.sysaiList = response.data
          this.loading = false
        }
      )
    },
    /** 转换算法数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.aiId,
        label: node.aiName,
        children: node.children
      }
    },
    /** 查询算法下拉树结构 */
    getTreeselect(e) {
      getAiList().then(response => {
        this.aiOptions = []

        if (e === 'update') {
          const ai = {
            aiId: '0',
            aiName: '主算法集合包',
            children: [],
            isDisabled: true
          }
          ai.children = response.data
          this.aiOptions.push(ai)
        } else {
          const ai = { aiId: '0', aiName: '主算法集合包', children: [] }
          ai.children = response.data
          this.aiOptions.push(ai)
        }
      })
    },
    // 参数系统内置字典翻译
    aiLastFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.aiLast)
    },
    // 参数系统内置字典翻译
    aiPackageFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.aiPackage)
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        aiId: undefined,
        parentId: undefined,
        aiName: undefined,
        aiEnable: '1',
        aiDraw: '1',
        sort: 1,
        aiTable: undefined,
        aiColor: 'rgba(255, 0, 0, 1)',
        aiConfig: undefined,
        aiDescribe: undefined,
        aiWeight: undefined,
        alarmAudio: undefined
      }
      this.resetForm('form')
    },
    getImgList: function() {
      this.form[this.fileIndex] = this.$refs['fileChoose'].resultList[0].fullUrl
    },
    fileClose: function() {
      this.fileOpen = false
    },
    aiEnableFormat(row) {
      return this.selectDictLabel(this.aiEnableOptions, row.aiEnable)
    },
    // 关系
    // 文件
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageIndex = 1
      this.getList()
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset()
      this.getTreeselect('add')
      if (row !== undefined) {
        this.form.parentId = row.aiId
      }
      this.open = true
      this.title = '添加算法'
      this.isEdit = false
    },
    /** 同步按钮操作 */
    handleSync() {
      this.$confirm(
        '同步后集群盒子算法的修改会被重置成本盒子当前数据！请谨慎操作！是否确认同步?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }
      )
        .then(function() {
          return syncSysAi()
        })
        .then(response => {
          if (response.code === 200) {
            this.msgSuccess(response.msg)
            this.open = false
            this.getList()
          } else {
            this.msgError(response.msg)
          }
        })
        .catch(function() {})
    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.getTreeselect('update')

      getSysAi(row.aiId).then(response => {
        console.log(response.data, 'qweqwe')
        this.form = response.data
        this.form.aiEnable = String(this.form.aiEnable)
        this.form.sort = String(this.form.sort)
        this.form.lightEnvir = String(this.form.lightEnvir)
        this.open = true
        this.title = '修改算法'
        this.isEdit = true
        console.log(this.form, 'sadasd')
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          // this.form.aiId = this.$refs.ele
          // this.form.sort = parseInt(this.form.sort)
          if (this.form.aiId !== undefined) {
            this.form.ambiguity = Number(this.form.ambiguity)
            this.form.criticalFrame = Number(this.form.criticalFrame)
            this.form.totalFrame = Number(this.form.totalFrame)
            this.form.lightEnvir = Number(this.form.lightEnvir)
            updateSysAi(this.form, this.form.aiId).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            this.form.parentId = Number(this.form.parentId)
            addSysAi(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm(
        '是否确认删除算法名称为"' + row.aiName + '"的数据项?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }
      )
        .then(function() {
          return delSysAi({ id: row.aiId })
        })
        .then(response => {
          if (response.code === 200) {
            this.msgSuccess(response.msg)
            this.open = false
            this.getList()
          } else {
            this.msgError(response.msg)
          }
        })
        .catch(function() {})
    },
    /** 排序回调函数 */
    // handleSortChang(column, prop, order) {
    //   prop = column.prop
    //   order = column.order
    //   if (this.order !== '' && this.order !== prop + 'Order') {
    //     this.queryParams[this.order] = undefined
    //   }
    //   if (order === 'descending') {
    //     this.queryParams[prop + 'Order'] = 'desc'
    //     this.order = prop + 'Order'
    //   } else if (order === 'ascending') {
    //     this.queryParams[prop + 'Order'] = 'asc'
    //     this.order = prop + 'Order'
    //   } else {
    //     this.queryParams[prop + 'Order'] = undefined
    //   }
    //   this.getList()
    // },
    // 摄像头状态修改
    handleAiEnableChange(row) {
      const text = row.aiEnable === '1' ? '启用' : '停用'
      this.$confirm('确认要"' + text + '""' + row.aiName + '"算法吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(function() {
          return changeAiEnable(row)
        })
        .then(() => {
          this.msgSuccess(text + '成功')
        })
        .catch(function() {
          row.aiEnable = row.aiEnable === '1' ? '0' : '1'
        })
    },
    // 选择图标
    selected(name) {
      this.form.icon = name
    }
    /** 查看按钮操作 */
    // viewAi(row) {
    //   if (row.aiTable === 'SysAiBorder') {
    //     this.$router.push({
    //       path: '/box/sys-ai-border'
    //     })
    //   }
    //   if (row.aiTable === 'SysAiFirework') {
    //     this.$router.push({
    //       path: '/box/sys-ai-firework'
    //     })
    //   }
    // }
  }
}
</script>
<style lang="scss" scoped>
.el-button--primary{
  background: linear-gradient(to bottom, #a388ff, #654ef4);
  padding:9px 20px
}

.ALG{
  .el-button{
    padding:10px 30px;
    margin: 0 20px;
  }
}
</style>
