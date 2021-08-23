<template>
  <div class="app-container">
    <div style="padding-bottom: 15px; border-bottom: 1px solid #f8f8f8">
      <div class="diagnosis2Logo">
        <svg-icon icon-class="diagnosis2" />
      </div>
      <strong class="desc" :title="formData.desc">{{ formData.desc }}</strong>
      <div v-if="!isView" style="float: right; padding: 5px 0">
        <el-button
          :disabled="dataListTree.children.length <= 0"
          @click="cleanUp"
        >
          清空
        </el-button>
        <el-button
          :disabled="dataListTree.children.length <= 0"
          type="primary"
          @click="dialogFormVisible = true"
        >
          保存
        </el-button>
      </div>
      <div v-else style="float: right; padding: 7px 0">
        <el-button @click="goBack"> 返回 </el-button>
      </div>
    </div>
    <div class="main">
      <div class="stepsBox">
        <div id="steps" />
      </div>
    </div>
    <el-drawer
      :size="230"
      :visible.sync="drawer"
      :before-close="handleClose"
      class="options"
    >
      <div slot="title">
        <el-input
          v-model="optionsSearchVal"
          placeholder="请输入名称"
          prefix-icon="el-icon-search"
          @input="optionsSearchFn"
        />
      </div>
      <div class="optionBox">
        <ul>
          <li
            v-for="(item, i) in operationsData2"
            :key="item.name + i"
            :title="item.name"
            :class="{
              'step-box': true,
              'step-boxActive': item.name === targetTag.name,
            }"
            @click="optionFn(item)"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
    </el-drawer>
    <el-dialog title="确定创建" :visible.sync="dialogFormVisible" width="500px">
      <el-form ref="formData" :model="formData" label-width="80px">
        <el-form-item
          label="诊断名称"
          prop="name"
          :rules="[
            {
              required: true,
              message: '请输入诊断名称',
              trigger: 'blur',
            },
          ]"
        >
          <!-- {
              min: 0,
              max: 253,
              pattern: /^[a-z0-9]+([a-z,-.0-9]+)+[a-z0-9]+$/,
              message: '只能输入小写字母、数字、中划线、逗号、点',
            }, -->
          <el-input v-model="formData.name" placeholder="请输入诊断名称" />
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input
            v-model="formData.desc"
            placeholder="请输入描述"
            type="textarea"
            :rows="2"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
    <edit ref="edit" />
  </div>
</template>

