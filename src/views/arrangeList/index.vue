<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="所有诊断编排" name="all" />
      <el-tab-pane label="我的编排" name="me" />
    </el-tabs>
    <div>
      <router-link to="/diagnosis/index">
        <el-button type="primary" icon="el-icon-plus">创建诊断编排 </el-button>
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
      :data="tableData"
      style="width: 100%; margin: 10px 0"
      :header-cell-style="{
        background: '#F5F7FA',
        color: '#000',
        fontWeight: '900',
      }"
    >
      <el-table-column prop="date" label="诊断名称" show-overflow-tooltip />
      <el-table-column prop="name" label="版本号" show-overflow-tooltip />
      <el-table-column prop="address" label="描述" show-overflow-tooltip />
      <el-table-column prop="address" label="维护者" show-overflow-tooltip />
      <el-table-column prop="address" label="更新时间" show-overflow-tooltip />
      <el-table-column label="操作" width="100">
        <!-- <template slot-scope="scope"> -->
        <el-button type="text" size="small">查看详情</el-button>
        <!-- </template> -->
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
  </div>
</template>

<script>
export default {
  components: {},
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
    handleClick(tab, event) {
      // console.log(tab.name, event);
      this.tableData.unshift(this.tableData.pop())
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
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
