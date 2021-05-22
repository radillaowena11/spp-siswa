import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store/index.js";
import Navbar from "../views/Layouts/Navbar.vue";
import Footer from "../views/Layouts/Footer.vue";
import Sidebar from "../views/Layouts/Sidebar.vue";
import Login from "../views/Login.vue";
import Pembayaran from "../views/Pembayaran.vue";
import Tanggungan from "../views/Tanggungan.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/pembayaran",
    name: "pembayaran",
    components: {
      default: Pembayaran,
      header: Navbar,
      sidebar: Sidebar,
      footer: Footer,
    },
    meta: { requiresAuth: true },
  },
  {
    path: "/tanggungan",
    name: "tanggungan",
    components: {
      default: Tanggungan,
      header: Navbar,
      sidebar: Sidebar,
      footer: Footer,
    },
    meta: { requiresAuth: true },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next();
      return;
    }
    next("/login");
  } else {
    next();
  }
});

export default router;
