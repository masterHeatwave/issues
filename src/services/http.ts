import axios, { AxiosError, HeadersDefaults } from 'axios'
import config from 'src/services/storage'

const origin = process.env.REACT_APP_API_URL || ''
const baseURL = `${origin}/api`

interface ICommonHeaders extends Partial<HeadersDefaults> {
  'Content-Type'?: string
  'Access-Control-Allow-Origin'?: string
}

const headers: ICommonHeaders = {
  'Content-Type': 'application/json'
}

if (process.env.REACT_APP_API_URL) {
  headers['Access-Control-Allow-Origin'] = origin
}

const http = axios.create({
  baseURL,
  withCredentials: false,
  headers,
  responseType: 'json'
})

http.interceptors.request.use(request => {
  const newRequest = { ...request }
  const token = config.userDetails?.token
  if (token) {
    newRequest.headers.Authorization = `Bearer ${token}`
  }
  return newRequest
})

const setupInterceptors = (checkAuth: () => Promise<void>): void => {
  http.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      if (error.config?.url?.startsWith('/Auth') === true) {
        return Promise.reject(error)
      }
      if (error?.response?.status === 401) {
        await checkAuth()
      }
      return Promise.reject(error)
    }
  )
}

export { setupInterceptors }

export default http
