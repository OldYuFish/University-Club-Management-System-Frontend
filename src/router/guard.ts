import type { NavigationGuardNext, RouteLocationNormalized, Router } from "vue-router";
import type { IUserInfo, IPermission, ICrumb } from "@/store/models";
import NProgress from "nprogress";
import store from "@/store";
import { common } from "@/api";

NProgress.configure({
  showSpinner: false,
  easing: 'ease',
  speed: 500,
  minimum: 0.1,
})

export class useAuthGuard {
  whiteList: string[] = ['Forbidden', 'NotFound', 'user-list'];

  constructor(private router: Router) {
    this.canActivate();
    this.afterEach();
  }

  canActivate() {
    this.router.beforeEach(async (to, from, next) => {
      document.title = to.meta.title as string;
      NProgress.start();
      if (to.name === "NotFound") {
        await store.dispatch('common/getUserInfo');
        next();
      } else {
        this.extractCrumbs(to);
        if (to.name && this.whiteList.includes(to.name.toString())) {
          if (['Forbidden', 'NotFound'].includes(to.name as string)) {
            await store.dispatch('common/getUserInfo');
          }
          next();
        } else {
          let userInfo: IUserInfo = store.getters['common/userInfo'];
          if (userInfo.userNumber) {
            const isAllowed = this.allowRouter(to, userInfo.permissionList);
            this.validPermission(isAllowed, to, next);
          } else {
            if (to.name!.toString() === "login") {
              const connection = localStorage.getItem("connection");
              if (!connection) {
                const { data } = await common.cid({ connectionId: connection ? connection : "" });
                if (data.code === 0) {
                  localStorage.setItem("connection", data.data.connectionId);
                }
              }
              next();
            } else {
              next('/login');
            }
          }
        }
      }
    });
    return this.router;
  }

  afterEach() {
    this.router.afterEach(() => {
      NProgress.done();
    });
  }

  private validPermission(
      isAllowed: boolean,
      to: RouteLocationNormalized,
      next: NavigationGuardNext,
  ) {
    if (isAllowed) {
      if (['home', 'center'].includes(to.name!.toString())) {
        next();
      } else if ((to.name as string).split('-').length > 1) {
        next();
      } else {
        next('/home');
      }
    } else {
      if (to.path === '/') {
        next('/home');
      } else if (useRouter().hasRoute(to.path.toString())) {
        next('/exception/403');
      } else {
        next('/exception/404');
      }
    }
  }

  private extractCrumbs(to: RouteLocationNormalized) {
    let crumbs: ICrumb[] = [];
    to.matched.forEach((m) => {
      crumbs.push({
        path: m.path,
        title: m.meta.title as string,
        to: m.meta.to as string || '',
      });
    });
    if (crumbs.length < 2) {
      crumbs = crumbs.map((c) => {
        c.to = '';
        return c;
      });
    }
    store.commit('common/setCrumbs', crumbs);
  }

  private allowRouter(router: RouteLocationNormalized, permission: IPermission[]): boolean {
    const routeList = router.name!.toString().split('-');
    if (routeList.length === 1) return true;
    return permission.some((p: IPermission) => {
      const urlList = p.url.split('/');
      if (urlList[3] === "research") {
        if (routeList.length === 2) {
          return urlList[2] === routeList[0];
        } else if (routeList.length === 3) {
          return urlList[4] === routeList[2];
        }
      } else if (urlList[3] === "create") {
        if (routeList.length === 3) {
          return routeList[2] === "apply";
        }
      }
    });
  }
}
