import Vue from "vue";
import content from './content.vue'

new Vue({
  el: "#abcd",
  render: createElement => {
    
    return createElement(content);
  }
})