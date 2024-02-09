import http from 'src/services/http'
import TLoginRequest from 'src/structures/dto/loginRequest'
import TLoginResponse from 'src/structures/dto/loginResponse'

export const login = async (params: TLoginRequest): Promise<TLoginResponse> => {
  try {
    const res = await http.post<TLoginResponse>('/Auth/Login', params)
    return res.data
  } catch (error: unknown) {
    return Promise.reject(error)
  }
}

export const logout = async (): Promise<void> =>
  http.post<void>('/Auth/Logout').then(() => Promise.resolve())

export const checkAuth = async (): Promise<void> =>
  http.get<void>('/Auth/Check').then(() => Promise.resolve())
