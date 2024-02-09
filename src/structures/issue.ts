import TApplication from 'src/structures/application'
import TAssignee from 'src/structures/assignee'
import TAttachment from 'src/structures/attachment'
import TEntityBase from 'src/structures/entityBase'
import TMessage from 'src/structures/message'
import TStatus from 'src/structures/status'
import TUser from 'src/structures/user'
import TWatcher from 'src/structures/watcher'

type TIssue = {
  id: string
  title: string
  description: string | null
  applicationId: number
  userId: string
  statusId: number
  application: TApplication
  status: TStatus
  user: TUser
  assignees: TAssignee[]
  watchers: TWatcher[]
  messages: TMessage[]
  attachments: TAttachment[]
} & TEntityBase

export default TIssue
