import Button from '@mui/material/Button'
import Dialog, { DialogProps } from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import React, { ReactElement } from 'react'
import classes from './styles'

export type ConfirmDialogProps = {
  content: ReactElement | string
  defaultTitle?: string
  buttons?: ConfirmDialogButtons | false
  severity?: ConfirmDialogSeverity
  defaultAction: ConfirmDialogResult
  buttonCaptions?: ConfirmDialogButtonCaptions
  dialogProps?: Partial<DialogProps>
  cancelable?: boolean
  deleteAction?: ConfirmDialogResult
}

export enum ConfirmDialogButtons {
  OK,
  OKCancel,
  YesNoCancel,
  YesNo
}

export enum ConfirmDialogSeverity {
  Asterisk,
  Error,
  Exclamation,
  Hand,
  Information,
  None,
  Question,
  Stop,
  Warning
}

export enum ConfirmDialogResult {
  OK,
  Cancel,
  Yes,
  No
}

export interface IConfirmDialog {
  onOpen?: (open: boolean) => void
  onState?: (state: unknown) => void
  setDisabled?: (state: boolean) => void
  setEnabled?: (button: ConfirmDialogResult, enabled: boolean) => void
  setTitle?: (title: string) => void
  onAction?: (action: ConfirmDialogResult, state?: unknown) => void
  entered?: boolean
}

export type ConfirmDialogButtonCaptions = {
  [ConfirmDialogResult.OK]?: string
  [ConfirmDialogResult.Cancel]?: string
  [ConfirmDialogResult.Yes]?: string
  [ConfirmDialogResult.No]?: string
}

export type ConfirmDialogResponse = {
  result: ConfirmDialogResult | null
  state?: unknown
}

type IProps = {
  onClose?: (response: ConfirmDialogResponse) => void
} & ConfirmDialogProps

const ConfirmDialog: React.FC<IProps> = ({
  content,
  defaultTitle,
  buttons,
  defaultAction,
  deleteAction,
  onClose,
  cancelable,
  buttonCaptions,
  dialogProps
}) => {
  const [title, setTitle] = React.useState<string>(defaultTitle || '')
  const [open, setOpen] = React.useState(true)

  const [result, setResult] = React.useState<ConfirmDialogResponse>({
    result: defaultAction
  })

  const [loading, setLoading] = React.useState<boolean>(false)

  const [transitionEntered, setTransitionEntered] = React.useState<boolean>(false)

  const handleClick = (action: ConfirmDialogResult) => {
    setResult({
      ...result,
      result: action
    })
    setOpen(false)
  }

  const isCancelable = (): boolean => !loading && (cancelable === undefined || cancelable)

  const handleClose = () => {
    if (isCancelable()) {
      setOpen(false)
    }
  }

  const handleTransitionEnd = () => {
    onClose?.(result)
  }

  const handleTransitionEnter = () => {
    setTransitionEntered(true)
  }

  const handleContentStateChange = (state: unknown) => {
    setResult({
      ...result,
      state
    })
  }

  const [buttonProps, setButtonProps] = React.useState<Record<ConfirmDialogResult, boolean>>({
    [ConfirmDialogResult.Yes]: true,
    [ConfirmDialogResult.No]: true,
    [ConfirmDialogResult.Cancel]: true,
    [ConfirmDialogResult.OK]: true
  })

  const handleDisabled = (state: boolean) => {
    setLoading(state)
  }

  const handleEnabled = (button: ConfirmDialogResult, enabled: boolean) => {
    setButtonProps({
      ...buttonProps,
      [button]: enabled
    })
  }

  const handleTitleChange = (title: string) => setTitle(title)

  const contentWithProps =
    typeof content !== 'string'
      ? React.cloneElement(content, {
          onState: handleContentStateChange,
          entered: transitionEntered,
          setDisabled: handleDisabled,
          setEnabled: handleEnabled,
          setTitle: handleTitleChange,
          onAction: (action: ConfirmDialogResult, state?: unknown) => {
            setResult({
              ...result,
              result: action,
              state: state == null ? result.state : state
            })
            setOpen(false)
          }
        })
      : null

  const id = React.useMemo(() => Date.now(), [])

  return (
    <Dialog
      open={open}
      fullWidth
      scroll="body"
      maxWidth="sm"
      TransitionProps={{
        onExited: handleTransitionEnd,
        onEntered: handleTransitionEnter
      }}
      sx={classes.dialog}
      onClose={handleClose}
      aria-labelledby={`${id}-alert-dialog-title`}
      aria-describedby={`${id}-alert-dialog-description`}
      {...dialogProps}>
      {!!title.length && <DialogTitle id={`${id}-alert-dialog-title`}>{title}</DialogTitle>}
      <DialogContent>
        {!contentWithProps ? (
          <DialogContentText id={`${id}-alert-dialog-description`}>{content}</DialogContentText>
        ) : (
          contentWithProps
        )}
      </DialogContent>
      {buttons !== false && (
        <DialogActions>
          {(buttons === undefined ||
            buttons === ConfirmDialogButtons.OK ||
            buttons === ConfirmDialogButtons.OKCancel) && (
            <Button
              disabled={loading || !buttonProps[ConfirmDialogResult.OK]}
              onClick={() => handleClick(ConfirmDialogResult.OK)}
              autoFocus={defaultAction === ConfirmDialogResult.OK}>
              {(buttonCaptions && buttonCaptions[ConfirmDialogResult.OK]) || 'Ok'}
            </Button>
          )}
          {(buttons === ConfirmDialogButtons.YesNo ||
            buttons === ConfirmDialogButtons.YesNoCancel) && (
            <Button
              disabled={loading || !buttonProps[ConfirmDialogResult.Yes]}
              onClick={() => handleClick(ConfirmDialogResult.Yes)}
              autoFocus={defaultAction === ConfirmDialogResult.Yes}>
              {(buttonCaptions && buttonCaptions[ConfirmDialogResult.Yes]) || 'Yes'}
            </Button>
          )}
          {(buttons === ConfirmDialogButtons.YesNo ||
            buttons === ConfirmDialogButtons.YesNoCancel) && (
            <Button
              color={deleteAction === ConfirmDialogResult.No ? 'error' : undefined}
              disabled={loading || !buttonProps[ConfirmDialogResult.No]}
              onClick={() => handleClick(ConfirmDialogResult.No)}
              autoFocus={defaultAction === ConfirmDialogResult.No}>
              {(buttonCaptions && buttonCaptions[ConfirmDialogResult.No]) || 'No'}
            </Button>
          )}
          {(buttons === ConfirmDialogButtons.OKCancel ||
            buttons === ConfirmDialogButtons.YesNoCancel) && (
            <Button
              disabled={loading || !buttonProps[ConfirmDialogResult.Cancel]}
              onClick={() => handleClick(ConfirmDialogResult.Cancel)}
              autoFocus={defaultAction === ConfirmDialogResult.Cancel}>
              {(buttonCaptions && buttonCaptions[ConfirmDialogResult.Cancel]) || 'Cancel'}
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>
  )
}

export default ConfirmDialog
