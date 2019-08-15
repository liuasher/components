let scrollCallback = function(callback, el) {
  const scrollTop = el.scrollTop;
  const scrollHeight = el.scrollHeight;
  const scrollHeightOffset = el.clientHeight;
  const offset = 0;
  
  if (scrollTop - offset <= 0) {
    callback('top', el);
  } else if (scrollTop + offset >= scrollHeight - scrollHeightOffset) {
    callback('bottom', el);
  }
};
let callBackWarpped; 
export default {
  bind: function(el, binding) {
    callBackWarpped =  scrollCallback.bind({}, binding.value, el);
    el.addEventListener('scroll', callBackWarpped);
  },
  unbind: function(el) {
    el.removeEventListener('scroll', callBackWarpped);
  }
};