import Scrollbar from './src/main';

/* istanbul ignore next */
Scrollbar.install = function(Vue) {
  Vue.component('myScrollbar', Scrollbar);
};

export default Scrollbar;