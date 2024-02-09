import { AlertColor } from '@mui/material'
import React from 'react'
import ConfirmDialog, {
  ConfirmDialogButtons,
  ConfirmDialogProps,
  ConfirmDialogResponse,
  ConfirmDialogResult
} from 'src/components/ConfirmDialog/ConfirmDialog'
import Snackbar, {
  SnackbarMessage,
  SnackbarOptions,
  SnackbarSeverityProps
} from 'src/components/Snackbar/Snackbar'

interface IState {
  showDialog: (props: ConfirmDialogProps) => Promise<ConfirmDialogResponse>
  showInputDialog: (props: ConfirmDialogProps) => Promise<ConfirmDialogResponse>
  showInfo: SnackbarSeverityProps
  ask: (message: string, cancelable?: boolean) => Promise<boolean | null>
}

const DialogContext = React.createContext<IState>({} as IState)

interface IDialogProvider {
  children?: React.ReactNode
}

const DialogProvider: React.FC<Partial<IDialogProvider>> = ({ children }) => {
  const [messages, setMessages] = React.useState<SnackbarMessage[]>([])
  const addMessage = React.useCallback(
    (payload: string, type: AlertColor, options: SnackbarOptions) => {
      setMessages([
        {
          payload,
          type,
          id: Date.now(),
          timeout: options?.timeout == null ? 6000 : options.timeout,
          anchorOrigin:
            options?.anchorOrigin == null
              ? {
                  vertical: 'bottom',
                  horizontal: 'left'
                }
              : options.anchorOrigin
        },
        ...messages
      ])
    },
    [messages]
  )
  const showInfo = {
    error: (message: string, options: SnackbarOptions) => addMessage(message, 'error', options),
    success: (message: string, options: SnackbarOptions) => addMessage(message, 'success', options),
    info: (message: string, options: SnackbarOptions) => addMessage(message, 'info', options),
    warning: (message: string, options: SnackbarOptions) => addMessage(message, 'warning', options)
  }
  const removeMessage = (messageId: unknown) => {
    const updatedMessages = messages.filter((message: SnackbarMessage) => message.id !== messageId)
    setMessages(updatedMessages)
  }
  const [confirmationDialog, setConfirmationDialog] = React.useState<ConfirmDialogProps | null>(
    null
  )
  const [inputDialog, setInputDialog] = React.useState<ConfirmDialogProps | null>(null)
  const [customDialog, setCustomDialog] = React.useState<ConfirmDialogProps | null>(null)
  const awaitCustomDialog = React.useRef<{
    resolve: (response: ConfirmDialogResponse) => void
    reject: () => void
  } | null>(null)
  const awaitConfirmDialog = React.useRef<{
    resolve: (response: ConfirmDialogResponse) => void
    reject: () => void
  } | null>(null)
  const awaitInputDialog = React.useRef<{
    resolve: (response: ConfirmDialogResponse) => void
    reject: () => void
  } | null>(null)
  const showDialog = (dialogProps: ConfirmDialogProps): Promise<ConfirmDialogResponse> => {
    setCustomDialog(dialogProps)
    return new Promise((resolve, reject) => {
      awaitCustomDialog.current = {
        resolve,
        reject
      }
    })
  }
  const showConfirmationDialog = (
    dialogProps: ConfirmDialogProps
  ): Promise<ConfirmDialogResponse> => {
    setConfirmationDialog(dialogProps)
    return new Promise((resolve, reject) => {
      awaitConfirmDialog.current = {
        resolve,
        reject
      }
    })
  }
  const ask = async (message: string, cancelable = false): Promise<boolean | null> => {
    const { result } = await showConfirmationDialog({
      content: message,
      buttons: cancelable ? ConfirmDialogButtons.YesNoCancel : ConfirmDialogButtons.YesNo,
      defaultAction: cancelable ? ConfirmDialogResult.Cancel : ConfirmDialogResult.No,
      cancelable: true
    })
    if (result === ConfirmDialogResult.Cancel) return null
    return result === ConfirmDialogResult.Yes
  }
  const showInputDialog = (dialogProps: ConfirmDialogProps): Promise<ConfirmDialogResponse> => {
    setInputDialog(dialogProps)
    return new Promise((resolve, reject) => {
      awaitInputDialog.current = {
        resolve,
        reject
      }
    })
  }
  const handleClose = (target: string) => (response: ConfirmDialogResponse) => {
    if (target === 'input') {
      setInputDialog(null)
      if (awaitInputDialog.current) awaitInputDialog.current.resolve(response)
      awaitInputDialog.current = null
    } else if (target === 'confirm') {
      setConfirmationDialog(null)
      if (awaitConfirmDialog.current) awaitConfirmDialog.current.resolve(response)
      awaitConfirmDialog.current = null
    } else if (target === 'custom') {
      setCustomDialog(null)
      if (awaitCustomDialog.current) awaitCustomDialog.current.resolve(response)
      awaitCustomDialog.current = null
    }
  }
  const memoedValue = React.useMemo(
    () => ({
      showInfo,
      showDialog,
      showInputDialog,
      ask
    }),
    []
  )
  return (
    <DialogContext.Provider value={memoedValue}>
      <>
        {messages.map(({ payload, type, id, timeout, anchorOrigin }) => (
          <Snackbar
            key={String(id)}
            message={payload}
            anchorOrigin={anchorOrigin}
            severity={type}
            timeout={timeout}
            handleOnClose={() => removeMessage(id)}
          />
        ))}
        {customDialog && <ConfirmDialog {...customDialog} onClose={handleClose('custom')} />}
        {inputDialog && <ConfirmDialog {...inputDialog} onClose={handleClose('input')} />}
        {confirmationDialog && (
          <ConfirmDialog {...confirmationDialog} onClose={handleClose('confirm')} />
        )}
        {children}
      </>
    </DialogContext.Provider>
  )
}
export { DialogProvider }
const useDialogs = () => React.useContext(DialogContext)
export default useDialogs
