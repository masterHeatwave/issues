import { Box, FormControl } from '@mui/material'
import { saveAs } from 'file-saver'
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import sanitize from 'sanitize-filename'
import AttachmentControl from 'src/components/AttachmentControl/AttachmentControl'
import { ConfirmDialogResult } from 'src/components/ConfirmDialog/ConfirmDialog'
import ImagePreview from 'src/components/ImagePreview/ImagePreview'
import IssueFormLayout from 'src/components/IssueForm/IssueFormLayout'
import IssueLayout from 'src/components/IssueForm/IssueLayout'
import IssueModal from 'src/components/IssueModal/IssueModal'
import MessageField from 'src/components/MessageField/MessageField'
import MessageList from 'src/components/MessageList/MessageList'
import {
  create,
  createMessage,
  download,
  fetchId,
  getBase64String,
  notifyIssuer,
  removeAttachments,
  update,
  uploadAttachment
} from 'src/context/actions/issues'
import useAuth from 'src/context/useAuth'
import useDialogs from 'src/context/useDialogs'
import useSnackbar from 'src/context/useSnackbar'
import SubmitException from 'src/exceptions/SubmitException'
import TIssuePayload from 'src/structures/dto/issuePayload'
import TIssue from 'src/structures/issue'
import TMessage from 'src/structures/message'
import TAttachmentImage from 'src/structures/viewmodel/attachmentImage'

interface IState {
  createIssue: () => Promise<unknown>
  handleIssue: (issueId: string) => Promise<unknown>
  loading: boolean
}

const FormContext = React.createContext<IState>({} as IState)

interface IFormProvider {
  children?: React.ReactNode
  onDeleteMessage: (messageId: string) => void;
}

