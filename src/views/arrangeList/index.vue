<template>
  <div class="app-container">
    <!-- <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="所有诊断编排" name="all" />
      <el-tab-pane label="我的编排" name="me" />
    </el-tabs> -->
    <div>
      <router-link to="/diagnosis/index">
        <el-button type="primary" icon="el-icon-plus">创建诊断流程 </el-button>
      </router-link>
      <el-input
        v-model="diagnosisName"
        style="width: 300px; float: right"
        placeholder="请输入诊断名称"
        prefix-icon="el-icon-search"
        clearable
        @keyup.enter.native="diagnosisNameSearch"
      />
    </div>

    <el-table
      v-loading="isLoading"
      :data="operationSetsData.filter(
        (data) =>
          !diagnosisName ||
          data.name.toLowerCase().includes(diagnosisName.toLowerCase())
      )"
      style="width: 100%; margin: 10px 0"
      :header-cell-style="{
        background: '#F5F7FA',
        color: '#000',
        fontWeight: '900',
      }"
    >
      <el-table-column prop="name" label="诊断名称" show-overflow-tooltip />
      <el-table-column prop="version" label="版本号" show-overflow-tooltip />
      <el-table-column prop="desc" label="描述" show-overflow-tooltip />
      <el-table-column prop="maintainer" label="维护者" show-overflow-tooltip />
      <el-table-column
        prop="time"
        label="更新时间"
        :formatter="formatter"
        show-overflow-tooltip
      />
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="viewDeta(scope.row)"
          >查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right; margin: 20px 0">
      <!-- <el-pagination
        background
        :current-page="pagination.currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        >
      </el-pagination> -->
    </div>
  </div>
</template>

<script>
import { operationSets } from '@/api/arrangeList.js'
import { parseTime } from '@/utils'
// import { JSONFromService2 } from '../diagnosis/data.js'
export default {
  components: {},
  props: {},
  data() {
    return {
      isLoading: false,
      activeName: 'all',
      diagnosisName: '',
      operationSetsData: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 100
      }
    }
  },
  created() {
    this.operationSetsFn()
  },
  mounted() {},
  methods: {
    operationSetsFn() {
      this.isLoading = true
      operationSets({})
        .then((res) => {
          this.operationSetsData = res.data
          this.isLoading = false
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    viewDeta(row) {
      console.log(row, row.detail.metadata.annotations['diagnosis.kubediag.org/dashboard/detail'])
      this.$router.push({
        name: 'diagnosis',
        path: '/diagnosis/index',
        // params: { id: row.id },
        query: { isView: true }
      })
      // row.JSONFromService2 = JSONFromService2
      localStorage.setItem('viewDeta', JSON.stringify(row)) // 存
    },
    handleClick(tab, event) {
      // console.log(tab.name, event);
      this.operationSetsData.unshift(this.operationSetsData.pop())
    },
    diagnosisNameSearch() {
      this.handleClick()
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val
      // this.activityListFn();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val
      // this.activityListFn();
    },
    formatter(row) {
      return parseTime(row.time || '', '{y}-{m}-{d} {h}:{i}:{s}')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
