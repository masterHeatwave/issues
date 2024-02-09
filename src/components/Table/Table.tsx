/* eslint-disable @typescript-eslint/no-unused-vars */
import MoreVertIcon from '@mui/icons-material/MoreVert'
import {
  Box,
  Button,
  IconButton,
  Table as MuiTable,
  TableBody as MuiTableBody,
  TableCell as MuiTableCell,
  TableContainer as MuiTableContainer,
  TableHead as MuiTableHead,
  TableRow as MuiTableRow,
  Paper,
  TableSortLabel,
  Theme,
  useMediaQuery
} from '@mui/material'
import Popover from '@mui/material/Popover'
import { SxProps } from '@mui/system'
import { visuallyHidden } from '@mui/utils'
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state'
import React from 'react'
import { v5 as uuidv5 } from 'uuid'
import CellBase from './CellBase'
import { TFilterConfig } from './Filter/types'
import Row from './Row'
import { TableOrderDirection, TCellProp, TSorting } from './types'

interface ITable<T> {
  loading?: boolean
  keyProp?: string
  options: ReadonlyArray<T>
  selectedRows?: string[]
  collapsedRows?: string[]
  noHeader?: boolean
  noBorder?: boolean
  emptyText?: string
  onCollapse?: (id: unknown) => void
  onSelect?: (id: unknown, selected: boolean) => void
  onRowClick?: (id: unknown) => void
  onCellEvent?: (id: unknown, name: string) => void
  renderCollapsibleRow?: (option: T) => React.ReactNode
  renderCell?: (
    id: unknown,
    value: unknown,
    cellProp: TCellProp,
    parentObject: unknown,
    index: number
  ) => React.ReactNode
  cellProps: TCellProp[]
  renderFilterPopup?: (filter: TFilterConfig) => React.ReactNode
  onInputProps?: (id: unknown, prevProps: TCellProp) => TCellProp
  onChange?: (id: unknown, name: string, value: unknown) => void
  sorting?: TSorting
  onSortChange?: (id: string, direction: TableOrderDirection) => void
  cellFocused?: (cellProp: TCellProp) => boolean
}

const getId = (option: any, keyProp?: string): string => {
  let obj: any
  if (keyProp !== undefined) {
    const props = keyProp.split('.')
    props.forEach(prop => {
      if (obj === undefined) {
        obj = option[prop]
      } else {
        obj = obj[prop]
      }
    })
  }
  if (typeof obj === 'string' || typeof obj === 'number') return String(obj)
  return uuidv5(typeof option === 'object' ? JSON.stringify(option) : option, uuidv5.URL)
}

