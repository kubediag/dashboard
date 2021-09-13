<template>
  <div>
    <el-drawer
      title="详情"
      :visible.sync="drawer"
      :size="800"
    >
      <div style="text-align: right;margin-bottom: 8px;margin-right: 8px">
        <el-radio-group v-model="type" size="medium">
          <el-radio-button label="0">普通格式</el-radio-button>
          <el-radio-button label="1">YAML格式</el-radio-button>
        </el-radio-group>
      </div>
      <div class="infoContainer" v-show="type==='1'">
        <pre ref="formatInfo" style="white-space: pre-wrap;"></pre>
      </div>
      <div class="infoContainer" style="background:#ffffff;color: #333333" v-show="type==='0'">
        <el-form ref="form" :model="info" label-width="120px" v-if="row.detail">
          <el-form-item label="诊断模板：">
            <div>{{ row.name }}</div>
          </el-form-item>
          <el-form-item label="诊断目标：">
            <div>{{ row.target }}</div>
          </el-form-item>
          <el-form-item label="命名空间：">
            <div>{{ info.metadata.namespace }}</div>
          </el-form-item>
          <el-form-item label="容器名称：" v-if="info.spec.podReference">
            <div>{{ info.spec.podReference.container }}</div>
          </el-form-item>
          <el-form-item label="诊断参数：" v-if="info.spec.parameters">
            <div v-html="hljsJSON(info.spec.parameters)"></div>
          </el-form-item>
          <el-form-item label="诊断结果：">
            <div v-if="!info.status.operationResults">无</div>
            <pre v-else style="overflow:auto;">{{ info.status.operationResults}}</pre>
          </el-form-item>
          <template v-if="info.status.FailedPaths">
            <el-form-item :label="`失败路径${index}：`" v-for="(item, index) in info.status.FailedPaths" :key="index">
              <el-table style="padding: 0 16px;width: 100%" :data="item" class="hydrea">
                <el-table-column
                  type="index"
                  label="步骤"
                  width="80">
                </el-table-column>
                <el-table-column
                  prop="operation"
                  label="操作名称"
                  show-overflow-tooltip>
                </el-table-column>
<!--                <el-table-column-->
<!--                  prop="status"-->
<!--                  label="状态"-->
<!--                  width="80">-->
<!--                </el-table-column>-->
<!--                <el-table-column-->
<!--                  prop="lastTransitionTime"-->
<!--                  label="开始时间"-->
<!--                  width="190">-->
<!--                </el-table-column>-->
<!--                <el-table-column-->
<!--                  prop="type"-->
<!--                  label="操作结果"-->
<!--                  width="100">-->
<!--                </el-table-column>-->
              </el-table>
            </el-form-item>
          </template>
          <el-form-item label="成功路径：" v-if="info.status.succeededPath">
            <el-table style="padding: 0 16px;width: 100%" :data="info.status.succeededPath" class="hydrea">
              <el-table-column
                type="index"
                label="步骤"
                width="80">
              </el-table-column>
              <el-table-column
                prop="operation"
                label="操作名称"
                show-overflow-tooltip>
              </el-table-column>
<!--              <el-table-column-->
<!--                prop="status"-->
<!--                label="状态"-->
<!--                width="80">-->
<!--              </el-table-column>-->
<!--              <el-table-column-->
<!--                prop="lastTransitionTime"-->
<!--                label="开始时间"-->
<!--                width="190">-->
<!--              </el-table-column>-->
<!--              <el-table-column-->
<!--                prop="type"-->
<!--                label="操作结果"-->
<!--                width="100">-->
<!--              </el-table-column>-->
            </el-table>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import jsyaml from 'js-yaml'
import hljs from 'highlight.js'
import 'highlight.js/styles/default.css'

export default {
  data () {
    return {
      drawer: false,
      info: '',
      list: [],
      type: '0',
      row: {}
    }
  },
  watch: {
    info () {
      this.$nextTick(() => {
        const infoRef = this.$refs.formatInfo
        infoRef.innerHTML = hljs.highlight('yaml', jsyaml.dump(this.info)).value
      })
    }
  },
  methods: {
    hljsJSON (json) {
      if (!json) return ''
      return hljs.highlight('json', JSON.stringify(json)).value
    },
    openDrawer (row) {
      this.drawer = true
      this.row = row
      this.info = row.detail
      this.list = row.detail.status.conditions
      console.log(row)
    },
    closeDrawer () {
      this.drawer = false
    },
    // 处理json数据，采用正则过滤出不同类型参数
    syntaxHighlight (json) {
      if (typeof json !== 'string') {
        json = JSON.stringify(json, undefined, 2)
      }
      json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>')
      return json.replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        function (match) {
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
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-drawer__body {
  overflow-y: hidden;
}

.infoContainer {
  overflow: auto;
  height: calc(100% - 44px);
  background: #000;
  color: #fff;
}

/deep/ .infoContainer {
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

/deep/ .hydrea table {
  width: auto !important;
}
</style>
