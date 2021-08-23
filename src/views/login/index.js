import Vue from 'vue'
import Cookies from 'js-cookie'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import Element from 'element-ui'
import Login from './index.vue'
import store from '../../store'
import '../../icons' // icon
import '../../styles/element-variables.scss'
import '@/styles/index.scss' // global css
import i18n from '../../lang' // Internationalization
Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})
Vue.config.productionTip = false
new Vue({
  el: '#app',
  store,
  i18n,
  render: h => h(Login)
})
