(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-fc664b52"],{"291b":function(t,e,i){"use strict";i("d92a")},"2ae2":function(t,e,i){t.exports=i.p+"static/img/dt.7c9baa2d.gif"},9406:function(t,e,i){"use strict";i.r(e);var a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"app-container"},[i("div",{staticStyle:{"text-align":"center",margin:"50px 0"}},[i("h1",[t._v("基于 Kubernetes 打造的诊断运维编排框架")]),t._v(" "),i("router-link",{staticStyle:{"vertical-align":"middle"},attrs:{to:"/arrangeList/diagnosis"}},[i("el-button",{attrs:{type:"primary",round:""}},[t._v("快速开始")])],1),t._v(" "),i("a",{staticStyle:{margin:"0 20px","font-size":"28px","vertical-align":"middle"},attrs:{title:"https://github.com/kubediag",href:"https://github.com/kubediag",target:"_blank"}},[i("svg-icon",{attrs:{"icon-class":"github"}})],1)],1),t._v(" "),i("div",{staticStyle:{overflow:"hidden"}},[t._m(0),t._v(" "),i("div",{staticClass:"emotion-img",staticStyle:{float:"right",width:"35%",background:"rgba(25, 25, 25, 0.1)","border-radius":"6px",margin:"40px 0"}},[t._m(1),t._v(" "),i("div",{staticStyle:{margin:"40px"}},[i("h2",[t._v("资源数量：")]),t._v(" "),i("div",{staticStyle:{padding:"1px 30px"}},[i("p",[t._v("诊断任务："+t._s(t.summaryData.diagnosis))]),t._v(" "),i("p",[t._v("诊断触发器："+t._s(t.summaryData.trigger))]),t._v(" "),i("p",[t._v("操作流水线："+t._s(t.summaryData.operationSet))]),t._v(" "),i("p",[t._v("诊断操作："+t._s(t.summaryData.operation))])])])])])])},n=[function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticStyle:{float:"left",width:"55%"}},[i("h2",[t._v("简介：")]),t._v(" "),i("div",{staticStyle:{"font-size":"18px"}},[i("p",{staticStyle:{padding:"0 50px","line-height":"40px"}},[t._v("\n          KubeDiag 为 Kubernetes\n          集群中的诊断运维管理提供了一套统一的编排框架。用户通过 Kubernetes\n          自定义资源可以定义运维操作、如何执行复杂的诊断运维流水线、如何通过报警自动触发诊断运维流水线。该系统通过下列自定义资源为用户提供了运维操作的自动化管理能力：\n        ")]),t._v(" "),i("ul",{staticStyle:{padding:"0px 80px","line-height":"45px"}},[i("li",[t._v("Operation 用于定义故障运维和集群检查等操作。")]),t._v(" "),i("li",[t._v("OperationSet 用于定义诊断运维流水线。")]),t._v(" "),i("li",[t._v("\n            Trigger 支持用户通过 Prometheus、Kafka\n            等系统自动触发诊断运维流水线。\n          ")]),t._v(" "),i("li",[t._v("Diagnosis 中记录了一次诊断运维流水线的结果和状况。")])])])])},function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("img",{staticStyle:{width:"100px"},attrs:{src:i("2ae2"),alt:""}}),t._v(" "),a("div",{staticStyle:{padding:"10px 40px"},attrs:{id:"show"}})])}],r=i("5530"),s=i("b775");function o(t){return Object(s["a"])({url:"/v1/summary",method:"get",params:t})}var c=i("2f62"),u={name:"Dashboard",components:{},data:function(){return{summaryData:{},timer:null}},computed:Object(r["a"])({},Object(c["b"])(["roles"])),created:function(){},mounted:function(){this.run(),this.summaryFn()},beforeDestroy:function(){clearTimeout(this.timer)},methods:{summaryFn:function(){var t=this;o({}).then((function(e){t.summaryData=e.data.resourceCount||{}})).catch((function(){}))},run:function(){var t=this,e=new Date,i=e.getFullYear(),a=e.getMonth()+1,n=e.getDate(),r=e.getHours(),s=e.getMinutes(),o=e.getSeconds();a<10&&(a="0"+a),n<10&&(n="0"+n),r<10&&(r="0"+r),s<10&&(s="0"+s),o<10&&(o="0"+o),document.getElementById("show").innerHTML=i+"-"+a+"-"+n+"  "+r+":"+s+":"+o,this.timer=setTimeout((function(){t.run()}),1e3)}}},l=u,d=(i("291b"),i("2877")),m=Object(d["a"])(l,a,n,!1,null,"df54f022",null);e["default"]=m.exports},d92a:function(t,e,i){}}]);