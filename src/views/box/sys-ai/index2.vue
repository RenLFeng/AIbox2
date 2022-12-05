<template>
  <div>
    <div id="wordView" v-html="vHtml" />
  </div>
</template>

<script>
import mammoth from 'mammoth'
export default {
  name: 'Word',
  data() {
    return {
      vHtml: '',
      wordURL: 'http://127.0.0.1:8880/static/upload-file/testWord.docx'// 文件地址
    }
  },
  created() {
    const vm = this
    vm.wordURL = 'http://127.0.0.1:8880/static/upload-file/testWord.docx'

    const xhr = new XMLHttpRequest()
    xhr.open('get', this.wordURL, true)
    xhr.responseType = 'arraybuffer'
    xhr.onload = function() {
      if (xhr.status === 200) {
        mammoth
          .convertToHtml({ arrayBuffer: new Uint8Array(xhr.response) })
          .then(function(resultObject) {
            vm.$nextTick(() => {
              // document.querySelector("#wordView").innerHTML =
              //   resultObject.value;
              vm.vHtml = resultObject.value
            })
          })
      }
    }
    xhr.send()
  },
  methods: {
  }
}
</script>

<style>
</style>
