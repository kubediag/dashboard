<!--分页-->
<template>
  <el-pagination
    background
    layout="total, sizes, prev, pager, next, jumper"
    :total="totalCount"
    :page-size="pageSize"
    :current-page="currentPage"
    :page-sizes="[10, 20, 50, 100]"
    @current-change="handleCurrentChange"
    @size-change="handleSizeChange"
  />
</template>

<script>
export default {
  props: {
    totalCount: {
      type: Number,
      default: 10
    },
    pageSize: {
      type: Number,
      default: 10
    },
    tableData: {
      type: Array,
      default() {
        return []
      }
    },
    defaultData: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      tableView: [],
      currentPage: 1
    }
  },
  watch: {
    defaultData(newValue) {
      // 数据已经被更新
      this.handleCurrentChange(1)
    }
  },
  methods: {
    handleCurrentChange(val) {
      // 为什么必须不是1 呢 因为点击1是返回初始数据
      if (val !== 1) {
        val = (val - 1) * this.pageSize // 比如点击是2，并且pageSize是10的时候 那么数据下标是 10开始就是10
      } else {
        val = 0
      }
      const number = this.tableData.length
      // 当点击2的时候如果第二页是最后一页进入else全部展示
      if (number > val + this.pageSize) {
        this.tableView = this.tableData.slice(val, val + this.pageSize)
      } else {
        this.tableView = this.tableData.slice(val, this.tableData.length)
      }
      this.$emit('tables', this.tableView)
    },
    handleSizeChange(val) {
      this.$emit('handleSizeChange', val)
    }
  }
}
</script>
