import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import { userModule } from "@/store/modules/user";
import ErrorPage from "@/components/404.vue";
import Community from "@/views/Community.vue";
import Login from "@/components/Login.vue";
import PatientList from "@/views/PatientList.vue";
import PatientRecords from "@/views/PatientRecords.vue";
import RecordChart from "@/views/RecordChart.vue";
import PatientForm from "@/views/PatientForm.vue";
import CommunityRecords from "@/views/CommunityRecords.vue";
import VerifyPatients from "@/views/VerifyPatients.vue";
import ApiToken from "@/views/ApiToken.vue";

function requireAuth(to: TODO, from: TODO, next: TODO) {
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

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

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
    path: "/patients/:id/records/chart",
    component: RecordChart,
    name: "病人紀錄圖表",
    beforeEnter: requireAuth
  },
  {
    path: "/verifyPatients",
    component: VerifyPatients,
    name: '病人審核',
    beforeEnter: requireAuth
  },
  {
    path: "/newPatient",
    component: PatientForm,
    name: "新增病人",
    beforeEnter: requireAuth
  },
  {
    path: "/apiToken",
    component: ApiToken,
    name: 'API列表',
    beforeEnter: requireAuth
  },
  // {
  //   path: "/community",
  //   component: Community,
  //   name: '社區狀態顯示表',
  //   beforeEnter: requireAuth
  // },
  // {
  //   path: "/community/:name/records",
  //   component: CommunityRecords,
  //   name: "社區紀錄",
  //   beforeEnter: requireAuth
  // },
  { path: "/login", component: Login, name: "Login" },
  { path: "/", redirect: "/login" },
  { path: "*", redirect: "/404" }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
