import React from 'react'
import TIssue from 'src/structures/issue'
import TMessage from 'src/structures/message'
import { Avatar, Chip, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material'
import DeleteButton from 'src/components/DeleteButton/DeleteButton'
import NameAvatar from 'src/components/NameAvatar/NameAvatar'
import { formatContent, formatDate } from 'src/helpers'

interface IMessageList {
  children?: React.ReactNode
  issue: TIssue
  onAttachmentRender: (message: TMessage) => React.ReactNode
  onDeleteMessage: (messageId: string) => void
}

const MessageList: React.FC<IMessageList> = ({ issue, onDeleteMessage }) => {
  // Check if there are no messages
  if (issue.messages.length === 0) {
    return <Typography>No messages found</Typography>
  }

  // Define handleDeleteMessage function
  const handleDeleteMessage = (messageId: string) => {
    onDeleteMessage(messageId)
  }

  return (
    <List dense sx={{ width: '100%', bgcolor: 'transparent', px: 0 }}>
      {issue.messages.map(message => {
        const { id, userId, content, dateCreated, user } = message
        const { firstName, lastName } = user
        const userName = `${firstName} ${lastName}`
        const formattedContent = formatContent(content)
        return (
          <React.Fragment key={id}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <NameAvatar caption={`${firstName.charAt(0)}${lastName.charAt(0)}`} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography component="span" variant="body2" color="text.secondary">
                    {formatDate(dateCreated, 'PPpp')}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      {userName}
                    </Typography>
                    <Typography variant="inherit" sx={{ whiteSpace: 'pre-wrap' }}>
                      {` — ${formattedContent ?? ''}`}
                    </Typography>
                  </>
                }
              />
              <DeleteButton onDelete={() => handleDeleteMessage(id.toString())} messageId={id.toString()} />
            </ListItem>
            {issue.messages.indexOf(message) !== issue.messages.length - 1 && (
              <Divider variant="inset" component="li" />
            )}
          </React.Fragment>
        )
      })}
    </List>
  )
}

export default MessageList
