<script>
// import { on, off } from 'element-ui/src/utils/dom';
import Vue from 'vue';
import { renderThumbStyle, BAR_MAP } from './util';

const isServer = Vue.prototype.$isServer;

// 绑定监听 poilyfill
export const on = (function() {
  if (!isServer && document.addEventListener) {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    };
  } else {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler);
      }
    };
  }
})();

// 移除监听 poilyfill
export const off = (function() {
  if (!isServer && document.removeEventListener) {
    return function(element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  } else {
    return function(element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler);
      }
    };
  }
})();

/* istanbul ignore next */
export default {
  name: 'Bar',
  props: {
    vertical: Boolean,
    size: String,
    move: Number
  },

  computed: {
    bar() {
      // 映射一下，兼容竖着和横着
      return BAR_MAP[this.vertical ? 'vertical' : 'horizontal'];
    },
    /**
     * this.$parent 访问到父组件实例
     * 这里返回的是wrap
     */
    wrap() {
      return this.$parent.wrap;
    }
  },

  // 渲染出来的是，最长的那一条
  // thumb是里面拖拽的那个条
  render() {
    const { size, move, bar } = this;
    /**
     * size：thumb的高度比
     * move:最终用来渲染偏移量%了
     */
    return (
      <div
        class={ ['el-scrollbar__bar', 'is-' + bar.key] }
        onMousedown={ this.clickTrackHandler } >
        <div
          ref="thumb"
          class="el-scrollbar__thumb"
          onMousedown={ this.clickThumbHandler }
          style={ renderThumbStyle({ size, move, bar }) }>
        </div>
      </div>
    );
  },

  /**
   * 这里统一一下称呼：
   *    wrap：有滚动条的容器（滚动条被负的marginRight隐藏）
   *        view：滚动的视图
   *            ul：<我的组件/> 
   * -> bar：背景滚动条
   *        thumb：滚动滚动条
   */
  methods: {

    /** 
     * 触发：当鼠标，点到了thumb的地方 
     * 作用：当点击了thumb时，计算出点击处距离元素底部的距离
     */
    clickThumbHandler(e) {
      if (e.ctrlKey || e.button === 2) {
        return;
      }
      this.startDrag(e);
      /**
       * 作用：设置Y，this指向bar（就是保存一个值）
       * 解释：
       *    currentTarget：指向事件绑定元素（这里是绑定在thumb上）
       *    target：指向事件触发元素
       * 计算结果：点击thumb事件距离thumb底部的高度
       */


       
      // this[this.bar.axis] = (
      //   // thumb的高度
      //   e.currentTarget[this.bar.offset] - 
      //   (
      //     // 事件距离浏览器窗口，左上角的位置
      //     e[this.bar.client] - 
      //     // thumb距离浏览器窗口的位置
      //     e.currentTarget.getBoundingClientRect()[this.bar.direction]
      //   )
      // );
      this[this.bar.axis] = (
        // thumb的高度
        e.currentTarget[this.bar.offset] - 
        (
          // 事件距离浏览器窗口，左上角的位置
          e[this.bar.client] - 
          // thumb距离浏览器窗口的位置
          e.currentTarget.getBoundingClientRect()[this.bar.direction]
        )
      );

    },

    /** 
     * 触发：当鼠标，点到了bar的地方 
     * 作用：当点击了bar时，同步view滚动区
     */
    clickTrackHandler(e) {
      /**
       * 作用：点击bar，同步滚动
       * 解释：
       *    getBoundingClientRect：是元素距离浏览器的上下左右，距离浏览器窗口的位置（不包含卷起部分
       *    clientX，clientY：事件距离浏览器窗口，左上角的位置
       * 计算结果：事件距离元素顶部的高度
       */
      const offset = Math.abs(e.target.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]);

      // offsetHeight：元素的像素高度
      // 获取bar高度的一半，因为点击之后，bar的中点需要定位到指定位置
      const thumbHalf = (this.$refs.thumb[this.bar.offset] / 2);

      // 需要挪动的偏移量 / 高度 * 100 = 要挪动的偏移百分比（期待的）
      // 乘以100是害怕丢失精度
      const thumbPositionPercentage = ((offset - thumbHalf) * 100 / this.$el[this.bar.offset]);

      // 期待的高度（thumb顶部 距离 bar顶部的高度）
      // 需要同步wrap里面的滚动距离，设置wrap的scrollheight
      this.wrap[this.bar.scroll] = (thumbPositionPercentage * this.wrap[this.bar.scrollSize] / 100);

    },

    /**
     * 作用：点击了thumb，就给dom绑定事件，监听
     * 解释：
     *    stopImmediatePropagation：阻止冒泡，阻止事件在相同监听中的传递
     *    stopPropagation：阻止冒泡，阻止后续的侦听行为
     * 计算结果：无
     */
    startDrag(e) {
      e.stopImmediatePropagation();
      this.cursorDown = true;
      // 当鼠标 在document上 滑动
      on(document, 'mousemove', this.mouseMoveDocumentHandler);
      // 当鼠标 在document上 施放
      on(document, 'mouseup', this.mouseUpDocumentHandler);
      // 不允许被选择
      document.onselectstart = () => false;
    },
    /**
     * 背景：此时点击了thumb
     * 作用：鼠标在document上 滑动时调用
     * 解释：
     *    
     * 计算结果：同步wrap的滚动
     */
    mouseMoveDocumentHandler(e) {
      if (this.cursorDown === false) return;
      // 点击thumb事件距离thumb底部的高度
      const prevPage = this[this.bar.axis];
      // 用来过滤 ？？？？？ 下面的情况？？？？
      if (!prevPage) return;
      // bar距离顶部的距离 - 点击处距离顶部的距离 = 点击处距离bar顶部的距离
      const offset = ((this.$el.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]) * -1);
      // thumb的高度 - 点击处距离thumb下面的距离 = 点击处距离thumb的高度
      const thumbClickPosition = (this.$refs.thumb[this.bar.offset] - prevPage);
      // thumb距离顶部的高度 / bar的高度 = thumb偏移的百分比
      const thumbPositionPercentage = ((offset - thumbClickPosition) * 100 / this.$el[this.bar.offset]);
      // 同步wrap的滚动
      this.wrap[this.bar.scroll] = (thumbPositionPercentage * this.wrap[this.bar.scrollSize] / 100);
    },
    /**
     * 背景：此时点击了thumb
     * 作用：鼠标在document上 释放时调用
     * 解释：
     *    
     * 计算结果：
     */
    mouseUpDocumentHandler() {
      // 重置
      this.cursorDown = false;
      this[this.bar.axis] = 0;
      // 移除对document上滑动的监听
      off(document, 'mousemove', this.mouseMoveDocumentHandler);
      // 允许对dom的选择
      document.onselectstart = null;
    }
  },

  destroyed() {
    // 防止内存泄漏
    off(document, 'mouseup', this.mouseUpDocumentHandler);
  }
};

</script>
<style lang="less" scoped>
.is-vertical{
  width: 6px;
  top: 2px;
  position: absolute;
  background: lightskyblue;
  right: 2px;
  bottom: 2px;
  z-index: 1;
  border-radius: 4px;
}
.el-scrollbar__thumb{
  position: relative;
  display: block;
  width: 0;
  height: 0;
  cursor: pointer;
  border-radius: inherit;
  background-color: rgba(144,147,153,.8);
  transition: background-color .3s;
  transform: translateY(0%);
  width: 100%;
}
</style>