export interface RoleInfo {
  id?: number
  roleName: string
  permissionList?: PermissionInfo[]
}

export interface RoleQuery {
  id?: number
  roleName: string
  pageIndex?: number
  pageSize?: number
}

export interface PermissionInfo {
  id?: number
  permissionName?: string
  url?: string
}

export interface RolePermission {
  id?: number
  roleName?: string
  permissionList: PermissionInfo[]
}
