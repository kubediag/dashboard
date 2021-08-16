<template>
  <div class="app-container">
    <div style="text-align: center; margin: 50px 0">
      <h1>基于 Kubernetes 打造的诊断运维编排框架</h1>
      <router-link to="/diagnosis/index" style="vertical-align: middle">
        <el-button
          type="primary"
          round
        >快速开始</el-button>
      </router-link>
      <a
        title="https://github.com/kubediag"
        href="https://github.com/kubediag"
        target="_blank"
        style="margin: 0 20px; font-size: 28px; vertical-align: middle"
      >
        <svg-icon icon-class="github" />
        <!-- <el-button type="primary" round
          >下载 <i class="el-icon-download"></i
        ></el-button> -->
      </a>
    </div>
    <div style="overflow: hidden">
      <div style="float: left; width: 55%">
        <h2>简介：</h2>
        <div style="font-size: 18px">
          <p style="padding: 0 50px; line-height: 40px">
            KubeDiag 为 Kubernetes
            集群中的诊断运维管理提供了一套统一的编排框架。用户通过 Kubernetes
            自定义资源可以定义运维操作、如何执行复杂的诊断运维流水线、如何通过报警自动触发诊断运维流水线。该系统通过下列自定义资源为用户提供了运维操作的自动化管理能力：
          </p>
          <ul style="padding: 0px 80px; line-height: 45px">
            <li>Operation 用于定义故障运维和集群检查等操作。</li>
            <li>OperationSet 用于定义诊断运维流水线。</li>
            <li>
              Trigger 支持用户通过 Prometheus、Kafka
              等系统自动触发诊断运维流水线。
            </li>
            <li>Diagnosis 中记录了一次诊断运维流水线的结果和状况。</li>
          </ul>
          <!-- 大规模容器集群管理工具。客户端命令行工具，将接受的命令格式化后发送给kube-apiserver，作为整个系统的操作入口。运行在每个计算节点上，作为agent，接受分配该节点的Pods任务及管理容器，周期性获取容器状态，反馈给kube-apiserver。 -->
        </div>
      </div>
      <div
        class="emotion-img"
        style="
          float: right;
          width: 35%;
          background: rgba(25, 25, 25, 0.1);
          border-radius: 6px;
          margin: 40px 0;
        "
      >
        <div>
          <img style="width: 100px" src="../../assets/dt.gif" alt="">
          <div id="show" style="padding: 10px 40px" />
        </div>
        <div style="margin: 40px">
          <h2>资源数量：</h2>
          <div style="padding: 1px 30px">
            <p>编排管理：{{ summaryData.operationSet }}</p>
            <p>操作管理：{{ summaryData.operation }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { summary } from '@/api/dashboard.js'
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  components: {},
  data() {
    return { summaryData: {}, timer: null }
  },
  computed: {
    ...mapGetters(['roles'])
  },
  created() {},
  mounted() {
    this.run()
    this.summaryFn()
  },
  beforeDestroy() {
    clearTimeout(this.timer)
  },
  methods: {
    summaryFn() {
      summary({})
        .then((res) => {
          this.summaryData = res.data.resourceCount || {}
        })
        .catch(() => {})
    },
    run() {
      var time = new Date() // 获取系统当前时间
      var year = time.getFullYear()
      var month = time.getMonth() + 1
      var date = time.getDate() // 系统时间月份中的日
      // var day = time.getDay() // 系统时间中的星期值
      // var weeks = [
      //   '星期日',
      //   '星期一',
      //   '星期二',
      //   '星期三',
      //   '星期四',
      //   '星期五',
      //   '星期六'
      // ]
      // var week = weeks[day] // 显示为星期几
      var hour = time.getHours()
      var minutes = time.getMinutes()
      var seconds = time.getSeconds()
      if (month < 10) {
        month = '0' + month
      }
      if (date < 10) {
        date = '0' + date
      }
      if (hour < 10) {
        hour = '0' + hour
      }
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      if (seconds < 10) {
        seconds = '0' + seconds
      }
      // var newDate = year+"年"+month+"月"+date+"日"+week+hour+":"+minutes+":"+seconds;
      document.getElementById('show').innerHTML =
        year +
        '-' +
        month +
        '-' +
        date +
        ' ' +
        // week +
        ' ' +
        hour +
        ':' +
        minutes +
        ':' +
        seconds
      this.timer = setTimeout(() => {
        this.run()
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  background: url("../../assets/homeBg.png") center bottom no-repeat;
  background-size: 100% 100%;
}
</style>
