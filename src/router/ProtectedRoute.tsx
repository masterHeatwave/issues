import React from 'react'
import { Navigate, Outlet, useSearchParams } from 'react-router-dom'
import useAuth from 'src/context/useAuth'

interface IProtectedRoute {
  adminOnly?: boolean
  redirectPath?: string
  children?: React.ReactElement | null
}

const ProtectedRoute: React.FC<IProtectedRoute> = ({
  redirectPath = '/Login',
  adminOnly = false,
  children
}) => {
  const url = redirectPath.split('?')
  const defaultUrl = url[0]
  const defaultParams = new URLSearchParams(url?.[1])
  const [searchParams] = useSearchParams()
  searchParams.forEach((value, key) => {
    defaultParams.set(key, value)
  })
  const { user, isAdmin } = useAuth()
  if (!user) {
    return <Navigate to={`${defaultUrl}?${defaultParams.toString()}`} replace />
  }
  if (adminOnly) {
    if (!isAdmin()) {
      return <Navigate to="/" replace />
    }
  }
  return children || <Outlet />
}

export default ProtectedRoute
