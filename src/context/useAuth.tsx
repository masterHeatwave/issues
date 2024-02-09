import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  checkAuth as _checkAuth,
  login as _login,
  logout as _logout
} from 'src/context/actions/auth'
import useApp from 'src/context/useApp'
import { setupInterceptors } from 'src/services/http'
import config, { defaults } from 'src/services/storage'
import Roles from 'src/types/Roles'
import UserDetails from 'src/types/UserDetails'
import useSnackbar from './useSnackbar'

interface IState {
  user: UserDetails | null
  loading: boolean
  login: (email: string, password: string, rememberMe: boolean) => void
  logout: (force?: boolean) => Promise<void>
  isAdmin: () => undefined | boolean
  isUser: (id: string) => undefined | boolean
}

const AuthContext = React.createContext<IState>({} as IState)

interface IAuthProvider {
  children?: React.ReactNode
}

export const AuthProvider: React.FC<IAuthProvider> = ({ children }) => {
  const [user, setUser] = React.useState<UserDetails | null>(config.userDetails)
  const [loading, setLoading] = React.useState<boolean>(false)
  const { fetchData } = useApp()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isAdmin = React.useCallback((roles = user?.roles) => roles?.includes(Roles.Admin), [user])
  const isUser = React.useCallback((id: string) => user?.id === id, [user])
  const { showError } = useSnackbar()
  const login = async (userName: string, password: string, rememberMe: boolean) => {
    setLoading(true)
    try {
      const res = await _login({ userName, password, rememberMe })
      const userDetails: UserDetails = {
        userName: res.userName,
        firstName: res.firstName,
        lastName: res.lastName,
        id: res.id,
        roles: res.roles,
        token: res.token
      }
      config.userDetails = userDetails
      config.persist = rememberMe
      config.save()
      setUser(userDetails)
      navigate(`/?${searchParams.toString()}`)
    } catch (error: any) {
      let message = ''
      if (error?.response?.data) {
        const { Message } = error.response.data
        if (Message) {
          message = Message
        }
      }
      showError(message || undefined)
    } finally {
      setLoading(false)
    }
  }
  const logout = async (): Promise<void> => {
    setLoading(true)
    try {
      await _logout()
      config.fetchProps = defaults.fetchProps
      config.save()
    } catch (error: unknown) {
      showError()
    } finally {
      setLoading(false)
      config.userDetails = null
      config.save()
      setUser(null)
    }
    return Promise.resolve()
  }
  const checkAuth = async () => {
    try {
      await _checkAuth()
    } catch (error: unknown) {
      await logout()
    }
  }
  const memoedValue = React.useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      isAdmin,
      isUser
    }),
    [user, loading]
  )
  React.useEffect(() => {
    setupInterceptors(checkAuth)
  }, [])
  React.useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])
  return <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
}

const useAuth = () => React.useContext(AuthContext)

export default useAuth
