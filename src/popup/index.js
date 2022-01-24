import Vue from "vue";
import AppComponent from "./App/App.vue";

import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(Element)
Vue.component("app-component", AppComponent);
new Vue({
  el: "#app",
  render: createElement => {
    return createElement(AppComponent);
  }
});
