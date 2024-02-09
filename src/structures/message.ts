import TAttachment from 'src/structures/attachment'
import TEntityBase from 'src/structures/entityBase'
import TUser from 'src/structures/user'

type TMessage = {
  id: number
  userId: string
  issueId: string
  content: string
  user: TUser
  attachments: TAttachment[]
} & TEntityBase

export default TMessage
