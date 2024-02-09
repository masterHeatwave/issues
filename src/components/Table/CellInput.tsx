import { FormControl, TextField, TextFieldProps } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { format, parse } from 'date-fns'
import React from 'react'
import { TCellProp } from './types'

const defaultInputProps: TextFieldProps = {
  size: 'small',
  InputLabelProps: {
    shrink: true
  },
  autoCapitalize: 'on',
  spellCheck: true,
  autoCorrect: 'on',
  autoComplete: 'off',
  multiline: true,
  minRows: 1
}

interface ICellInput {
  initialValue?: unknown
  parentId: unknown
  cellProps: TCellProp
  onChange?: (id: unknown, name: string, value: unknown) => void
}

const withDate = (value: unknown) => {
  return !value ? null : parse(String(value).split('.')[0], "yyyy-MM-dd'T'HH:mm:ss", new Date())
}

const CellInput: React.FC<ICellInput> = ({ initialValue, onChange, parentId, cellProps }) => {
  const inputName = String(cellProps.name ?? cellProps.id)

  const [value, setValue] = React.useState<unknown>(initialValue)

  const handleTextChange = (obj: unknown) => {
    if (cellProps.date) {
      const value = obj as Date | null
      setValue(!value ? value : format(value, "yyyy-MM-dd'T'HH:mm:ss"))
    } else {
      const event = obj as React.ChangeEvent<HTMLTextAreaElement>
      setValue(event.currentTarget.value)
    }
  }
  React.useEffect(() => {
    const handle = setTimeout(
      () => onChange && value !== initialValue && onChange(parentId, inputName, value),
      500
    )
    return () => {
      clearTimeout(handle)
    }
  }, [value])

  React.useEffect(() => {
    if (value === initialValue) {
      return
    }
    setValue(initialValue)
  }, [initialValue])
  return (
    <FormControl fullWidth>
      {cellProps.date ? (
        <DatePicker
          onChange={handleTextChange}
          renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => {
            return <TextField {...params} name={inputName} size={defaultInputProps.size} />
          }}
          value={withDate(value)}
          inputFormat="dd/MM/yyyy"
          maxDate={cellProps.maxDate ? withDate(cellProps.maxDate) : undefined}
          minDate={cellProps.minDate ? withDate(cellProps.minDate) : undefined}
        />
      ) : (
        <TextField
          {...defaultInputProps}
          name={inputName}
          type={cellProps.inputProps?.type}
          label={cellProps.inputProps?.label}
          value={value}
          onChange={handleTextChange}
        />
      )}
    </FormControl>
  )
}

export default React.memo(CellInput)
