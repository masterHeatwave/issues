import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { Box, Fab, useScrollTrigger, Zoom } from '@mui/material'
import React from 'react'
import classes from './styles'

interface IProps {
  node?: Element
  onClick: () => void
}

const ScrollTop: React.FC<IProps> = ({ node, onClick }) => {
  const trigger = useScrollTrigger({
    target: node || undefined,
    disableHysteresis: true,
    threshold: 100
  })
  return (
    <Zoom in={trigger}>
      <Box sx={{ ...classes.root }} component="div" onClick={onClick} role="presentation">
        <Fab color="secondary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </Box>
    </Zoom>
  )
}

export default ScrollTop
