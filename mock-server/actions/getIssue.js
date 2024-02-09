const mapIssue = require('../mappers/mapIssue')

const issues = require('../data/issues.json')

function getIssue(req, res) {
  const id = req.params.id
  const data = issues.find(i => i.id === id)
  res.jsonp(mapIssue(data))
}
module.exports = getIssue
