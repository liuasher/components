import Vue from 'vue';
import ElementUI from 'element-ui';
import App from './App.vue';
import router from './router/index';
import store from './store/index';
import 'element-ui/lib/theme-chalk/index.css';

import TopologyGraph from '@/components/topology-graph/index';

Vue.use(ElementUI);
Vue.use(TopologyGraph);

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app');
