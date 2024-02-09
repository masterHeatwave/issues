import TIssue from 'src/structures/issue'

type TIssueListItem = Omit<TIssue, 'assignees' | 'watchers' | 'messages' | 'attachments'> & {
  assignees: number
  watchers: number
  messages: number
  attachments: number
}

export default TIssueListItem
