export interface FundInfo {
  id?: number
  theme: string
  type: string
  amount: number
  surplus: number
  appropriationTime: string
  statusCode: number
  approvalComment?: string
  clubId: number
  competitionId?: number
  activityId?: number
  clubName?: string
  competitionBonus?: CompetitionInfo
  title?: string
}

export interface FundQuery {
  id?: number
  theme: string
  type: string
  amount?: number
  surplus?: number
  statusCode: number
  clubName: string
  pageIndex?: number
  pageSize?: number
}

export interface CompetitionInfo {
  id?: number
  competitionName: string
  type: string
  competitionLevel: string
  award: string
}
