const mapIssue = require('./mapIssue')

function mapIssueListItem(issue) {
  const i = mapIssue(issue)

  return {
    ...i,
    assignees: i.assignees.length,
    watchers: i.watchers.length,
    messages: i.messages.length,
    attachments: i.attachments.length
  }
}

module.exports = mapIssueListItem
