import http from 'src/services/http'
import TApplicationData from 'src/structures/viewmodel/applicationData'

export const fetchData = async (): Promise<TApplicationData> => {
  try {
    const res = await http.get<TApplicationData>(`/Data`)
    return res.data
  } catch (error) {
    return Promise.reject(error)
  }
}

export default fetchData
