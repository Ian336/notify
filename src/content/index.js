import Vue from 'vue'
import content from './content.vue'
import Mock from 'mockjs'
import ElementUI , {Button,Drawer,Table,TableColumn,Switch,Input} from 'element-ui';
// // import 'element-ui/lib/theme-chalk/index.css';
//按需导入,避免影响项目中的样式
Vue.use(Button);
Vue.use(Drawer);
Vue.use(TableColumn);
Vue.use(Table);
Vue.use(Switch);
Vue.use(Input);
// Vue.use(ElementUI);

var div = document.createElement('div')
div.id = 'app1'
var link  = document.createElement('link')
link.rel='stylesheet'
link.href="https://unpkg.com/element-ui/lib/theme-chalk/index.css"
document.body.append(div)
document.head.insertBefore(link,document.head.getElementsByTagName("link")[0])
// document.body.insertBefore(div,document.body.firstChild)
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
  el: '#app1',
  render: (createElement) => {
    return createElement(content)
  },
})
