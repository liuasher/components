import Vue from 'vue';
import App from './App.vue';
import router from './router/index';
import store from './store/index';
import './plugins/iview';

import './assets/css/common.less';

import '@/style/index.less';

import iView from 'iview/dist/iview.js';
import 'iview/dist/styles/iview.css';
import i18n from '@/locale';

Vue.use(iView);

Vue.config.productionTip = false;
Vue.config.lang = 'zh-CN';

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app');