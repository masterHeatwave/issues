import React from 'react'
import type { Swiper as TSwiper } from 'swiper'
import { Virtual } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
// Import Swiper styles
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import {
  Box,
  Button,
  IconButton,
  MobileStepper,
  Paper,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material'
import ImageContainer from 'src/components/ImagePreview/ImageContainer'
import NameAvatar from 'src/components/NameAvatar/NameAvatar'
import { formatDate } from 'src/helpers'
import TAttachmentImage from 'src/structures/viewmodel/attachmentImage'
import 'swiper/css'

interface IImagePreview {
  images: TAttachmentImage[]
  onDataRequest?: (attachmentId: number) => Promise<string>
}

const NumOfItems = 1

const ImagePreview: React.FC<IImagePreview> = ({ images, onDataRequest }) => {
  const theme = useTheme()
  const [activeIndex, setActiveIndex] = React.useState<number | undefined>(undefined)
  const [fullScreen, setFullScreen] = React.useState<boolean>(false)
  const [swiper, setSwiper] = React.useState<TSwiper | null>(null)
  const [userName, setUserName] = React.useState<string | undefined>(undefined)
  const [date, setDate] = React.useState<string | undefined>(undefined)
  const handleNext = () => {
    swiper?.slideNext()
  }
  const handleBack = () => {
    swiper?.slidePrev()
  }
  React.useEffect(() => {
    let defaultSlide = 0
    if (images.length > 1) {
      defaultSlide = images.length - 1
    }
    setActiveIndex(defaultSlide)
    swiper?.slideTo(defaultSlide)
  }, [images, swiper])
  const handleChange = (swiper: TSwiper) => {
    setActiveIndex(swiper.activeIndex)
  }
  React.useEffect(() => {
    if (activeIndex === undefined) return
    const attachment = images[activeIndex]
    setUserName(attachment.userName)
    setDate(attachment.dateCreated)
  }, [activeIndex])
  const handleSize = () => setFullScreen(!fullScreen)
  const containerStyle = React.useMemo(() => {
    if (fullScreen) {
      return {
        zIndex: 10000,
        position: 'fixed',
        height: '100vh',
        width: '100vw',
        top: 0,
        left: 0
      }
    }
    return {
      height: 500,
      width: '100%'
    }
  }, [fullScreen])
  const handleKeyDown = React.useCallback((event: KeyboardEvent) => {
    switch (event.code) {
      case 'Escape':
        setFullScreen(false)
        break
      default:
        break
    }
  }, [])

  React.useEffect(() => {
    if (fullScreen) {
      document.addEventListener('keydown', handleKeyDown, false)
    } else {
      document.removeEventListener('keydown', handleKeyDown, false)
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown, false)
    }
  }, [fullScreen])
  return (
    <Box
      sx={{
        ...containerStyle
      }}>
      <Paper
        square
        elevation={0}
        sx={{
          backgroundColor: theme =>
            theme.palette.mode === 'light' ? theme.palette.grey.A200 : theme.palette.grey[900],
          display: 'flex',
          alignItems: 'center',
          height: 60,
          pl: 3,
          pr: 2
        }}>
        {!!userName && (
          <>
            <Box component="div" sx={{ display: 'flex', flex: '0 0 auto', marginRight: 2 }}>
              <NameAvatar size="small" colored caption={userName} />
            </Box>
            <Box sx={{ flex: '1 1 auto' }}>
              <Typography variant="body1" color="text.primary" component="span">
                {userName}
              </Typography>
              <Typography variant="caption" color="text.secondary" component="span">
                &nbsp;&nbsp;&nbsp;
                {formatDate(date, 'PPpp')}
              </Typography>
            </Box>
          </>
        )}
        <Tooltip title={fullScreen ? 'Minimize' : 'Full Screen'}>
          <IconButton sx={{ ml: 'auto' }} color="default" onClick={handleSize} aria-label="edit">
            {fullScreen ? <CloseFullscreenIcon /> : <OpenInFullIcon />}
          </IconButton>
        </Tooltip>
      </Paper>
      <Swiper
        style={{
          paddingTop: '5px',
          paddingBottom: '5px',
          height: 'calc(100% - 109px)',
          backgroundColor:
            theme.palette.mode === 'light' ? theme.palette.grey.A200 : theme.palette.grey[900]
        }}
        modules={[Virtual]}
        virtual
        spaceBetween={0}
        slidesPerView={NumOfItems}
        onSwiper={setSwiper}
        onSlideChange={handleChange}>
        {images.map((images, index) => {
          return (
            <SwiperSlide key={images.id} virtualIndex={index}>
              <ImageContainer onDataRequest={onDataRequest} attachment={images} />
            </SwiperSlide>
          )
        })}
      </Swiper>
      {swiper && (
        <MobileStepper
          variant="text"
          steps={Math.ceil(images.length / NumOfItems)}
          position="static"
          activeStep={activeIndex}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={!images.length || activeIndex === images.length - 1}>
              Next
              <KeyboardArrowRight />
            </Button>
          }
          backButton={
            <Button size="small" onClick={handleBack} disabled={!activeIndex}>
              <KeyboardArrowLeft />
              Back
            </Button>
          }
        />
      )}
    </Box>
  )
}

export default ImagePreview
