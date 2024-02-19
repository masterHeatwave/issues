const applications = require('../data/applications.json')
const users = require('../data/employees.json')
const status = require('../data/status.json')
const messages = require('../data/messages.json')
function getData(req, res) {
  res.jsonp({
    applications,
    users,
    status,
    messages
  })
}

module.exports = { getData };
