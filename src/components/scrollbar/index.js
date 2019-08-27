import Scrollbar from './src/main.vue';

/* istanbul ignore next */
Scrollbar.install = function(Vue) {
  Vue.component('myScrollbar', Scrollbar);
};

export default Scrollbar;