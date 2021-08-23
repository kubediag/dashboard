<template>
  <!-- 最外层容器监mouse系列事件, 用来做节点拖拽 -->
  <div
    class="app-container diagramExample"
    @mousedown="startNodesBus($event)"
    @mousemove="moveNodesBus($event)"
    @mouseup="endNodesBus($event)"
  >
    <!-- 左侧导航 -->
    <div class="page-left">
      <div class="logo">DAG-Board</div>
      <div
        v-for="(item, i) in initNodesBasic"
        :key="'nodes_basic' + i"
        class="basic-node"
        @mousedown="dragIt(item)"
      >
        {{ item.name }}
      </div>
    </div>

    <!-- 顶栏 -->
    <div class="headbar">
      <!-- <el-button
        type="primary"
        size="medium"
        @click="changeVersion"
      >切换连线方向</el-button> -->
      <!-- <el-button
        type="primary"
        size="medium"
        @click="loadJSON2"
      >切换连线类型</el-button> -->
    </div>

    <!-- 右侧表单 -->
    <div v-show="updateDAGData" class="right-form">
      <div style="border-bottom: 1px solid; padding: 15px; text-align: right">
        <span
          class="closeJson"
          @click="closeJson"
        ><i
          class="el-icon-close"
        /></span>
        <el-button
          type="primary"
          size="mini"
          @click="handleCopy(updateDAGData, $event)"
        >Copy JSON</el-button>
      </div>
      <div class="updateDAGDataBox">
        <pre id="updateDAGData" />
      </div>
    </div>

    <!-- DAG-Diagram主体 -->
    <DAGBoard
      ref="DAGBoard"
      :data-all="yourJSONDataFillThere"
      @updateDAG="updateDAG"
      @editNodeDetails="editNodeDetails"
      @doSthPersonal="doSthPersonal"
    />

    <!-- 用来模拟拖拽添加的元素 -->
    <node-bus
      v-if="dragBus"
      :value="busValue.value"
      :pos_x="busValue.pos_x"
      :pos_y="busValue.pos_y"
    />
  </div>
</template>

<script>
import { JSONFromService, nodesBasic } from './data.js'
import clip from '@/utils/clipboard' // use clipboard directly

