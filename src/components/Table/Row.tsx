import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import {
  Collapse,
  IconButton,
  TableCell as MuiTableCell,
  TableRow as MuiTableRow
} from '@mui/material'
import { Theme } from '@mui/material/styles'
import { SxProps } from '@mui/system'
import React from 'react'

interface IRow {
  children?: React.ReactNode
  collapsibleRow?: React.ReactNode
  colSpan?: number
  collapsed?: boolean
  onCollapse?: () => void
  onClick?: React.MouseEventHandler<HTMLTableRowElement>
}

const rowProps: SxProps<Theme> = {
  '&:nth-of-type(odd)': theme => ({
    backgroundColor: theme.palette.action.hover
  }),
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  }
}

const Row: React.FC<IRow> = ({
  children,
  collapsibleRow,
  colSpan,
  collapsed,
  onCollapse,
  onClick
}) => {
  return (
    <>
      <MuiTableRow
        onClick={onClick}
        hover
        sx={{ ...rowProps, cursor: onClick ? 'pointer' : undefined }}>
        {collapsibleRow && (
          <MuiTableCell sx={{ width: '20px', border: 'none' }}>
            <IconButton aria-label="expand row" size="small" onClick={onCollapse}>
              {collapsed ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </MuiTableCell>
        )}
        {children}
      </MuiTableRow>
      {collapsibleRow && (
        <MuiTableRow>
          <MuiTableCell colSpan={colSpan ? colSpan + (collapsibleRow ? 1 : 0) : undefined}>
            <Collapse in={collapsed} unmountOnExit>
              {collapsibleRow}
            </Collapse>
          </MuiTableCell>
        </MuiTableRow>
      )}
    </>
  )
}

export default React.memo(Row)
