<template>
  <el-dropdown v-if="showCol" @command="handleCommand">
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
</template>
<script>
export default {
  name: 'ActionList',
  components: {},
  data() {
    return {
      // 用户权限控制列显示
      showCol: true
    }
  },
  created() {
    // 权限控制
    // console.info("user", this.$store.state.user);
    const roles = this.$store.state.user.roles
    if (roles.indexOf('normal') !== -1) {
      // 修改对应角色名，控制权限
      this.showCol = false
    }
  },
  methods: {
    handleCommand(en) {
      switch (en) {
        case 6:
          this.handleDelete()
          break
      }
    }
  }
}
</script>
