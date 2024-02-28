import type { ICommonState } from "@/store/models";

export const state: ICommonState = {
  isExpand: true,
  crumbs: [],
  userInfo: {
    userId: 0,
    cardId: '',
    name: '',
    permission: [],
    role: [],
  },
}
