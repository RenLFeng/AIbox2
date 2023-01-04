<template>
  <div
    class="wrap my-imgwrap"
    :style="`width: ${width ? width : '100%'}; height: ${
      height ? height : '100%'
    };`"
  >
    <!-- <div
      v-loading="loading"
      class="load-wrap"
      style="width: 100%; height: 100%"
      :class="{ imgLoadingend: loadingend }"
      :element-loading-text="`拼命加载中`"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.1)"
    >

      <el-skeleton style="width: 100%; height: 100%">
        <template slot="template">
          <el-skeleton-item variant="image" style="width: 100%; height: 100%" />
        </template>
      </el-skeleton>
      <el-button
        class="reloadbtn cpointer"
        type="text"
        size="small"
        @click="reloadFn"
      >刷新</el-button>
    </div> -->

    <div
      v-loading="loading"
      class="load-wrap"
      :class="{ imgLoadingend: loadingend }"
      :element-loading-text="`拼命加载中`"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.1)"
    >
      <el-button
        class="reloadbtn cpointer"
        type="text"
        size="small"
        @click="reloadFn"
      >刷新</el-button>
    </div>
    <img
      v-if="reloadimg"
      class="pic"
      :class="{ cpointer: hasPointer, imgLoadingend: loadingend }"
      :src="src"
      alt=""
      referrerPolicy="no-referrer"
      REL="NOREFERRER"
      @click="viewLists"
      @load="onLoadSuccess"
      @error="onImgError($event)"
    >
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  props: {
    src: {
      type: String,
      default: ""
    },
    previewList: {
      type: Array,
      default() {
        return [];
      }
    },
    width: {
      type: String,
      default: ""
    },
    height: {
      type: String,
      default: ""
    },
    fit: {
      type: String,
      default: "contain"
    }
  },
  data() {
    return {
      imgLoading: false,
      loading: true,
      loadIndex: 0,
      reloadimg: true,
      loadingend: false,
      loadDefault: false
    };
  },
  computed: {
    hasViewLists() {
      if (
        this.previewList &&
        Array.isArray(this.previewList) &&
        this.previewList.length &&
        !this.loadDefault
      ) {
        return true;
      }
      return false;
    },
    hasPointer() {
      return this.hasViewLists;
    }
  },
  watch: {
    src: function() {
      this.initImgLoad();
    }
  },
  created() {
    console.log("myimg created", this.loadingend);
    this.initImgLoad();
  },
  mounted() {},
  beforeDestroy() {
    this.initImgLoad();
  },
  methods: {
    reloadFn() {
      this.initImgLoad();
      this.reloadimg = false;
      setTimeout(() => {
        this.reloadimg = true;
      }, 200);
    },
    viewLists() {
      if (this.hasViewLists) {
        console.log("预览", this.previewList);
        this.$viewerApi({
          images: this.previewList
        });
      }
    },
    onLoadSuccess(e) {
      if (this.loadIndex) {
        this.loadIndex = 0;
      }
      this.loadingend = true;
    },
    onImgError(e) {
      if (!this.loadIndex) {
        // console.log("图片初始化加载失败", e);
        this.loadIndex = 1;
      }
      this.loadIndex++;
      if (this.loadIndex < 4) {
        // console.log(`尝试重复加载失败`, e);
        // eslint-disable-next-line no-self-assign
        e.target.src = e.target.src;
      } else {
        if (this.loadIndex < 6) {
          this.loadDefault = true;
          // console.log(`尝试重复加载默认图片失败,允许重复加载2次,防止死循环`, e);
          e.target.src = require("@/assets/404_images/imgNotFound.png");
          // e.target.src = "http://sdfs.jpg";
        } else {
          this.loadIndex = 0;
        }
      }
    },
    initImgLoad() {
      if (this.loadIndex) {
        this.loadIndex = 0;
      }
      this.loadingend = false;
      this.loadDefault = false;
    }
  }
};
</script>
<style scoped lang="scss">
.wrap {
  position: relative;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
.load-wrap {
  width: 100%;
  height: 100%;
  position: relative;
  &:hover {
    .reloadbtn {
      opacity: 1;
      z-index: 9999;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
    }
  }

  .reloadbtn {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    color: #fff;
    opacity: 0;
  }

  &.imgLoadingend {
    position: absolute;
    opacity: 0;
    height: 0;
  }
}

.pic {
  position: absolute;
  opacity: 0;
  transition: all 0.3s;
  left: 0;
  top: 0;

  &.imgLoadingend {
    opacity: 1;
  }
}
</style>
<style>
.load-wrap .el-loading-spinner .el-loading-text {
  font-size: 12px;
}
.my-imgwrap .load-wrap .el-skeleton {
  height: 100%;
}
.my-imgwrap .load-wrap .el-skeleton svg {
  height: 100%;
}
</style>
