export type NavigationLinkType = {
  id: string
  path: string
  name: string
  disabled: boolean
  adminOnly?: boolean
}

const getNavigationLinks = (): NavigationLinkType[] => []

export default getNavigationLinks
