import Vue from 'vue'
import content from './content.vue'
import Mock from 'mockjs'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

var div = document.createElement('div')
div.id = 'app'
var link  = document.createElement('link')
link.rel='stylesheet'
link.href="https://unpkg.com/element-ui/lib/theme-chalk/index.css"
document.body.insertBefore(link,document.body.firstChild)
document.body.insertBefore(div,document.body.firstChild)
console.log({ window, document })
window.abc1 = 130
//可以访问window. document 但是添加不了属性
setTimeout(() => {
  window.Mock = Mock
  window.abc = 120
  document.Mock = Mock
  document.abc = 120
}, 1000)

new Vue({
  el: '#app',
  render: (createElement) => {
    return createElement(content)
  },
})
