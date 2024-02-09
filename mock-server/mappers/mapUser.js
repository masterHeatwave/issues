const employees = require('../data/employees.json')

function mapUser(props) {
  return {
    ...props,
    user: employees.find(e => e.id === props.userId)
  }
}

module.exports = mapUser
