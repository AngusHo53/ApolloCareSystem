import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import { userModule } from "@/store/modules/user";
import ErrorPage from "@/components/404.vue";
import Dashboard from "@/pages/Dashboard.vue";
import OrderList from "@/pages/OrderList.vue";
import OrderForm from "@/pages/OrderForm.vue";
import CustomerList from "@/pages/CustomerList.vue";
import CustomerForm from "@/pages/CustomerForm.vue";
import Products from "@/pages/ProductList.vue";
import ProductForm from "@/pages/ProductForm.vue";
import Login from "@/components/Login.vue";

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
    path: "/dashboard",
    component: Dashboard,
    name: "儀錶板",
    beforeEnter: requireAuth
  },
  {
    path: "/orders",
    component: OrderList,
    name: "訂單",
    beforeEnter: requireAuth
  },
  {
    path: "/neworder",
    component: OrderForm,
    name: "NewOrder",
    beforeEnter: requireAuth
  },
  {
    path: "/order/:id",
    component: OrderForm,
    name: "Order",
    beforeEnter: requireAuth
  },
  {
    path: "/customers",
    component: CustomerList,
    name: "使用者名單",
    beforeEnter: requireAuth
  },
  {
    path: "/newcustomer",
    component: CustomerForm,
    name: "NewCustomer",
    beforeEnter: requireAuth
  },
  {
    path: "/customer/:id",
    component: CustomerForm,
    name: "Customer",
    beforeEnter: requireAuth
  },
  {
    path: "/product/:id",
    component: ProductForm,
    name: "Product",
    beforeEnter: requireAuth
  },
  {
    path: "/products",
    component: Products,
    name: "產品",
    beforeEnter: requireAuth
  },
  {
    path: "/newproduct",
    component: ProductForm,
    name: "NewProduct",
    beforeEnter: requireAuth
  },
  { path: "/login", component: Login, name: "Login" },
  { path: "/", redirect: "/dashboard" },
  { path: "*", redirect: "/404" }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
