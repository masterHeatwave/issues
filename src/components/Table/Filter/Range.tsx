import ClearIcon from '@mui/icons-material/Clear'
import { Box, IconButton, InputAdornment, TextField, Tooltip } from '@mui/material'
import React from 'react'

interface IRangeFilter {
  onChange?: (value: string[]) => void
  value?: string[]
}

const RangeFilter: React.FC<IRangeFilter> = ({ onChange, value }) => {
  const debouncedState = React.useRef<number | undefined>(undefined)
  const [_value, _setValue] = React.useState<string[]>(value ?? Array(2).fill(''))
  const handleChange =
    (field: 'from' | 'to') =>
    (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const { value } = event.target
      if (field === 'from') {
        _value.fill(!value ? '' : value)
      } else {
        _value[1] = !value ? '' : value
      }
      _setValue([..._value])
      clearTimeout(debouncedState.current)
      debouncedState.current = window.setTimeout(() => {
        onChange?.(_value)
      }, 500)
    }
  const handleClear = (field: 'from' | 'to') => () => {
    clearTimeout(debouncedState.current)
    if (field === 'from') {
      _value[0] = ''
    } else {
      _value[1] = ''
    }
    _setValue([..._value])
    onChange?.(_value)
  }
  React.useEffect(() => {
    if (value?.some((_, i) => _ !== _value[i])) {
      _setValue(value ?? Array(2).fill(''))
    }
  }, [value])

  return (
    <>
      <TextField
        label="From"
        onChange={handleChange('from')}
        value={_value[0] ?? ''}
        autoFocus
        size="small"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title="Clear">
                <Box component="span">
                  <IconButton
                    disabled={!_value[0]?.length}
                    size="small"
                    onClick={handleClear('from')}
                    edge="end">
                    <ClearIcon />
                  </IconButton>
                </Box>
              </Tooltip>
            </InputAdornment>
          )
        }}
        InputLabelProps={{
          shrink: true
        }}
      />
      <TextField
        label="To"
        onChange={handleChange('to')}
        value={_value[1] ?? ''}
        size="small"
        inputProps={{
          min: 1,
          type: 'number'
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title="Clear">
                <Box component="span">
                  <IconButton
                    disabled={!_value[1]?.length}
                    size="small"
                    onClick={handleClear('to')}
                    edge="end">
                    <ClearIcon />
                  </IconButton>
                </Box>
              </Tooltip>
            </InputAdornment>
          )
        }}
        InputLabelProps={{
          shrink: true
        }}
      />
    </>
  )
}

export default RangeFilter
