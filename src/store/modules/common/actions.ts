import type { ActionTree } from "vuex";
import type { ICommonState, IRootStore } from "@/store/models";
import { common } from "@/api";
import store from "@/store";

export const actions: ActionTree<ICommonState, IRootStore> = {
  async getUserInfo({ commit }) {
    // TODO 应该在成功登录后的重定向过程中被第一次调用，登录前不应调用
    const { data } = await common.isLogin();
    if (data.code === 0) {
      store.commit('common/setUserInfo', data.data);
    } else {
      store.commit('common/setUserInfo', {});
      location.replace('/login');
    }
  },
}
