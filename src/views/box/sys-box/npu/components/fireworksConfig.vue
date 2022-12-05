<template>
  <div class="app-container">
    <div class="my-0">
      <el-form
        ref="form"
        :label-position="labelPosition"
        label-width="200px"
        :model="formLabelAlign"
        :rules="rules"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="灵敏度:">
              <template>
                <div class="block" style="width: 438px">
                  <el-slider
                    v-model="formLabelAlign.aiSensitivity"
                    :max="100"
                    :min="1"
                    show-input
                  />
                </div>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="有效距离:">
              <template>
                识别目标在画面占比
                <el-select
                  v-model="formLabelAlign.aiDistance"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="12">
            <el-form-item label="开始识别时间段:" prop="startTime">
              <template>
                <el-time-picker
                  v-model="formLabelAlign.startTime"
                  :picker-options="{
                    selectableRange: '00:00:00 - 23:59:59'
                  }"
                  placeholder="任意时间点"
                />
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束识别时间段:" prop="stopTime">
              <template>
                <el-time-picker
                  v-model="formLabelAlign.stopTime"
                  :picker-options="{
                    selectableRange: '00:00:00 - 23:59:59'
                  }"
                  placeholder="任意时间点"
                />
              </template>
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-form-item>
          <template>
            <el-button
              type="primary"
              round
              @click="handleByUpdateAlgorithmConf"
            >保存算法参数</el-button>
          </template>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AlgorithmConfig',
  props: {
    config: {
      type: Object,
      default: function() {
        return undefined
      }
    },
    ind: {
      type: Number,
      default: function() {
        return 0
      }
    }
  },
  data() {
    return {
      labelPosition: 'right',
      aiIndex: this.ind,
      formLabelAlign: {
        aiSensitivity: 0,
        aiDistance: ''
      },
      rules: {
        startTime: [
          { required: true, message: '开始时间不能为空', trigger: 'blur' }
        ],

        stopTime: [
          { required: true, message: '结束时间不能为空', trigger: 'blur' }
        ]
      },
      options: [
        {
          value: '10',
          label: '10%'
        },
        {
          value: '20',
          label: '20%'
        },
        {
          value: '30',
          label: '30%'
        },
        {
          value: '40',
          label: '40%'
        },
        {
          value: '50',
          label: '50%'
        },
        {
          value: '60',
          label: '60%'
        },
        {
          value: '70',
          label: '70%'
        },
        {
          value: '80',
          label: '80%'
        },
        {
          value: '90',
          label: '90%'
        },
        {
          value: '100',
          label: '100%'
        }
      ]
    }
  },
  watch: {
    config: {
      handler(newValue, oldValue) {
        if (newValue.aiSensitivity !== 'number') {
          newValue.aiSensitivity = Number(newValue.aiSensitivity)
        }
        this.formLabelAlign = newValue
      },
      deep: true,
      immediate: true
    },
    ind: {
      handler(newValue, oldValue) {
        this.aiIndex = newValue
      },
      deep: true
    }
  },
  methods: {
    initData() {},
    handleByUpdateAlgorithmConf() {
      this.$emit('ok', { index: this.aiIndex, config: this.formLabelAlign })
    }
  }
}
</script>