export default {
  components: {},
  props: {},
  data() {
    return {
      updateDAGData: null,
      initNodesBasic: nodesBasic,
      // 以下为svg必要内容
      dragBus: false, // 是否在拖拽,
      yourJSONDataFillThere: {
        // 用来展示的节点与连线
        nodes: [],
        rectEdges: []
      },
      // 以下为拖拽方式添加节点必须内容
      busValue: {
        value: 'name',
        pos_x: 100,
        pos_y: 100
      },
      // 监听的事件
      onkeydown: null,
      // 复制的内容
      copyContent: [],
      domToLeft: 0,
      domToTop: 0
    }
  },
  created() {
    this.changeVersion()
    this.loadJSON()
    this.onkeydown = document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'c') {
        // 按下ctrl + c
        this.ctrlC()
      } else if (e.ctrlKey && e.key === 'v') {
        // 按下ctrl + v
        this.ctrlV()
      }
    })
  },
  mounted() {},
  updated() {
    const pageLeft = document.getElementsByClassName('page-left')[0] // dom 的视口距离
    this.domToTop = pageLeft.getBoundingClientRect().top // dom 的顶边到视口顶部的距离
    this.domToLeft = pageLeft.getBoundingClientRect().left // dom 的左边到视口左边的距离
    // console.log(this.domToLeft, this.domToTop, 'domToLeft')
  },
  beforeDestroy() {
    this.onkeydown = null // 销毁事件
  },
  methods: {
    ctrlC() {
      const currentChoice = this.$refs.DAGBoard.choice
      if (currentChoice.index > -1) {
        // 有选中元素
        const activeNodes = this.yourJSONDataFillThere.nodes.filter(
          (item) => currentChoice.paneNode.indexOf(item.id) > -1
        )
        this.copyContent = JSON.parse(JSON.stringify(activeNodes))
        this.copyContent.forEach((item) => {
          item.id = item.id + this.yourJSONDataFillThere.nodes.length + 100 // 自定义id规范 这里随便写个长度+100作为id
          item.pos_x += 100 / (sessionStorage['svgScale'] || 1)
          item.pos_y += 100 / (sessionStorage['svgScale'] || 1)
        })
      }
    },
    ctrlV() {
      if (!this.copyContent.length) return false
      this.yourJSONDataFillThere.nodes.push(...this.copyContent)
      this.$refs.DAGBoard.choice = {
        paneNode: [], // 选取的节点下标组
        index: -1,
        point: -1
      } // 复制完成 取消选中状态
      this.copyContent = []
    },
    updateDAG(data, action, id) {
      // 检测是否成环
      data.rectEdges.forEach((item) => {
        let isCircle = false
        // 出口 入口id
        const { dst_node_id } = item; // eslint-disable-line
        const checkCircle = (dstNodeId, nth) => {
          if (nth > data.nodes.length) {
            isCircle = true
            return false
          }
          data.rectEdges.forEach((item) => {
            if (item.src_node_id === dstNodeId) {
              console.log('目标节点是', item.src_node_id, '次数为', nth)
              checkCircle(item.dst_node_id, ++nth); // eslint-disable-line
            }
          })
          return false
        }
        checkCircle(dst_node_id, 1)
        if (isCircle) {
          data.rectEdges.pop()
          this.$message.error('禁止成环')
        }
      })

      if (action === 'startRunning') {
        this.updateDAGData = JSON.stringify(data, null, 4)
        document.getElementById('updateDAGData').innerHTML =
          this.syntaxHighlight(data)
      }
      console.log(...arguments, 1111)
      // console.log(JSON.stringify(arguments[0]))
      // switch (action) {
      //   case 'selectNode':
      //     this.showNodeDetails(data.nodes.find(item => item.id === id))
      //     break;
      //   default: () => { }
      // }
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
    editNodeDetails() {
      console.log(...arguments)
    },
    doSthPersonal() {
      console.log(...arguments)
    },
    loadJSON() {
      // const ConnectionDirection = localStorage.getItem('ConnectionDirection')
      // if (ConnectionDirection && ConnectionDirection === 'edges') {
      //   this.yourJSONDataFillThere = JSON.parse(JSON.stringify(JSONFromService).replace(/edges/g, 'rectEdges'))
      //   // localStorage.setItem('ConnectionDirection', 'rectEdges')
      // } else if (ConnectionDirection && ConnectionDirection === 'rectEdges') {
      //   this.yourJSONDataFillThere = JSON.parse(JSON.stringify(JSONFromService).replace(/rectEdges/g, 'edges'))
      //   // localStorage.setItem('ConnectionDirection', 'edges')
      // } else {
      //   this.yourJSONDataFillThere = JSONFromService
      // }
      // 这里可以跟服务端交互获取数据
      setTimeout(() => {
        this.yourJSONDataFillThere = JSONFromService
      }, 500)
    },
    // loadJSON2() {
    //   const ConnectionDirection = localStorage.getItem('ConnectionDirection')
    //   if (ConnectionDirection && ConnectionDirection === 'edges') {
    //     this.yourJSONDataFillThere = JSON.parse(JSON.stringify(JSONFromService).replace(/edges/g, 'rectEdges'))
    //     localStorage.setItem('ConnectionDirection', 'rectEdges')
    //   } else {
    //     this.yourJSONDataFillThere = JSON.parse(JSON.stringify(JSONFromService).replace(/rectEdges/g, 'edges'))
    //     localStorage.setItem('ConnectionDirection', 'edges')
    //   }
    //   console.log(ConnectionDirection, 'ConnectionDirection')
    //   location.reload()
    //   alert(`更改为 ${ConnectionDirection === 'edges' ? '弧线' : '矩形线'}`)
    // },
    /**
     * 通过拖拽方式加入新节点必须的函数
     */
    startNodesBus(e) {
      /**
       *  别的组件调用时, 先放入缓存
       * dragDes: {
       *    drag: true,
       *    name: 组件名称
       *    type: 组件类型
       *    model_id: 跟后台交互使用
       * }
       **/
      let dragDes = null
      if (sessionStorage['dragDes']) {
        dragDes = JSON.parse(sessionStorage['dragDes'])
      }
      if (dragDes && dragDes.drag) {
        const x = e.pageX
        const y = e.pageY
        this.busValue = Object.assign({}, this.busValue, {
          pos_x: x - this.domToLeft + 20,
          pos_y: y - this.domToTop + 20,
          value: dragDes.name
        })
        this.dragBus = true
      }
    },
    moveNodesBus(e) {
      // 移动模拟节点
      if (this.dragBus) {
        const x = e.pageX
        const y = e.pageY
        this.busValue = Object.assign({}, this.busValue, {
          pos_x: x - this.domToLeft + 20,
          pos_y: y - this.domToTop + 20
        })
      }
    },
    endNodesBus(e) {
      // 节点放入svg
      let dragDes = null
      if (sessionStorage['dragDes']) {
        dragDes = JSON.parse(sessionStorage['dragDes'])
      }
      if (dragDes && dragDes.drag && e.toElement.id === 'svgContent') {
        const pos_x =
          (e.offsetX - 90 - (sessionStorage['svg_left'] || 0)) /
          (sessionStorage['svgScale'] || 1) // 参数修正
        const pos_y =
          (e.offsetY - 15 - (sessionStorage['svg_top'] || 0)) /
          (sessionStorage['svgScale'] || 1) // 参数修正
        delete dragDes.drag
        const params = {
          model_id: sessionStorage['newGraph'],
          desp: {
            pos_x,
            pos_y,
            name: this.busValue.value,
            ...dragDes
          }
        }
        this.yourJSONDataFillThere.nodes.push({
          ...params.desp,
          id: this.yourJSONDataFillThere.nodes.length + 100, // 这里注意, 新增的id一定不能重复, 建议id交由后端处理
          in_ports: [0],
          out_ports: [0]
        })
      }
      window.sessionStorage['dragDes'] = null
      this.dragBus = false
      console.log(dragDes, this.yourJSONDataFillThere, 'ee')

      this.yourJSONDataFillThere.nodes.forEach((v) => {
        v.parentId = 0
      })
      this.priorityFn(this.yourJSONDataFillThere)
    },
    priorityFn({ nodes, rectEdges }) {
      nodes.sort(function(a, b) {
        return a.pos_y - b.pos_y
      })
      nodes.forEach((v) => {
        let i = 1
        rectEdges.forEach((k) => {
          if (v.id === k.src_node_id) {
            nodes.forEach((z) => {
              if (z.id === k.dst_node_id) {
                z.priority = i
                z.parentId = v.id
                i++
              }
            })
          }
        })
      })
      const sortNode = this.sortClass(nodes)
      sortNode.forEach((v) => {
        v.forEach((k, i) => {
          if (k.parentId === 0) {
            k.priority = 1
          } else {
            k.priority = i + 1
          }
        })
      })
      this.yourJSONDataFillThere.nodes = sortNode.flat()
      // console.log(this.yourJSONDataFillThere, this.sortClass(nodes), sortNode.flat(), "nodes");
    },
    sortClass(sortData) {
      const groupBy = (array, f) => {
        const groups = {}
        array.forEach((o) => {
          const group = JSON.stringify(f(o))
          groups[group] = groups[group] || []
          groups[group].push(o)
        })
        return Object.keys(groups).map((group) => {
          return groups[group]
        })
      }
      const sorted = groupBy(sortData, (item) => {
        return item.parentId // 返回需要分组的对象
      })
      return sorted
    },
    dragIt(val) {
      val.form.createTime = new Date().toDateString()
      sessionStorage['dragDes'] = JSON.stringify({
        drag: true,
        ...val
      })
    },
    /**
     * 右侧form展示逻辑
     */
    showNodeDetails(val) {
      // 展示选中的节点
      const { id, form } = val
      if (!form) return
      this.formDetail = {
        currentEditNodeId: id,
        form: Object.assign(this.formDetail.form, form, {})
      }
    },
    handleCopy(text, event) {
      clip(text, event)
    },
    changeVersion() {
      const GlobalConfig = {}
      GlobalConfig.isVertical = false
      localStorage.setItem('GlobalConfig', JSON.stringify(GlobalConfig))
      // return
      // const GlobalConfigString = localStorage.getItem('GlobalConfig')
      // if (GlobalConfigString && GlobalConfigString.length > 0) {
      //   GlobalConfig = JSON.parse(GlobalConfigString)
      //   GlobalConfig.isVertical = !GlobalConfig.isVertical
      //   localStorage.setItem('GlobalConfig', JSON.stringify(GlobalConfig))
      // } else {
      //   GlobalConfig.isVertical = false
      //   localStorage.setItem('GlobalConfig', JSON.stringify(GlobalConfig))
      // }
      // location.reload()
      // alert(`更改为 ${GlobalConfig.isVertical ? '垂直版本' : '横向版本'}`)
    },
    closeJson() {
      this.updateDAGData = null
    }
  }
}
</script>

