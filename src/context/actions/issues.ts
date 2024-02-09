import { AxiosResponse, CancelToken } from 'axios'
import http from 'src/services/http'
import TAttachment from 'src/structures/attachment'
import TIssuePayload from 'src/structures/dto/issuePayload'
import TMessagePayload from 'src/structures/dto/messagePayload'
import TIssue from 'src/structures/issue'
import TMessage from 'src/structures/message'
import TIssueListItem from 'src/structures/viewmodel/issueListItem'
import TPagination from 'src/structures/viewmodel/pagination'

export const fetchList = async (
  urlParams: URLSearchParams,
  cancelToken: CancelToken
): Promise<TPagination<TIssueListItem>> => {
  try {
    const res = await http.get<TPagination<TIssueListItem>>(`/Issue?${urlParams.toString()}`, {
      cancelToken
    })
    return res.data
  } catch (error) {
    return Promise.reject(error)
  }
}

export const fetchId = async (id: string): Promise<TIssue> => {
  try {
    const res = await http.get<TIssue>(`/Issue/${id}`)
    return res.data
  } catch (error) {
    return Promise.reject(error)
  }
}

export const create = async (issue: TIssuePayload): Promise<TIssue> => {
  try {
    const res = await http.post<TIssue>(`/Issue`, issue)
    return res.data
  } catch (error) {
    return Promise.reject(error)
  }
}

export const createMessage = async (message: TMessagePayload): Promise<TMessage> => {
  try {
    const res = await http.post<TMessage>(`/Issue/${message.issueId}/Message`, message)
    return res.data
  } catch (error) {
    return Promise.reject(error)
  }
}

export const update = async (issueId: string, issue: TIssuePayload): Promise<void> => {
  try {
    await http.put<void>(`/Issue/${issueId}`, issue)
  } catch (error) {
    return Promise.reject(error)
  }
}

export const notifyIssuer = async (issueId: string): Promise<void> => {
  try {
    await http.post<void>(`/Issue/${issueId}/Notify`)
  } catch (error) {
    return Promise.reject(error)
  }
}

export const removeAttachments = async (attachmentIds: number[]): Promise<void> => {
  const urlParams = new URLSearchParams()
  attachmentIds.forEach(id => urlParams.append('id[]', String(id)))
  try {
    await http.delete(`/Issue/Attachment?${urlParams.toString()}`)
  } catch (error) {
    return Promise.reject(error)
  }
}

export const uploadAttachment = async (
  issueId: string,
  files: FileList,
  messageId?: number
): Promise<TAttachment[]> => {
  const url = messageId
    ? `Issue/${issueId}/Message/${messageId}/Attachment`
    : `Issue/${issueId}/Attachment`
  const formData = new FormData()
  for (let i = 0; i < files.length; i += 1) {
    formData.append('files', files[i])
  }
  try {
    const res = await http.post<TAttachment[]>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return res.data
  } catch (error: unknown) {
    return Promise.reject(error)
  }
}

export const getAttachment = async (
  issueId: string,
  messageId?: number,
  attachmentId?: number
): Promise<AxiosResponse<ArrayBuffer, any>> => {
  let url = `Issue`
  if (!messageId) {
    url += `/${issueId}/Attachment`
  } else {
    url += `/${issueId}/Message/${messageId}/Attachment`
  }
  if (attachmentId) {
    url += `/${attachmentId}`
  }
  const res = await http.get<ArrayBuffer>(url, {
    responseType: 'arraybuffer'
  })
  return Promise.resolve(res)
}

export const getBase64String = async (
  issueId: string,
  messageId?: number,
  attachmentId?: number
): Promise<string> => {
  const res = await getAttachment(issueId, messageId, attachmentId)
  const TYPED_ARRAY = new Uint8Array(res.data)
  const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => data + String.fromCharCode(byte), '')
  return btoa(STRING_CHAR)
}

export type TFile = {
  name: string
  contentType?: string
  bytes: ArrayBuffer
}

export const download = async (
  issueId: string,
  messageId?: number,
  attachmentId?: number
): Promise<TFile> => {
  const res = await getAttachment(issueId, messageId, attachmentId)
  const contentType = res.headers['content-type']
  const p = /.*filename=(.+);.*/i
  const match = res.headers['content-disposition']?.match(p)
  const name = match ? match[1] : 'download'
  return Promise.resolve({
    name,
    contentType,
    bytes: res.data
  })
}
