type TIssuePayload = {
  id: string | null
  title: string
  description: string | null
  applicationId: number
  userId: string
  statusId: number
  hidden: boolean
  assignees: string[]
  watchers: string[]
}

export default TIssuePayload