const FormProvider: React.FC<Partial<IFormProvider>> = ({ children, onDeleteMessage = () => { } }) => {
  const { user } = useAuth()
  const [issue, setIssue] = React.useState<TIssue | null>(null)
  const [open, setOpen] = React.useState<boolean>(false)
  const [loading, setLoading] = React.useState<boolean>(false)
  const [newMessage, setNewMessage] = React.useState<string>('')
  const [newMessageFileList, setNewMessageFileList] = React.useState<FileList | null>(null)
  const { showError } = useSnackbar()
  const [dirty, setDirty] = React.useState<boolean>(false)
  const [images, setImages] = React.useState<TAttachmentImage[]>([])
  const [searchParams, setSearchParams] = useSearchParams()
  const awaitModal = React.useRef<{
    resolve: (value: unknown) => void
    reject: () => void
  } | null>(null)
  const { showDialog, ask } = useDialogs()
  const removeParams = React.useCallback(() => {
    if (searchParams.has('issue')) {
      searchParams.delete('issue')
      setSearchParams(searchParams)
    }
  }, [searchParams])
  const handleTransitionExit = React.useCallback(() => {
    removeParams()
    awaitModal.current?.resolve(dirty)
    awaitModal.current = null
    setDirty(false)
    setIssue(null)
  }, [dirty])
  React.useEffect(() => {
    setNewMessage('')
    setNewMessageFileList(null)
  }, [issue])
  const handleNewMessage = React.useCallback((value: string) => setNewMessage(value), [])
  const handleClose = React.useCallback(() => {
    setOpen(false)
  }, [])
  const fetchIssue = React.useCallback(async (issueId: string): Promise<TIssue> => {
    try {
      setLoading(true)
      const issue = await fetchId(issueId)
      return issue
    } catch (error: unknown) {
      showError()
      return await Promise.reject(error)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSubmit = React.useCallback(async (issueDTO: TIssuePayload) => {
    if (!issueDTO.description?.trim()) {
      issueDTO.description = null
    }
    if (!issueDTO.assignees) issueDTO.assignees = []
    if (!issueDTO.watchers) issueDTO.watchers = []
    issueDTO.assignees = issueDTO.assignees.filter(userId => userId !== issueDTO.userId)
    issueDTO.watchers = issueDTO.watchers.filter(
      userId => userId !== issueDTO.userId && !issueDTO.assignees.includes(userId)
    )
    try {
      setLoading(true)
      let issueId = issueDTO.id
      if (issueId) {
        try {
          await update(issueId, issueDTO)
          setDirty(true)
        } catch (error: unknown) {
          throw new SubmitException('Error updating issue.', issueId)
        }
      } else {
        try {
          ;({ id: issueId } = await create(issueDTO))
          setDirty(true)
        } catch (error: unknown) {
          throw new SubmitException('Error creating issue.', issueId)
        }
      }
      try {
        const issue = await fetchIssue(issueId)
        return await Promise.resolve(issue)
      } catch (error: unknown) {
        throw new SubmitException('Error fetching issue.', issueId)
      }
    } catch (error: unknown) {
      if (!(error instanceof SubmitException)) {
        showError()
        throw error
      }
      showError(error.message)
      if (error.id) {
        const issue = await fetchIssue(error.id)
        throw new SubmitException(error.message, issue.id, issue)
      }
      throw new SubmitException(error.message)
    } finally {
      setLoading(false)
    }
  }, [])
  const handleIssue = React.useCallback(async (issueId: string) => {
    try {
      const issue = await fetchIssue(issueId)
      if (!searchParams.has('issue') || searchParams.get('issue')?.toUpperCase() !== issue.id) {
        searchParams.set('issue', issue.id)
        setSearchParams(searchParams)
      }
      setIssue(issue)
      setOpen(true)
    } catch (error: unknown) {
      removeParams()
      return Promise.reject(error)
    }
    return new Promise((resolve, reject) => {
      awaitModal.current = {
        resolve,
        reject
      }
    })
  }, [])
  const createForm = React.useCallback(
    async (issueId?: string) => {
      const defaultValues = { statusId: 1, userId: user?.id } as Partial<TIssuePayload>
      if (issueId) {
        try {
          const issue = await fetchIssue(issueId)
          defaultValues.id = issue.id
          defaultValues.title = issue.title
          defaultValues.description = issue.description ?? ''
          defaultValues.applicationId = issue.applicationId
          defaultValues.userId = issue.userId
          defaultValues.statusId = issue.statusId
          defaultValues.assignees = issue.assignees.map(assignee => assignee.userId)
          defaultValues.watchers = issue.watchers.map(watcher => watcher.userId)
        } catch (error: unknown) {
          return Promise.reject(error)
        }
      }
      const dialog = await showDialog({
        defaultTitle: defaultValues.id ? defaultValues.id : 'Create an Issue',
        content: (
          <IssueFormLayout sx={{ pt: 1 }} onSubmit={handleSubmit} defaultValues={defaultValues} />
        ),
        buttons: false,
        cancelable: false,
        defaultAction: ConfirmDialogResult.Yes,
        dialogProps: {
          maxWidth: 'lg'
        }
      })
      if (dialog.result !== ConfirmDialogResult.Yes) {
        return Promise.reject()
      }
      return Promise.resolve(dialog.state as TIssue)
    },
    [handleSubmit]
  )
  const handleEvent = React.useCallback(async () => {
    try {
      const res = await createForm(issue!.id)
      setIssue(res)
    } catch (error: unknown) {
      return Promise.resolve()
    }
  }, [issue, createForm])
  const createIssue = React.useCallback(async () => {
    try {
      const res = await createForm()
      setDirty(true)
      return await handleIssue(res.id)
    } catch (error: unknown) {
      return Promise.resolve()
    }
  }, [createForm, handleIssue])
  const handleFileChange = React.useCallback(
    (messageId?: number) => async (files: FileList | null) => {
      if (!issue?.id || !files) return Promise.resolve()
      try {
        const attachments = await uploadAttachment(issue.id, files, messageId)
        setIssue({ ...issue, attachments: [...issue.attachments, ...attachments] })
      } catch (error: unknown) {
        showError('Error uploading file(s).')
      }
      return Promise.resolve()
    },
    [issue]
  )
  const handleAttachmentChange = React.useCallback(
    (messageId?: number) => async (attachmentId: number) => {
      if (!issue?.id) return Promise.reject()
      const confirm = await ask('Are you sure to delete this file?')
      if (!confirm) {
        return Promise.resolve()
      }
      try {
        await removeAttachments(Array.of(attachmentId))
        if (messageId) {
          setIssue({
            ...issue,
            messages: issue.messages.map(message =>
              message.id === messageId
                ? {
                    ...message,
                    attachments: message.attachments.filter(
                      attachment => attachment.id !== attachmentId
                    )
                  }
                : message
            )
          })
        } else {
          setIssue({
            ...issue,
            attachments: issue.attachments.filter(attachment => attachment.id !== attachmentId)
          })
        }
      } catch (error: unknown) {
        showError('Error removing file(s).')
      }
      return Promise.resolve()
    },
    [issue]
  )
  const handleDownload = React.useCallback(
    (messageId?: number) =>
      (attachmentId: number) =>
      async (e: React.MouseEvent<HTMLSpanElement>) => {
        const popup = window.open('about:blank', 'blank')
        try {
          const { name, contentType, bytes } = await download(issue!.id, messageId, attachmentId)
          const file = new File([bytes], name, {
            type: contentType || 'application/force-download'
          })
          if (!contentType?.startsWith('image') && !contentType?.startsWith('application/pdf')) {
            if (popup && !popup.closed) {
              popup.close()
            }
            saveAs(file, sanitize(name))
          } else {
            setTimeout(() => {
              if (!popup) throw new Error()
              const url = URL.createObjectURL(file)
              popup.location.assign(url)
              setTimeout(() => {
                URL.revokeObjectURL(url)
              }, 0)
            }, 0)
          }
          if (typeof file === 'string') {
            URL.revokeObjectURL(file as string)
          }
        } catch {
          if (popup && !popup.closed) {
            popup.close()
          }
          showError('Error downloading file.')
        }
        return Promise.resolve()
      },
    [issue]
  )
  const handleDownloadAll = React.useCallback(
    (messageId?: number) => async (e: React.MouseEvent<HTMLButtonElement>) => {
      try {
        const { name, contentType, bytes } = await download(issue!.id, messageId)
        const file = new File([bytes], name, {
          type: contentType || 'application/force-download'
        })
        saveAs(file, sanitize(name))
        if (typeof file === 'string') {
          URL.revokeObjectURL(file as string)
        }
      } catch {
        showError('Error downloading files.')
      }
      return Promise.resolve()
    },
    [issue]
  )
  const handleAttachmentRender = React.useCallback(
    (message: TMessage) => {
      if (!message.attachments?.length) return null
      return (
        <Box component="li" sx={{ display: 'inline-block', marginLeft: '72px', mb: 1 }}>
          <FormControl fullWidth>
            <AttachmentControl
              loading={loading}
              readOnly={message.userId !== user?.id}
              dense
              attachments={message.attachments}
              onChange={handleAttachmentChange(message.id)}
              onInputFileChange={handleFileChange(message.id)}
              onDownload={handleDownload(message.id)}
              onDownloadAll={handleDownloadAll(message.id)}
            />
          </FormControl>
        </Box>
      )
    },
    [handleAttachmentChange, handleFileChange, handleDownload, handleDownloadAll]
  )
  const handleNewMessageFileChange = React.useCallback(async (files: FileList | null) => {
    setNewMessageFileList(files)
    return Promise.resolve()
  }, [])
  const handleSubmitMessage = React.useCallback(async () => {
    const value = newMessage.trim()
    if (!issue || !value) return Promise.reject()
    try {
      setLoading(true)
      const message = await createMessage({
        id: null,
        issueId: issue.id,
        content: value
      })
      setDirty(true)
      if (newMessageFileList?.length) {
        try {
          const attachments = await uploadAttachment(issue.id, newMessageFileList, message.id)
          message.attachments = attachments
        } catch {
          showError('Error uploading file(s).')
        }
      }
      setIssue({
        ...issue,
        messages: [message, ...issue.messages]
      })
    } catch (error: unknown) {
      showError('Error creating message.')
    } finally {
      setLoading(false)
    }
  }, [newMessage, issue, newMessageFileList])
  const memoedValue = React.useMemo(
    () => ({
      loading,
      createIssue,
      handleIssue
    }),
    [loading]
  )
  const getAttachmentData = React.useCallback(
    async (attachmentId: number): Promise<string> => {
      if (!issue) return Promise.reject()
      const message = issue?.messages.find(message =>
        message.attachments.some(attachment => attachment.id === attachmentId)
      )
      try {
        const data = await getBase64String(issue.id, message?.id, attachmentId)
        return await Promise.resolve(data)
      } catch {
        return Promise.reject()
      }
    },
    [issue]
  )
  React.useEffect(() => {
    if (!issue) {
      setImages([])
      return
    }
    const attachments = [] as TAttachmentImage[]
    issue.attachments.forEach(attachment => {
      if (!attachment.mimeType.startsWith('image')) return
      attachments.push({
        ...attachment,
        userName: `${issue.user.lastName} ${issue.user.firstName}`,
        caption: `${issue.title}. ${issue.description ?? ''}`.trim()
      })
    })
    issue.messages.forEach(message => {
      message.attachments.forEach(attachment => {
        if (!attachment.mimeType.startsWith('image')) return
        attachments.push({
          ...attachment,
          userName: `${message.user.lastName} ${message.user.firstName}`,
          caption: message.content
        })
      })
    })
    attachments.sort((a, b) => {
      if (a.id < b.id) {
        return -1
      }
      if (a.id > b.id) {
        return 1
      }
      return 0
    })
    setImages(attachments)
  }, [issue])

  const handleNotify = React.useCallback(() => {
    if (!issue) return Promise.resolve()
    return notifyIssuer(issue?.id)
  }, [issue])
  return (
    <FormContext.Provider value={memoedValue}>
      {children}
      <IssueModal
        readOnly={user?.id !== issue?.userId}
        title={issue?.title}
        open={open}
        onEvent={handleEvent}
        onClose={handleClose}
        onTransitionExit={handleTransitionExit}>
        {!!issue && (
          <IssueLayout onNotify={handleNotify} issue={issue}>
            <AttachmentControl
              loading={loading}
              readOnly={user?.id !== issue?.userId}
              attachments={issue?.attachments}
              onChange={handleAttachmentChange()}
              onInputFileChange={handleFileChange()}
              onDownload={handleDownload()}
              onDownloadAll={handleDownloadAll()}
            />
          </IssueLayout>
        )}
        {!!images.length && <ImagePreview images={images} onDataRequest={getAttachmentData} />}
        {!!issue && issue.statusId !== 2 && (
          <Box sx={{ my: 2 }}>
            <Box component="form" sx={{ bgColor: 'transparent' }}>
              <FormControl fullWidth sx={{ bgColor: 'transparent' }}>
                <MessageField
                  loading={loading}
                  defaultValue={newMessage}
                  onChange={handleNewMessage}
                  onSubmit={handleSubmitMessage}
                />
              </FormControl>
              <FormControl fullWidth>
                <AttachmentControl
                  loading={loading}
                  files={newMessageFileList}
                  onInputFileChange={handleNewMessageFileChange}
                />
              </FormControl>
            </Box>
          </Box>
        )}
        {!!issue && <MessageList onAttachmentRender={handleAttachmentRender} issue={issue} onDeleteMessage={onDeleteMessage} />}
      </IssueModal>
    </FormContext.Provider>
  )
}

export { FormProvider }

const useForm = () => React.useContext(FormContext)

export default useForm
