<template>
  <div class="app-container">
    <div>
      <router-link to="/diagnosis/index">
        <el-button type="primary" icon="el-icon-plus">创建诊断编排 </el-button>
      </router-link>
      <el-input
        v-model="diagnosisName"
        style="width: 300px; float: right"
        placeholder="请输入操作名称"
        prefix-icon="el-icon-search"
        clearable
        @keyup.enter.native="diagnosisNameSearch"
      />
    </div>

    <el-table
      :data="tableData"
      style="width: 100%; margin: 10px 0"
      :header-cell-style="{
        background: '#F5F7FA',
        color: '#000',
        fontWeight: '900',
      }"
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="date" label="操作名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editData(scope.row)">{{
            scope.row.date
          }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="版本号" show-overflow-tooltip />
      <el-table-column prop="address" label="描述" show-overflow-tooltip />
      <el-table-column prop="address" label="维护者" show-overflow-tooltip />
      <el-table-column prop="address" label="更新时间" show-overflow-tooltip />
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="editData(scope.row)"
          >编辑</el-button>
          <el-button
            type="text"
            size="small"
            @click="delData(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right; margin: 20px 0">
      <el-pagination
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
      </el-pagination>
    </div>
    <edit ref="edit" />
  </div>
</template>

<script>
import edit from './edit.vue'
export default {
  components: { edit },
  props: {},
  data() {
    return {
      activeName: 'all',
      diagnosisName: '',
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎1',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎2',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎3',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎4',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 100
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    diagnosisNameSearch(tab, event) {
      this.tableData.unshift(this.tableData.pop())
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
      // this.activityListFn();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val
      // this.activityListFn();
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