<script>
import { operationSets } from '@/api/diagnosis.js'
import { operations } from '@/api/operation.js'
import edit from '../operation/edit.vue'
export default {
  components: { edit },
  props: {},
  data() {
    return {
      dialogFormVisible: false,
      formData: { name: '', desc: '', data: {}},
      dataListTree: {
        id: 0,
        parentId: -1,
        name: '开始',
        children: []
      },
      isTypeOf: null,
      isEmptyNode: null,
      getMuiltWrapper: null,
      parseDom: null,
      // replacePx: null,
      removeNode: null,
      api: null,
      EDIT_STATE: 'EDIT',
      drawer: false,
      optionsSearchVal: '',
      operationsData2: [],
      rules: {
        name: [
          { required: true, message: '请输入诊断名称', trigger: 'blur' },
          {
            min: 3,
            max: 5,
            message: '只能输入字母、数字、中划线、下划线、点',
            trigger: 'blur'
          }
        ]
      },
      operationsData: [],
      commitIcon: null,
      commitIcon2: null,
      myindex: [],
      targetTag: {},
      node2: {},
      children2: {}
    }
  },
  computed: {
    isView() {
      return this.$route.query.isView || false
    }
  },
  watch: {
    drawer(_new) {
      const vm = this
      if (_new) {
        document.getElementsByClassName('stepsBox')[0].style.width =
          document.getElementsByClassName('stepsBox')[0].clientWidth -
          185 +
          'px'
        vm.optionsSearchFn('')
      } else {
        document.getElementsByClassName('stepsBox')[0].style.width = '100%'
        vm.optionsSearchVal = ''
      }
    },
    dataListTree: {
      handler(newValue, oldValue) {
        localStorage.setItem(
          'diagnosisData',
          JSON.stringify(newValue.children[0])
        ) // 存
        console.log(newValue, '监听')
      },
      deep: true
    }
  },
  created() {
    this.commonUtilFn()
    this.operationsFn()
    if (this.isView) {
      const viewDeta = JSON.parse(localStorage.getItem('viewDeta'))
      const req = viewDeta.req || {}
      this.formData.desc = viewDeta.desc
      this.formData.name = viewDeta.name
      this.dataListTree.children[0] = req.data
    } else {
      if (
        localStorage.getItem('diagnosisData') &&
        localStorage.getItem('diagnosisData') !== 'undefined'
      ) {
        const diagnosisData = JSON.parse(localStorage.getItem('diagnosisData'))
        this.dataListTree.children[0] = diagnosisData
      }
    }
  },
  mounted() {
    this.stepFn()
  },
  beforeDestroy() {
    localStorage.removeItem('viewDeta') // 删除
  },
  methods: {
    operationsFn() {
      operations({})
        .then((res) => {
          this.operationsData = res.data
        })
        .catch(() => {})
    },
    stepFn() {
      const vm = this
      const step = vm.Steps(document.querySelector('#steps'), {
        data: vm.dataListTree
      })
      step.init()
      if (this.isView) {
        const stepBoxAction =
          document.getElementsByClassName('step-box__action')
        for (let i = 0; i < stepBoxAction.length; i++) {
          stepBoxAction[i].style.display = 'none'
        }
      }
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
          // return !node.name && !node.state && !node.children;
          return !node.name && !node.state
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
            `<span title="${node.name}">${node.name}</span>` +
            '</div>'
        )

        const actionWrapper = vm.parseDom(
          '<div class="step-box__action"></div>'
        )
        vm.commitIcon = vm.parseDom(
          '<i class="iconfont el-icon-circle-check"></i>'
        )
        const cancelIcon = vm.parseDom(
          '<i class="iconfont el-icon-delete"></i>'
        )

        vm.commitIcon.addEventListener('click', function(e) {
          e.stopPropagation()
          node.name = vm.targetTag.name || null
          node.desc = vm.targetTag.desc || '暂无描述'
          if (vm.node2.name && !vm.targetTag.name) {
            node.name = vm.node2.name
            node.desc = vm.node2.desc || '暂无描述'
            node.children = vm.node2.children
          }
          node.state = null
          vm.targetTag = {}
          vm.node2 = {}
          vm.api.refresh()
        })

        cancelIcon.addEventListener('click', function() {
          node.state = null
          vm.api.refresh()
        })

        actionWrapper.appendChild(vm.commitIcon)
        actionWrapper.appendChild(cancelIcon)
        stepBox.appendChild(actionWrapper)
      } else {
        stepBox = vm.parseDom(
          '<div class="step-box step-box' +
            node.id +
            '">' +
            `<span title="${node.name}">${node.name}</span>` +
            '</div>'
        )
        const actionWrapper = vm.parseDom(
          '<div class="step-box__action"></div>'
        )
        const tooltip = vm.parseDom(
          `<div><i class="el-icon-warning-outline"></i><div class="popover popover${
            node.id
          }">${
            node.desc || '暂无描述'
          }<div class="popper__arrow"></div></div></div>`
        )
        tooltip.addEventListener('click', function(e) {
          e.stopPropagation()
        })
        tooltip.addEventListener('mouseenter', function(e) {
          e.stopPropagation()
          document.getElementsByClassName(
            'popover' + node.id
          )[0].style.display = 'block'
          console.log('tooltip', 'mouseenter')
        })
        tooltip.addEventListener('mouseleave', function(e) {
          e.stopPropagation()
          document.getElementsByClassName(
            'popover' + node.id
          )[0].style.display = 'none'
        })
        const addIcon = vm.parseDom(
          '<i class="iconfont el-icon-document-add" title="向后同级新增"></i>'
        )
        const editIcon = vm.parseDom(
          '<i class="iconfont el-icon-edit-outline" title="编辑"></i>'
        )
        const removeIcon = vm.parseDom(
          '<i class="iconfont el-icon-delete" title="删除"></i>'
        )
        const addRightIcon = vm.parseDom(
          '<i class="iconfont addRightIcon el-icon-circle-plus-outline" title="向后新增"></i>'
        )
        const addLeftIcon = vm.parseDom(
          '<i class="iconfont addLeftIcon el-icon-circle-plus-outline" title="向前新增"></i>'
        )
        addLeftIcon.addEventListener('click', function(e) {
          e.stopPropagation()
          vm.drawer = true
          const children = node.children
          if (!children) {
            node.children = []
          }
          if (vm.isTypeOf(children, 'Object')) {
            node.children = [children]
          }
          vm.node2 = JSON.parse(JSON.stringify(node))
          console.log(vm.node2, 'vm.node2')

          node.children = [{ ...vm.node2 }]
          node.name = ''
          node.desc = ''
          node.id =
            vm.node2.id +
            1 +
            vm.node2.children.length +
            Math.round(Math.random() * 80 + 20)
          node.parentId = vm.node2.parentId
          node.state = vm.EDIT_STATE
          node.children[0].parentId = node.id
          vm.api.refresh()
        })
        addRightIcon.addEventListener('click', function(e) {
          e.stopPropagation()
          vm.drawer = true
          const children = node.children
          vm.children2 = JSON.parse(JSON.stringify(node))
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
              name: '',
              desc: '',
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

        addIcon.addEventListener('click', function(e) {
          e.stopPropagation()
          vm.drawer = true
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
            name: '',
            desc: '',
            state: vm.EDIT_STATE
          })
          vm.api.refresh()
        })

        editIcon.addEventListener('click', function(e) {
          e.stopPropagation()
          vm.drawer = true
          node.state = vm.EDIT_STATE
          vm.api.refresh()
        })

        stepBox.addEventListener('mouseenter', function(e) {
          e.stopImmediatePropagation()
          vm.findParent([vm.dataListTree], node)
          vm.lookup(node)
        })
        stepBox.addEventListener('mouseleave', function(e) {
          e.stopImmediatePropagation()
          vm.findParentCancel([vm.dataListTree], node)
          vm.lookupCancel(node)
        })

        stepBox.addEventListener('click', function(e) {
          e.stopImmediatePropagation()
          if (node.name !== '开始' && node.id !== 0) {
            const data = vm.operationsData.filter(
              (item) => item.name === node.name
            )
            vm.$refs.edit.openDrawer(data[0])
          }
          // console.log({ ...node }, e, e.stopImmediatePropagation, "click");
        })

        removeIcon.addEventListener('click', function(e) {
          e.stopPropagation()
          vm.$confirm(`此操作将删除“${node.name}”标签, 是否继续?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              node.children = null
              node.name = null
              node = undefined
              vm.api.refresh()
            })
            .catch(() => {})
        })

        vm.commitIcon2 = vm.parseDom('<i></i>')
        vm.commitIcon2.addEventListener('click', function(e) {
          e.stopPropagation()
          vm.api.refresh()
        })
        // actionWrapper.appendChild(vm.commitIcon);

        actionWrapper.appendChild(addIcon)
        actionWrapper.appendChild(editIcon)
        actionWrapper.appendChild(removeIcon)
        actionWrapper.appendChild(addRightIcon)
        actionWrapper.appendChild(addLeftIcon)
        stepBox.appendChild(actionWrapper)
        stepBox.appendChild(tooltip)
      }
      return stepBox
    },
    findParent(dataListTree, data) {
      const vm = this
      dataListTree.forEach((v) => {
        if (v.id === data.parentId) {
          const boxActive = document.getElementsByClassName(
            'step-box' + v.id
          )[0]
          if (boxActive) {
            boxActive.classList.add('step-boxActive')
            vm.searchIndex([vm.dataListTree], data)
            vm.myindex = vm.myindex.length < 1 ? [0] : vm.myindex
            const lineActive =
              boxActive.getElementsByClassName('step-line')[vm.myindex[0]]
            if (lineActive) {
              lineActive.classList.add('step-lineActive')
              vm.myindex = []
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
    searchIndex(dataListTree, data) {
      const vm = this
      dataListTree.forEach((v, i) => {
        if (v.id === data.id) {
          vm.myindex.push(i)
        } else {
          if (v.children) {
            vm.searchIndex(v.children, data)
          }
        }
      })
    },
    findParentCancel(dataListTree, data) {
      const vm = this
      dataListTree.forEach((v) => {
        if (v.id === data.parentId) {
          const boxActive = document.getElementsByClassName(
            'step-box' + v.id
          )[0]
          if (boxActive) {
            boxActive.classList.remove('step-boxActive')
            vm.searchIndex([vm.dataListTree], data)
            vm.myindex = vm.myindex.length < 1 ? [0] : vm.myindex
            const lineActive =
              boxActive.getElementsByClassName('step-line')[vm.myindex[0]]
            if (lineActive) {
              lineActive.classList.remove('step-lineActive')
              vm.myindex = []
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
      const boxActive = document.getElementsByClassName(
        'step-box' + data.id
      )[0]
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
      const boxActive = document.getElementsByClassName(
        'step-box' + data.id
      )[0]
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
      const muiltWrappers = startWrapper.querySelectorAll(
        '.step-wrapper__muilt'
      )
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
        return vm.parseDom('<i class="el-icon-caret-right step-dot left"></i>')
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
        line.style.width = lineWidth - 5 + 'px'
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
          // for (let i = 0, len = childWrappers.length; i <script len; i++) {
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
      data &&
        data.forEach((v, i) => {
          if (v.name == null) {
            data.splice(i, 1)
          }
          if (v && v.children) {
            vm.delempty(v.children)
          }
        })
    },
    save() {
      const vm = this
      vm.$refs['formData'].validate((valid) => {
        if (valid) {
          vm.formData.data = { ...vm.dataListTree.children[0] }
          console.log(vm.formData, 'save')
          operationSets(vm.formData)
            .then((res) => {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              vm.dialogFormVisible = false
            })
            .catch(() => {
              vm.dialogFormVisible = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cleanUp() {
      const vm = this
      vm.$confirm(`此操作将清空标签, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          vm.dataListTree.children = []
          vm.commitIcon2.click()
        })
        .catch(() => {})
      console.log({ ...vm.dataListTree }, 'cleanUp')
    },
    goBack() {
      this.$router.push({
        name: 'arrangeList',
        path: '/arrangeList/index'
      })
    },
    optionFn(row) {
      this.targetTag = row
      this.commitIcon.click()
      this.drawer = false
    },
    handleClose(done) {
      this.commitIcon.click()
      done()
    },
    optionsSearchFn(val) {
      this.operationsData2 = this.operationsData.filter(
        (item) => item.name.indexOf(val) !== -1
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  overflow-x: auto;
}
.diagnosis2Logo {
  width: 50px;
  height: 50px;
  float: left;
  background: #85aeff;
  margin-right: 10px;
  border-radius: 5px;
  text-align: center;
  line-height: 50px;
  font-size: 30px;
}
.main {
  width: 100%;
  height: calc(100vh - 200px);
}
.desc {
  height: 50px;
  line-height: 50px;
  display: inline-block;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 68%;
}
.stepsBox {
  width: calc(100% - 0px);
  // width: calc(100% - 185px);
  height: 100%;
  overflow: auto;
  float: left;
  padding: 20px 0 80px 0;
}
.optionBox {
  height: 100%;
  // width: 180px;
  text-align: center;
  // border-left: 1px solid #f8f8f8;
  overflow: auto;
}
.optionBox ul {
  display: inline-block;
  margin: 0;
  padding: 0;
  text-align: center;
  list-style-type: none;
}
.optionBox ul li {
  margin: 10px auto;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 0 10px;
}
/deep/ .addRightIcon {
  position: absolute;
  right: -50px;
  top: 45px;
  font-size: 20px;
  z-index: 9;
  background: #fff;
  border-radius: 50%;
  color: #3378ff;
  font-weight: 900;
}
/deep/ .addLeftIcon {
  position: absolute;
  left: -20px;
  top: 45px;
  font-size: 20px;
  z-index: 9;
  background: #fff;
  border-radius: 50%;
  color: #3378ff;
  font-weight: 900;
}
/deep/ .popover {
  display: none;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  width: 200px;
  padding: 10px;
  line-height: 26px;
  font-size: 14px;
  // text-align-last: left;
  white-space: normal;
  position: absolute;
  top: 62px;
  left: 0;
  box-shadow: 0 0 10px #eee;
  // transform-origin: center top;
  z-index: 2001;
}
/deep/ .popper__arrow:after {
  content: " ";
  border-width: 8px;
  position: absolute;
  display: none;
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid;
  top: -8px;
  left: 50%;
  margin-left: -5px;
  border-top-width: 0;
  border-bottom-color: #fff;
}
.options /deep/ .el-drawer__header {
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f8f8f8;
}
</style>
