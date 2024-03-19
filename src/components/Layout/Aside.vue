<template>
  <ElScrollbar :style="{ height: `${height}px`}">
    <ElMenu
        activeTextColor="#ffd04b"
        backgroundColor="#545c64"
        :defaultActive="state.defaultActive"
        :class="[store.state.common.isExpand ? 'w-240' : '']"
        :collapse="!store.state.common.isExpand"
    >
      <ElMenuItem index="0" @click="store.commit('common/setExpand', !store.state.common.isExpand)">
        <ElRow justify="end">
          <ElIcon :size="18">
            <template v-if="store.state.common.isExpand">
              <ArrowLeft />
            </template>
            <template v-else>
              <ArrowRight />
            </template>
          </ElIcon>
        </ElRow>
      </ElMenuItem>
      <template v-for="menu of state.menus" :key="menu.id">
        <ElMenuItem class="pl-12" :index="menu.id" @click="triggerMenuItem($event, menu)">
          <ElIcon :size="18">
            <Component :is="menu.icon" />
          </ElIcon>
          <template #title>{{ menu.title }}</template>
        </ElMenuItem>
      </template>
    </ElMenu>
  </ElScrollbar>
</template>
<script lang="ts" setup>
import type { IPermission } from "@/store/models";
import type { IRouterRecord } from "@/models";
import { ArrowLeft, ArrowRight, House, Star, TrophyBase, Tickets, Edit, User, Notebook } from "@element-plus/icons-vue";
import store from "@/store";

defineProps({
  height: {
    type: Number,
    default: 0,
  },
});

const route = useRoute();
const router = useRouter();

const { permissionList } = store.getters['common/userInfo'];
const menuSource: IRouterRecord[] = [
  {
    id: '1',
    name: 'home',
    title: '系统主页',
    icon: 'House',
    path: '/home',
  },
  {
    id: '2',
    name: 'club',
    title: '社团管理',
    icon: 'Star',
    path: '/club/list',
  },
  {
    id: '3',
    name: 'activity',
    title: '活动管理',
    icon: 'TrophyBase',
    path: '/activity/list',
  },
  {
    id: '4',
    name: 'fund',
    title: '经费管理',
    icon: 'Tickets',
    path: '/fund/list',
  },
  {
    id: '5',
    name: 'role',
    title: '分组管理',
    icon: 'Edit',
    path: '/role/list',
  },
  {
    id: '6',
    name: 'user',
    title: '用户管理',
    icon: 'User',
    path: '/user/list',
  },
  {
    id: '7',
    name: 'log',
    title: '日志管理',
    icon: 'Notebook',
    path: '/log/list',
  },
];

const filterMenu = (tree: IRouterRecord[]): IRouterRecord[] => {
  const treeTemp: IRouterRecord[] = [];
  tree.forEach((node: IRouterRecord) => {
    const isExist: boolean = permissionList.some((p: IPermission) => {
              const urlList = p.url.split('/');
              if (urlList[3] === "research") {
                return node.name === urlList[2];
              }
            });
    if (isExist) {
      treeTemp.push(node);
    }
  });
  return treeTemp;
};

const state = reactive({
  defaultActive: '1',
  menus: filterMenu(menuSource),
});

const triggerMenuItem = (el: any, menu: IRouterRecord) => {
  state.defaultActive = menu.id;
  router.push(menu.path!);
};

state.defaultActive = route.meta.relation as string;

if (route.name === 'center') state.defaultActive = '';
</script>