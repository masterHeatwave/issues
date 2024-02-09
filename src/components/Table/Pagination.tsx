import { Paper, TablePagination } from '@mui/material'
import React from 'react'

interface IPagination {
  pageNumber: number
  pageSize: number
  totalRecords: number
  loading?: boolean
  onPageChange?: (pageNumber: number) => void
  onPageSizeChange?: (rowsPerPage: number) => void
}

const Pagination: React.FC<IPagination> = ({
  onPageChange,
  onPageSizeChange,
  pageNumber,
  pageSize,
  totalRecords,
  loading
}) => {
  const handlePageChange = (_event: unknown, page: number) => onPageChange?.(page + 1)
  const handlePageSizeChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    onPageSizeChange?.(parseInt(event.target.value, 10))
  const pageContainer = React.useRef<HTMLElement>(null)
  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        bottom: 12,
        bgcolor: 'background.paper',
        zIndex: theme => theme.zIndex.speedDial,
        pr: 0,
        left: '50%',
        transform: 'translateX(-50%)'
      }}>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        width="auto"
        labelRowsPerPage="Rows"
        count={totalRecords}
        rowsPerPage={pageSize}
        page={pageNumber - 1}
        onPageChange={handlePageChange}
        nextIconButtonProps={{
          disabled: loading || pageNumber >= Math.ceil(totalRecords / pageSize)
        }}
        backIconButtonProps={{
          disabled: pageNumber < 2 || loading
        }}
        onRowsPerPageChange={handlePageSizeChange}
        sx={{ display: 'flex' }}
        ref={pageContainer}
      />
    </Paper>
  )
}

export default Pagination
