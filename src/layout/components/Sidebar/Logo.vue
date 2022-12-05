<template>
  <div
    class="sidebar-logo-container"
    :class="{ collapse: collapse }"
    :style="{
      backgroundColor:
        $store.state.settings.themeStyle === 'dark'
          ? variables.menuBg
          : variables.menuLightBg
    }"
  >
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" to="/">
        <div class="sidebar-logo-link">
          <img
            v-if="appInfo.sys_app_logo"
            :src="appInfo.sys_app_logo"
            class="sidebar-logo"
          >
          <h1
            v-else
            class="sidebar-title"
            :style="{
              color:
                $store.state.settings.themeStyle === 'dark'
                  ? variables.sidebarTitle
                  : variables.sidebarLightTitle
            }"
          >
            {{ appInfo.sys_app_name }}
          </h1>
        </div>
      </router-link>
      <router-link v-else key="expand" to="/">
        <div class="sidebar-logo-link">
          <img
            v-if="appInfo.sys_app_logo"
            :src="appInfo.sys_app_logo"
            class="sidebar-logo"
          >
          <h1
            class="sidebar-title"
            :style="{
              color:
                $store.state.settings.themeStyle === 'dark'
                  ? variables.sidebarTitle
                  : variables.sidebarLightTitle
            }"
          >
            {{ appInfo.sys_app_name }}
          </h1>
        </div>
      </router-link>
    </transition>
  </div>
</template>

<script>
import variables from '@/styles/variables.scss'
import logoImg from '@/assets/logo/sidebarLogo.png'
import { mapGetters } from 'vuex'

export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      logo: logoImg
    }
  },
  computed: {
    ...mapGetters(['appInfo']),
    variables() {
      return variables
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 64px;
  // background: #001529;
  // background: url(../../../assets/logo-head.png) no-repeat center center;

  & .sidebar-logo-link {
    width: 100%;
    height: 64px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    padding-left: 12px;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      border-radius: 3px;
      margin-top: 5px;
    }

    & .sidebar-title {
      color: #fff;
      font-weight: 400;
      font-size: 10px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      box-sizing: border-box;
      line-height: 20px;
      margin-left: 5px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2; // 根据实际情况修改
      overflow: hidden;
      max-height: 64px;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0;
      border-radius: 3px;
    }
  }
}
</style>
