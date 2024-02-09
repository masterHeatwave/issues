import Roles from 'src/types/Roles'

type TLoginResponse = {
  firstName: string
  id: string
  lastName: string
  roles: Roles[]
  token: string
  userName: string
}

export default TLoginResponse
