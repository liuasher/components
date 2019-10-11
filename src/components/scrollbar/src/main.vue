<script>


import Bar from './bar.vue';

/** 复制一个对象 */
function extend(to, _from) {
  for (let key in _from) {
    to[key] = _from[key];
  }
  return to;
}
function toObject(arr) {
  var res = {};
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res;
}

/** 获取浏览器 滚动条的 宽度 */
let scrollBarWidth;
function scrollbarWidth() {
  // if (Vue.prototype.$isServer) return 0;
  if (scrollBarWidth !== undefined) return scrollBarWidth;

  const outer = document.createElement('div');
  outer.className = 'el-scrollbar__wrap';
  outer.style.visibility = 'hidden';
  outer.style.width = '100px';
  outer.style.position = 'absolute';
  outer.style.top = '-9999px';
  document.body.appendChild(outer);

  const widthNoScroll = outer.offsetWidth;
  outer.style.overflow = 'scroll';

  const inner = document.createElement('div');
  inner.style.width = '100%';
  outer.appendChild(inner);

  const widthWithScroll = inner.offsetWidth;
  outer.parentNode.removeChild(outer);
  scrollBarWidth = widthNoScroll - widthWithScroll;

  return scrollBarWidth;
}

/**
 * 
 */
const isServer = typeof window === 'undefined';

const resizeHandler = function(entries) {
  for (let entry of entries) {
    const listeners = entry.target.__resizeListeners__ || [];
    if (listeners.length) {
      listeners.forEach(fn => {
        fn();
      });
    }
  }
};
export const addResizeListener = function(element, fn) {
  if (isServer) return;
  if (!element.__resizeListeners__) {
    element.__resizeListeners__ = [];
    element.__ro__ = new ResizeObserver(resizeHandler);
    element.__ro__.observe(element);
  }
  element.__resizeListeners__.push(fn);
};
export const removeResizeListener = function(element, fn) {
  if (!element || !element.__resizeListeners__) return;
  element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
  if (!element.__resizeListeners__.length) {
    element.__ro__.disconnect();
  }
};




export default {
  name: 'MyScrollbar',

  components: { Bar },

  props: {
    native: Boolean,
    wrapStyle: {},
    wrapClass: {},
    viewClass: {},
    viewStyle: {},
    noresize: Boolean, // 如果 container 尺寸不会发生变化，最好设置它可以优化性能
    tag: {
      type: String,
      default: 'div'
    }
  },

  data() {
    return {
      sizeWidth: '0',
      sizeHeight: '0',
      moveX: 0,
      moveY: 0
    };
  },

  computed: {
    wrap() {
      console.log(11111111111111);
      return this.$refs.wrap;
    }
  },

  render(h) {
    
    // target.overflow = 'hidden';
    // target.position = 'relative';
    /**
     * 渲染出来的就是 my-scrollbar
     * 
     * <el-scrollbar>
     *    <el-scrollbar__wrap>  
     *        <el-scrollbar__view>
     *            <包含的dom会被挂在这里>
     *    <el-scrollbar__bar is-horizontal>
     *        <el-scrollbar__thumb>
     * 
     * wrap：有滚动条的容器（滚动条被负的marginRight隐藏）
     *    view：滚动的视图
     *        ul：<我的组件/> 
     * ar：背景滚动条
     *    thumb：滚动滚动条
     */

    /**
     * 这里渲染出来的是：<el-scrollbar>
     */



    // 滚动条的宽度
    // 外面传入的wrapStyle，这是wrap的style
    // 处理合并外部的style
    let gutter = scrollbarWidth();
    let style = this.wrapStyle;
    if (gutter) {
      const gutterWith = `-${gutter}px`;
      const gutterStyle = `margin-bottom: ${gutterWith}; margin-right: ${gutterWith};`;

      if (Array.isArray(this.wrapStyle)) {
        style = toObject(this.wrapStyle);
        style.marginRight = style.marginBottom = gutterWith;
      } else if (typeof this.wrapStyle === 'string') {
        style += gutterStyle;
      } else {
        style = gutterStyle;
      }
    }

    // 渲染view，使用默认的slot（ul）最为子元素
    const view = h(this.tag, {
      class: ['el-scrollbar__view', this.viewClass],
      style: this.viewStyle,
      ref: 'resize'
    }, this.$slots.default);
    
    // 渲染wrapper，view是他的子元素
    const wrap = (
      <div
        ref="wrap"
        style={ style }
        onScroll={ this.handleScroll }
        class={ [this.wrapClass, 'el-scrollbar__wrap', gutter ? '' : 'el-scrollbar__wrap--hidden-default'] }>
        { [view] }
      </div>
    );
    let nodes;
    
    /** 
     * 如果原生支持，就不需要自己写滚动条了，
     * native为true，就不显示滚动条
     */
    if (!this.native) {
      nodes = ([
        wrap,
        <Bar
          move={ this.moveX }
          size={ this.sizeWidth }></Bar>,
        <Bar
          vertical
          move={ this.moveY }
          size={ this.sizeHeight }></Bar>
      ]);
    } else {
      nodes = ([
        <div
          ref="wrap"
          class={ [this.wrapClass, 'el-scrollbar__wrap'] }
          style={ style }>
          { [view] }
        </div>
      ]);
    }
    // 渲染el-scrollbar
    return h('div', { class: 'el-scrollbar' }, nodes);
  },

  methods: {
    /**
     * 作用：处理scroll
     * 解释：
     * 计算结果：点击thumb事件距离thumb底部的高度
     */
    handleScroll() {
      const wrap = this.wrap;
      // wrap滚动的高度 / wrap的高度 = y滚动偏移量百分比（相对于他自身）
      this.moveY = ((wrap.scrollTop * 100) / wrap.clientHeight);
      this.moveX = ((wrap.scrollLeft * 100) / wrap.clientWidth);
    },
    /**
     * 作用：更新
     * 解释：
     * 计算结果：
     */
    update() {
      let heightPercentage, widthPercentage;
      const wrap = this.wrap;
      if (!wrap) return;
      
      /**
       * wrap的高度 / wrap可滚动区域的高度
       * 如果不能滚动，这个比率等于100%
       * 如果能滚动，比率也低，滚动区域越多
       */
      heightPercentage = (wrap.clientHeight * 100 / wrap.scrollHeight);
      widthPercentage = (wrap.clientWidth * 100 / wrap.scrollWidth);

      this.sizeHeight = (heightPercentage < 100) ? (heightPercentage + '%') : '';
      this.sizeWidth = (widthPercentage < 100) ? (widthPercentage + '%') : '';
    }
  },
  /**
   * native
   * 选择是否需要渲染滚动条，移动端机型，有自己的滚动条
   */
  mounted() {
    if (this.native) return;
    /**
     * 每次dom更新，都要计算一次
     */
    this.$nextTick(this.update);
    // 如果 container 尺寸不会发生变化，最好设置noresize可以优化性能
    !this.noresize && addResizeListener(this.$refs.resize, this.update);
  },

  beforeDestroy() {
    if (this.native) return;
    // 如果 container 尺寸不会发生变化，最好设置noresize可以优化性能
    !this.noresize && removeResizeListener(this.$refs.resize, this.update);
  }
};
</script>
<style lang="less" scoped>
.el-scrollbar{
  height: 100%;
}
.el-scrollbar__wrap{
  height: 100%;
  overflow-x: hidden;
}
</style>