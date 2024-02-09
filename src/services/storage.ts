import { Breakpoint } from '@mui/material'
import TFetchProps from 'src/types/FetchProps'
import UserDetails from 'src/types/UserDetails'

export enum Config {
  TIMEOUT_INTERVAL = 6000
}

export enum ThemeMode {
  AUTO = 'auto',
  LIGHT = 'light',
  DARK = 'dark'
}

export enum TableListView {
  EXPANDED,
  COMPACT
}

export const ROWS_PER_PAGE = [25, 50, 100, 500]

export type RowsPerPage = (typeof ROWS_PER_PAGE)[number]

type AppStorageType = {
  themeMode?: ThemeMode | null
  userDetails?: UserDetails | null
  rowsPerPage: RowsPerPage
  persist: boolean
  tableListView: TableListView | null
  fetchProps: TFetchProps
}

const defaults = {
  themeMode: ThemeMode.AUTO,
  userDetails: null,
  rowsPerPage: 50 as RowsPerPage,
  persist: true,
  tableListView: null,
  containerSize: 'md' as Breakpoint,
  appCache: {},
  fetchProps: {
    filters: [
      {
        id: 'status',
        value: ['1']
      }
    ],
    pagging: {
      pageNumber: 1,
      pageSize: 100
    }
  }
}

export { defaults }

class AppStorage {
  repo: AppStorageType

  prefix = 'IssueTracking'

  type = 'Globals'

  constructor() {
    const jsonString = localStorage.getItem(`${this.prefix}-${this.type}`)

    if (jsonString) {
      const jsonObject: Partial<AppStorageType> = JSON.parse(jsonString)
      this.repo = { ...defaults, ...jsonObject }
      return
    }

    this.repo = { ...defaults }
  }

  save() {
    localStorage.setItem(`${this.prefix}-${this.type}`, JSON.stringify(this.repo))
  }

  get tableListView(): TableListView | null {
    return this.repo.tableListView
  }

  set tableListView(value: TableListView | null) {
    this.repo.tableListView = value
  }

  get themeMode(): ThemeMode | null {
    if (this.repo.themeMode) {
      return this.repo.themeMode
    }

    return defaults.themeMode
  }

  set themeMode(value: ThemeMode | null) {
    if (!value) {
      this.repo.themeMode = defaults.themeMode
      return
    }

    this.repo.themeMode = value
  }

  get persist(): boolean {
    return this.repo.persist
  }

  set persist(value: boolean) {
    this.repo.persist = value
  }

  get rowsPerPage(): RowsPerPage {
    if (this.repo.rowsPerPage) {
      return this.repo.rowsPerPage
    }

    return defaults.rowsPerPage
  }

  set rowsPerPage(value: RowsPerPage) {
    this.repo.rowsPerPage = value
  }

  get fetchProps(): TFetchProps {
    if (this.repo.fetchProps) {
      return this.repo.fetchProps
    }

    return defaults.fetchProps
  }

  set fetchProps(value: TFetchProps) {
    this.repo.fetchProps = {
      ...value,
      pagging: {
        ...value.pagging,
        pageNumber: 1
      }
    }
  }

  get userDetails(): UserDetails | null {
    if (this.repo.userDetails) {
      return this.repo.userDetails
    }

    return defaults.userDetails
  }

  set userDetails(value: UserDetails | null) {
    if (!value) {
      this.repo.userDetails = defaults.userDetails
      return
    }

    this.repo.userDetails = value
  }

  deleteAll = () => {
    this.repo = defaults
    localStorage.removeItem(`${this.prefix}-${this.type}`)
    this.save()
  }
}

export default new AppStorage()
