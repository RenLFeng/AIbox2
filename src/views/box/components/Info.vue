<template>
  <div>
    <span>
      <el-badge v-if="badgeStatus" is-dot :type="badgeStatus"/>
      {{ badgeText }}
    </span>
    <p :style="{ fontSize: '26px' }">{{ showData }}</p>
  </div>
</template>

<script>
export default {
  name: 'InsInfo',
  props: {
    badgeStatus: {
      type: String,
      default: ''
    },
    badgeText: {
      type: String,
      default: ''
    },
    showData: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
