<template>
  <div>
    <el-drawer
      title="操作详情"
      :visible.sync="drawer"
      :before-close="handleClose"
      :size="800"
    >
      <div slot="title">
        <el-tabs v-model="activeName" @tab-click="tabsClick">
          <el-tab-pane label="操作详情" name="details" />
          <el-tab-pane label="YAML" name="YAML" />
        </el-tabs>
      </div>
      <div v-show="activeName === 'details'">
        <el-form
          ref="form"
          disabled
          :model="form"
          label-width="95px"
          style="padding-right: 20px"
        >
          <el-form-item label="操作名称:">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="版本:">
            <el-input v-model="form.version" />
          </el-form-item>
          <el-form-item label="创建时间:">
            <el-date-picker
              v-model="form.time"
              type="datetime"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item label="操作人:">
            <el-input v-model="form.maintainer" />
          </el-form-item>
          <el-form-item label="要求:">
            <el-input v-model="form.desc" type="textarea" :rows="2" />
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
      <div v-show="activeName === 'YAML'">
        <div class="updateDAGDataBox">
          <pre id="updateDAGData" />
        </div>
      </div>
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
    // 处理json数据，采用正则过滤出不同类型参数
    syntaxHighlight(json) {
      if (typeof json !== 'string') {
        json = JSON.stringify(json, undefined, 2)
      }
      json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>')
      return json.replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        function(match) {
          var cls = 'number'
          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              cls = 'key'
            } else {
              cls = 'string'
            }
          } else if (/true|false/.test(match)) {
            cls = 'boolean'
          } else if (/null/.test(match)) {
            cls = 'null'
          }
          return '<span class="' + cls + '">' + match + '</span>'
        }
      )
    },
    tabsClick(val) {
      console.log(val.name, document.getElementById('updateDAGData'), 'val')
      if (val.name === 'YAML') {
        document.getElementById('updateDAGData').innerHTML =
          this.syntaxHighlight(this.form.detail)
      }
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
/deep/ .el-drawer__header {
  margin-bottom: 0;
}
.updateDAGDataBox {
  overflow: auto;
  height: -webkit-calc(100vh - 80px);
  height: -moz-calc(100vh - 80px);
  height: calc(100vh - 80px);
  background: #000;
  color: #fff;
}
/deep/ #updateDAGData {
  padding: 0 20px 10px 20px;
  .string {
    color: #00fd8b;
  }
  .number {
    color: #d978ef;
  }
  .boolean {
    color: #2aa2ff;
  }
  .null {
    color: #2aa2ff;
  }
  .key {
    color: #00f3fb;
  }
}
</style>
