import React from 'react';
import TIssue from 'src/structures/issue';
import TMessage from 'src/structures/message';
import { Chip, Typography, Avatar } from '@mui/material';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import NameAvatar from 'src/components/NameAvatar/NameAvatar';
import { formatContent, formatDate } from 'src/helpers';

interface IMessageList {
  children?: React.ReactNode;
  issue: TIssue;
  onAttachmentRender?: (message: TMessage) => React.ReactNode;
}

const MessageList: React.FC<IMessageList> = ({ children, issue, onAttachmentRender }) => {
  // Check if there are no messages
  if (issue.messages.length === 0) {
    return <Typography>No messages found</Typography>;
  }

  return (
    <List dense sx={{ width: '100%', bgcolor: 'transparent', px: 0 }}>
      {issue.messages.map(message => {
        const {
          userId,
          content,
          dateCreated,
          user: { firstName, lastName },
        } = message;
        const userName = `${firstName} ${lastName}`;
        const formattedContent = formatContent(content);
        return (
          <React.Fragment key={message.id}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <NameAvatar caption={`${message.user.firstName.charAt(0)}${message.user.lastName.charAt(0)}`} />
              </ListItemAvatar>
              <ListItemText
                secondaryTypographyProps={{
                  sx: {
                    lineHeight: 1.5,
                  },
                }}
                primary={
                  <Typography component="span" variant="body2" color="text.secondary">
                    {formatDate(dateCreated, 'PPpp')}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography
                      sx={{ display: 'inline-block', mt: 1, whiteSpace: 'pre-wrap' }}
                      component="span"
                      variant="body2"
                      color="text.primary">
                      {userName}
                      <Chip
                        component="span"
                        sx={{ ml: 1 }}
                        size="small"
                        color={
                          userId === issue.userId
                            ? 'primary'
                            : issue.assignees.some(assignee => assignee.userId === userId)
                              ? 'secondary'
                              : undefined
                        }
                        label={
                          userId === issue.userId
                            ? 'Issuer'
                            : issue.assignees.some(assignee => assignee.userId === userId)
                              ? 'Assignee'
                              : 'Watcher'
                        }
                      />
                    </Typography>
                    <Typography
                      component="span"
                      variant="inherit"
                      sx={{ whiteSpace: 'pre-wrap' }}>
                      {` — ${formattedContent ?? ''}`}
                    </Typography>
                  </>
                }
              />
            </ListItem>
            {onAttachmentRender?.(message)}
            {issue.messages.indexOf(message) !== issue.messages.length - 1 && (
              <Divider variant="inset" component="li" />
            )}
          </React.Fragment>
        );
      })}
    </List>
  );
};

export default MessageList;
