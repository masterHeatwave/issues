import { createTheme } from '@mui/material/styles'
import { ThemeMode } from 'src/services/storage'

const createAppTheme = (mode: ThemeMode | null, prefersDarkMode: boolean) =>
  createTheme({
    palette: {
      mode:
        mode === ThemeMode.DARK || (mode === ThemeMode.AUTO && prefersDarkMode) ? 'dark' : 'light'
    }
  })

export default createAppTheme
