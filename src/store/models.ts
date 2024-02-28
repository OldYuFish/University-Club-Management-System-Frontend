import type { RouteRecordRaw } from "vue-router";

export interface IRouteState {
  routers: RouteRecordRaw[]
  keepAliveModules: string[]
}

export interface IRootStore {
  home: IRouteState
  common: ICommonState
}

export interface IPermission {
  actionId: number
  menuId: number
  name: string
  num: number
  parentId: number
  router: string
}
export interface IUserInfo {
  userId: number
  cardId: string
  name: string
  permission: IPermission[]
  role: { id: number; name: string }[]
}

export interface ICommonState {
  isExpand: boolean
  crumbs: ICrumb[]
  userInfo: IUserInfo
}
export interface ICrumb {
  path: string
  title: string
  to: string
}
