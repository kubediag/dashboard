<template>
  <div class="app-container">
    <!-- <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="所有诊断编排" name="all" />
      <el-tab-pane label="我的编排" name="me" />
    </el-tabs> -->
    <div>
      <el-button type="primary" icon="el-icon-plus" @click="createNewDiagnosis">创建诊断</el-button>
    </div>

    <el-table
      v-loading="isLoading"
      :data="tableView"
      style="width: 100%; margin: 10px 0"
      :header-cell-style="{
        background: '#F5F7FA',
        color: '#000',
        fontWeight: '900',
      }"
    >
      <el-table-column prop="name" label="诊断名称" show-overflow-tooltip/>
      <el-table-column prop="target" label="执行对象" show-overflow-tooltip/>
      <el-table-column prop="phase" label="状态" show-overflow-tooltip/>
      <el-table-column prop="result" label="诊断结果" show-overflow-tooltip>
        <template slot-scope="scope" v-if="scope.row.result">
          <el-tooltip
            class="item"
            effect="dark"
            :content="JSON.stringify(scope.row.result, null, 2)"
            placement="top"
            popper-class="table-poper-result">
            <el-button type="text" size="small">查看</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
<!--      <el-table-column prop="maintainer" label="执行者" show-overflow-tooltip/>-->
      <el-table-column
        label="开始时间"
        :formatter="formatter"
        show-overflow-tooltip
        width="160"
      />
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="editData(scope.row)"
          >查看详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right; margin: 20px 0">
      <el-pagination
        :current-page="pagination.currentPage"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <diagnosisInfo ref="edit"/>
    <creatdiagnosis ref="add" @success="diagnosesSetsFn"/>
  </div>
</template>

<script>
import {diagnoses} from '@/api/diagnoseslist.js'
// import { parseTime } from '@/utils'
import diagnosisInfo from './diagnosisInfo.vue'
import creatdiagnosis from './creatdiagnosis.vue'
import moment from 'moment'

export default {
  components: {diagnosisInfo, creatdiagnosis},
  props: {},
  data () {
    return {
      isLoading: false,
      diagnosesSetsData: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 100
      }
    }
  },
  computed: {
    tableView () {
      if (this.pagination.total <= this.pagination.pageSize) return this.diagnosesSetsData
      return this.diagnosesSetsData.slice((this.pagination.currentPage - 1) * this.pagination.pageSize, this.pagination.pageSize)
    }
  },
  created () {
    this.diagnosesSetsFn()
  },
  methods: {
    createNewDiagnosis () {
      this.$refs.add.openDialog()
    },
    diagnosesSetsFn () {
      this.isLoading = true
      diagnoses({})
        .then((res) => {
          if (res.success) {
            this.pagination.currentPage = 1
            this.pagination.total = res.data.length
            this.diagnosesSetsData = res.data
          }
          this.isLoading = false
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    handleSizeChange (val) {
      this.pagination.currentPage = 1
      this.pagination.pageSize = val
    },
    handleCurrentChange (val) {
      this.pagination.currentPage = val
    },
    formatter (row) {
      console.log(row)
      return row.startTime ? moment(row.startTime).format('YYYY-MM-DD HH:mm:ss') : ''
    },
    editData (row) {
      this.$refs.edit.openDrawer(row)
    }
  }
}
</script>

<style lang="scss">
.table-poper-result {
  width: 80%;
}
</style>
