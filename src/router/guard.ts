import type { NavigationGuardNext, RouteLocationNormalized, Router } from "vue-router";
import type { IUserInfo, IPermission } from "@/store/models";
import NProgress from "nprogress";

NProgress.configure({
  showSpinner: false,
  easing: 'ease',
  speed: 500,
  minimum: 0.1,
})

export class useAuthGuard {
  whiteList: string[] = [];

  constructor(private router: Router) {
    this.canActivate();
    this.afterEach();
  }

  canActivate() {}

  afterEach() {
    this.router.afterEach(() => {
      NProgress.done();
    });
  }

  private validPermission(
      isAllowed: boolean,
      userInfo: IUserInfo,
      to: RouteLocationNormalized,
      next: NavigationGuardNext,
  ) {}

  private allowRouter(router: RouteLocationNormalized, permission: IPermission[]) {
    return permission.some((p: IPermission) => {
      return router.name === p.router;
    });
  }

  private locationFirst(permission: IPermission[], next: NavigationGuardNext) {
    permission.some((menu: IPermission) => {
      if (menu.router.split('-').length > 1) {
        next({ name: menu.router });
        return true;
      }
      return false;
    });
  }
}
