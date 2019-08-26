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

    wrap() {
      return this.$parent.wrap;
    }
  },

  // 渲染出来的是，最长的那一条
  // thumb是里面拖拽的那个条
  render() {
    const { size, move, bar } = this;
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

  methods: {
    clickThumbHandler(e) {
      // prevent click event of right button
      if (e.ctrlKey || e.button === 2) {
        return;
      }
      this.startDrag(e);
      this[this.bar.axis] = (e.currentTarget[this.bar.offset] - (e[this.bar.client] - e.currentTarget.getBoundingClientRect()[this.bar.direction]));
    },

    /** 当鼠标，点到了长滚动条的地方 */
    clickTrackHandler(e) {
      /**
       * getBoundingClientRect：是元素距离浏览器的上下左右，距离浏览器窗口的位置（不包含卷起部分
       * clientX，clientY：事件距离浏览器窗口，左上角的位置
       * 计算结果：事件距离元素顶部的高度
       */
      const offset = Math.abs(e.target.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]);
      /**
       * 获取bar高度的一半，因为点击之后，bar的中点需要定位到指定位置
       */
      const thumbHalf = (this.$refs.thumb[this.bar.offset] / 2);
      /**
       * 需要挪动的偏移量/高度=需要挪动的偏移百分比
       */
      const thumbPositionPercentage = ((offset - thumbHalf) * 100 / this.$el[this.bar.offset]);
      /**
       * 设置滚动条的高度
       */
      this.wrap[this.bar.scroll] = (thumbPositionPercentage * this.wrap[this.bar.scrollSize] / 100);
    },

    startDrag(e) {
      e.stopImmediatePropagation();
      this.cursorDown = true;

      on(document, 'mousemove', this.mouseMoveDocumentHandler);
      on(document, 'mouseup', this.mouseUpDocumentHandler);
      document.onselectstart = () => false;
    },

    mouseMoveDocumentHandler(e) {
      if (this.cursorDown === false) return;
      const prevPage = this[this.bar.axis];

      if (!prevPage) return;

      const offset = ((this.$el.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]) * -1);
      const thumbClickPosition = (this.$refs.thumb[this.bar.offset] - prevPage);
      const thumbPositionPercentage = ((offset - thumbClickPosition) * 100 / this.$el[this.bar.offset]);

      this.wrap[this.bar.scroll] = (thumbPositionPercentage * this.wrap[this.bar.scrollSize] / 100);
    },

    mouseUpDocumentHandler(e) {
      this.cursorDown = false;
      this[this.bar.axis] = 0;
      off(document, 'mousemove', this.mouseMoveDocumentHandler);
      document.onselectstart = null;
    }
  },

  destroyed() {
    off(document, 'mouseup', this.mouseUpDocumentHandler);
  }
};