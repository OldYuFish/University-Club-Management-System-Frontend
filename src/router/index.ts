import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { useAuthGuard } from "./guard";

const routes: readonly RouteRecordRaw[] = [
  {
    path: '',
    name: 'layout',
    component: () => import('@/components/Layout/index.vue'),
    children: [
      {
        path: '/center',
        name: 'center',
        meta: { key: 'center', title: '个人中心', to: '/center' },
        component: () => import('@/views/common/center/index.vue'),
      },
      {
        path: '/home',
        name: 'home',
        meta: { key: 'home', relation: '0', title: '主页', to: '/home' },
        component: () => import('@/views/common/home/index.vue'),
      },
      {
        path: '/club',
        name: 'club',
        meta: { key: 'club', relation: '1' },
        children: [
          {
            path: 'list',
            name: 'club-list',
            meta: { key: 'club-list', relation: '11', title: '社团列表', to: '/club/list' },
            component: () => import('@/views/club/list.vue'),
          },
          {
            path: 'detail/:id',
            name: 'club-detail',
            meta: { key: 'club-detail', relation: '12', title: '社团详情', to: '' },
            component: () => import('@/views/club/detail.vue'),
          },
          {
            path: 'apply/:aid',
            name: 'club-apply',
            meta: { key: 'club-apply', relation: '13', title: '社团申请', to: ''},
            component: () => import('@/views/club/apply.vue'),
          },
        ],
      },
      {
        path: '/activity',
        name: 'activity',
        meta: { key: 'activity', relation: '2' },
        children: [
          {
            path: 'list',
            name: 'activity-list',
            meta: { key: 'activity-list', relation: '21', title: '活动列表', to: '/activity/list' },
            component: () => import('@/views/activity/list.vue'),
          },
          {
            path: 'detail/:id',
            name: 'activity-detail',
            meta: { key: 'activity-detail', relation: '22', title: '活动详情', to: '' },
            component: () => import('@/views/activity/detail.vue'),
          },
          {
            path: 'apply/:aid',
            name: 'activity-apply',
            meta: { key: 'activity-apply', relation: '23', title: '活动申请', to: '' },
            component: () => import('@/views/activity/apply.vue'),
          },
        ],
      },
      {
        path: '/fund',
        name: 'fund',
        meta: { key: 'fund', relation: '3' },
        children: [
          {
            path: 'list',
            name: 'fund-list',
            meta: { key: 'fund-list', relation: '31', title: '经费列表', to: '/fund/list' },
            component: () => import('@/views/fund/list.vue'),
          },
          {
            path: 'apply/:aid',
            name: 'fund-apply',
            meta: { key: 'fund-apply', relation: '32', title: '经费申请', to: '' },
            component: () => import('@/views/fund/apply.vue'),
          },
        ],
      },
      {
        path: '/role',
        name: 'role',
        meta: { key: 'role', relation: '4' },
        children: [
          {
            path: 'list',
            name: 'role-list',
            meta: { key: 'role-list', relation: '41', title: '分组列表', to: '/role/list' },
            component: () => import('@/views/role/list.vue'),
          },
        ],
      },
      {
        path: '/user',
        name: 'user',
        meta: { key: 'user', relation: '5' },
        children: [
          {
            path: 'list',
            name: 'user-list',
            meta: { key: 'user-list', relation: '51', title: '用户列表', to: '/user/list' },
            component: () => import('@/views/user/list.vue'),
          },
        ],
      },
      {
        path: '/log',
        name: 'log',
        meta: { key: 'log', relation: '6' },
        children: [
          {
            path: 'list',
            name: 'log-list',
            meta: { key: 'log-list', relation: '61', title: '日志列表', to: '/log/list' },
            component: () => import('@/views/log/list.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    meta: { title: '登录' },
    component: () => import('@/views/common/login/index.vue'),
  },
  {
    path: '/exception',
    name: 'exception',
    children: [
      {
        path: '/403',
        name: 'Forbidden',
        meta: { title: '权限不足' },
        component: () => import('@/views/common/exception/403.vue'),
      },
      {
        path: '/404',
        name: 'NotFound',
        meta: { title: '页面丢失' },
        component: () => import('@/views/common/exception/404.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)',
    name: 'non-exist',
    redirect: 'exception/404',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

new useAuthGuard(router);

export default router;
