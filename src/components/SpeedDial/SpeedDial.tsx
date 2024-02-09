import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { SpeedDialAction, useScrollTrigger } from '@mui/material/'
import CircularProgress from '@mui/material/CircularProgress'
import { green } from '@mui/material/colors'
import MuiSpeedDial from '@mui/material/SpeedDial'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'
import { Theme } from '@mui/material/styles'
import { SxProps } from '@mui/system'
import React from 'react'

interface ISpeedDial {
  children?: React.ReactNode
  loading?: boolean
  error?: boolean
  onDefaultAction?: () => void
  defaultIcon?: React.ReactNode
}
const sxProps: SxProps<Theme> = { position: 'fixed', bottom: 16, right: 24 }
const SpeedDial: React.FC<ISpeedDial> = ({
  loading,
  error,
  children,
  onDefaultAction,
  defaultIcon
}) => {
  const scrollTrigger = useScrollTrigger({
    target: window,
    disableHysteresis: true,
    threshold: 100
  })
  const handleScrollTop = () => {
    window.scroll({ top: 0, behavior: 'smooth' })
  }
  const handleClick = (e: any, reason: string) => {
    if (reason === 'toggle') {
      onDefaultAction?.()
    }
  }
  return (
    <>
      <MuiSpeedDial
        onClose={handleClick}
        ariaLabel="form speedial"
        sx={{ ...sxProps }}
        FabProps={{
          color: error ? 'error' : 'secondary'
        }}
        icon={defaultIcon || <SpeedDialIcon />}>
        <SpeedDialAction
          icon={<KeyboardArrowUpIcon />}
          tooltipTitle="Scroll back to top"
          onClick={handleScrollTop}
          FabProps={{
            disabled: !scrollTrigger
          }}
        />
        {children}
      </MuiSpeedDial>
      {loading ? (
        <CircularProgress
          size={68}
          sx={{
            ...sxProps,
            bottom: (sxProps.bottom as number) - 6,
            right: (sxProps.right as number) - 6,
            color: green[500],
            zIndex: 1
          }}
        />
      ) : null}
    </>
  )
}

export default SpeedDial
