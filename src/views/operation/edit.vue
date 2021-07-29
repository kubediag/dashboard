<template>
  <div>
    <el-drawer
      title="操作详情"
      :visible.sync="drawer"
      :before-close="handleClose"
      :size="800"
    >
      <div slot="title">
        <el-tabs v-model="activeName">
          <el-tab-pane label="操作详情" name="details" />
          <el-tab-pane label="YAML" name="YAML" />
        </el-tabs>
      </div>
      <div v-if="activeName === 'details'">
        <el-form
          ref="form"
          :model="form"
          label-width="95px"
          style="padding-right: 20px"
        >
          <el-form-item label="操作名称:">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="参数列表:" style="margin: 0" />
          <div style="margin: 0 0 20px 20px">
            <el-table
              size="mini"
              :data="tableData"
              style="width: 100%"
              :header-cell-style="{
                background: '#F5F7FA',
                color: '#000',
                fontWeight: '900',
              }"
            >
              <el-table-column
                prop="date"
                label="键名称"
                align="center"
                show-overflow-tooltip
              />
              <el-table-column
                prop="address"
                label="描述"
                align="center"
                show-overflow-tooltip
              />
              <el-table-column
                prop="name"
                label="是否必须"
                align="center"
                show-overflow-tooltip
                width="80"
              />
            </el-table>
          </div>
          <el-form-item
            label="运维结果列表:"
            style="margin: 0"
            label-width="120px"
          />
          <div style="margin: 0 0 20px 20px">
            <el-table
              size="mini"
              :data="tableData"
              style="width: 100%"
              :header-cell-style="{
                background: '#F5F7FA',
                color: '#000',
                fontWeight: '900',
              }"
            >
              <el-table-column
                prop="date"
                label="键名称"
                align="center"
                show-overflow-tooltip
              />
              <el-table-column
                prop="address"
                label="描述"
                align="center"
                show-overflow-tooltip
              />
              <el-table-column
                prop="name"
                label="是否必须"
                align="center"
                show-overflow-tooltip
                width="80"
              />
            </el-table>
          </div>
        </el-form>
      </div>
      <div v-else>123</div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      activeName: 'details',
      drawer: false,
      form: {
        date: '2016-05-02',
        name: '王小虎1',
        address: '上海市普陀区金沙江路 1518 弄'
      },
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
      ]
    }
  },
  created() {},
  mounted() {},
  methods: {
    openDrawer(row) {
      this.drawer = true
      this.form = row
      console.log(row, 'row')
    },
    closeDrawer() {
      this.drawer = false
    },
    handleClose(done) {
      // this.$confirm("确认关闭？")
      //   .then((_) => {
      done()
      //   })
      //   .catch((_) => {});
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-drawer__close-btn {
  position: absolute;
  top: 0;
  right: 0;
  padding: 18px;
}
</style>
