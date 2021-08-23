(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-62c3d7bc"],{"2ae2":function(t,e,n){t.exports=n.p+"static/img/dt.7c9baa2d.gif"},"7fc7":function(t,e,n){},9406:function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"app-container"},[n("div",{staticStyle:{"text-align":"center",margin:"50px 0"}},[n("h1",[t._v("基于 Kubernetes 打造的诊断运维编排框架")]),t._v(" "),n("router-link",{staticStyle:{"vertical-align":"middle"},attrs:{to:"/diagnosis/index"}},[n("el-button",{attrs:{type:"primary",round:""}},[t._v("快速开始")])],1),t._v(" "),n("a",{staticStyle:{margin:"0 20px","font-size":"28px","vertical-align":"middle"},attrs:{title:"https://github.com/kubediag",href:"https://github.com/kubediag",target:"_blank"}},[n("svg-icon",{attrs:{"icon-class":"github"}})],1)],1),t._v(" "),n("div",{staticStyle:{overflow:"hidden"}},[t._m(0),t._v(" "),n("div",{staticClass:"emotion-img",staticStyle:{float:"right",width:"35%",background:"rgba(25, 25, 25, 0.1)","border-radius":"6px",margin:"40px 0"}},[t._m(1),t._v(" "),n("div",{staticStyle:{margin:"40px"}},[n("h2",[t._v("资源数量：")]),t._v(" "),n("div",{staticStyle:{padding:"1px 30px"}},[n("p",[t._v("编排管理："+t._s(t.summaryData.operationSet))]),t._v(" "),n("p",[t._v("操作管理："+t._s(t.summaryData.operation))])])])])])])},r=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticStyle:{float:"left",width:"55%"}},[n("h2",[t._v("简介：")]),t._v(" "),n("div",{staticStyle:{"font-size":"18px"}},[n("p",{staticStyle:{padding:"0 50px","line-height":"40px"}},[t._v("\n          KubeDiag 为 Kubernetes\n          集群中的诊断运维管理提供了一套统一的编排框架。用户通过 Kubernetes\n          自定义资源可以定义运维操作、如何执行复杂的诊断运维流水线、如何通过报警自动触发诊断运维流水线。该系统通过下列自定义资源为用户提供了运维操作的自动化管理能力：\n        ")]),t._v(" "),n("ul",{staticStyle:{padding:"0px 80px","line-height":"45px"}},[n("li",[t._v("Operation 用于定义故障运维和集群检查等操作。")]),t._v(" "),n("li",[t._v("OperationSet 用于定义诊断运维流水线。")]),t._v(" "),n("li",[t._v("\n            Trigger 支持用户通过 Prometheus、Kafka\n            等系统自动触发诊断运维流水线。\n          ")]),t._v(" "),n("li",[t._v("Diagnosis 中记录了一次诊断运维流水线的结果和状况。")])])])])},function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("img",{staticStyle:{width:"100px"},attrs:{src:n("2ae2"),alt:""}}),t._v(" "),i("div",{staticStyle:{padding:"10px 40px"},attrs:{id:"show"}})])}],a=(n("8e6e"),n("ac6a"),n("456d"),n("ade3")),c=n("b775");function s(t){return Object(c["a"])({url:"/v1/summary",method:"get",params:t})}var o=n("2f62");function u(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,i)}return n}function l(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?u(Object(n),!0).forEach((function(e){Object(a["a"])(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):u(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}var p={name:"Dashboard",components:{},data:function(){return{summaryData:{},timer:null}},computed:l({},Object(o["b"])(["roles"])),created:function(){},mounted:function(){this.run(),this.summaryFn()},beforeDestroy:function(){clearTimeout(this.timer)},methods:{summaryFn:function(){var t=this;s({}).then((function(e){t.summaryData=e.data.resourceCount||{}})).catch((function(){}))},run:function(){var t=this,e=new Date,n=e.getFullYear(),i=e.getMonth()+1,r=e.getDate(),a=e.getDay(),c=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],s=(c[a],e.getHours()),o=e.getMinutes(),u=e.getSeconds();i<10&&(i="0"+i),r<10&&(r="0"+r),s<10&&(s="0"+s),o<10&&(o="0"+o),u<10&&(u="0"+u),document.getElementById("show").innerHTML=n+"-"+i+"-"+r+"  "+s+":"+o+":"+u,this.timer=setTimeout((function(){t.run()}),1e3)}}},d=p,v=(n("9eac"),n("2877")),m=Object(v["a"])(d,i,r,!1,null,"1dae048e",null);e["default"]=m.exports},"9eac":function(t,e,n){"use strict";n("7fc7")}}]);