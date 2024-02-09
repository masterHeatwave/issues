import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import {
  Avatar,
  Box,
  Chip,
  Collapse,
  Divider,
  FormControl,
  Grid,
  Stack,
  Tooltip,
  Typography
} from '@mui/material'
import React from 'react'
import NameAvatar from 'src/components/NameAvatar/NameAvatar'
import useAuth from 'src/context/useAuth'
import { formatContent, formatDate } from 'src/helpers'
import TIssue from 'src/structures/issue'

interface IIssueLayout {
  issue: TIssue
  children?: React.ReactNode
  onNotify?: () => Promise<void>
}

type TCollapseState = Record<string, boolean>

const chipWidth = undefined

const IssueLayout: React.FC<IIssueLayout> = ({ issue, children, onNotify }) => {
  const {
    id,
    title,
    dateCreated,
    description,
    user: { firstName, lastName },
    application: { name: applicationName },
    status: { name: statusName, id: statusId }
  } = issue
  const [loading, setLoading] = React.useState<boolean>(false)
  const formattedDescription = formatContent(description)
  const { user } = useAuth()
  const [collapse, setCollapse] = React.useState<TCollapseState>({
    assignees: false,
    description: !!issue.description?.length,
    attachments: user?.id === issue.userId && !issue.attachments.length
  })
  const handleCollapse = React.useCallback(
    (target: keyof TCollapseState) => () => {
      setCollapse({
        ...collapse,
        [target]: !collapse[target]
      })
    },
    [collapse]
  )
  const handleNotify = async () => {
    if (onNotify) {
      try {
        setLoading(true)
        await onNotify()
      } catch {
        return
      } finally {
        setLoading(false)
      }
    }
  }
  const canNotify = React.useMemo<boolean>(() => {
    if (!onNotify) return false
    if (statusId !== 1) return false
    return issue.assignees.some(_ => _.userId === user?.id)
  }, [issue])
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Tooltip title={`${lastName} ${firstName}`}>
          <Box component="div" sx={{ display: 'flex', flex: '0 0 auto', marginRight: 3 }}>
            <NameAvatar
              colored
              size="large"
              caption={`${issue.user.lastName} ${issue.user.firstName}`}
            />
          </Box>
        </Tooltip>
        <Box sx={{ flex: '1 1 auto' }}>
          <Typography variant="h6" component="span" display="block">
            {title ?? '-'}
          </Typography>
          <Typography variant="body1" color="text.secondary" component="span" display="block">
            {formatDate(dateCreated, 'PPPP')}
          </Typography>
          <Typography variant="body2" color="text.secondary" component="span" display="block">
            {`${lastName} ${firstName}`}
          </Typography>
        </Box>
      </Box>
      <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
        <Chip sx={{ px: 1 }} label={id} />
        <Chip sx={{ px: 1 }} label={applicationName} />

        <Chip
          sx={{ px: 1 }}
          color={statusId === 1 ? 'primary' : undefined}
          label={statusName}
          disabled={loading}
          onDelete={canNotify ? handleNotify : undefined}
          deleteIcon={
            canNotify ? (
              <Tooltip title="Request to mark the issue as closed">
                <TaskAltIcon />
              </Tooltip>
            ) : undefined
          }
        />
      </Stack>
      <Divider sx={{ my: 2 }} textAlign="center">
        <Chip
          sx={{ minWidth: chipWidth }}
          label={`People (${issue.assignees.length})`}
          onClick={handleCollapse('assignees')}
          avatar={<Avatar>{collapse.assignees ? <ExpandLess /> : <ExpandMore />}</Avatar>}
        />
      </Divider>
      <Collapse in={collapse.assignees} timeout="auto" unmountOnExit>
        {issue.assignees.length || issue.watchers.length ? (
          <Stack
            columnGap={0}
            rowGap={2}
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            spacing={0}
            sx={{ flexWrap: 'wrap', my: 1 }}>
            {!issue.assignees.length && !issue.watchers.length && (
              <Typography color="text.secondary" variant="body2" sx={{ fontStyle: 'italic' }}>
                There are currently no assignees available...
              </Typography>
            )}
            {issue.assignees.map(assignee => (
              <Chip
                sx={{ px: 1, mr: 1 }}
                icon={<AssignmentIndIcon />}
                key={assignee.id}
                color="secondary"
                label={`${assignee.user.lastName} ${assignee.user.firstName}`}
              />
            ))}
            {issue.watchers.map(watcher => (
              <Chip
                sx={{ px: 1, mr: 1 }}
                icon={<RemoveRedEyeIcon />}
                key={watcher.id}
                label={`${watcher.user.lastName} ${watcher.user.firstName}`}
              />
            ))}
          </Stack>
        ) : (
          <Typography color="text.secondary" variant="body2" sx={{ fontStyle: 'italic' }}>
            There is currently no data available...
          </Typography>
        )}
      </Collapse>

      <Divider sx={{ my: 2 }} textAlign="center">
        <Chip
          sx={{ minWidth: chipWidth }}
          label="Description"
          onClick={handleCollapse('description')}
          avatar={<Avatar>{collapse.description ? <ExpandLess /> : <ExpandMore />}</Avatar>}
        />
      </Divider>
      <Collapse in={collapse.description} timeout="auto" unmountOnExit>
        {formattedDescription ? (
          <Typography sx={{ whiteSpace: 'pre-wrap' }}>{formattedDescription}</Typography>
        ) : (
          <Typography color="text.secondary" variant="body2" sx={{ fontStyle: 'italic' }}>
            There is currently no description available...
          </Typography>
        )}
      </Collapse>
      <Divider sx={{ my: 2 }} textAlign="center">
        <Chip
          sx={{ minWidth: chipWidth }}
          label={`Attachments (${issue.attachments.length})`}
          onClick={handleCollapse('attachments')}
          avatar={<Avatar>{collapse.attachments ? <ExpandLess /> : <ExpandMore />}</Avatar>}
        />
      </Divider>
      <Collapse in={collapse.attachments} timeout="auto" unmountOnExit>
        <Grid item xs={12} sx={{ mt: 1 }}>
          <FormControl fullWidth>{children}</FormControl>
        </Grid>
      </Collapse>
      <Divider light sx={{ my: 2 }} textAlign="center">
        <Box
          sx={{ display: 'flex', color: theme => theme.palette.text.secondary }}
          alignItems="center">
          <QuestionAnswerIcon sx={{ mr: 1 }} />
          Conversation
        </Box>
      </Divider>
    </>
  )
}

export default React.memo(IssueLayout)
