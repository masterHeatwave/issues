/* eslint-disable react/display-name */
import { AlertColor } from '@mui/material'
import React from 'react'
import Snackbar, { SnackbarMessage, SnackbarOptions, SnackbarProps } from './Snackbar'

const withSnackbar =
  <P,>(WrappedComponent: React.ComponentType<P & SnackbarProps>) =>
  (props: P) => {
    const [messages, setMessages] = React.useState<SnackbarMessage[]>([])

    const addMessage = (payload: string, type: AlertColor, options: SnackbarOptions) => {
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
    }

    const alertMessage = {
      error: (message: string, options: SnackbarOptions) => addMessage(message, 'error', options),
      success: (message: string, options: SnackbarOptions) =>
        addMessage(message, 'success', options),
      info: (message: string, options: SnackbarOptions) => addMessage(message, 'info', options),
      warning: (message: string, options: SnackbarOptions) =>
        addMessage(message, 'warning', options)
    }

    const removeMessage = (messageId: unknown) => {
      const updatedMessages = messages.filter(
        (message: SnackbarMessage) => message.id !== messageId
      )
      setMessages(updatedMessages)
    }

    return (
      <>
        <WrappedComponent {...props} showInfo={alertMessage} />
        <div>
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
        </div>
      </>
    )
  }

withSnackbar.displayName = 'withSnackbar'

export default withSnackbar
