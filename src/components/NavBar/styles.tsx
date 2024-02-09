import { styled, Theme } from '@mui/material/styles'
import { SxProps } from '@mui/system'

export const Root = styled('div')(() => ({
  flexGrow: 1
}))

const classes: {
  appBar: SxProps<Theme>
  menuButton: SxProps<Theme>
  title: SxProps<Theme>
  popover: SxProps<Theme>
} = {
  appBar: {},
  menuButton: {
    mr: 2
  },
  title: {
    flexGrow: 1
  },
  popover: {
    width: '100%',
    maxWidth: 360
  }
}

export default classes
