import Vue from "vue";
import Router from "vue-router";

import Home from "./views/Home";

const Demo = () => import(/* webpackChunkName: "about" */ "./views/Demo");

Vue.use(Router);

export default new Router({
  routes: [
    {
      component: Home,
      name: "home",
      path: "/"
    },
    {
      component: Demo,
      name: "demo",
      path: "/demo"
    }
  ]
});
