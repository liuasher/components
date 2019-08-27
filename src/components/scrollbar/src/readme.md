
这里免去了横向滚动条，先以纵向为例
- wrap是有滚动条，我的scroll-view
- view：为了隐藏滚动条，包裹一下
- bar：背景滚动条
- thumb：滑动滚动条
```html
<el-scrollbar>
  <wrap>
    <view>
      my-list
    </view>
  </wrap>
  <bar>
    <thumb/>
  </bar>
</el-scrollbar>
```


滚动列表wrap和thunb之间，有两个交互行为（具体精确的计算细节，后面会详叙）：

#### 1. wrap滚动，thumb需要滚动

```html
<!-- wrap -->
<div
  onScroll={ this.handleScroll }
  class="el-scrollbar__wrap"
</div>
<!-- thumb -->
<Bar
  vertical
  move={ this.moveY }
  size={ this.sizeHeight }>
</Bar>
```
```js
// wrap滚动时调用
handleScroll() {
  const wrap = this.wrap;
  this.moveY = ((wrap.scrollTop * 100) / wrap.clientHeight);
  this.moveX = ((wrap.scrollLeft * 100) / wrap.clientWidth);
}
// 给thumb设置样式
const translate = `translate${bar.axis}(${ move }%)`;
style[bar.size] = size;
style.transform = translate;
style.msTransform = translate;
style.webkitTransform = translate;
```

STEP：
- 当wrap滚动，会执行handleScroll
- handleScroll会计算moveY：wrap.scorlHeight/wrap.height，这是thumb应该距离顶部的百分比
- moveY通过props传入thumb
- thumb使用moveY直接做transform
- 完成


#### 2. thumb被拖动，wrap需要滚动
```js
// 点击thumb
clickThumbHandler(e) {
  this.startDrag(e);
  this[this.bar.axis] = GET_DETIAL_IN_CODE;
}
// 开始拖动，注意事件是绑定在document上面
startDrag(e) {
  e.stopImmediatePropagation();
  on(document, 'mousemove', this.mouseMoveDocumentHandler);
}
// 修改wrap的scrollTop
mouseMoveDocumentHandler(e) {
  // 注意，这里会触发 handleScroll 函数
  this.wrap[this.bar.scroll] = GET_DETIAL_IN_CODE;
}
// 后面的就跟上一种情况是一样的了
```

STEP：
- 点击thumb，计算点击处到thumb底部的距离x
- 拖动的时候，不断地计算thumb当前的距离y，与之前x做比较，计算偏移量
- 设置wrap.scrollTop，这时会触发wrap.handleScroll
- 重复第一种情况的STEP




#### 3. bar被点击，wrap需要滚动，thumb需要移动
```js
clickTrackHandler(e) {
  this.wrap[this.bar.scroll] = GET_DETIAL_IN_CODE;
},
```

STEP：
- 计算，thumb顶部 距离 bar顶部的高度
- 设置wrap.scrollTop，这时会触发wrap.handleScroll
- 重复第一种情况的STEP