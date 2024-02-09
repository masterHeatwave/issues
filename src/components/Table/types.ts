import { TFilterConfig } from 'src/components/Table/Filter/types'

export interface ICellInput {
  type?: string
  label?: string
}

interface ICellPropBase {
  header: string
  name?: string
  id?: string
  filter?: TFilterConfig
  inputProps?: ICellInput
  align?: 'left' | 'right' | 'center' | 'justify'
  date?: boolean
  dateTime?: boolean
  width?: number | string
  maxDate?: string
  minDate?: string
  sortingId?: string
}

export enum TableOrderDirection {
  ASCENDING = 'asc',
  DESCENDING = 'desc'
}

export type TPagging = {
  pageNumber: number
  pageSize: number
}

export type TSorting = {
  id?: string
  direction?: TableOrderDirection
}

interface ICellPropA extends ICellPropBase {
  name: string
}

interface ICellPropB extends ICellPropBase {
  id: string
}

export type TCellProp = ICellPropA | ICellPropB
