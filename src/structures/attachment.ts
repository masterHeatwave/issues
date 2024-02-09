import TEntityBase from 'src/structures/entityBase'

type TAttachment = {
  id: number
  fileName: string
  fileSize: number
  issueId: string
  messageId: number | null
  mimeType: string
} & TEntityBase

export default TAttachment
