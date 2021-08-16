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
      :data="tableView"
      style="width: 100%; margin: 10px 0"
      :header-cell-style="{
        background: '#F5F7FA',
        color: '#000',
        fontWeight: '900',
      }"
    >
      <el-table-column prop="name" label="诊断名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editData(scope.row)">{{
            scope.row.name
          }}</el-button>
        </template>
      </el-table-column>
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
            v-if="scope.row.req"
            type="text"
            size="small"
            @click="viewDeta(scope.row)"
          >查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right; margin: 20px 0">
      <pagination
        class="page"
        :total-count="pagination.total"
        :page-size="pagination.pageSize"
        :table-data="operationSetsData2"
        @tables="tables"
        @handleSizeChange="handleSizeChange"
      />
    </div>
    <edit ref="edit" />
  </div>
</template>

<script>
import { operationSets } from '@/api/arrangeList.js'
import { parseTime } from '@/utils'
import edit from '../operation/edit.vue'
import pagination from '../operation/pagination.vue'
export default {
  components: { edit, pagination },
  props: {},
  data() {
    return {
      isLoading: false,
      activeName: 'all',
      diagnosisName: '',
      operationSetsData2: [],
      operationSetsData: [],
      tableView: [],
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
          if (res.success) {
            // 记得清除this.tableView 因为搜索的时候也会用这个，会造成上次数据没及时清除掉
            this.tableView = []
            this.pagination.total = res.data.length
            // 进入if 因为他有多页码 else 只有1页
            if (res.data.length >= this.pagination.pageSize) {
              for (let i = 0; i < this.pagination.pageSize; i++) {
                this.tableView.push(res.data[i])
              }
            } else {
              this.tableView = res.data
            }
            this.operationSetsData = res.data
            this.operationSetsData2 = res.data
          }
          this.isLoading = false
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    operationSetsFn2() {
      this.tableView = []
      this.pagination.total = this.operationSetsData2.length
      // 进入if 因为他有多页码 else 只有1页
      if (this.operationSetsData2.length >= this.pagination.pageSize) {
        for (let i = 0; i < this.pagination.pageSize; i++) {
          this.tableView.push(this.operationSetsData2[i])
        }
      } else {
        this.tableView = this.operationSetsData2
      }
    },
    diagnosisNameSearch() {
      this.operationSetsData2 = this.operationSetsData.filter(item => item.name.indexOf(this.diagnosisName) !== -1)
      this.operationSetsFn2()
    },
    // 用户点击页码组件返回的数据
    tables(table) {
      this.tableView = table
    },
    viewDeta(row) {
      this.$router.push({
        name: 'diagnosis',
        path: '/diagnosis/index',
        // params: { id: row.id },
        query: { isView: true }
      })
      localStorage.setItem('viewDeta', JSON.stringify(row)) // 存
    },
    handleClick(tab, event) {
      this.operationSetsData.unshift(this.operationSetsData.pop())
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.operationSetsFn2()
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val
    },
    formatter(row) {
      return parseTime(row.time || '', '{y}-{m}-{d} {h}:{i}:{s}')
    },
    editData(row) {
      this.$refs.edit.openDrawer(row)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
