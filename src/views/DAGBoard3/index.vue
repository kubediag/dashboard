<template>
  <div class="app-container">
    <el-button type="primary" @click="save">主要按钮</el-button>
    <div id="steps" />
    <el-drawer
      title="我是标题"
      :visible.sync="drawer"
      :before-close="handleClose"
    >
      <div style="padding: 20px">
        <span>名称：</span>
        <el-select
          v-model="selectValue"
          placeholder="请选择"
          @change="changeSelect"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.label"
          />
        </el-select>
        <div>描述：</div>
        <el-input
          v-model="textarea2"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          placeholder="请输入内容"
        />
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { JSONFromService } from './data.js'
export default {
  components: {},
  props: {},
  data() {
    return {
      dataListTree: JSONFromService || {},
      isTypeOf: null,
      isEmptyNode: null,
      getMuiltWrapper: null,
      parseDom: null,
      // replacePx: null,
      removeNode: null,
      api: null,
      EDIT_STATE: 'EDIT',
      drawer: false,
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
      selectValue: '',
      textarea2: '',
      commitIcon: null
    }
  },
  created() {
    this.commonUtilFn()
  },
  mounted() {
    this.stepFn()
  },
  updated() {},
  beforeDestroy() {},
  methods: {
    stepFn() {
      const vm = this
      const step = vm.Steps(document.querySelector('#steps'), {
        data: vm.dataListTree
      })
      step.init()
    },

    commonUtil() {
      const vm = this
      return {
        isTypeOf: function(obj, type) {
          return (
            Object.prototype.toString.call(obj) === '[object ' + type + ']'
          )
        },
        // 空节点
        isEmptyNode: function(node) {
          return !node.label && !node.state && !node.children
        },
        // 获取一个多行wrapper
        getMuiltWrapper: function() {
          return vm.parseDom('<div class="step-wrapper__muilt"></div>')
        },
        parseDom: function(html) {
          const dom = document.createElement('div')
          dom.innerHTML = html
          return dom.childNodes[0]
        },

        // replacePx: function (attr) {
        //   return parseInt(attr.replace("px"));
        // },
        removeNode: function(node) {
          node.parentNode.removeChild(node)
        }
      }
    },

    commonUtilFn() {
      const vm = this
      const commonUtil = this.commonUtil()

      vm.isTypeOf = commonUtil.isTypeOf
      vm.isEmptyNode = commonUtil.isEmptyNode
      vm.getMuiltWrapper = commonUtil.getMuiltWrapper
      vm.parseDom = commonUtil.parseDom
      // vm.replacePx = commonUtil.replacePx;
      vm.removeNode = commonUtil.removeNode
    },

    // 生成流程盒子的方法
    initStepBox(node) {
      const vm = this
      let stepBox
      // 编辑状态
      if (node.state === vm.EDIT_STATE) {
        stepBox = vm.parseDom(
          '<div class="step-box step-box' +
            node.id +
            '">' +
            '<div class="step-box__color"></div>' +
            '</div>'
        )
        const inputEl = vm.parseDom(
          `<span style="display: inline-block;height: 17px;">${node.label}</span>`
        )

        const actionWrapper = vm.parseDom('<div class="step-box__action"></div>')
        vm.commitIcon = vm.parseDom(
          // '<span class="iconfont icon-queren"></span>'
          '<i class="iconfont el-icon-circle-check"></i>'
        )
        const cancelIcon = vm.parseDom(
          // '<span class="iconfont icon-quxiao"></span>'
          '<i class="iconfont el-icon-circle-close"></i>'
        )

        vm.commitIcon.addEventListener('click', function() {
          node.label = vm.selectValue
          node.desc = vm.textarea2
          node.state = null
          vm.api.refresh()
        })

        cancelIcon.addEventListener('click', function() {
          node.state = null
          vm.api.refresh()
        })

        actionWrapper.appendChild(vm.commitIcon)
        actionWrapper.appendChild(cancelIcon)
        stepBox.appendChild(actionWrapper)
        stepBox.appendChild(inputEl)
      } else {
        stepBox = vm.parseDom(
          '<div class="step-box step-box' +
            node.id +
            '">' +
            '<div class="step-box__color"></div>' +
            `<span style="display: inline-block;height: 17px;">${node.label}</span>` +
            '</div>'
        )

        const actionWrapper = vm.parseDom('<div class="step-box__action"></div>')
        const addIcon = vm.parseDom(
          // '<span class="iconfont icon-jiahao"></span>'
          '<i class="iconfont el-icon-share"></i>'
        )
        const editIcon = vm.parseDom(
          // '<span class="iconfont icon-bianji"></span>'
          '<i class="iconfont el-icon-edit-outline"></i>'
        )
        const removeIcon = vm.parseDom(
          // '<span class="iconfont icon-jianhao"></span>'
          '<i class="iconfont el-icon-circle-close"></i>'
        )
        const addRightIcon = vm.parseDom(
          '<i class="iconfont el-icon-circle-plus-outline" style="position: absolute;right: -10px;"></i>'
        )
        const addLeftIcon = vm.parseDom(
          '<i class="iconfont el-icon-circle-plus-outline" style="position: absolute;left: -123px;"></i>'
        )
        addLeftIcon.addEventListener('click', function() {
          vm.drawer = true
          vm.selectValue = ''
          vm.textarea2 = ''
          const children = node.children
          if (!children) {
            node.children = []
          }
          if (vm.isTypeOf(children, 'Object')) {
            node.children = [children]
          }
          const node2 = JSON.parse(JSON.stringify(node))

          node.children = [{ ...node2 }]
          node.label = ''
          node.id =
            node2.id +
            1 +
            node2.children.length +
            Math.round(Math.random() * 80 + 20)
          node.parentId = node2.parentId
          node.state = vm.EDIT_STATE
          node.children[0].parentId = node.id
          console.log(node2, node, vm.dataListTree, 'node')
          vm.api.refresh()
        })
        addRightIcon.addEventListener('click', function() {
          console.log(node, 'node')
          vm.drawer = true
          vm.selectValue = ''
          vm.textarea2 = ''
          const children = node.children
          if (!children) {
            node.children = []
          }
          if (vm.isTypeOf(children, 'Object')) {
            node.children = [children]
          }
          node.children = [
            {
              children: [...node.children],
              id:
                node.id +
                1 +
                node.children.length +
                Math.round(Math.random() * 80 + 20),
              parentId: node.id,
              label: '',
              state: vm.EDIT_STATE
            }
          ]
          node.children.forEach((v) => {
            v.children.forEach((k) => {
              k.parentId = v.id
            })
          })
          vm.api.refresh()
        })

        addIcon.addEventListener('click', function() {
          vm.drawer = true
          vm.selectValue = ''
          vm.textarea2 = ''
          const children = node.children
          if (!children) {
            node.children = []
          }
          if (vm.isTypeOf(children, 'Object')) {
            node.children = [children]
          }
          node.children.push({
            id:
              node.id +
              1 +
              node.children.length +
              Math.round(Math.random() * 80 + 20),
            parentId: node.id,
            label: '',
            state: vm.EDIT_STATE
          })
          vm.api.refresh()
        })

        editIcon.addEventListener('click', function() {
          node.state = vm.EDIT_STATE
          vm.selectValue = node.label
          vm.textarea2 = node.desc
          vm.drawer = true
          vm.api.refresh()
        })

        stepBox.addEventListener('mouseenter', function() {
          vm.findParent([vm.dataListTree], node)
          vm.lookup(node)
          // console.log(vm.dataListTree, { ...node }, "mousedown");
        })
        stepBox.addEventListener('mouseleave', function() {
          vm.findParentCancel([vm.dataListTree], node)
          vm.lookupCancel(node)
          // console.log({ ...node }, "mouseout");
        })

        removeIcon.addEventListener('click', function() {
          node.children = null
          node.label = null
          node = undefined
          vm.api.refresh()
        })
        actionWrapper.appendChild(addIcon)
        actionWrapper.appendChild(editIcon)
        actionWrapper.appendChild(removeIcon)
        actionWrapper.appendChild(addRightIcon)
        actionWrapper.appendChild(addLeftIcon)
        stepBox.appendChild(actionWrapper)
      }
      return stepBox
    },
    findParent(dataListTree, data) {
      const vm = this
      dataListTree.forEach((v) => {
        if (v.id === data.parentId) {
          const boxActive = document.getElementsByClassName('step-box' + v.id)[0]
          if (boxActive) {
            boxActive.classList.add('step-boxActive')
            const lineActive = boxActive.getElementsByClassName('step-line')[0]
            if (lineActive) {
              lineActive.classList.add('step-lineActive')
            }
          }
          if (v.children && v.children.length) {
            vm.findParent([vm.dataListTree], v)
          }
        } else {
          if (v.children && v.children.length) {
            vm.findParent(v.children, data)
          }
        }
      })
    },
    findParentCancel(dataListTree, data) {
      const vm = this
      dataListTree.forEach((v) => {
        if (v.id === data.parentId) {
          const boxActive = document.getElementsByClassName('step-box' + v.id)[0]
          if (boxActive) {
            boxActive.classList.remove('step-boxActive')
            const lineActive = boxActive.getElementsByClassName('step-line')[0]
            if (lineActive) {
              lineActive.classList.remove('step-lineActive')
            }
          }
          if (v.children && v.children.length) {
            vm.findParentCancel([vm.dataListTree], v)
          }
        } else {
          if (v.children && v.children.length) {
            vm.findParentCancel(v.children, data)
          }
        }
      })
    },
    lookup(data) {
      const vm = this
      // console.log(data, document.getElementsByClassName("step-box" + data.id));
      const boxActive = document.getElementsByClassName('step-box' + data.id)[0]
      if (boxActive) {
        boxActive.classList.add('step-boxActive')
        const lineActive = boxActive.getElementsByClassName('step-line')[0]
        if (lineActive) {
          lineActive.classList.add('step-lineActive')
        }
      }
      if (data.children && data.children.length) {
        vm.lookup(data.children[0])
      }
    },
    lookupCancel(data) {
      const vm = this
      // console.log(data, document.getElementsByClassName("step-box" + data.id));
      const boxActive = document.getElementsByClassName('step-box' + data.id)[0]
      if (boxActive) {
        boxActive.classList.remove('step-boxActive')
        const lineActive = boxActive.getElementsByClassName('step-line')[0]
        if (lineActive) {
          lineActive.classList.remove('step-lineActive')
        }
      }
      if (data.children && data.children.length) {
        vm.lookupCancel(data.children[0])
      }
    },
    drawBoxes(wrapper, currentNode) {
      const vm = this
      if (vm.isTypeOf(currentNode, 'Object')) {
        // 如果当前对象text为空则不继续渲染
        if (vm.isEmptyNode(currentNode)) return
        const stepWrapper = vm.parseDom('<div class="step-wrapper"></div>')
        // 生成流程盒子
        const stepBox = vm.initStepBox(currentNode)
        stepWrapper.appendChild(stepBox)
        wrapper.appendChild(stepWrapper)
        currentNode.children &&
          vm.drawBoxes.apply(this, [stepWrapper, currentNode.children])
      }
      if (vm.isTypeOf(currentNode, 'Array')) {
        // 全部为空节点
        const allEmpty = currentNode.every(function(node) {
          return vm.isEmptyNode(node)
        })
        if (allEmpty) {
          return
        }
        const newWrapper = vm.getMuiltWrapper()
        wrapper.appendChild(newWrapper)
        for (let i = 0, len = currentNode.length; i < len; i++) {
          vm.drawBoxes.apply(this, [newWrapper, currentNode[i]])
        }
      }
    },

    // muiltWrapper内如果里面还有muiltWrapper, 把其他子div的高度调为和最大高度一致
    calcMuiltWrapperHeight(startWrapper) {
      // 可以指定从某个wrapper节点开始调整
      const muiltWrappers = startWrapper.querySelectorAll('.step-wrapper__muilt')
      // 倒序循环 从最内存开始计算高度
      for (let i = muiltWrappers.length - 1; i >= 0; i--) {
        const currentMuiltWrapper = muiltWrappers[i]
        if (!currentMuiltWrapper.querySelector('.step-wrapper__muilt')) {
          continue
        } else {
          const stepWrappers = currentMuiltWrapper.childNodes
          let maxHeight = 0
          for (let j = 0, len = stepWrappers.length; j < len; j++) {
            const currentStepWrapper = stepWrappers[j]
            const height = currentStepWrapper.clientHeight
            if (height > maxHeight) {
              maxHeight = height
            }
          }
          for (let j = 0, len = stepWrappers.length; j < len; j++) {
            const currentStepWrapper = stepWrappers[j]
            currentStepWrapper.style.height = maxHeight + 'px'
          }
        }
      }
    },

    drawDotsAndLine(stepWrapper, first) {
      const vm = this
      const getDotLeft = function() {
        return vm.parseDom(
          // '<span class="step-dot left"></span>'
          '<i class="el-icon-caret-right step-dot left"></i>'
        )
      }
      const getDotRight = function() {
        return vm.parseDom('<span class="step-dot right"></span>')
      }
      const getStepLine = function() {
        return vm.parseDom('<span class="step-line"></span>')
      }

      // 一对一直线的画法
      const drawSingleLine = function(stepBox, nextWrapper) {
        const nextBox = nextWrapper.children[0]
        const nextBoxPosition = nextBox.getBoundingClientRect()
        const nextBoxLeft = nextBoxPosition.left
        const lineWidth = nextBoxLeft - currentBoxLeft - currentBoxWidth
        const line = getStepLine()
        line.style.width = lineWidth + 'px'
        stepBox.appendChild(line)
      }
      // 一对多直线画法
      const drawMuiltLine = function(stepBox, nextWrapper) {
        const nextBox = nextWrapper.children[0]
        const nextBoxPosition = nextBox.getBoundingClientRect()
        const nextBoxHeight = nextBoxPosition.height
        // 三角形对边长
        const oppositeLength =
          currentBoxPosition.top +
          currentBoxHeight / 2 -
          (nextBoxPosition.top + nextBoxHeight / 2)
        // 三角形邻边长
        const adjacentLength = Math.abs(
          nextBoxPosition.left - currentBoxPosition.left - currentBoxWidth
        )
        // 三角形斜边长  c2 = 根号(a2+b2)
        const bevelLength = Math.round(
          Math.sqrt(
            Math.pow(Math.abs(oppositeLength), 2) + Math.pow(adjacentLength, 2)
          )
        )
        // 倾斜角度
        const sin = oppositeLength / bevelLength
        const deg = Math.abs((180 * Math.asin(sin)) / Math.PI)
        const line = getStepLine()
        // 线段是否朝上旋转
        const upward = oppositeLength > 0
        const rotateDeg = upward ? 180 - deg : -(180 - deg)
        line.style.width = bevelLength + 'px'
        line.style.transform = 'translateY(-50%) rotate(' + rotateDeg + 'deg)'
        stepBox.appendChild(line)
      }
      const children = stepWrapper.childNodes
      const stepBox = children[0]
      const nextWrapper = children[1]
      const currentBoxPosition = stepBox.getBoundingClientRect()
      const currentBoxWidth = currentBoxPosition.width
      const currentBoxLeft = currentBoxPosition.left
      const currentBoxHeight = currentBoxPosition.height
      // 不是第一次进入的box 就绘制左边的点
      if (!first) {
        stepBox.appendChild(getDotLeft())
      }
      // 还有下个wrapper的话 就绘制右边的点
      if (nextWrapper) {
        stepBox.appendChild(getDotRight())
      }
      // 到达树的底端
      if (!nextWrapper) return false
      // 单对单盒子
      const singleTarget =
        nextWrapper.className.indexOf('step-wrapper__muilt') === -1

      if (singleTarget) {
        nextWrapper && vm.drawDotsAndLine(nextWrapper)
        drawSingleLine(stepBox, nextWrapper)
      } else {
        // 单对多
        const childWrappers = nextWrapper.children
        for (let i = 0, len = childWrappers.length; i < len; i++) {
          const childWrapper = childWrappers[i]
          vm.drawDotsAndLine(childWrapper)
          drawMuiltLine(stepBox, childWrapper)
        }
      }
    },

    Steps(el, option) {
      const vm = this
      const data = option.data
      // 是否平衡高度
      const balance = option.balance
      vm.api = {
        init: function() {
          const fragment = document.createDocumentFragment()
          el.classList.add('step-wrapper')
          // 根据数组绘制boxes
          vm.drawBoxes(fragment, data)
          el.appendChild(fragment)
          // 是否调整高度一致
          balance && vm.calcMuiltWrapperHeight(el)
          // 递归绘制连线
          vm.drawDotsAndLine(el.children[0], true)
          vm.delempty(data.children)
        },
        refresh: function() {
          vm.removeNode(el.children[0])
          this.init()
        }
      }
      return vm.api
    },
    delempty(data) {
      const vm = this
      // console.log(data, vm.isTypeOf(data, "Object"));
      data &&
        data.forEach((v, i) => {
          if (v.label == null) {
            data.splice(i, 1)
          }
          if (v && v.children) {
            vm.delempty(v.children)
          }
        })
    },
    changeSelect() {
      this.commitIcon.click()
    },
    save() {
      console.log({ ...this.dataListTree }, 'save')
    },
    handleClose(done) {
      this.commitIcon.click()
      done()
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  overflow-x: auto;
}
</style>
