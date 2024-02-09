const applications = require('../data/applications.json')
const status = require('../data/status.json')
const employees = require('../data/employees.json')
const assignees = require('../data/assignees.json')
const watchers = require('../data/watchers.json')
const messages = require('../data/messages.json')
const attachments = require('../data/attachments.json')
const mapUser = require('./mapUser')

function mapIssue(issue) {
  return {
    ...issue,
    user: employees.find(e => e.id === issue.userId),
    status: status.find(s => s.id === issue.statusId),
    application: applications.find(a => a.id === issue.applicationId),
    assignees: assignees.filter(a => a.issueId === issue.id).map(a => mapUser(a)),
    watchers: watchers.filter(w => w.issueId === issue.id).map(a => mapUser(a)),
    messages: messages.filter(m => m.issueId === issue.id).map(a => mapUser(a)),
    attachments: attachments.filter(a => a.issueId === issue.id)
  }
}

module.exports = mapIssue