const Table = <T,>(props: ITable<T>) => {
  const {
    keyProp,
    options,
    selectedRows,
    collapsedRows,
    onCollapse,
    onSelect,
    onRowClick,
    onCellEvent,
    renderCollapsibleRow,
    renderCell,
    cellProps,
    onChange,
    onInputProps,
    renderFilterPopup,
    noHeader,
    noBorder,
    emptyText,
    onSortChange,
    sorting,
    loading,
    cellFocused
  } = props

  const [editable, setEditable] = React.useState(false)
  const handleEditableClick = () => {
    setEditable(!editable)
  }
  const handleCollapse = React.useCallback(
    (id: unknown) => () => {
      onCollapse?.(id)
    },
    []
  )
  const handleSortChange = (id: string) => () => {
    const direction =
      sorting?.id === id
        ? sorting?.direction === TableOrderDirection.DESCENDING
          ? TableOrderDirection.ASCENDING
          : TableOrderDirection.DESCENDING
        : TableOrderDirection.DESCENDING
    onSortChange?.(id, direction)
  }
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))
  const stickyProps = React.useMemo<SxProps<Theme> | undefined>(() => {
    if (isDesktop) {
      return {
        position: 'sticky',
        top: 48,
        zIndex: theme => theme.zIndex.mobileStepper + 2
      }
    }
  }, [isDesktop])
  const handleClick = (id: unknown) => (_event: React.MouseEvent<HTMLTableRowElement>) => {
    onRowClick?.(id)
  }
  return (
    <>
      {onChange && <Button onClick={handleEditableClick}>Edit</Button>}
      <Paper elevation={0} sx={{ pb: 10 }}>
        <MuiTableContainer
          sx={{
            overflowX: isDesktop ? 'initial' : undefined
          }}>
          <MuiTable stickyHeader={isDesktop} size="small">
            {!noHeader && (
              <MuiTableHead>
                <MuiTableRow sx={stickyProps}>
                  {!!renderCollapsibleRow && <MuiTableCell />}
                  {cellProps.map(cell => (
                    <MuiTableCell
                      sortDirection={
                        !cell.sortingId || sorting?.id !== cell.sortingId
                          ? false
                          : sorting?.direction === TableOrderDirection.DESCENDING
                          ? TableOrderDirection.DESCENDING
                          : TableOrderDirection.ASCENDING
                      }
                      align={cell.align}
                      sx={{
                        position: 'relative',
                        width: cell.width
                      }}
                      key={String(cell.name) ?? cell.id}>
                      {cell.sortingId ? (
                        <TableSortLabel
                          sx={{
                            mr: cell.filter ? 2 : undefined,
                            '&, > *': {
                              color: theme =>
                                cellFocused?.(cell)
                                  ? `${theme.palette.primary.main}!important`
                                  : undefined
                            }
                          }}
                          active={sorting?.id === cell.sortingId && !loading}
                          direction={
                            sorting?.id === cell.sortingId &&
                            sorting?.direction === TableOrderDirection.DESCENDING
                              ? TableOrderDirection.DESCENDING
                              : TableOrderDirection.ASCENDING
                          }
                          onClick={handleSortChange(cell.sortingId)}>
                          {cell.header}
                          {sorting?.id === cell.sortingId ? (
                            <Box component="span" sx={visuallyHidden}>
                              {sorting?.direction === TableOrderDirection.DESCENDING
                                ? 'sorted descending'
                                : 'sorted ascending'}
                            </Box>
                          ) : null}
                        </TableSortLabel>
                      ) : (
                        cell.header
                      )}
                      {!!cell.filter && (
                        <PopupState variant="popover" popupId={`${cell.filter.id}-popup-menu`}>
                          {popupState => (
                            <>
                              <IconButton
                                component="span"
                                sx={{
                                  m: 0,
                                  position: 'absolute',
                                  right: '0!important',
                                  top: '50%',
                                  transform: 'translateY(-50%)',
                                  color: theme =>
                                    cellFocused?.(cell) ? theme.palette.primary.main : undefined
                                }}
                                {...bindTrigger(popupState)}
                                size="small">
                                <MoreVertIcon fontSize="inherit" />
                              </IconButton>
                              <Popover
                                {...bindPopover(popupState)}
                                anchorOrigin={{
                                  vertical: 'bottom',
                                  horizontal: 'center'
                                }}
                                transformOrigin={{
                                  vertical: 'top',
                                  horizontal: 'center'
                                }}>
                                {renderFilterPopup?.(cell.filter!)}
                              </Popover>
                            </>
                          )}
                        </PopupState>
                      )}
                    </MuiTableCell>
                  ))}
                </MuiTableRow>
              </MuiTableHead>
            )}
            <MuiTableBody>
              {options.map((option, index) => {
                const id = getId(option, keyProp)
                return (
                  <Row
                    key={id}
                    onClick={handleClick(id)}
                    onCollapse={handleCollapse(id)}
                    colSpan={cellProps.length}
                    collapsed={collapsedRows?.includes(id)}
                    collapsibleRow={renderCollapsibleRow?.(option)}>
                    {cellProps.map(prop => {
                      const value = prop.name ? option[prop.name as keyof T] : undefined
                      if (editable && onInputProps) {
                        prop = onInputProps(id, prop)
                      }
                      return (
                        <CellBase
                          noBorder={noBorder}
                          editable={editable}
                          parentId={id}
                          onChange={onChange}
                          value={value}
                          cellProps={prop}
                          key={`${id}-${prop.name ?? prop.id ?? ''}`}>
                          {renderCell?.(id, value, prop, option, index)}
                        </CellBase>
                      )
                    })}
                  </Row>
                )
              })}
              {!options.length && (
                <Row>
                  <CellBase colSpan={cellProps.length}>{emptyText || '-'}</CellBase>
                </Row>
              )}
            </MuiTableBody>
          </MuiTable>
        </MuiTableContainer>
      </Paper>
    </>
  )
}

export default Table
