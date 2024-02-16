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

const fs = require('fs');

const path = require('path');

function fetchMessages() {
  try {
    const messagesData = fs.readFileSync('./data/messages.json', 'utf8');
    const messages = JSON.parse(messagesData);
    return messages;
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
}



function updateMessages(updatedMessages) {
  try {
    const messagesFilePath = path.resolve(__dirname, './data/messages.json');
    fs.writeFileSync(messagesFilePath, JSON.stringify(updatedMessages, null, 2));
    console.log('Messages updated successfully.');
  } catch (error) {
    console.error('Error updating messages:', error);
  }
}

module.exports = { getData, fetchMessages, updateMessages };
