
<template>
  <BasicLayout>
    <template #wrapper>
      <div class="main-box">
        <el-card class="box-card">
          <div class="flex search-wapper">
            <el-form
              ref="queryForm"
              :model="queryParams"
              :inline="true"
              label-width="68px"
            >
              <el-form-item label="产品状态" prop="isPublish">
                <el-select
                  v-model="queryParams.isPublish"
                  placeholder="产品状态"
                  clearable
                  size="small"
                  style="width: 240px"
                >
                  <el-option
                    v-for="dict in isPublishOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="产品名称" prop="prodName">
                <el-input
                  v-model="queryParams.prodName"
                  placeholder="请输入产品名称"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>

              <el-form-item>
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  size="mini"
                  @click="handleQuery"
                >搜索</el-button>
                <el-button
                  icon="el-icon-refresh"
                  size="mini"
                  @click="resetQuery"
                >重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="data-operate-container">
            <el-button
              v-permisaction="['admin:sysproduct:add']"
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >新增
            </el-button>
          </div>
          <el-row v-for="(page, index) of pages" :key="index" :gutter="8">
            <el-col
              v-for="item of page"
              :key="item.prodId"
              :span="6"
              style="margin-bottom: 40px"
            >
              <el-card shadow="hover">
                <el-row :gutter="5">
                  <el-col :span="4">
                    <el-avatar
                      size="small"
                      :src="
                        item.photoUrl
                          ? item.photoUrl
                          : require('../../../assets/product_avater.png')
                      "
                      class="avatar"
                    />
                  </el-col>
                  <el-col :span="20">
                    <div class="productName">
                      <span>{{ item.prodName }}</span>
                    </div>
                    <div class="productDes">
                      <span> {{ item.prodDescribe }}</span>
                    </div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <card-info
                      :product-num="item.sysBoxNum"
                      :product-state="item.isPublish"
                      :product-cam="item.camLimit"
                      :product-ape="item.apeLimit"
                    />
                  </el-col>
                </el-row>
                <el-divider />
                <el-row>
                  <el-col>
                    <el-button-group style="width: 100% ;display: flex;">
                      <el-tooltip content="查看">
                        <el-button
                          icon="el-icon-view"
                          placement="bottom-start"
                          :style="{ fontSize: '20px', width: '33%' }"
                          @click="viewProduct(item)"
                        />
                      </el-tooltip>
                      <el-tooltip content="修改">
                        <el-button
                          icon="el-icon-edit-outline"
                          placement="bottom-start"
                          :style="{ fontSize: '20px', width: '33%' }"
                          @click="editProduct(item)"
                        />
                      </el-tooltip>

                      <el-tooltip v-if="item.isPublish === '1'" content="删除">
                        <el-button
                          placement="bottom-start"
                          :style="{ fontSize: '20px', width: '33%' }"
                          icon="el-icon-delete"
                          @click="handleDelete(item)"
                        />
                      </el-tooltip>
                      <el-dropdown
                        v-if="item.isPublish !== '1'"
                        style="margin: 0 0 0 1px; width: 33%"
                        @command="handleCommand"
                      >
                        <el-button
                          icon="el-icon-more"
                          placement="bottom-start"
                          :style="{ fontSize: '20px', width: '100%' }"
                        />
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item
                            :command="{ data: item, type: 1 }"
                            icon="el-icon-check"
                          >发布</el-dropdown-item>
                          <el-dropdown-item
                            :command="{ data: item, type: 2 }"
                            icon="el-icon-delete"
                          >删除</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </el-button-group>
                  </el-col>
                </el-row>
              </el-card>
            </el-col>
          </el-row>
        </el-card>

        <view-dialog
          :show="viewDialog.show"
          :p-id="viewDialog.pId"
          @showChange="viewDialogToggle"
          @ok="getList"
        />
        <edit-dialog
          :show="editDialog.show"
          :p-id="editDialog.pId"
          @showChange="editDialogToggle"
          @ok="getList"
        />
        <add-dialog
          :show="addDialog.show"
          @showChange="addDialogToggle"
          @ok="getList"
        />
      </div>
    </template>
  </BasicLayout>
</template>

<script>
import {
  addSysProduct,
  changeProductStatus,
  delSysProduct,
  listSysProduct,
  updateSysProduct
} from '@/api/box/sys-product'

