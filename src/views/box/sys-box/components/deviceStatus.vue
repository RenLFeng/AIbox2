<template>
  <div class="top">
    <div class="page-wrapper">
      <div class="text">全部设备</div>
      <!-- <ins-info

              :badge-text="'全部设备'"
              :show-data="deviceStatus['total']"
            /> -->
      <div class="text-strong">
        {{ deviceStatus['total'] }}
      </div>
    </div>
    <el-card class="standardList">
      <el-row :gutter="10" class="mb8">
        <el-form
          ref="form"
          :model="queryBoxStatusParams"
          label-width="80px"
        >
          <!-- <el-col :sm="7" :xs="24">
                  <el-form-item prop="prodId">
                    <el-select
                      v-model="queryBoxStatusParams.pId"
                      placeholder="选择产品"
                      :style="{ width: '70%', marginTop: '7px' }"
                      clearable
                      @change="setProduct"
                    >
                      <el-option
                        v-for="item in prodOptions"
                        :key="item.prodId"
                        :label="item.prodName"
                        :value="item.prodId"
                        :disabled="item.isPublish === 1"
                      />
                    </el-select>
                  </el-form-item>
                </el-col> -->

          <!-- <el-col :sm="4" :xs="24">
              <ins-info
                :badge-text="'全部设备'"
                :show-data="deviceStatus['total']"
              />
            </el-col> -->
          <!-- <el-col :sm="4" :xs="24">
                  <ins-info
                    :badge-status="'success'"
                    :badge-text="'在线设备'"
                    :show-data="deviceStatus['online']"
                  />
                </el-col>
                <el-col :sm="4" :xs="24">
                  <ins-info
                    :badge-status="'danger'"
                    :badge-text="'离线设备'"
                    :show-data="deviceStatus['offline']"
                  />
                </el-col>
                <el-col :sm="4" :xs="24">
                  <ins-info
                    :badge-status="'warning'"
                    :badge-text="'未启用设备'"
                    :show-data="deviceStatus['notActive']"
                  />
                </el-col> -->
          <div class="main-box-state">
            <div class="online">
              <div
                style="width: 14px;height:14px;background-color: #56D875;margin-right: 5px;"
              />
              <div class="state-text">在线设备</div>
              <div class="state-count">
                {{ deviceStatus['online'] }}
              </div>
              <div class="pipe-1" />
            </div>

            <div class="offline">
              <div
                style="width: 14px;height:14px;background-color: #F44040;margin-right: 5px;"
              />
              <div class="state-text">离线设备</div>
              <div class="state-count">
                {{ deviceStatus['offline'] }}
              </div>
              <div class="pipe-1" />
            </div>
            <div class="enabled">
              <div
                style="width: 14px;height:14px;background-color: #8D8D8D;margin-right: 5px;"
              />
              <div class="state-text">未启用设备</div>
              <div class="state-count">
                {{ deviceStatus['notActive'] }}
              </div>
            </div>
          </div>
          <div class="refresh">
            <el-tooltip content="刷新">
              <el-button
                circle
                size="mini"
                type="sync"
                icon="el-icon-refresh-right"
                :style="{ fontSize: '20px' }"
                @click="getDeviceData"
              />
            </el-tooltip>
          </div>
        </el-form>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import { getBoxStatueCount } from '@/api/box/sys-box'
export default {
  name: 'DeviceStatus',
  components: {

  },
  data() {
    return {
      deviceStatus: {},
      queryBoxStatusParams: {}
    }
  },
  created() {
    this.getDeviceData()
  },
  methods: {
    getDeviceData: function() {
      getBoxStatueCount(
        this.addDateRange(this.queryBoxStatusParams, this.dateRange)
      ).then(response => {
        if (response.code === 200) {
          // eslint-disable-next-line no-unused-vars
          for (const key in response.data) {
            // console.log('key名称是：' + key + ',key的值是：' + response.data[key])
            this.deviceStatus['total'] = response.data[3] || 0
            this.$set(this.deviceStatus, 'notActive', response.data[2] || 0)
            this.$set(this.deviceStatus, 'offline', response.data[0] || 0)
            this.$set(this.deviceStatus, 'online', response.data[1] || 0)
          }
        }
      })
    }
  }
}
</script>
