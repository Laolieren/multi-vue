// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import home from "./home.vue";

Vue.config.productionTip = false;
new Vue({
  render: (h) => h(home),
}).$mount("#app");
