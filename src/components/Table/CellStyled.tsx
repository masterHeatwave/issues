import React from 'react'
import { formatDate, formatDateTime } from 'src/helpers'
import { TCellProp } from './types'

interface ICellStyled {
  value: unknown
  cellProps: TCellProp
}

const CellStyled: React.FC<ICellStyled> = ({ value, cellProps }) => {
  if (cellProps.date || cellProps.dateTime) {
    return <span>{(cellProps.dateTime ? formatDateTime(value) : formatDate(value)) ?? '-'}</span>
  }
  return <span>{String(value)}</span>
}

export default React.memo(CellStyled)
