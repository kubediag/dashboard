<template>
  <div>
    <el-dialog
      title="触发式诊断任务"
      :visible.sync="dialogVisible"
      width="50%"
      top="5vh"
    >
      <el-form ref="form" v-loading="isLoading" :model="form" label-width="140px" :rules="rules" label-position="left">
        <el-form-item label="诊断任务名称" prop="name" key="name">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="触发诊断模板" prop="operationSet" key="operationSet">
          <el-select v-model="form.operationSet" filterable placeholder="请选择">
            <el-option
              v-for="item in operationsSet"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="触发诊断类型" prop="type" key="type">
          <el-radio-group v-model="form.type">
            <el-radio label="Prometheus">Prometheus报警</el-radio>
            <el-radio label="Kubernetes">Kubernetes事件</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="form.type === 'Prometheus'">
          <el-form-item label="触发诊断目标" prop="resource" key="resource">
            <el-radio-group v-model="form.resource">
              <el-radio label="node"/>
              <el-radio label="pod"/>
            </el-radio-group>
          </el-form-item>
          <template v-if="form.resource === 'node'">
            <el-form-item label="node标签" prop="nodeNameReferenceLabel" key="nodeNameReferenceLabel">
              <el-input v-model="form.nodeNameReferenceLabel"/>
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item label="Namespace标签" prop="podNamespaceReferenceLabel" key="podNamespaceReferenceLabel">
              <el-input v-model="form.podNamespaceReferenceLabel"/>
            </el-form-item>
            <el-form-item label="Pod标签" prop="podNameReferenceLabel" key="podNameReferenceLabel">
              <el-input v-model="form.podNameReferenceLabel"/>
            </el-form-item>
          </template>
          <el-form-item label="报警名称" prop="alertName" key="alertName">
            <el-input v-model="form.alertName"/>
          </el-form-item>
          <el-form-item label="Parameter标签" prop="parameterInjectionLabels" key="parameterInjectionLabels">
            <el-input v-model="form.parameterInjectionLabels"/>
          </el-form-item>
          <el-button
            type="text"
            :icon="showMoreFormItem? 'el-icon-arrow-down':'el-icon-arrow-up'"
            @click="showMoreFormItem=!showMoreFormItem"
          >高级配置
          </el-button>
          <template v-if="showMoreFormItem">
            <template v-if="form.resource === 'pod'">
              <el-form-item label="容器标签" prop="containerReferenceLabel" key="containerReferenceLabel">
                <el-input v-model="form.containerReferenceLabel"/>
              </el-form-item>
            </template>
            <el-form-item label="报警标签" prop="labels" key="labels">
              <el-input v-model="form.labels"/>
            </el-form-item>
            <el-form-item label="报警注解" prop="annotations" key="annotations">
              <el-input v-model="form.annotations"/>
            </el-form-item>
            <el-form-item label="开始时间" prop="startsAt" key="startsAt">
              <el-date-picker
                v-model="form.startsAt"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" prop="endsAt" key="endsAt">
              <el-date-picker
                v-model="form.endsAt"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="GeneratorURL" prop="generatorURL" key="generatorURL">
              <el-input v-model="form.generatorURL"/>
            </el-form-item>
          </template>
        </template>
        <template v-else>
          <el-form-item label="Namespace" prop="namespace" key="namespace">
            <el-select v-model="form.namespace" filterable placeholder="请选择">
              <el-option
                v-for="item in namespaces"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="事件名称" prop="eventname" key="eventname">
            <el-input v-model="form.eventname"/>
          </el-form-item>
          <el-form-item label="Reason" prop="reason" key="reason">
            <el-input v-model="form.reason"/>
          </el-form-item>
          <el-form-item label="Message" prop="message" key="message">
            <el-input v-model="form.message"/>
          </el-form-item>
          <div
            class="el-form-item el-form-item--medium is-required"
            style="margin-bottom: 0"
          >
            <label class="el-form-item__label" style="width: 140px;">source</label>
          </div>
          <el-form-item label="component" prop="component" class="subform-item" key="component">
            <el-input v-model="form.component"/>
          </el-form-item>
          <el-form-item label="host" prop="host" class="subform-item" key="host">
            <el-input v-model="form.host"/>
          </el-form-item>
        </template>
        <el-form-item>
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {createtrigger} from '@/api/triggertask'
import {checkName, namespaces} from '@/api/diagnoseslist'
// import {operations} from '@/api/operation'
import {operationSets} from '@/api/arrangeList'

