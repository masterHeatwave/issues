import CloseIcon from '@mui/icons-material/Close'
import { Alert, Button, CircularProgress } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Snackbar from '@mui/material/Snackbar'
import React from 'react'

interface IState {
  setLoading: (loading: boolean) => void
  showError: (message?: string) => void
}

const SnackbarContext = React.createContext<IState>({} as IState)

interface ISnackbarProvider {
  children?: React.ReactNode
}

const SnackbarProvider: React.FC<Partial<ISnackbarProvider>> = ({ children }) => {
  const [loading, _setLoading] = React.useState<boolean>(false)
  const [message, setMessage] = React.useState<string>('')
  const [open, setOpen] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (!message.length) {
      return
    }
    setOpen(true)
  }, [message])

  const handleTransitionEnd = () => {
    setMessage('')
  }

  const showError = (message?: string) => {
    setMessage(message || 'An unknown error occurred!')
  }

  const setLoading = (loading: boolean) => {
    _setLoading(loading)
  }

  const memoedValue = React.useMemo(
    () => ({
      setLoading,
      showError
    }),
    [loading, message]
  )

  const handleClose = () => setOpen(false)

  return (
    <SnackbarContext.Provider value={memoedValue}>
      <>
        <Snackbar
          open={loading}
          onClose={() => undefined}
          message="Please wait..."
          action={
            <Button>
              <CircularProgress
                sx={{
                  color: theme =>
                    theme.palette.mode === 'light'
                      ? theme.palette.secondary.light
                      : theme.palette.secondary.dark
                }}
                size={20}
              />
            </Button>
          }
        />
        <Snackbar
          open={open}
          onClose={handleClose}
          TransitionProps={{
            onExited: handleTransitionEnd
          }}
          action={
            <IconButton aria-label="close" color="inherit" sx={{ p: 0.5 }} onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          }>
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            {message}
          </Alert>
        </Snackbar>
        {children}
      </>
    </SnackbarContext.Provider>
  )
}

export { SnackbarProvider }

const useSnackbar = () => React.useContext(SnackbarContext)

export default useSnackbar
