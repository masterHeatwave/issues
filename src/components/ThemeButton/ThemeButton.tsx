import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness5Icon from '@mui/icons-material/Brightness5'
import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto'
import { Tooltip } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import React from 'react'
import useTheme from 'src/context/useTheme'
import { ThemeMode } from 'src/services/storage'

const ThemeButton: React.FC = () => {
  const { themeMode, setThemeMode } = useTheme()

  const getThemeModeTitle = (): string => {
    switch (themeMode) {
      case ThemeMode.AUTO:
        return 'Theme Auto'
      case ThemeMode.DARK:
        return 'Theme Dark'
      default:
        return 'Theme Light'
    }
  }

  const getThemeModeButton = () => {
    switch (themeMode) {
      case ThemeMode.AUTO:
        return <BrightnessAutoIcon />
      case ThemeMode.DARK:
        return <Brightness4Icon />
      default:
        return <Brightness5Icon />
    }
  }

  const handleThemeMode = (): void => {
    switch (themeMode) {
      case ThemeMode.AUTO:
        setThemeMode(ThemeMode.LIGHT)
        break
      case ThemeMode.DARK:
        setThemeMode(ThemeMode.AUTO)
        break
      case ThemeMode.LIGHT:
        setThemeMode(ThemeMode.DARK)
        break
      default:
        setThemeMode(ThemeMode.AUTO)
        break
    }
  }
  return (
    <Tooltip title={getThemeModeTitle()} aria-label="theme-mode">
      <IconButton onClick={handleThemeMode} aria-label="View Mode" color="inherit">
        {getThemeModeButton()}
      </IconButton>
    </Tooltip>
  )
}

export default ThemeButton
