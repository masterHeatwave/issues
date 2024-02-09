import TApplication from 'src/structures/application'
import TStatus from 'src/structures/status'
import TUser from 'src/structures/user'

type TApplicationData = {
  applications: TApplication[]
  users: TUser[]
  status: TStatus[]
}

export default TApplicationData
