import React from 'react'
import AppDrawer from 'src/components/AppDrawer/AppDrawer'
import NavBar from 'src/components/NavBar/NavBar'

const HeaderContainer: React.FC = () => {
  const [drawOpen, setDrawOpen] = React.useState<boolean>(false)
  return (
    <>
      <AppDrawer state={drawOpen} onToggle={(state: boolean) => setDrawOpen(state)} />
      <NavBar setDrawOpen={() => setDrawOpen(true)} />
    </>
  )
}

export default HeaderContainer
