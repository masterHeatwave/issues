import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import MenuIcon from '@mui/icons-material/Menu'
import { Badge, Box, Divider, Popover, Tooltip } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import Hidden from '@mui/material/Hidden'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import ThemeButton from 'src/components/ThemeButton/ThemeButton'
import getNavigationLinks, { NavigationLinkType } from 'src/config/NavigationLinks'
import useApp from 'src/context/useApp'
import useAuth from 'src/context/useAuth'
import classes, { Root } from './styles'

interface IProps {
  setDrawOpen: () => void
}

const NavBar: React.FC<IProps> = ({ setDrawOpen }) => {
  const { user, logout, isAdmin } = useAuth()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClose = () => {
    setAnchorEl(null)
  }

  const openAccount = Boolean(anchorEl)

  const id = openAccount ? 'account-popover' : undefined

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleLogout = () => {
    logout()
  }

  const location = useLocation()

  const { title } = useApp()

  const isSupervisor = React.useMemo(() => isAdmin(), [user])

  const isCurrentLocation = React.useCallback(
    (path: string) => {
      const { pathname } = location
      if (!pathname.startsWith(path)) return false
      if (path !== '/' || pathname === '/') {
        return true
      }
      return false
    },
    [location]
  )

  return (
    <Root>
      <AppBar
        enableColorOnDark
        position="sticky"
        elevation={0}
        sx={{ top: 0, zIndex: theme => theme.zIndex.mobileStepper }}>
        <Toolbar variant="dense">
          <Hidden mdUp>
            <IconButton
              edge="start"
              sx={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={() => setDrawOpen()}>
              <MenuIcon />
            </IconButton>
          </Hidden>
          <Typography variant="h6" sx={classes.title}>
            {title}
          </Typography>
          <Hidden smDown>
            {getNavigationLinks().map((link: NavigationLinkType) => {
              if (link.adminOnly && !isSupervisor) return null
              return (
                <Button
                  color="inherit"
                  sx={{
                    opacity: isCurrentLocation(link.path) ? 1 : 0.6
                  }}
                  disabled={link.disabled}
                  key={link.name}
                  component={NavLink}
                  to={link.path}>
                  {link.name}
                </Button>
              )
            })}
          </Hidden>
          <ThemeButton />
          <Tooltip
            title={user ? `${user.firstName} ${user.lastName}` : String('Account')}
            aria-label="theme-mode">
            <IconButton
              aria-label={user ? `${user.firstName} ${user.lastName}` : String('Account')}
              color="inherit"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={handleClick}>
              <Badge badgeContent={0} color="error">
                <AccountCircleIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Popover
            id={id}
            open={openAccount}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}>
            <Box component="div" sx={classes.popover}>
              <List
                subheader={
                  <ListSubheader component="div" id="user-login-name">
                    {`${user?.firstName ?? ''} ${user?.lastName ?? ''}`}
                  </ListSubheader>
                }
                component="nav"
                aria-label="account preferences">
                <Divider component="li" />
                <ListItem onClick={handleLogout} button>
                  <ListItemIcon>
                    <ExitToAppIcon />
                  </ListItemIcon>
                  <ListItemText primary="Sign Out" />
                </ListItem>
              </List>
            </Box>
          </Popover>
        </Toolbar>
      </AppBar>
    </Root>
  )
}

export default NavBar