export default {
  components: {},
  props: {},
  data () {
    return {
      isLoading: false,
      dialogVisible: false,
      showMoreFormItem: false,
      form: {
        type: 'Prometheus',
        resource: 'node',
        name: '',
        operationSet: '',
        nodeNameReferenceLabel: '',
        podNamespaceReferenceLabel: '',
        podNameReferenceLabel: '',
        containerReferenceLabel: '',
        parameterInjectionLabels: '',

        alertName: '',
        labels: '',
        annotations: '',
        startsAt: '',
        endsAt: '',
        generatorURL: '',

        namespace: '',
        eventname: '',
        reason: '',
        message: '',
        component: '',
        host: ''
      },
      rules: {
        name: [
          {required: true, trigger: 'blur', message: '请输入'},
          {validator: this.validatePass, trigger: 'blur'}
        ],
        resource: [
          {required: true, trigger: 'blur', message: '请输入'}
        ],
        type: [
          {required: true, trigger: 'blur', message: '请输入'}
        ],
        operationSet: [
          {required: true, trigger: 'change', message: '请选择'}
        ],
        nodeNameReferenceLabel: [
          {required: true, trigger: 'blur', message: '请输入'}
        ],
        alertName: [
          {required: true, trigger: 'blur', message: '请输入'}
        ],
        podNamespaceReferenceLabel: [
          {required: true, trigger: 'blur', message: '请输入'}
        ],
        podNameReferenceLabel: [
          {required: true, trigger: 'blur', message: '请输入'}
        ],

        namespace: [
          {required: true, trigger: 'change', message: '请输入'}
        ],
        eventname: [
          {required: true, trigger: 'blur', message: '请输入'}
        ],
        reason: [
          {required: true, trigger: 'blur', message: '请输入'}
        ],
        message: [
          {required: true, trigger: 'blur', message: '请输入'}
        ],
        component: [
          {required: true, trigger: 'blur', message: '请输入'}
        ],
        host: [
          {required: true, trigger: 'blur', message: '请输入'}
        ]
      },
      operationsSet: [],
      namespaces: []
    }
  },
  mounted () {
    this.operations()
    this.getnamespaces()
  },
  methods: {
    async checkName (name, kind) {
      const params = {name, kind}
      const data = await checkName(params)
      if (!data.success) {
        return data.message
      }
    },
    async validatePass (rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入'))
      } else {
        if (value !== '') {
          const message = await this.checkName(value, 'Operation')
          if (message) {
            callback(new Error(message))
          }
        }
        callback()
      }
    },
    async operations () {
      const params = {}
      const data = await operationSets(params)
      if (data.success) {
        this.operationsSet = data.data
      }
    },
    async getnamespaces () {
      const params = {}
      const data = await namespaces(params)
      if (data.success) {
        this.namespaces = data.data
      }
    },
    openDialog () {
      this.dialogVisible = true
      this.isLoading = false
      this.resetForm()
      this.$nextTick(() => {
        this.$refs.form.resetFields()
      })
    },
    resetForm () {
      this.form = {
        type: 'Prometheus',
        resource: 'node',
        name: '',
        operationSet: '',
        nodeNameReferenceLabel: '',
        podNamespaceReferenceLabel: '',
        podNameReferenceLabel: '',
        containerReferenceLabel: '',
        parameterInjectionLabels: '',

        alertName: '',
        labels: '',
        annotations: '',
        startsAt: '',
        endsAt: '',
        generatorURL: '',

        namespace: '',
        eventname: '',
        reason: '',
        message: '',
        component: '',
        host: ''
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
            type,
            resource,
            name,
            operationSet,
            nodeNameReferenceLabel,
            podNamespaceReferenceLabel,
            podNameReferenceLabel,
            containerReferenceLabel,
            parameterInjectionLabels,

            alertName,
            labels,
            annotations,
            startsAt,
            endsAt,
            generatorURL,

            namespace,
            eventname,
            reason,
            message,
            component,
            host
          } = this.form
          const params = {
            name,
            operationSet,
            prometheusAlertTemplate: null,
            kubernetesEventTemplate: null
          }

          if (type === 'Prometheus') {
            params.prometheusAlertTemplate = {
              parameterInjectionLabels: parameterInjectionLabels || null,
              regexp: {
                alertName: alertName || null,
                labels: labels || null,
                annotations: annotations || null,
                startsAt: startsAt || null,
                endsAt: endsAt || null,
                generatorURL: generatorURL || null
              }
            }
            if (resource === 'node') {
              Object.assign(params.prometheusAlertTemplate, {
                nodeNameReferenceLabel: nodeNameReferenceLabel || null
              })
            } else {
              Object.assign(params.prometheusAlertTemplate, {
                podNamespaceReferenceLabel: podNamespaceReferenceLabel || null,
                podNameReferenceLabel: podNameReferenceLabel || null,
                containerReferenceLabel: containerReferenceLabel || null
              })
            }
          } else {
            params.kubernetesEventTemplate = {
              regexp: {
                namespace: namespace || null,
                name: eventname || null,
                reason: reason || null,
                message: message || null,
                source: {
                  component: component || null,
                  host: host || null
                }
              }
            }
          }
          try {
            const data = await createtrigger(params)
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
/deep/ .subform-item .el-form-item__label {
  color: #999999;
  padding-left: 16px;
}

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
