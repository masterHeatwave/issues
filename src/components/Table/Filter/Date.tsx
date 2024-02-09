import ClearIcon from '@mui/icons-material/Clear'
import { IconButton, InputAdornment, TextField, TextFieldProps, Tooltip } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { format, isValid, parse } from 'date-fns'
import React from 'react'

interface IDateFilter {
  onChange?: (value: string[]) => void
  value?: string[]
}

const formatDate = (value: Date | null): string | false => {
  if (value === null) return ''
  if (isValid(value) && value.getFullYear() >= 1000) {
    return format(value, 'yyyy-MM-dd')
  }
  return false
}
const parseDate = (value: string) => {
  const dateValue = parse(value.split("'T'")[0], 'yyyy-MM-dd', new Date())
  if (isValid(dateValue)) {
    return dateValue
  }
  return null
}

const DateFilter: React.FC<IDateFilter> = ({ onChange, value }) => {
  const debouncedState = React.useRef<number | undefined>(undefined)
  const [_value, _setValue] = React.useState<string[]>(value ?? Array(2).fill(''))
  const handleChange = (field: 'from' | 'to') => (value: Date | null) => {
    if (field === 'from') {
      const newDate = formatDate(value)
      if (newDate === false) return
      _value.fill(newDate)
    } else {
      const newDate = formatDate(value)
      if (newDate === false) return
      _value[1] = newDate
    }
    _setValue([..._value])
    clearTimeout(debouncedState.current)
    debouncedState.current = window.setTimeout(() => {
      onChange?.(_value)
    }, 500)
  }

  React.useEffect(() => {
    if (value?.some((_, i) => _ !== _value[i])) {
      _setValue(value ?? Array(2).fill(''))
    }
  }, [value])

  return (
    <>
      <DatePicker
        label="From"
        autoFocus
        onChange={handleChange('from')}
        renderInput={(params: TextFieldProps) => {
          const { InputProps, ...restParams } = params
          const { endAdornment, ...restProps } = InputProps!
          return (
            <TextField
              {...restParams}
              InputProps={{
                ...restProps,
                endAdornment: (
                  <>
                    <InputAdornment position="end">
                      <Tooltip title="Clear">
                        <span>
                          <IconButton
                            edge="end"
                            disabled={!_value[0]?.length}
                            onClick={() => handleChange('from')(null)}>
                            <ClearIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </InputAdornment>
                    {endAdornment}
                  </>
                )
              }}
              size="small"
            />
          )
        }}
        value={parseDate(_value[0])}
        inputFormat="dd/MM/yyyy"
      />
      <DatePicker
        label="To"
        onChange={handleChange('to')}
        renderInput={(params: TextFieldProps) => {
          const { InputProps, ...restParams } = params
          const { endAdornment, ...restProps } = InputProps!
          return (
            <TextField
              {...restParams}
              InputProps={{
                ...restProps,
                endAdornment: (
                  <>
                    <InputAdornment position="end">
                      <Tooltip title="Clear">
                        <span>
                          <IconButton
                            edge="end"
                            disabled={!_value[1]?.length}
                            onClick={() => handleChange('to')(null)}>
                            <ClearIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </InputAdornment>
                    {endAdornment}
                  </>
                )
              }}
              size="small"
            />
          )
        }}
        value={parseDate(_value[1])}
        inputFormat="dd/MM/yyyy"
      />
    </>
  )
}

export default DateFilter
