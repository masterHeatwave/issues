import { Theme } from '@mui/material/styles'
import { SxProps } from '@mui/system'

type Classes = {
  root: SxProps<Theme>
}

const classes: Classes = {
  root: {
    position: 'fixed',
    bottom: theme => theme.spacing(2),
    right: theme => theme.spacing(2),
    zIndex: theme => theme.zIndex.appBar + 3000
  }
}

export default classes
