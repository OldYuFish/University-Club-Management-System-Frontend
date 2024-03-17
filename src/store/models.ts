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
  id: number
  permissionName: string
  url: string
}
export interface IUserInfo {
  email: string
  userNumber: string
  realName: string
  permissionList: IPermission[]
  role: { id: number; roleName: string }
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
