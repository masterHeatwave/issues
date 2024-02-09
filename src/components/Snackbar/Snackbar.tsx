import { Alert, AlertColor, Snackbar as MuiSnackbar, SnackbarOrigin } from '@mui/material'
import React from 'react'

export type SnackbarOptions =
  | {
      timeout?: number
      anchorOrigin?: SnackbarOrigin
    }
  | undefined

export type SnackbarMessage = {
  payload: string
  type: AlertColor
  id: unknown
  timeout: number
  anchorOrigin: SnackbarOrigin
}

export type SnackbarSeverityProps = {
  error: (message: string, options?: SnackbarOptions) => void
  success: (message: string, options?: SnackbarOptions) => void
  info: (message: string, options?: SnackbarOptions) => void
  warning: (message: string, options?: SnackbarOptions) => void
}

export type SnackbarProps = {
  showInfo: SnackbarSeverityProps
}

type IProps = {
  anchorOrigin?: SnackbarOrigin
  message: string
  severity?: AlertColor
  handleOnClose: (messageId: unknown) => void
  timeout?: number
}

const Snackbar: React.FC<IProps> = ({
  anchorOrigin,
  message,
  severity,
  handleOnClose,
  timeout
}) => {
  const [timer, setTimer] = React.useState<number | undefined>(undefined)

  React.useEffect(() => {
    if (timeout && !Number.isNaN(timeout)) setTimer(window.setTimeout(handleOnClose, timeout))
    return () => {
      if (timer) window.clearTimeout(timer)
    }
  }, [])

  return (
    <MuiSnackbar open anchorOrigin={anchorOrigin} onClose={() => handleOnClose}>
      <Alert variant="filled" onClose={handleOnClose} severity={severity}>
        {message}
      </Alert>
    </MuiSnackbar>
  )
}

export default Snackbar
