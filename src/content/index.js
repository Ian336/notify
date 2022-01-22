import Vue from 'vue'
import content from './content.vue'
import Mock from 'mockjs'




//动态加载不了本地的js,可以加载图片
// var file = chrome.extension.getURL('assets/test.js')
// const script2 = document.createElement('script');

// script2.type = 'application/javascript'
// script2.src =file;

// document.documentElement.appendChild(script2);


var div = document.createElement('div')
div.id = 'xuzhiqiang'
document.body.appendChild(div)
console.log({ window, document })
window.abc1 = 130
//可以范围window. document 但是添加不了属性
setTimeout(() => {
  window.Mock = Mock
  window.abc = 120
  document.Mock = Mock
  document.abc = 120
}, 1000)

new Vue({
  el: '#xuzhiqiang',
  render: (createElement) => {
    return createElement(content)
  },
})
