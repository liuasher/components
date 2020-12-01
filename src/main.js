
import Vue from 'vue';
import App from './App.vue';
import router from './router/index';
import store from './store/index';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import calendar from '@/components/calendar';

Vue.use(ElementUI);
Vue.use(calendar);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');