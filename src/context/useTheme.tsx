import { useMediaQuery } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider as MuiThemeProvider, Theme } from '@mui/material/styles'
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import createTheme from 'src/context/actions/theme'
import config, { ThemeMode } from 'src/services/storage'

interface IState {
  children?: React.ReactNode
  themeMode: ThemeMode | null
  setThemeMode: (mode: ThemeMode) => void
}

const ThemeContext = createContext<IState>({} as IState)

export const ThemeProvider: React.FC<Partial<IState>> = ({ children }) => {
  const defaultMode = useMediaQuery('(prefers-color-scheme: dark)')
  const [themeMode, setMode] = useState<ThemeMode | null>(config.themeMode)
  const [theme, setTheme] = useState<Theme>(createTheme(themeMode, defaultMode))
  useEffect(() => {
    setTheme(createTheme(themeMode, defaultMode))
  }, [defaultMode, themeMode])
  const setThemeMode = (mode: ThemeMode) => {
    config.themeMode = mode
    config.save()
    setMode(mode)
  }
  const memoedValue = useMemo(() => ({ themeMode, setThemeMode }), [themeMode])
  return (
    <ThemeContext.Provider value={memoedValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  )
}

const useTheme = (): IState => {
  return useContext(ThemeContext)
}

export default useTheme
