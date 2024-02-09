import { List, ListItem, ListItemText, SwipeableDrawer } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import getNavigationLinks, { NavigationLinkType } from 'src/config/NavigationLinks'
import useAuth from 'src/context/useAuth'

interface IProps {
  state: boolean
  onToggle: (state: boolean) => void
}

const AppDrawer: React.FC<IProps> = ({ state, onToggle }) => {
  const [open, setOpen] = useState<boolean>(false)
  const { user, isAdmin } = useAuth()
  const isSupervisor = React.useMemo(() => isAdmin(), [user])

  useEffect(() => {
    setOpen(state)
  }, [state])

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event &&
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return
    }
    setOpen(open)
    onToggle(open)
  }

  const handleDrawerClose = () => {
    setOpen(false)
    onToggle(false)
  }

  const location = useLocation()
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
    <SwipeableDrawer
      anchor="left"
      open={open}
      onClose={toggleDrawer(false)}
      onOpen={toggleDrawer(true)}>
      <List>
        {getNavigationLinks().map((link: NavigationLinkType) => (
          <ListItem
            button
            selected={isCurrentLocation(link.path)}
            component={NavLink}
            disabled={link.disabled || (link.adminOnly && !isSupervisor)}
            to={link.path}
            key={link.name}
            onClick={handleDrawerClose}>
            <ListItemText primary={link.name} />
          </ListItem>
        ))}
      </List>
    </SwipeableDrawer>
  )
}

export default AppDrawer
