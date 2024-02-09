import ClearIcon from '@mui/icons-material/Clear'
import { Box, IconButton, InputAdornment, TextField, Tooltip } from '@mui/material'
import React from 'react'

interface ITextFilter {
  onChange?: (value: string) => void
  value?: string
}

const TextFilter: React.FC<ITextFilter> = ({ onChange, value }) => {
  const debouncedState = React.useRef<number | undefined>(undefined)
  const [_value, _setValue] = React.useState<string>(value ?? '')

  const handleClear = () => {
    clearTimeout(debouncedState.current)
    _setValue('')
    onChange?.('')
  }

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    _setValue(event.target.value)
    clearTimeout(debouncedState.current)
    debouncedState.current = window.setTimeout(() => {
      onChange?.(event.target.value)
    }, 500)
  }

  React.useEffect(() => {
    if (value === _value) return
    _setValue(value ?? '')
  }, [value])

  return (
    <TextField
      label="Filter by text..."
      onChange={handleChange}
      value={_value}
      autoFocus
      size="small"
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Tooltip title="Clear">
              <Box component="span">
                <IconButton
                  disabled={!_value?.length}
                  size="small"
                  onClick={handleClear}
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
  )
}

export default TextFilter
