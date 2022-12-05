<template>
  <div class="dub-video-touch">

    <div
      class="dub-video-touch-btn top-left"
      @mousedown="onPtz($event, 'topLeft', true)"
      @mouseup="onPtz($event, 'topLeft', false)"
    />
    <div
      class="dub-video-touch-btn top"
      @mousedown="onPtz($event, 'top', true)"
      @mouseup="onPtz($event, 'top', false)"
    />
    <div
      class="dub-video-touch-btn top-right"
      @mousedown="onPtz($event, 'topRight', true)"
      @mouseup="onPtz($event, 'topRight', false)"
    />

    <div
      class="dub-video-touch-btn left"
      @mousedown="onPtz($event, 'left', true)"
      @mouseup="onPtz($event, 'left', false)"
    />
    <div class="dub-video-touch-btn right" />
    <div
      class="dub-video-touch-btn right"
      @mousedown="onPtz($event, 'right', true)"
      @mouseup="onPtz($event, 'right', false)"
    />

    <div
      class="dub-video-touch-btn bottom-left"
      @mousedown="onPtz($event, 'bottomLeft', true)"
      @mouseup="onPtz($event, 'bottomLeft', false)"
    />
    <div
      class="dub-video-touch-btn bottom"
      @mousedown="onPtz($event, 'bottom', true)"
      @mouseup="onPtz($event, 'bottom', false)"
    />
    <div
      class="dub-video-touch-btn bottom-right"
      @mousedown="onPtz($event, 'bottomRight', true)"
      @mouseup="onPtz($event, 'bottomRight', false)"
    />

  </div>
</template>

<script>
export default {
  name: 'DubVideoTouch',
  props: {

  },
  data() {
    return {

    }
  },
  methods: {
    onPtz(evt, command, flag) {
      evt.stopPropagation()
      evt.preventDefault()
      this.$emit('ptz', evt, command, flag)
    }
  }
}
</script>

<style>
    .dub-video-touch{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        padding: 5px;
    }

    .dub-video-touch-btn{
        float: left;
        width: 32.5%;
        height: 31.5%;
        margin-right: 1px;
        margin-bottom: 1px;
        opacity: 0;
    }

    .dub-video-touch-btn:hover{
        opacity: 0.5;
    }

    .dub-video-touch-btn.top{
        cursor: n-resize;
    }

    .dub-video-touch-btn.top-left{
        cursor: nw-resize;
    }

    .dub-video-touch-btn.top-right{
        cursor: ne-resize;
    }

    .dub-video-touch-btn.left{
        cursor: w-resize;
    }

    .dub-video-touch-btn.right{
        cursor: e-resize;
    }

    .dub-video-touch-btn.bottom{
        cursor: s-resize;
    }

    .dub-video-touch-btn.bottom-left{
        cursor: sw-resize;
    }

    .dub-video-touch-btn.bottom-right{
        cursor: se-resize;
    }

</style>
