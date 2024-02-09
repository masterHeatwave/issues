import AttachFileIcon from '@mui/icons-material/AttachFile'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DownloadIcon from '@mui/icons-material/Download'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import React from 'react'
import { ellipsize } from 'src/helpers'
import TAttachment from 'src/structures/attachment'

interface IAttachmentControl {
  loading?: boolean
  files?: FileList | null
  dense?: boolean
  readOnly?: boolean
  attachments?: readonly TAttachment[]
  onInputFileChange?: (files: FileList | null) => Promise<void>
  onChange?: (attachmentId: number) => Promise<void>
  onDownload?: (attachmentId: number) => (e: React.MouseEvent<HTMLSpanElement>) => void
  onDownloadAll?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5)
}))

const AttachmentControl: React.FC<IAttachmentControl> = ({
  attachments,
  onInputFileChange,
  onChange,
  onDownload,
  onDownloadAll,
  readOnly,
  dense,
  files,
  loading
}) => {
  const [busy, setBusy] = React.useState<boolean>(false)
  const handleDelete = (attachmentId: number) => async () => {
    setBusy(true)
    await onChange?.(attachmentId)
    setBusy(false)
  }
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const handleReset = async () => {
    if (inputRef.current) {
      inputRef.current.value = ''
      if (onInputFileChange) {
        await onInputFileChange?.(null)
      }
    }
  }
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusy(true)
    await onInputFileChange?.(e.target.files)
    setBusy(false)
    if (files === undefined) {
      await handleReset()
    }
  }
  const [hoveredAttachment, setHoveredAttachment] = React.useState<number | null>(null)
  const handleHover = (applicationId: number) => () => setHoveredAttachment(applicationId)
  const handleBlur = () => setHoveredAttachment(null)
  return (
    <>
      <Paper
        elevation={0}
        variant="elevation"
        sx={{
          bgcolor: 'transparent',
          display: 'flex',
          flexWrap: 'wrap',
          listStyle: 'none',
          px: 0,
          py: 0,
          mt: 0,
          mb: 1
        }}
        component="ul">
        {attachments?.map(attachment => (
          <ListItem key={attachment.id}>
            <Tooltip title={attachment.fileName}>
              <Chip
                size={dense ? 'small' : undefined}
                sx={{ px: 1 }}
                onMouseEnter={handleHover(attachment.id)}
                onMouseLeave={handleBlur}
                disabled={busy}
                icon={
                  hoveredAttachment === attachment.id ? (
                    <DownloadIcon fontSize="small" />
                  ) : (
                    <AttachFileIcon fontSize="small" />
                  )
                }
                label={ellipsize(30, attachment.fileName)}
                onClick={onDownload?.(attachment.id)}
                onDelete={!readOnly ? handleDelete(attachment.id) : undefined}
              />
            </Tooltip>
          </ListItem>
        ))}
        {!!files?.length && (
          <ListItem>
            <Tooltip
              title={Object.values(files)
                .map(file => file.name)
                .join(', ')}>
              <Chip
                sx={{ px: 1 }}
                icon={<CloudUploadIcon fontSize="small" />}
                disabled={busy}
                label={ellipsize(
                  30,
                  Object.values(files)
                    .map(file => file.name)
                    .join(', ')
                )}
                onDelete={handleReset}
              />
            </Tooltip>
          </ListItem>
        )}
        {files === undefined && !attachments?.length && !dense && (
          <Typography color="text.secondary" variant="body2" sx={{ fontStyle: 'italic' }}>
            There are currently no attachments available...
          </Typography>
        )}
      </Paper>
      {!dense && (
        <Stack direction="row" alignItems="center" spacing={[0, 2]} sx={{ mt: 0 }}>
          {!!attachments?.length && attachments.length > 1 && (
            <Button
              onClick={onDownloadAll}
              size="small"
              endIcon={<DownloadIcon />}
              variant="text"
              disabled={busy}>
              Download All
            </Button>
          )}
          {!readOnly && (
            <Button
              endIcon={<AttachFileIcon />}
              size="small"
              variant="text"
              component="label"
              disabled={loading || busy || !!files?.length}>
              Add Attachment
              <input
                ref={inputRef}
                onChange={handleChange}
                hidden
                accept="*/*"
                multiple
                type="file"
              />
            </Button>
          )}
        </Stack>
      )}
    </>
  )
}

export default React.memo(AttachmentControl)
