<template>
  <BasicLayout>
    <template #wrapper>
      <div class="main-box">
        <el-card class="box-card">
          <div class="container">
            <button @click="handleDownload">JSZip下载</button>
          </div>
        </el-card>
        <el-upload
          ref="upload"
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          :auto-upload="false"
          multiple
        >
          <el-button
            slot="trigger"
            size="small"
            type="primary"
          >选取文件</el-button>
          <el-button
            style="margin-left: 10px"
            size="small"
            type="success"
            @click="submitUpload"
          >上传到服务器</el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>

        <div>
          <input type="file" multiple @change="handleBefore">
          <input type="file" value="zip" @change="handleBeforedecodeZip">
          <p v-for="(v, i) in dataList" :key="i">
            {{ v.fileName }} <img :src="v.content" alt="">
          </p>
          <button @click="decodeZip(zipurl)">解压zip</button>
          <!-- <input type="file" webkitdirectory @change="handleBefore"> -->
        </div>
      </div>
    </template>
  </BasicLayout>
</template>

<script>
import axios from 'axios'
import JSZip from 'jszip'
// eslint-disable-next-line no-unused-vars
import FileSaver from 'file-saver'
export default {
  name: 'Download',
  data() {
    return {
      zipurl:
        'https://www2.exsoft.com.cn/downloads/bankefile/20221215/4bb957674357a0c00fe63a732bcaf3b3.zip',
      dataList: [],
      // 需要下载的文件，必须要有文件路径和文件名称
      fileList: [
        // {
        //   path: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
        //   fileName: 'img1.jpeg'
        // },
        // {
        //   path: 'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
        //   fileName: 'img2.jpeg'
        // },
        // {
        //   path: 'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
        //   fileName: 'img3.jpeg'
        // }
        // {
        //   path: 'https://img2.baidu.com/it/u=3005034651,882371095&fm=26&fmt=auto',
        //   fileName: '11.pdf'
        // }
      ]
    }
  },
  methods: {
    generateZipFile(
      zipName,
      files,
      options = { type: 'blob', compression: 'DEFLATE' }
    ) {
      return new Promise((resolve, reject) => {
        const zip = new JSZip()
        for (let i = 0; i < files.length; i++) {
          // 添加目录中包含的文件
          zip.file(files[i].name, files[i])
        }
        zip.generateAsync(options).then(function(content) {
          //
          // 生成zip文件
          zipName = zipName || Date.now() + '.zip'
          const zipFile = new File([content], zipName, {
            type: 'application/zip'
          })
          resolve(zipFile)
        })
      })
    },
    handleBefore(e) {
      const files = e.target.files
      console.log(files)
      this.generateZipFile('', files).then((res) => {
        console.log('generateZipFile', res)
        FileSaver.saveAs(res, '文件下载.zip')
      })
    },
    handleBeforedecodeZip(e) {
      const files = e.target.files
      this.decodeZip('', files)
    },
    async decodeZip(zipurl, file = null) {
      const jszip = new JSZip()
      let fileobj = file
      if (!file) {
        fileobj = await this.getFile(zipurl, 'arraybuffer')
        console.log('FDK放得开 fileobj', fileobj)
      }
      jszip
        .loadAsync(fileobj)
        .then((zip) => {
          console.log('FDK放得开', zip)
          for (const key in zip.files) {
            // 判断是否是目录
            if (!zip.files[key].dir) {
              if (/\.(png|jpg|jpeg|gif)$/.test(zip.files[key].name)) {
                // 判断是否是图片格式
                const base = zip.file(zip.files[key].name).async('base64') // 将图片转化为base64格式
                base.then((res) => {
                  this.dataList.push({
                    fileName: zip.files[key].name,
                    type: 'img',
                    content: `data:image/png;base64,${res}`
                  })
                })
              }
              if (/\.(txt)$/.test(zip.files[key].name)) {
                // 判断是否是文本文件
                const base = zip.file(zip.files[key].name).async('string') // 以字符串形式输出文本内容
                base.then((res) => {
                  this.dataList.push({
                    fileName: zip.files[key].name,
                    type: 'text',
                    content: res
                  })
                })
              }
            }
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    handleDownload() {
      const zip = new JSZip()
      const cache = {}
      const promises = []
      this.fileList.forEach((item) => {
        console.log('item', item)
        const promise = this.getFile(item.path).then((data) => {
          // eslint-disable-next-line camelcase
          const file_name = item.fileName
          zip.file(file_name, item.path, { binary: true })
          cache[file_name] = data
        })
        promises.push(promise)
      })
      Promise.all(promises).then(() => {
        console.log('发多少了', promises)
        zip.generateAsync({ type: 'blob' }).then((content) => {
          // 生成二进制流
          console.log('zip.generateAsyn', content)
          FileSaver.saveAs(content, '文件下载.zip') // 利用file-saver保存文件  自定义文件名
        })
      })
    },
    /**
     * 获取文件
     * @param url 文件路径
     * @returns {Promise<unknown>}
     */
    getFile(url, responseType = 'blob') {
      return new Promise((resolve, reject) => {
        axios({
          method: 'get',
          url,
          responseType: responseType // blob    arraybuffer
        })
          .then((data) => {
            console.log('data放松放松放松', data)
            resolve(data.data)
          })
          .catch((error) => {
            reject(error.toString())
          })
      })
    },
    submitUpload() {
      console.log(this.fileList)
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    }
  }
}
</script>
<style scoped lang="scss"></style>
