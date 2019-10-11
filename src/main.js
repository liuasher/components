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
console.log(1111111);
import Scrollbar from '@/components/scrollbar';

Vue.use(iView);
Vue.use(Scrollbar);

Vue.config.productionTip = false;
Vue.config.lang = 'zh-CN';

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app');