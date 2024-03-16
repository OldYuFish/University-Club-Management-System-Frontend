export interface UserInfo {
  id?: number
  realName: string
  password: string
  studentNumber?: string
  teacherNumber?: string
  phone: string
  email: string
  secretKey?: string
  isDelete?: number
  roleId?: number
  oldPassword?: string
  oldEmail?: string
  verifyCode?: string
  token?: string
}

export interface UserQuery {
  id?: number
  realName: string
  studentNumber: string
  teacherNumber: string
  phone: string
  email: string
  isDelete: number
  roleName: string
  pageIndex?: number
  pageSize?: number
}

export interface LoginInfo {
  phone?: string
  email?: string
  password: string
  verifyCode: string
  connectionId: string
}
