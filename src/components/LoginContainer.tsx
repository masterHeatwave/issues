import { Stack } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import FormControlLabel from '@mui/material/FormControlLabel'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React from 'react'
import { Navigate } from 'react-router-dom'
import icon from 'src/assets/ionia.png'
import useAuth from 'src/context/useAuth'
import config from 'src/services/storage'
import Copyright from './Copyright/Copyright'
import ThemeButton from './ThemeButton/ThemeButton'

interface ILoginContainer {
  children?: React.ReactNode
}

type Credentials = {
  username: string
  password: string
}

const LoginContainer: React.FC<ILoginContainer> = () => {
  const { user, loading, login } = useAuth()
  const [credentials, setCredentials] = React.useState<Credentials>({
    username: process.env.REACT_APP_USERNAME || '',
    password: process.env.REACT_APP_PASSWORD || ''
  })
  const [persists, setPersists] = React.useState<boolean>(config.persist)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    login(credentials.username, credentials.password, persists)
  }
  return user ? (
    <Navigate to="/" replace />
  ) : (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
        <Avatar
          sx={{ m: 1, height: '100%', width: 100, border: 0, objectFit: 'contain!important' }}
          variant="square"
          src={icon}
        />
        <Typography component="h1" variant="h5">
          Issue Tracking
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="User Name"
            name="username"
            value={credentials.username}
            autoComplete="username"
            onChange={handleChange}
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            type="password"
            name="password"
            label="Password"
            value={credentials.password}
            autoComplete="current-password"
            onChange={handleChange}
          />
          <FormControlLabel
            control={
              <Checkbox
                value="remember"
                color="primary"
                onChange={e => setPersists(e.target.checked)}
                checked={persists}
              />
            }
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}>
            Sign in
          </Button>
          <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
            <ThemeButton />
          </Stack>
        </Box>
      </Box>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  )
}

export default LoginContainer
