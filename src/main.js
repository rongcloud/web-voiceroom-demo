import Vue from 'vue'
import App from './App.vue'
import Axios from './utils/request'
import router from './router'
import VueRouter from 'vue-router'
import store from './store/index'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import md5 from 'js-md5';
import RCLiveRoomLib from "@rongcloud/rcliveroomlib";
import RCVoiceRoomLib from "@rongcloud/rcvoiceroomlib-v1";
// import RCVoiceRoomLib from "../../../Gwork/rcvoiceroomlib-web/dist/main";

import * as RongIMLib from "@rongcloud/imlib-next";
import * as RongRTCLib from "@rongcloud/plugin-rtc";
import * as Engine from "@rongcloud/engine";
import VueScroller from 'vue-scroller'

const originalPush = VueRouter.prototype.push
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
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
Vue.prototype.$RCLiveRoomLib = RCLiveRoomLib;
Vue.prototype.$RongIMLib = RongIMLib;
Vue.prototype.$RongRTCLib = RongRTCLib;
Vue.prototype.$Engine = Engine;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')