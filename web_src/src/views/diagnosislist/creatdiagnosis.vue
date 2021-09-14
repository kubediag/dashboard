<template>
  <div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-form ref="form" v-loading="isLoading" :model="form" label-width="120px" :rules="rules">
        <el-form-item label="诊断模板" prop="operationSet" key="operationSet">
          <el-select v-model="form.operationSet" filterable placeholder="请选择" @change="changeOperationSet">
            <el-option
              v-for="item in operationsSet"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="诊断目标" prop="resource" key="resource">
          <el-radio-group v-model="form.resource"  @change="changeResource">
            <el-radio label="node"/>
            <el-radio label="pod"/>
          </el-radio-group>
        </el-form-item>
        <template v-if="form.resource === 'node'">
          <el-form-item label="Node名称" prop="nodeName" key="nodeName">
            <el-select v-model="form.nodeName" filterable placeholder="请选择">
              <el-option
                v-for="item in nodes"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="Namespace" prop="namespacedName" key="namespacedName">
            <el-select v-model="form.namespacedName" filterable placeholder="请选择" @change="changeNamespace">
              <el-option
                v-for="item in namespaces"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Pod名称" prop="podname" key="podname">
            <el-select v-model="form.podname" filterable placeholder="请选择" @change="changePod">
              <el-option
                v-for="item in pods"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="容器名称" filterable prop="container" key="container">
            <el-select v-model="form.container" placeholder="请选择">
              <el-option
                v-for="item in (containers[form.podname]||[])"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </template>
        <el-form-item label="诊断参数" prop="parameters" key="parameters">
          <el-input v-model="form.parameters" type="textarea" :rows="4"/>
        </el-form-item>
        <el-form-item label="诊断名称" prop="name" key="name">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="命名空间" prop="namespace" key="namespace">
          <el-select v-model="form.namespace" filterable placeholder="请选择">
            <el-option
              v-for="item in namespaces"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item key="btn">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {creatediagnoses, nodes, namespaces, checkName, podsByNamespace} from '@/api/diagnoseslist'
// import {operations} from '@/api/operation'

import {operationSets} from '@/api/arrangeList'

import moment from 'moment'
import {v4 as uuidv4} from 'uuid'


export default {
  components: {},
  props: {},
  data () {
    const validatePass = async (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入'))
      } else {
        if (value !== '') {
          const message = await this.checkName(value, 'Diagnosis')
          if (message) {
            callback(new Error(message))
          }
        }
        callback()
      }
    }

    const validateJSON = async (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入'))
      } else {
        if (value !== '') {

          try {
            const json = JSON.parse(value)

            this.form.parameters = JSON.stringify(json, null, 2)
            callback()
          } catch (e) {
            callback(new Error(e.message))
          }
        }
        callback()
      }
    }
    return {
      isLoading: false,
      dialogVisible: false,
      form: {
        resource: 'node',
        operationSet: '',
        name: '',
        namespace: 'default',
        parameters: '',

        nodeName: '',

        namespacedName: '',
        podname: '',
        container: ''
      },
      rules: {
        name: [
          {required: true, trigger: 'blur', message: '请输入'},
          {validator: validatePass, trigger: 'blur'}
        ],
        resource: [
          {required: true, trigger: 'blur', message: '请输入'}
        ],
        operationSet: [
          {required: true, trigger: 'change', message: '请选择'}
        ],
        namespacedName: [
          {required: true, trigger: 'change', message: '请选择'}
        ],
        namespace: [
          {required: true, trigger: 'change', message: '请选择'}
        ],
        parameters: [
          {required: true, trigger: 'blur', message: '请输入'},
          {validator: validateJSON, trigger: 'blur'}
        ],
        nodeName: [
          {required: true, trigger: 'change', message: '请选择'}
        ],
        podname: [
          {required: true, trigger: 'change', message: '请选择'}
        ]
      },
      operationsSet: [],
      nodes: [],
      namespaces: [],
      pods: [],
      containers: {}
    }
  },
  mounted () {
    this.operations()
    this.getnodes()
    this.getnamespaces()
  },
  methods: {
    changeResource(name) {
      if (name === 'node') {
        this.form.namespace = 'default'
      } else if (name === 'pod') {
        this.form.namespace = this.form.namespacedName
      }
      setTimeout(() => {
        this.$refs.form.clearValidate('namespace')
      })
    },
    changeOperationSet(name) {
      const random = uuidv4()

      this.form.name = name + '-' + moment().format('YYYY-MM-DD') + '-' + random.substring(0, 4)
    },
    async checkName (name, kind) {
      const params = {name, kind}
      const data = await checkName(params)
      if (!data.success) {
        return data.message
      }
    },
    async operations () {
      const params = {}
      const data = await operationSets(params)
      if (data.success) {
        this.operationsSet = data.data
      }
    },
    async getnodes () {
      const params = {}
      const data = await nodes(params)
      if (data.success) {
        this.nodes = data.data
      }
    },
    async getnamespaces () {
      const params = {}
      const data = await namespaces(params)
      if (data.success) {
        this.namespaces = data.data
      }
    },
    async podsByNamespace (namespace) {
      const data = await podsByNamespace(namespace)
      if (data.success) {
        this.pods = Object.keys(data.data || {})
        this.containers = data.data || {}
      }
    },
    changePod () {
      this.form.container = ''
    },
    changeNamespace (name) {
      this.form.podname = ''
      this.form.container = ''
      this.form.namespace = this.form.namespacedName
      this.podsByNamespace(name)
    },
    openDialog () {
      this.resetForm()
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.form.resetFields()
      })
    },
    resetForm () {
      this.form = {
        resource: 'node',
        operationSet: '',
        name: '',
        namespace: 'default',
        parameters: '',

        nodeName: '',

        namespacedName: '',
        podname: '',
        container: ''
      }
    },
    closeDialog () {
      this.dialogVisible = false
      this.resetForm()
    },
    onSubmit () {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          this.isLoading = true
          const {
            resource,
            operationSet,
            name,
            namespace,
            parameters,

            nodeName,

            namespacedName,
            podname,
            container
          } = this.form
          const params = {
            name: name || null,
            namespace: namespace || null,
            spec: {
              operationSet: operationSet || null,
              parameters: parameters ? JSON.parse(parameters) : null
            }
          }
          if (resource === 'node') {
            Object.assign(params.spec, {nodeName: nodeName || null})
          } else {
            Object.assign(params.spec, {
              podReference: {
                container: container || null,
                namespace: namespacedName || null,
                name: podname || null
              }
            })
          }
          try {
            const data = await creatediagnoses(params)
            if (data.success) {
              this.closeDialog()
              this.$emit('success')
            }
            this.isLoading = false
          } catch (e) {
            this.isLoading = false
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
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
