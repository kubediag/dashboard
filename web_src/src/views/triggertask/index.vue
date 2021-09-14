<template>
  <div class="app-container">
    <div style="margin-bottom: 8px">
      <el-button type="primary" icon="el-icon-plus" @click="createNewDiagnosis">创建触发式诊断任务</el-button>
    </div>
    <el-table
      v-loading="isLoading"
      :data="tableView"
      style="width: 100%;"
      :header-cell-style="{
        background: '#F5F7FA',
        color: '#000',
        fontWeight: '900',
      }"
    >
      <el-table-column prop="name" label="诊断触发器名称" show-overflow-tooltip />
      <el-table-column prop="type" label="诊断类型" show-overflow-tooltip />
      <el-table-column prop="operationSet" label="诊断流水线" show-overflow-tooltip />
<!--      <el-table-column prop="maintainer" label="维护者" show-overflow-tooltip />-->
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
    <creattask ref="add" @success="triggersSetsFn" />
    <taskInfo ref="info" />
  </div>
</template>

<script>
import { triggers } from '@/api/triggertask.js'
import { parseTime } from '@/utils'
import creattask from './creattask.vue'
import taskInfo from './taskInfo.vue'

export default {
  components: { creattask, taskInfo },
  props: {},
  data() {
    return {
      isLoading: false,
      triggersSetsData: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 100
      }
    }
  },
  computed: {
    tableView() {
      if (this.pagination.total <= this.pagination.pageSize) return this.triggersSetsData
      return this.triggersSetsData.slice((this.pagination.currentPage - 1) * this.pagination.pageSize, this.pagination.pageSize)
    }
  },
  created() {
    this.triggersSetsFn()
  },
  methods: {
    createNewDiagnosis() {
      this.$refs.add.openDialog()
    },
    triggersSetsFn() {
      // const res = {
      //   success: true,
      //   data: [
      //     {
      //       name: '维权翁群翁',
      //       operationSet: '342342424',
      //       type: 'prometheus-alert或kube-event或prometheus-alert&&kube-event',
      //       maintainer: '目前为空',
      //       detail: '查看详情时候渲染, 是个完整的yaml.'
      //     }, {
      //       name: '维权翁群翁',
      //       operationSet: '342342424',
      //       type: 'prometheus-alert或kube-event或prometheus-alert&&kube-event',
      //       maintainer: '目前为空',
      //       detail: '查看详情时候渲染, 是个完整的yaml.'
      //     }
      //   ]
      // }
      this.isLoading = true
      triggers({})
        .then((res) => {
          if (res.success) {
            // 记得清除this.tableView 因为搜索的时候也会用这个，会造成上次数据没及时清除掉
            this.pagination.total = res.data.length
            this.pagination.currentPage = 1
            this.triggersSetsData = res.data
          }
          this.isLoading = false
        })
        .catch(() => {
          this.isLoading = false
        })
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
      this.$refs.info.openDrawer(row.detail)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
