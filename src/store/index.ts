import type { InjectionKey } from "vue";
import type { IRootStore } from "./models";
import type { Store } from "vuex";
import { createStore, useStore as aliasUseStore } from "vuex";
import modules from "./modules";

export const key: InjectionKey<Store<IRootStore>> = Symbol();

const store = createStore<IRootStore>({ modules });

export const useStore = () => aliasUseStore(key);

export default store;
