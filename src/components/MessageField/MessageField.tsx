import SendIcon from '@mui/icons-material/Send'
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip
} from '@mui/material'
import React from 'react'

interface IMessageField {
  loading?: boolean
  defaultValue: string
  onChange: (value: string) => void
  onSubmit: () => Promise<void>
}

const MessageField: React.FC<IMessageField> = ({ loading, defaultValue, onChange, onSubmit }) => {
  const [value, setValue] = React.useState<string>(defaultValue)
  const debouncedState = React.useRef<number | undefined>(undefined)
  React.useEffect(() => {
    if (value === defaultValue) {
      return
    }
    setValue(defaultValue)
  }, [defaultValue])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setValue(e.currentTarget.value)

  React.useEffect(() => {
    clearTimeout(debouncedState.current)
    debouncedState.current = window.setTimeout(() => onChange(value), 500)
    return () => {
      clearTimeout(debouncedState.current)
    }
  }, [value])
  return (
    <TextField
      InputLabelProps={{ shrink: undefined }}
      InputProps={{
        endAdornment: (
          <InputAdornment sx={{ alignSelf: 'flex-end', mb: 2, mr: 1 }} position="end">
            <Tooltip title="Send">
              <Box component="span">
                <IconButton
                  color="primary"
                  disabled={loading || !value}
                  onClick={onSubmit}
                  edge="end">
                  <SendIcon />
                </IconButton>
                {loading && (
                  <CircularProgress
                    size={24}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginTop: '-12px',
                      marginLeft: '-12px'
                    }}
                  />
                )}
              </Box>
            </Tooltip>
          </InputAdornment>
        )
      }}
      sx={{ my: 1, py: 0 }}
      multiline
      minRows={4}
      onChange={handleChange}
      value={value}
      label="Write something..."
    />
  )
}

export default React.memo(MessageField)
