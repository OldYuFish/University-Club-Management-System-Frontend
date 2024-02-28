import type { MutationTree } from "vuex";
import type { ICommonState, ICrumb, IUserInfo } from "@/store/models";

export const mutations: MutationTree<ICommonState> = {
  setExpand: (state: ICommonState, isExpand: boolean): void => {
    state.isExpand = isExpand;
  },
  setCrumbs: (state: ICommonState, crumbs: ICrumb[]): void => {
    state.crumbs = crumbs;
  },
  setUserInfo: (state: ICommonState, userInfo: IUserInfo): void => {
    userInfo.permission = (userInfo.permission || []).concat(
        { actionId: 0, num: 0, parentId: 0, name: 'center', router: 'center', menuId: -1 },
        { actionId: 0, num: 0, parentId: 0, name: '403', router: '403', menuId: -1 },
        { actionId: 0, num: 0, parentId: 0, name: '404', router: '404', menuId: -1 },
    );
    state.userInfo = userInfo;
  },
}
