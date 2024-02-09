export type TFilterOptions = {
  header?: string
  options: ReadonlyArray<TFilterOption>
}
export type TFilterOption = {
  key: string
  value: string
}
export type TFilterType = 'range' | 'dateRange' | 'string' | 'list'

export type TFilterConfig = {
  id: string
  type: TFilterType
}
export type TFilter = {
  id: string
  value: string | string[]
}
export enum ListTarget {
  OWNED = 0,
  ASSIGNED = 1,
  WATCHING = 2
}
