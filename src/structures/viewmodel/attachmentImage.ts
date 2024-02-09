import TAttachment from 'src/structures/attachment'

type TAttachmentImage = TAttachment & {
  userName: string
  caption: string
}

export default TAttachmentImage
