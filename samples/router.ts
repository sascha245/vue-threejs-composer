import Vue from "vue";
import Router from "vue-router";

import Home from "./views/Home";

const Demo = () => import(/* webpackChunkName: "about" */ "./views/Demo");

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/demo",
      name: "demo",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: Demo
    }
  ]
});
