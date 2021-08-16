<template>
  <div class="app-container">
    <div>
      <!-- <router-link to="/diagnosis/index">
        <el-button type="primary" icon="el-icon-plus">创建诊断流程 </el-button>
      </router-link> -->
      <el-input
        v-model="diagnosisName"
        style="width: 300px; float: right; margin-bottom: 10px"
        placeholder="请输入操作名称"
        prefix-icon="el-icon-search"
        clearable
        @keyup.enter.native="diagnosisNameSearch"
      />
    </div>

    <el-table
      :data="tableView"
      style="width: 100%; margin: 10px 0"
      :header-cell-style="{
        background: '#F5F7FA',
        color: '#000',
        fontWeight: '900',
      }"
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="name" label="操作名称" show-overflow-tooltip>
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
      <!-- <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editData(scope.row)"
            >编辑</el-button
          >
          <el-button type="text" size="small" @click="delData(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column> -->
    </el-table>

    <div style="text-align: right; margin: 20px 0">
      <pagination
        class="page"
        :total-count="pagination.total"
        :page-size="pagination.pageSize"
        :table-data="operationsData2"
        @tables="tables"
        @handleSizeChange="handleSizeChange"
      />
    </div>
    <edit ref="edit" />
  </div>
</template>

<script>
import { operations } from '@/api/operation.js'
import edit from './edit.vue'
import pagination from './pagination.vue'
import { parseTime } from '@/utils'
export default {
  components: { edit, pagination },
  props: {},
  data() {
    return {
      activeName: 'all',
      diagnosisName: '',
      operationsData: [],
      operationsData2: [],
      tableView: [],
      isLoading: false,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  created() {},
  mounted() {
    this.operationsFn()
  },
  methods: {
    operationsFn() {
      this.isLoading = true
      operations({})
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
            this.operationsData = res.data
            this.operationsData2 = res.data
          }
          this.isLoading = false
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    operationsFn2() {
      this.tableView = []
      this.pagination.total = this.operationsData2.length
      // 进入if 因为他有多页码 else 只有1页
      if (this.operationsData2.length >= this.pagination.pageSize) {
        for (let i = 0; i < this.pagination.pageSize; i++) {
          this.tableView.push(this.operationsData2[i])
        }
      } else {
        this.tableView = this.operationsData2
      }
    },
    diagnosisNameSearch() {
      this.operationsData2 = this.operationsData.filter(item => item.name.indexOf(this.diagnosisName) !== -1)
      this.operationsFn2()
    },
    editData(row) {
      this.$refs.edit.openDrawer(row)
    },
    delData(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.operationsFn2()
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val
    },
    formatter(row) {
      return parseTime(row.time || '', '{y}-{m}-{d} {h}:{i}:{s}')
    },
    // 用户点击页码组件返回的数据
    tables(table) {
      this.tableView = table
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