import CardInfo from '../components/CardInfo'
import editDialog from './edit/index'
import addDialog from './add/index'
import viewDialog from './view/index'

export default {
  name: 'SysProduct',
  components: {
    CardInfo,
    editDialog,
    addDialog,
    viewDialog
  },
  data() {
    return {

      // 遮罩层
      loading: true,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      isEdit: false,
      // 类型数据字典
      typeOptions: [],
      sysproductList: [],

      // 关系表类型
      isPublishOptions: [],

      // 部门树选项
      deptOptions: undefined,
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        isPublish: '',
        prodName: ''
      },
      // 表单参数
      form: {},
      editDialog: {
        show: false,
        pId: undefined
      },
      viewDialog: {
        show: false,
        pId: undefined
      },
      addDialog: {
        show: false
      }
    }
  },
  computed: {
    pages() {
      const pages = []
      this.sysproductList.forEach((item, index) => {
        const page = Math.floor(index / 4) // 4代表4条为一行，随意更改
        if (!pages[page]) {
          pages[page] = []
        }
        pages[page].push(item)
      })
      // console.log(pages)
      return pages
    }
  },
  created() {
    this.getList()
    this.getDicts('sys_device_publish').then(response => {
      this.isPublishOptions = response.data
    })
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listSysProduct(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.sysproductList = response.data.list
          this.total = response.data.count
          this.loading = false
        }
      )
    },
    /** 排序回调函数 */
    handleSortChang(column, prop, order) {
      prop = column.prop
      order = column.order
      if (this.order !== '' && this.order !== prop + 'Order') {
        this.queryParams[this.order] = undefined
      }
      if (order === 'descending') {
        this.queryParams[prop + 'Order'] = 'desc'
        this.order = prop + 'Order'
      } else if (order === 'ascending') {
        this.queryParams[prop + 'Order'] = 'asc'
        this.order = prop + 'Order'
      } else {
        this.queryParams[prop + 'Order'] = undefined
      }
      this.getList()
    },
    // 产品状态修改
    handleIsPublishChange(row) {
      const text = row.isPublish === '0' ? '发布' : '取消发布'
      this.$confirm(
        '确认要"' + text + '""' + row.prodName + '"产品吗?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }
      )
        .then(function() {
          row.isPublish = '1'
          return changeProductStatus(row)
        })
        .then(() => {
          this.msgSuccess(text + '成功')
        })
        .catch(function() {
          // row.isPublish = row.isPublish === "1" ? "0" : "1";
        })
    },

    // 文件
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageIndex = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.addDialog.show = true
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.editDialog.show = true
      this.editDialog.pId = row.prodId
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.prodId !== undefined) {
            updateSysProduct(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addSysProduct(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      var Id = (row.prodId && [row.prodId])

      this.$confirm('是否确认删除"' + row.prodName + '"产品?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(function() {
          return delSysProduct({ id: Id })
        })
        .then(response => {
          if (response.code === 200) {
            this.msgSuccess(response.msg)
            this.open = false
            this.getList()
          } else {
            this.msgError(response.msg)
          }
        })
        .catch(function() {})
    },
    /** 查看按钮操作 */
    viewProduct(item) {
      this.viewDialog.show = true
      this.viewDialog.pId = item.prodId
    },
    /** 修改按钮操作 */
    editProduct(item) {
      this.editDialog.show = true
      this.editDialog.pId = item.prodId
    },
    handleCommand(en) {
      switch (en.type) {
        case 1:
          this.handleIsPublishChange(en.data)
          break
        case 2:
          this.handleDelete(en.data)
          break
      }
    },
    viewDialogToggle(value) {
      const _this = this
      _this.viewDialog.show = value
    },
    editDialogToggle(value) {
      const _this = this
      _this.editDialog.show = value
    },
    addDialogToggle(value) {
      const _this = this
      _this.addDialog.show = value
    }
  }
}
</script>

<style scoped lang="scss">
.productName {
  margin: 0 0 10px 10px;
  font-size: 19px;
  font-weight: bold;
}
.productDes {
  margin: 0 0 0 10px;
  color: #8c939d;
}
.avatar {
  width: 40px;
  height: 40px;
  line-height: 40px;
  background-color: #fff;
}
.data-operate-container {
  padding: 5px 0 15px 5px;
}
</style>
