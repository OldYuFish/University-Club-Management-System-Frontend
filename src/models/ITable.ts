export interface IColumn {
  type: string
  prop: string
  label: string
  sortable: boolean
  fixed: string | boolean
}

export interface ITable {
  showTab: boolean
  tabLabel: string
  tabName: string
  loading: boolean
  data: any[]
  pageConfig: IPagination
  column: IColumn[]
  showDelete: boolean
  showUpdate: boolean
  showDetail: boolean
}

export interface ICardData {
  name: string,
  value: string | number,
}
