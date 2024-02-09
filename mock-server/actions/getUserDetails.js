function getUserDetails(req, res) {
  res.jsonp({
    EmployeeId: 'guest',
    Domain: 'ionia.gr',
    EmployeeName: 'Guest'
  })
}

module.exports = getUserDetails
