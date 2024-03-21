import type { ICommonState } from "@/store/models";

export const state: ICommonState = {
  isExpand: true,
  crumbs: [],
  userInfo: {
    id: 0,
    email: '',
    userNumber: '',
    realName: '',
    permissionList: [],
    role: { id: 0, roleName: '' },
  },
}
