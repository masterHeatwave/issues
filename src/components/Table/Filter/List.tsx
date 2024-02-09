import FilterListOffIcon from '@mui/icons-material/FilterListOff'
import { Box, IconButton, ListSubheader, Tooltip } from '@mui/material'
import Checkbox from '@mui/material/Checkbox'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import React from 'react'
import { TFilterOptions } from 'src/components/Table/Filter/types'

interface IListFilter {
  list?: TFilterOptions
  value?: string[]
  onToggle?: (key: string) => void
  onClear?: () => void
}

const ListFilter: React.FC<IListFilter> = ({ list, value, onToggle, onClear }) => {
  const handleToggle = (key: string) => () => {
    onToggle?.(key)
  }
  return (
    <List
      component="div"
      role="list"
      dense
      sx={{ width: '100%', bgcolor: 'background.paper' }}
      subheader={
        <ListSubheader
          sx={{
            display: 'flex',
            flexWrap: 'nowrap',
            alignItems: 'center'
          }}
          component="div">
          <Box component="div" sx={{ mr: 3 }}>
            {list?.header ?? ''}
          </Box>
          <Tooltip title="Clear List">
            <Box component="div" sx={{ ml: 'auto' }}>
              <IconButton
                color="primary"
                onClick={onClear}
                disabled={!list?.options.some(option => value?.includes(option.key))}
                size="small">
                <FilterListOffIcon fontSize="inherit" />
              </IconButton>
            </Box>
          </Tooltip>
        </ListSubheader>
      }>
      {list?.options?.map(option => {
        const labelId = `checkbox-list-label-${option.key}`
        return (
          <ListItem role="listitem" button onClick={handleToggle(option.key)} key={option.key}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={value?.includes(option.key) ?? false}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': labelId }}
              />
            </ListItemIcon>
            <ListItemText id={labelId} primary={`${option.value}`} />
          </ListItem>
        )
      }) ?? null}
    </List>
  )
}

export default ListFilter
