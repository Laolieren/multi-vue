// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import profile from "./profile.vue";

Vue.config.productionTip = false;
new Vue({
  render: (h) => h(profile),
}).$mount("#app");
