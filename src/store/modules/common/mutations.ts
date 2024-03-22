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
        { id: 39, permissionName: '查询个人信息', url: '/api/user/research/detail' },
        { id: 40, permissionName: '注销账号', url: '/api/user/delete' },
        { id: 41, permissionName: '退出登录', url: '/api/user/logout' },
        { id: 42, permissionName: '查询社团总数', url: '/api/club/count' },
    );
    state.userInfo = userInfo;
  },
}
