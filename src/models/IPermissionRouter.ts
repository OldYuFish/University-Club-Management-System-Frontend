import type { IPermission } from "@/store/models";

export interface PermissionRouterInfo {
  name: string
  router: string
  permissionUrl?: string
  children?: PermissionRouterInfo[]
  permission?: IPermission[]
}
