const employees = require('../data/employees.json')

function postLogin(req, res) {
  const employee = employees.find(e => e.userName === req.body.userName)
  if (!employee || req.body.password !== req.body.userName) {
    res.sendStatus(403)
  }
  res.jsonp(employee)
}

module.exports = postLogin
