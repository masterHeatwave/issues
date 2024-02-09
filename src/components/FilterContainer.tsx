/* eslint-disable react/prop-types */
import { Box, FormControl, Paper, Stack } from '@mui/material'
import React from 'react'
import DateFilter from 'src/components/Table/Filter/Date'
import ListFilter from 'src/components/Table/Filter/List'
import RangeFilter from 'src/components/Table/Filter/Range'
import TextFilter from 'src/components/Table/Filter/Text'
import { TFilterOptions, TFilterType } from 'src/components/Table/Filter/types'

interface IFilterContainer {
  list?: TFilterOptions
  value?: string | string[]
  onFilterChange?: (value: string | string[]) => void
  type: TFilterType
}

const FilterContainer: React.FC<IFilterContainer> = ({ list, value, onFilterChange, type }) => {
  const handleTextChange = (value: string) => {
    onFilterChange?.(value.trim())
  }
  const handleClear = () => onFilterChange?.([])
  const handleToggleOption = (key: string) => {
    if (!Array.isArray(value)) {
      onFilterChange?.([key])
      return
    }
    if (value.some(_ => key === _)) {
      value = value.filter(_ => key !== _)
    } else {
      value = [...value, key]
    }
    onFilterChange?.(value)
  }
  const handleRangeChange = (value: string[]) => {
    value = value.map(value => value.trim())
    if (!value.filter(length => length).length) {
      value = []
    }
    onFilterChange?.(value)
  }
  const preventSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => e.preventDefault(),
    []
  )

  if (type === 'string') {
    return (
      <Paper>
        <Box component="form" noValidate onSubmit={preventSubmit}>
          <FormControl fullWidth sx={{ p: 2, maxWidth: 500 }}>
            <TextFilter onChange={handleTextChange} value={value as string | undefined} />
          </FormControl>
        </Box>
      </Paper>
    )
  }
  if (type === 'dateRange') {
    return (
      <Paper>
        <Box component="form" noValidate onSubmit={preventSubmit}>
          <Stack sx={{ p: 2 }} spacing={2}>
            <DateFilter onChange={handleRangeChange} value={value as string[] | undefined} />
          </Stack>
        </Box>
      </Paper>
    )
  }
  if (type === 'range') {
    return (
      <Paper>
        <Box component="form" noValidate onSubmit={preventSubmit}>
          <Stack sx={{ p: 2 }} spacing={2}>
            <RangeFilter onChange={handleRangeChange} value={value as string[] | undefined} />
          </Stack>
        </Box>
      </Paper>
    )
  }
  if (type === 'list') {
    return (
      <Paper>
        <Box component="form" noValidate onSubmit={preventSubmit}>
          <FormControl fullWidth sx={{ p: 0, maxWidth: 500 }}>
            <ListFilter
              onClear={handleClear}
              list={list}
              onToggle={handleToggleOption}
              value={value as string[] | undefined}
            />
          </FormControl>
        </Box>
      </Paper>
    )
  }

  return null
}

export default FilterContainer
