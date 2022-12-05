<template>
  <div class="container">
    <div class="demo-image__preview">
      <el-image
        v-show="image1.isMain"
        class="image"
        :src="image1.src"
        @load="loadSuccess1"
        @error="image1.isLoaded=true"
      />
      <div class="demo-image__preview">
        <el-image
          v-show="image2.isMain"
          class="image"
          :src="image2.src"
          @load="loadSuccess2"
          @error="image2.isLoaded=true"
        />
      </div>
    </div></div></template>

<script>

export default {
  data() {
    return {
      // currentIndex: 1,
      isInitialized: false,
      isChanging: false, // 当前是否正在进行图片切换
      image1: {
        src: null,
        isLoaded: false,
        isMain: false
      },
      image2: {
        src: null,
        isLoaded: false,
        isMain: true
      }
    }
  },
  mounted() {
    // setInterval(() => {
    //   if (this.change(this.currentIndex)) {
    //     this.currentIndex++
    //   }
    //   if (this.currentIndex === 38) {
    //     this.currentIndex = 1
    //   }
    // }, 100)
  },
  methods: {
    async change(imageName) {
      if (this.isChanging) {
        console.log('当前正在进行图片切换，拒绝再次进行切换！')
        return false
      }

      /* 如果存在资源未加载完毕情况，等待图片加载完毕再进行切图 */
      while (this.isInitialized && (!this.image1.isLoaded || !this.image2.isLoaded)) {
        this.isChanging = true
        console.log('存在图片尚未加载完成，等待图片加载中')
        // await this.sleep(2)
      }

      this.isChanging = false
      const {
        src: src1,
        isMain: isMain1
      } = this.image1
      const {
        src: src2,
        isMain: isMain2
      } = this.image2
      // const context = require.context('@/assets/', false, /\.jpg$/) // 根据路径正则读取文件

      if (!src1 && !src2) {
        /* 首次加载图片 */
        console.log(`初始化，加载图片${imageName}.jpg，主图为image2...`)
        // this.image1.src = context(`./${imageName}.jpg`)
        // this.image2.src = context(`./${imageName}.jpg`)
        this.image1.src = imageName
        this.image2.src = imageName
        this.image2.isMain = true
        return true
      }

      /* 后续加载图片 */
      if (isMain1) {
        console.log(`加载图片${imageName}.jpg，主图为image1，令image2加载图片...`)
        this.image2.isLoaded = false
        // this.image2.src = context(`./${imageName}.jpg`)
        this.image2.src = imageName
      } else if (isMain2) {
        console.log(`加载图片${imageName}.jpg，主图为image2，令image1加载图片...`)
        this.image1.isLoaded = false
        // this.image1.src = context(`./${imageName}.jpg`)
        this.image1.src = imageName
      }
      return true
    },
    loadSuccess1() {
      this.image1.isLoaded = true
      if (this.isInitialized) {
        console.log('已切换到image1')
        this.image1.isMain = true
        this.image2.isMain = false
      } else {
        if (this.image2.isLoaded) {
          this.isInitialized = true
        }
      }
    },
    loadSuccess2() {
      this.image2.isLoaded = true
      if (this.isInitialized) {
        console.log('已切换到image2')
        this.image2.isMain = true
        this.image1.isMain = false
      } else {
        if (this.image1.isLoaded) {
          this.isInitialized = true
        }
      }
    },
    sleep(time) {
      return new Promise((resolve) => setTimeout(resolve, time))
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  width: 100%;
  height: 100%;
}

.image {
  position: absolute;

  &:nth-of-type(1) {
    z-index: 2000;
  }

  &:nth-of-type(2) {
    z-index: 3000;
  }
}
</style>
