import { Box, Typography } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import React from 'react'
import { ellipsize } from 'src/helpers'
import TAttachmentImage from 'src/structures/viewmodel/attachmentImage'

interface IImageContainer {
  attachment: TAttachmentImage
  onDataRequest?: (attachmentId: number) => Promise<string>
}

const ImageContainer: React.FC<IImageContainer> = ({ attachment, onDataRequest }) => {
  const [loading, setLoading] = React.useState<boolean>(true)
  const data = React.useRef<string | null>(null)
  React.useEffect(() => {
    let isMounted = true
    if (data.current) return
    if (!onDataRequest) return
    setLoading(true)
    onDataRequest(attachment.id)
      .then(res => {
        if (!isMounted) return
        data.current = res
      })
      .catch(() => undefined)
      .finally(() => setLoading(false))
    return () => {
      isMounted = false
    }
  }, [attachment])
  return (
    <Box
      component="div"
      sx={{
        display: 'flex',
        alignItems: 'center',
        jutifyContent: 'center',
        height: '100%',
        position: 'relative'
      }}>
      {loading ? (
        <Box component="div" sx={{ mx: 'auto' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {data.current ? (
            <Box
              component="img"
              sx={{
                maxWidth: '100%',
                maxHeight: '100%',
                overflow: 'hidden',
                mx: 'auto'
              }}
              src={`data:${attachment.mimeType};base64, ${data.current}`}
              alt={attachment.caption}
            />
          ) : (
            <Typography sx={{ mx: 'auto' }} variant="h6">
              Error loading image!
            </Typography>
          )}
          <Box
            component="div"
            sx={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              p: 2,
              maxWidth: '40vw',
              m: [4, 5],
              borderRadius: '2px',
              backgroundColor: theme => theme.palette.background.paper,
              opacity: 0.1,
              transition: 'opacity .3s',
              '&:hover': {
                opacity: 1
              }
            }}>
            <Typography variant="body1">{ellipsize(260, attachment.caption)}</Typography>
          </Box>
        </>
      )}
    </Box>
  )
}

export default ImageContainer