<style lang="scss" scoped>
.diagramExample {
  width: 100%;
  height: -webkit-calc(100vh - 130px);
  height: -moz-calc(100vh - 130px);
  height: calc(100vh - 130px);
  overflow: hidden;
  position: relative;
  /deep/ #svgContent {
    top: 0;
    foreignObject {
      overflow: visible;
    }
  }
  .basic-node {
    margin-top: 5px;
    background: #fff;
    color: black;
    border-radius: 15px;
    height: 30px;
    width: 140px;
    border: 1px solid #289de9;
    line-height: 30px;
    display: inline-block;
    cursor: pointer;
    user-select: none;
  }
  .page-left {
    position: absolute;
    // left: 0;
    // top: 0;
    width: 200px;
    height: -webkit-calc(100vh - 110px);
    height: -moz-calc(100vh - 110px);
    height: calc(100vh - 110px);
    background: #717171;
    text-align: center;
    .logo {
      font-size: 20px;
      line-height: 40px;
      font-weight: bold;
      border-bottom: 1px solid #ccc;
      background: #fff;
    }
  }
  .headbar {
    position: absolute;
    // top: 0;
    left: 220px;
    right: 0;
    line-height: 40px;
    text-align: left;
    // text-indent: 20px;
    // user-select: none;
  }
  .right-form {
    width: 400px;
    position: absolute;
    right: 20px;
    top: 60px;
    bottom: 0;
    border-left: 1px solid #000;
    background: #000;
    color: #fff;
    overflow: hidden;
    text-align: left;
    .updateDAGDataBox {
      overflow: auto;
      height: -webkit-calc(100vh - 209px);
      height: -moz-calc(100vh - 209px);
      height: calc(100vh - 209px);
    }
  }
}
/** 给svg添加格子背景 */
#svgContent {
  background-size: 50px 50px;
  background-image: linear-gradient(
      0deg,
      transparent 24%,
      rgba(255, 255, 255, 0.05) 25%,
      rgba(255, 255, 255, 0.05) 26%,
      transparent 27%,
      transparent 74%,
      rgba(255, 255, 255, 0.05) 75%,
      rgba(255, 255, 255, 0.05) 76%,
      transparent 77%,
      transparent
    ),
    linear-gradient(
      90deg,
      transparent 24%,
      rgba(255, 255, 255, 0.05) 25%,
      rgba(255, 255, 255, 0.05) 26%,
      transparent 27%,
      transparent 74%,
      rgba(255, 255, 255, 0.05) 75%,
      rgba(255, 255, 255, 0.05) 76%,
      transparent 77%,
      transparent
    );
  background-color: rgb(60, 60, 60) !important;
  margin-left: 200px;
  margin-top: 40px;
  margin-right: 200px;
}
/deep/ #updateDAGData {
  padding: 0 20px 10px 10px;
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
.closeJson {
  float: left;
  font-size: 20px;
  cursor: pointer;
}
</style>
