const applications = require('../data/applications.json')
const users = require('../data/employees.json')
const status = require('../data/status.json')
function getData(req, res) {
  res.jsonp({
    applications,
    users,
    status
  })
}

module.exports = getData
