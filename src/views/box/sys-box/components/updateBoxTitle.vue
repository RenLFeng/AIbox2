<template>
  <el-dialog
    title="修改盒子名称"
    :visible.sync="changeBoxNameOpen"
    class="changeBoxName"
    width="400px"
    :close-on-click-modal="false"
  >
    <el-form
      ref="changeBoxNameForm"
      :model="changeBoxNameForm"
      :rules="changeBoxNameRules"
      label-width="40px"
    >
      <el-col :span="21">
        <el-form-item prop="boxName">
          <el-input
            v-model="changeBoxNameForm.boxName"
            placeholder="请输入盒子名称"
            @input="changeBoxName"
          />
        </el-form-item>
      </el-col>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="changeBoxNameOpen = false">取 消</el-button>
      <el-button
        type="primary"
        :disabled="isEditChangeBoxName"
        @click="changeBoxNameSubmitForm"
      >确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { updateSysBoxName } from '@/api/box/sys-box'
export default {
  name: 'UpdateBoxTitle',
  data() {
    return {
      changeBoxNameOpen: false,
      isEditChangeBoxName: true,
      changeBoxNameForm: {
        boxName: ''
      },
      changeBoxNameRules: {
        boxName: [
          { required: true, message: '盒子名称不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 20,
            message: '盒子名称限制输入20个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    changeBoxName() {
      this.isEditChangeBoxName = false
    },
    open(data) {
      this.changeBoxNameForm = { ...data }
      this.changeBoxNameOpen = true
    },
    changeBoxNameSubmitForm() {
      this.$refs['changeBoxNameForm'].validate(valid => {
        if (valid) {
          if (this.changeBoxNameForm.boxId !== undefined) {
            updateSysBoxName(this.changeBoxNameForm).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改盒子名称成功')
                this.changeBoxNameOpen = false
                this.$emit('success')
              } else {
                this.msgError(response.msg)
              }
            })
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-dialog {
  border-radius: 8px;
}

.dialog-footer {
  width: 284px;
  height: 40px;
  line-height: 30px;
  display: flex;
  justify-content: space-around;
  margin: 30px auto;
  .el-button {
    padding: 0 50px;
    &.el-button--primary {
      background: linear-gradient(to bottom, #a388ff, #654ef4) !important;
    }
  }
}

.changeBoxName {
  text-align: center;
  .el-dialog__header {
    border-bottom: 1px solid transparent;
    .el-dialog__title {
      font-size: 24px;
      font-weight: 700;
      color: #7558f4;
    }
  }
}
</style>
