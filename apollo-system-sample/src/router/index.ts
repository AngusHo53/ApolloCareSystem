import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import { userModule } from "@/store/modules/user";
import ErrorPage from "@/components/404.vue";
import Community from "@/pages/Community.vue";
import Login from "@/components/Login.vue";
import PatientList from "@/pages/PatientList.vue";
import PatientRecords from "@/pages/PatientRecords.vue";

function requireAuth(to: TODO, from: TODO, next: TODO) {
  console.log(`userModule.isSignedI ${userModule.isSignedIn}`);
  if (!userModule.isSignedIn) {
    next({
      path: "/login",
      query: { redirect: to.fullPath }
    });
  } else {
    next();
  }
}

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  { path: "/404", component: ErrorPage, name: "ErrorPage" },
  {
    path: "/patients",
    component: PatientList,
    name: "病人名單",
    beforeEnter: requireAuth
  },
  {
    path: "/patients/:id/records",
    component: PatientRecords,
    name: "病人紀錄",
    beforeEnter: requireAuth
  },
  {
    path: "/community",
    component: Community,
    name: "社區狀態顯示表",
    beforeEnter: requireAuth
  },
  { path: "/login", component: Login, name: "Login" },
  { path: "/", redirect: "/community" },
  { path: "*", redirect: "/404" }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
