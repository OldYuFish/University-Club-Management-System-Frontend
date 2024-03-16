export interface ClubInfo {
  id?: number
  clubName: string
  memberNumber: number
  type: string
  clubLevel?: string
  department?: string
  totalFund?: number
  surplusFund?: number
  description?: string
  applicationTime: string
  establishmentTime?: string
  statusCode?: number
  approvalComment?: string
  loginId: number
  realName?: string
  studentNumber?: string
  email?: string
}

export interface ClubQuery {
  id?: number
  clubName: string
  type: string
  clubLevel: string
  department: string
  statusCode: number
  realName?: string
  pageIndex?: number
  pageSize?: number
}
