import { TableCell as MuiTableCell } from '@mui/material'
import React from 'react'
import CellInput from './CellInput'
import CellStyled from './CellStyled'
import { TCellProp } from './types'

interface ICellBase {
  editable?: boolean
  children?: React.ReactNode
  cellProps?: TCellProp
  parentId?: unknown
  value?: unknown
  colSpan?: number
  noBorder?: boolean
  onChange?: (id: unknown, name: string, value: unknown) => void
}

const CellBase: React.FC<ICellBase> = ({
  children,
  value,
  cellProps,
  onChange,
  parentId,
  editable,
  noBorder,
  colSpan
}) => {
  let node: React.ReactNode

  switch (true) {
    case !cellProps:
      node = children
      break
    case editable && cellProps?.inputProps != null:
      node = (
        <CellInput
          cellProps={cellProps!}
          parentId={parentId}
          initialValue={value}
          onChange={onChange}
        />
      )
      break
    case React.isValidElement(children):
      node = children
      break
    default:
      node = <CellStyled value={children === undefined ? value : children} cellProps={cellProps!} />
      break
  }

  return (
    <MuiTableCell
      colSpan={colSpan}
      sx={{ width: cellProps?.width, border: noBorder ? 'none' : undefined }}
      align={cellProps?.align}>
      {node}
    </MuiTableCell>
  )
}

export default React.memo(CellBase)
