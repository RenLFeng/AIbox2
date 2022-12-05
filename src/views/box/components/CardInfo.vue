<template>
  <div class="cardInfo">
    <div>
      <p>设备数量</p>
      <p>{{ productNum }}</p>
    </div>
    <div>
      <p>发布状态</p>
      <p>
        <el-badge :type="productState === '0' ? 'danger' : 'success'" is-dot />{{
          productState === "0" ? " 未发布" : " 已发布"
        }}
      </p>
    </div>
    <div>
      <p>摄像头</p>
      <!--      <p style="font-size: 14px; font-weight: 600;">{{ deviceTypeFormat(productType) }}</p>-->
      <p style="font-size: 14px; font-weight: 600">
        {{ productCam }}
      </p>
    </div>
    <div>
      <p>算力</p>
      <!--      <p style="font-size: 14px; font-weight: 600;">{{ deviceTypeFormat(productType) }}</p>-->
      <p style="font-size: 14px; font-weight: 600">
        {{ productApe }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardInfo',
  props: {
    productNum: {
      type: [String, Number],
      default: 10
    },
    productState: {
      type: [String, Number],
      default: 0
    },
    productCam: {
      type: Number,
      default: 0
    },
    productApe: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {

    }
  },
  created() {

  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.cardInfo {
  margin-top: 16px;
  & > div {
    position: relative;
    float: left;
    width: 25%;
    text-align: center;
    margin: 0 0 0 0;
    p {
      margin: 0;
      font-size: 14px;
      line-height: 32px;
    }
    p:first-child {
      margin-bottom: 4px;
      font-size: 14px;
      line-height: 20px;
    }
  }
}
</style>
