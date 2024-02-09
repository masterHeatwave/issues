/* eslint-disable react/prop-types */
import axios, { CancelTokenSource } from 'axios'
import React, { createContext, useMemo } from 'react'
import { ListTarget } from 'src/components/Table/Filter/types'
import { TCellProp } from 'src/components/Table/types'
import getProps from 'src/config/IssueList'
import { fetchList as _fetchList } from 'src/context/actions/issues'
import config from 'src/services/storage'
import TIssueListItem from 'src/structures/viewmodel/issueListItem'
import TPagination from 'src/structures/viewmodel/pagination'
import TFetchProps from 'src/types/FetchProps'

interface IState {
  issues: TPagination<TIssueListItem>
  fetchList: (fetchProps?: TFetchProps) => Promise<TPagination<TIssueListItem>>
  loading: boolean
  fetchProps: TFetchProps
  listTarget: ListTarget
  cellProps: TCellProp[]
}

const IssueContext = createContext<IState>({} as IState)

interface IIssueProvider {
  children?: React.ReactNode
}

export const IssueProvider: React.FC<IIssueProvider> = ({ children }) => {
  const [fetchProps, setFetchProps] = React.useState<TFetchProps>(config.fetchProps)
  const [loading, setLoading] = React.useState(false)
  const [issues, setIssues] = React.useState<TPagination<TIssueListItem>>({
    pageNumber: config.fetchProps.pagging.pageNumber,
    pageSize: config.fetchProps.pagging.pageSize,
    totalPages: 0,
    totalRecords: 0,
    data: []
  })
  const listTarget = React.useMemo(() => {
    switch (true) {
      case fetchProps.filters.some(
        filter => filter.id === 'list' && filter.value === String(ListTarget.OWNED)
      ):
        return ListTarget.OWNED
      case fetchProps.filters.some(
        filter => filter.id === 'list' && filter.value === String(ListTarget.WATCHING)
      ):
        return ListTarget.WATCHING
      default:
        return ListTarget.ASSIGNED
    }
  }, [fetchProps])
  const cellProps = React.useMemo<TCellProp[]>(() => getProps(listTarget), [listTarget])
  const [axiosCancelTokenSource, setAxiosCancelTokenSource] =
    React.useState<CancelTokenSource | null>(null)
  React.useEffect(() => {
    config.fetchProps = fetchProps
    config.save()
  }, [fetchProps])
  const fetchList = React.useCallback(
    async (props: TFetchProps = fetchProps): Promise<TPagination<TIssueListItem>> => {
      if (axiosCancelTokenSource) {
        axiosCancelTokenSource.cancel()
      }
      const cancelToken = axios.CancelToken
      const source = cancelToken.source()
      setAxiosCancelTokenSource(source)
      const urlParams = new URLSearchParams()
      if (props.pagging.pageNumber) {
        urlParams.set(`pageNumber`, props.pagging.pageNumber.toString())
      }
      if (props.pagging.pageSize) {
        urlParams.set(`pageSize`, props.pagging.pageSize.toString())
      }
      if (props.pagging.pageNumber) {
        urlParams.set(`pageNumber`, props.pagging.pageNumber.toString())
      }
      if (props.sorting?.id) {
        urlParams.set(`SortBy`, props.sorting.id.toString())
      }
      if (props.sorting?.direction) {
        urlParams.set(`Sort`, props.sorting?.direction === 'desc' ? '1' : '0')
      }
      props.filters.forEach(filter => {
        if (!filter.value.length) {
          return
        }
        urlParams.set(
          `filter[${filter.id}]`,
          typeof filter.value === 'string' ? filter.value : filter.value.join(',')
        )
      })
      setLoading(true)
      try {
        const issues = await _fetchList(urlParams, source.token)
        setIssues(issues)
        setFetchProps({
          ...props,
          pagging: {
            ...fetchProps.pagging,
            pageNumber: issues.pageNumber,
            pageSize: issues.pageSize
          }
        })
        return issues
      } catch (error) {
        return await Promise.reject(error)
      } finally {
        setLoading(false)
      }
    },
    [fetchProps]
  )
  const memoedValue = useMemo(
    () => ({
      loading,
      issues,
      fetchProps,
      listTarget,
      cellProps,
      fetchList
    }),
    [loading, fetchProps]
  )
  return <IssueContext.Provider value={memoedValue}>{children}</IssueContext.Provider>
}

const useIssues = () => React.useContext(IssueContext)

export default useIssues
