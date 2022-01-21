import Vue from "vue";
import AppComponent from "./App/App.vue";
import { Button, Select, Card, Dialog, Option, OptionGroup,  Tooltip ,datePicker,Row,Col,Switch,input,inputNumber} from 'element-ui';
Vue.use(Button)
Vue.use(Select)
Vue.use(Option)
Vue.use(OptionGroup)
Vue.use(Card)
Vue.use(Dialog)
Vue.use(Tooltip)
Vue.use(datePicker)
Vue.use(Row)
Vue.use(Col)
Vue.use(Switch)
Vue.use(input)
Vue.use(inputNumber)
Vue.component("app-component", AppComponent);
new Vue({
  el: "#app",
  render: createElement => {
    return createElement(AppComponent);
  }
});
