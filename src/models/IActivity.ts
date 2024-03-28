export interface ActivityInfo {
  id?: number
  title: string
  coOrganizer: string
  type: string
  address: string
  activityStartTime: string
  activityEndTime: string
  shouldApply: number
  applicationStartTime?: string
  applicationEndTime?: string
  numberLimit?: number
  realNumber?: number
  description?: string
  summarize?: string
  statusCode: number
  approvalComment?: string
  clubId?: number
  clubName?: string
}

export interface ActivityQuery {
  id?: number
  title: string
  type: string
  numberLimit?: number
  statusCode: number
  clubName: string
  pageIndex?: number
  pageSize?: number
}