export interface ITreeData {
  id: number
  label: string
  children?: ITreeData[]
  disabled?: boolean
}
