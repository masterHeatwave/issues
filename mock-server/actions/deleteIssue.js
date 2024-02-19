const fs = require('fs');
const path = require('path');

const messagesFilePath = path.join(__dirname, '../data/messages.json');


function deleteIssue(req, res) {
  const { messageId } = req.params;

  console.log('Received message ID:', messageId);

  fs.readFile(messagesFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading messages file:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    let messages = [];
    try {
      messages = JSON.parse(data);
    } catch (parseError) {
      console.error('Error parsing messages data:', parseError);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Find index of message to delete
    const messageIndex = messages.findIndex(message => message.id.toString() === messageId);

    if (messageIndex === -1) {
      res.status(404).json({ error: 'Message not found' });
      return;
    }

    // Remove message from array
    messages.splice(messageIndex, 1);

    // Write updated messages array back to file
    fs.writeFile(messagesFilePath, JSON.stringify(messages, null, 2), 'utf8', writeErr => {
      if (writeErr) {
        console.error('Error writing messages file:', writeErr);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      res.status(200).json({ success: true });
    });
  });
}

module.exports = deleteIssue;
