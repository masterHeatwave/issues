import { Typography } from '@mui/material'
import React from 'react'

const Copyright: React.FC = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © Ionia Management '}
      {new Date().getFullYear()}
    </Typography>
  )
}

export default Copyright
