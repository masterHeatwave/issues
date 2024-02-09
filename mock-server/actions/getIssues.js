const mapIssueListItem = require('../mappers/mapIssueListItem')
const issues = require('../data/issues.json')
const PAGE_SIZE = 5

function getIssues(_req, res) {

  const data = issues.map(mapIssueListItem).slice(0, PAGE_SIZE)
  res.jsonp({
    pageNumber: 1,
    pageSize: PAGE_SIZE,
    totalPages: 1,
    totalRecords: data.length,
    data: data
  })
}

module.exports = getIssues
