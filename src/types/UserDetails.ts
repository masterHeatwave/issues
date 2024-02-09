import Roles from './Roles'

type UserDetails = {
  firstName: string
  id: string
  lastName: string
  roles: Roles[]
  token: string
  userName: string
}

export default UserDetails
