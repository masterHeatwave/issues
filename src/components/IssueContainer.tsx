import AddIcon from '@mui/icons-material/Add'
import FilterListOffIcon from '@mui/icons-material/FilterListOff'
import RefreshIcon from '@mui/icons-material/Refresh'
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha'
import { AppBar, Container, IconButton, SpeedDialAction, Toolbar, Tooltip } from '@mui/material'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import FilterContainer from 'src/components/FilterContainer'
import SpeedDial from 'src/components/SpeedDial/SpeedDial'
import { ListTarget, TFilterConfig } from 'src/components/Table/Filter/types'
import Table from 'src/components/Table/Table'
import { TableOrderDirection, TCellProp } from 'src/components/Table/types'
import useApp from 'src/context/useApp'
import useForm from 'src/context/useForm'
import useIssues from 'src/context/useIssues'
import TIssueListItem from 'src/structures/viewmodel/issueListItem'

interface IIssueContainer {
  children?: React.ReactNode
}

const IssueContainer: React.FC<IIssueContainer> = () => {
  const { loading: listLoading, issues, fetchList, fetchProps, listTarget, cellProps } = useIssues()
  const {
    data: { applications, status, users }
  } = useApp()
  const { createIssue, loading: formLoading, handleIssue } = useForm()
  const [searchParams] = useSearchParams()
  const handlePageChange = React.useCallback(
    (pageNumber: number) =>
      fetchList({
        ...fetchProps,
        pagging: {
          ...fetchProps.pagging,
          pageNumber
        }
      }),
    [fetchProps]
  )
  const handlePageSizeChange = React.useCallback(
    (pageSize: number) =>
      fetchList({
        ...fetchProps,
        pagging: {
          ...fetchProps.pagging,
          pageNumber: 1,
          pageSize
        }
      }),
    [fetchProps]
  )
  const handleSortChange = React.useCallback(
    (id: string, direction: TableOrderDirection) =>
      fetchList({
        ...fetchProps,
        sorting: {
          id,
          direction
        }
      }),
    [fetchProps]
  )
  const handleFiltersClear = React.useCallback(
    () =>
      fetchList({
        ...fetchProps,
        pagging: {
          ...fetchProps.pagging,
          pageNumber: 1
        },
        filters: fetchProps.filters.filter(filter => filter.id === 'list')
      }),
    [fetchProps]
  )
  const handleSortingReset = React.useCallback(
    () =>
      fetchList({
        ...fetchProps,
        sorting: undefined
      }),
    [fetchProps]
  )
  const handleRefresh = React.useCallback(() => fetchList(), [fetchProps])

  const handleCreate = React.useCallback(() => {
    createIssue().then(refresh => refresh && handleRefresh())
  }, [])
  const handleIssueClose = React.useCallback(
    (refresh: unknown) => {
      if (refresh) {
        handleRefresh()
      }
    },
    [handleRefresh]
  )
  const handleClick = (id: unknown) => {
    handleIssue(id as string).then(handleIssueClose)
  }
  const handleFilterChange = React.useCallback(
    (id: string) =>
      (value: string | string[], removeAll = false) => {
        const { filters, ...restProps } = fetchProps
        let newFilters = removeAll ? [] : [...filters]
        const filterExists = newFilters.some(filter => filter.id === id)
        if (!value.length && !filterExists) {
          return
        }
        if (filterExists) {
          newFilters = value.length
            ? newFilters.map(filter => (filter.id !== id ? filter : { ...filter, value }))
            : newFilters.filter(filter => filter.id !== id)
        } else {
          newFilters.push({ id, value })
        }
        fetchList({
          ...restProps,
          pagging: {
            ...restProps.pagging,
            pageNumber: 1
          },
          filters: newFilters
        })
      },
    [fetchProps]
  )
  const handleChange = React.useCallback(
    (_event: React.SyntheticEvent, tab: ListTarget) =>
      handleFilterChange('list')(String(tab), true),
    [handleFilterChange]
  )
  const renderFilterPopup = React.useCallback(
    (filter: TFilterConfig) => {
      const getList = (id: string) => {
        switch (id) {
          case 'application':
            return {
              header: 'Applications',
              options: applications.map(_ => ({
                key: String(_.id),
                value: _.name
              }))
            }
          case 'status':
            return {
              header: 'Status',
              options: status.map(_ => ({
                key: String(_.id),
                value: _.name
              }))
            }
          case 'user':
            return {
              header: 'Employees',
              options: users.map(_ => ({
                key: String(_.id),
                value: `${_.lastName} ${_.firstName}`
              }))
            }
          default:
            return undefined
        }
      }
      return (
        <FilterContainer
          type={filter.type}
          list={getList(filter.id)}
          value={fetchProps.filters.find(_ => _.id === filter.id)?.value}
          onFilterChange={handleFilterChange(filter.id)}
        />
      )
    },
    [fetchProps, applications]
  )
  const renderCell = React.useCallback(
    (id: unknown, value: unknown, cellProp: TCellProp, parentObject: unknown): React.ReactNode => {
      const issue = parentObject as TIssueListItem
      const { name } = cellProp
      switch (name) {
        case 'applicationId':
          return issue.application.name
        case 'statusId':
          return issue.status.name
        case 'userId':
          return `${issue.user.lastName} ${issue.user.firstName}`
        default:
      }
    },
    []
  )
  const hasFilter = React.useCallback(
    (filterId?: string) =>
      fetchProps.filters
        .filter(filter => filter.id !== 'list' && (filterId ? filter.id === filterId : true))
        .some(filter => filter.value.length),
    [fetchProps]
  )
  const handleCellFocused = React.useCallback(
    (cellProp: TCellProp) => !!cellProp.filter && hasFilter(cellProp.filter.id),
    [fetchProps]
  )
  React.useEffect(() => {
    fetchList().then(() => {
      if (searchParams.has('issue')) {
        const issueId = searchParams.get('issue')?.toUpperCase()
        if (issueId) {
          handleIssue(issueId).then(handleIssueClose)
        }
      }
    })
  }, [])
  return (
    <>
      <AppBar
        component="div"
        enableColorOnDark
        color="primary"
        position="sticky"
        sx={{ top: 0, zIndex: theme => theme.zIndex.mobileStepper + 1 }}
        elevation={0}>
        <Tabs
          centered
          variant="standard"
          value={listTarget}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          sx={{ height: 'auto', borderRight: 1, borderColor: 'divider' }}>
          <Tab label="My Issues" />
          <Tab label="Assigned" />
          <Tab label="Watching" />
        </Tabs>
      </AppBar>
      <div role="tabpanel">
        <Container disableGutters maxWidth={false}>
          <Toolbar
            variant="dense"
            sx={{
              '& > *': {
                mr: 1
              },
              '& :last-child': {
                mr: 0
              }
            }}>
            <Tooltip title="Refresh">
              <span>
                <IconButton size="small" onClick={handleRefresh} disabled={listLoading}>
                  <RefreshIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Clear Filters">
              <span>
                <IconButton
                  size="small"
                  disabled={listLoading || !hasFilter()}
                  onClick={handleFiltersClear}>
                  <FilterListOffIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Clear Sorting">
              <span>
                <IconButton
                  size="small"
                  disabled={listLoading || !fetchProps.sorting}
                  onClick={handleSortingReset}>
                  <SortByAlphaIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Toolbar>
          <Table
            onRowClick={handleClick}
            loading={listLoading}
            sorting={fetchProps.sorting}
            cellFocused={handleCellFocused}
            onSortChange={handleSortChange}
            renderFilterPopup={renderFilterPopup}
            renderCell={renderCell}
            options={issues.data}
            keyProp="id"
            cellProps={cellProps}
            emptyText="No data is currently available!"
          />
        </Container>
      </div>
      <SpeedDial onDefaultAction={handleCreate} loading={listLoading || formLoading}>
        <SpeedDialAction
          icon={<AddIcon />}
          tooltipTitle="Create a New Issue"
          onClick={handleCreate}
        />
      </SpeedDial>
    </>
  )
}

export default IssueContainer
