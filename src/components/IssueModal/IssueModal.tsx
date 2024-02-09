/* eslint-disable no-case-declarations */
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import {
  AppBar,
  Box,
  Container,
  Dialog,
  DialogContent,
  IconButton,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material'
import React from 'react'

interface IIssueModal {
  readOnly?: boolean
  onTransitionExited?: () => void
  onTransitionExit?: () => void
  children?: React.ReactNode
  open?: boolean
  onClose?: () => void
  onEvent?: () => void
  title?: string
}

const IssueModal: React.FC<IIssueModal> = ({
  onTransitionExited,
  onTransitionExit,
  children,
  open,
  onClose,
  title,
  onEvent,
  readOnly
}) => {
  const dialogRef = React.useRef<HTMLElement | null>(null)
  const handleTransitionExited = () => {
    onTransitionExited?.()
  }
  const handleTransitionExit = () => {
    onTransitionExit?.()
  }
  const [container, setContainer] = React.useState<HTMLDivElement | undefined | null>(null)
  const handleTransitionEntered = () => {
    setContainer(dialogRef.current?.querySelector<HTMLDivElement>('div.MuiDialogContent-root'))
  }
  // React.useEffect(() => {
  //   setOpen(issue !== null)
  // }, [issue])
  // const cellProps = React.useRef(getTableHeadCells())
  const handleScrollTop = () => {
    if (!dialogRef.current) {
      return
    }
    const elem = dialogRef.current.querySelector<HTMLDivElement>('div.MuiDialogContent-root')
    elem?.scroll({ top: 0, behavior: 'smooth' })
  }
  return (
    <Box>
      <Dialog
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ref={dialogRef}
        disableEscapeKeyDown
        fullScreen
        open={!!open}
        TransitionProps={{
          onEntered: handleTransitionEntered,
          onExited: handleTransitionExited,
          onExit: handleTransitionExit
        }}
        TransitionComponent={undefined}>
        <AppBar component="div" enableColorOnDark elevation={0} position="sticky">
          <Toolbar>
            <Tooltip title="Close">
              <IconButton
                edge="start"
                sx={{ mr: 2 }}
                color="inherit"
                onClick={onClose}
                aria-label="close">
                <CloseIcon />
              </IconButton>
            </Tooltip>
            <Typography variant="h6">{title ?? ''}</Typography>
            {!readOnly && (
              <Tooltip title="Edit">
                <IconButton sx={{ ml: 'auto' }} color="inherit" onClick={onEvent} aria-label="edit">
                  <EditIcon />
                </IconButton>
              </Tooltip>
            )}
          </Toolbar>
        </AppBar>
        <DialogContent sx={{ px: 0 }} dividers>
          <Container maxWidth="xl" sx={{ py: 3 }}>
            {children}
          </Container>
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default IssueModal
