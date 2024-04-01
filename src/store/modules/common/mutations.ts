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
        { id: 1, permissionName: '查询个人信息', url: '/api/user/research/detail' },
        { id: 2, permissionName: '注销账号', url: '/api/user/delete' },
        { id: 3, permissionName: '退出登录', url: '/api/user/logout' },
        { id: 4, permissionName: '修改密码', url: '/api/user/update/password'},
        { id: 5, permissionName: '修改手机号码', url: '/api/user/update/phone'},
        { id: 6, permissionName: '修改邮箱地址', url: '/api/user/update/email'},
    );
    state.userInfo = userInfo;
  },
}
