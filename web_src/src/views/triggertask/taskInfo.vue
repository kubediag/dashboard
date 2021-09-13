<template>
  <el-drawer
    title="详情"
    :visible.sync="drawer"
    :size="800"
  >
    <div class="infoContainer" style="padding: 0 16px;">
      <pre ref="formatInfo" style="white-space: pre-wrap;"></pre>
    </div>
  </el-drawer>
</template>

<script>
import jsyaml from 'js-yaml'
import hljs from 'highlight.js'
import 'highlight.js/styles/default.css'

export default {
  components: {},
  data () {
    return {
      drawer: false,
      info: ''
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
    openDrawer (detail) {
      this.info = detail
      this.drawer = true
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

.infoContainer {
  overflow: auto;
  height: -webkit-calc(100vh - 80px);
  height: -moz-calc(100vh - 80px);
  height: calc(100vh - 80px);
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

.infoContainer {

}
</style>
