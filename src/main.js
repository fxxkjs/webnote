import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import iconSvg from "./components/IconSvg.vue"
import "@/icon/iconfont"

Vue.use(mavonEditor);
Vue.use(ElementUI);
Vue.component('icon-svg', iconSvg)

// Vue.config.devtools = true
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
