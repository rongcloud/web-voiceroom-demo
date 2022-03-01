import Vue from 'vue'
import App from './App.vue'
import Axios from './utils/request'
import router from './router'
import VueRouter from 'vue-router'
import store from './store/index'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import md5 from 'js-md5';
import RCVoiceRoomLib from "@rongcloud/rcvoiceroomlib-v1";
import VueScroller from 'vue-scroller'

Vue.use(VueRouter)
Vue.use(router)
Vue.use(store)
Vue.use(ElementUI)
Vue.use(VueScroller)
Vue.config.productionTip = false
Vue.prototype.$axios = Axios
Vue.prototype.$md5 = md5;
Vue.prototype.$store = store;
Vue.prototype.$RCVoiceRoomLib = RCVoiceRoomLib;


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')