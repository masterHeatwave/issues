import { Box, Container } from '@mui/material'
import React from 'react'
import useAuth from 'src/context/useAuth'
import FooterContainer from './FooterContainer'
import HeaderContainer from './HeaderContainer'

interface IMainContainer {
  children?: React.ReactNode
}

const MainContainer = React.forwardRef<HTMLDivElement, IMainContainer>(({ children }, ref) => {
  const { user } = useAuth()
  if (!user) {
    return <Box component="div">{children}</Box>
  }
  return (
    <>
      <Box component="header">
        <Box component="div" sx={{}}>
          <HeaderContainer />
        </Box>
      </Box>
      <Box component="main">
        <Container ref={ref} disableGutters maxWidth={false}>
          {children}
        </Container>
      </Box>
      <Box component="footer">
        <FooterContainer />
      </Box>
    </>
  )
})
MainContainer.displayName = 'MainContainer'

export default MainContainer
