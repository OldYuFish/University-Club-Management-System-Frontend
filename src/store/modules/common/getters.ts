import type { GetterTree } from "vuex";
import type { ICommonState, IRootStore } from "@/store/models";

export const getters: GetterTree<ICommonState, IRootStore> = {
  userInfo: (state: ICommonState) => {
    return state.userInfo;
  },
}
