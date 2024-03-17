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
    userInfo.permissionList = (userInfo.permissionList || []).concat(
        // TODO
        { id: 39, permissionName: '查询个人信息', url: '/api/user/research/detail' },
    );
    state.userInfo = userInfo;
  },
}
