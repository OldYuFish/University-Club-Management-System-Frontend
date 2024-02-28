import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { useAuthGuard } from "./guard";

const routes: readonly RouteRecordRaw[] = [];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

new useAuthGuard(router);

export default router;
