import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import { Box } from '@mui/system'
import React from 'react'

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5)
}))

type TFilter = {
  id: string
  value?: string
  label: string
}

interface IFilterArray {
  filters: TFilter[]
  onDelete?: (filterId: string, value?: string) => () => void
}

const FilterArray: React.FC<IFilterArray> = ({ filters, onDelete }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'start',
        flexWrap: 'wrap',
        listStyle: 'none',
        p: 0.5,
        m: 0
      }}
      component="ul">
      {filters.map(filter => {
        return (
          <ListItem key={`${filter.id}:${filter.value ?? ''}`}>
            <Chip
              size="small"
              label={filter.label}
              onDelete={onDelete?.(filter.id, filter.value)}
            />
          </ListItem>
        )
      })}
    </Box>
  )
}

export default FilterArray
